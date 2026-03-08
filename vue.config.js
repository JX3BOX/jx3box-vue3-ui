const path = require("path");

function normalizeTarget(value) {
    if (!value) return "";
    const trimmed = String(value).trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed.replace(/^\/+/, "")}`;
}

function escapeRegExp(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildEnvProxy() {
    const enabled = ["1", "true", "yes", "on"].includes(String(process.env.VUE_APP_PROXY_ENABLE || "").toLowerCase());
    if (!enabled) return {};

    const prefix = process.env.VUE_APP_PROXY_PREFIX || "/__proxy";
    const mk = (serviceKey, target) => {
        const normalized = normalizeTarget(target);
        if (!normalized) return {};
        const context = `${prefix}/${serviceKey}`;
        const contextRe = new RegExp(`^${escapeRegExp(context)}`);
        return {
            [context]: {
                target: normalized,
                changeOrigin: true,
                secure: false,
                cookieDomainRewrite: "",
                pathRewrite: (p) => p.replace(contextRe, ""),
            },
        };
    };

    return Object.assign(
        {},
        mk("cms", process.env.VUE_APP_CMS_API),
        mk("next", process.env.VUE_APP_NEXT_API),
        mk("team", process.env.VUE_APP_TEAM_API),
        mk("pay", process.env.VUE_APP_PAY_API),
        mk("lua", process.env.VUE_APP_LUA_API),
        mk("node", process.env.VUE_APP_NODE_API),
    );
}


const envProxy = buildEnvProxy();

module.exports = {
    //❤️ define path for static files ~
    publicPath: process.env.NODE_ENV === "development" ? "/" : process.env.STATIC_PATH,

    // 过滤依赖包里的已知兼容性 warning（不影响运行，但会刷屏）
    configureWebpack: {
        stats: {
            warningsFilter: [/node_modules[\\\\/]+@jx3box[\\\\/]+jx3box-common[\\\\/]+/],
        },
    },

    pages: {
        index: {
            entry: "src/main.js",
            template: "public/index.html",
            filename: "index.html",
            title: "JX3BOX",
        },
        article: {
            title: "Article",
            entry: "demo/A.js",
            template: "public/article.html",
            filename: "article/index.html",
        },
        tinymce: {
            title: "Tinymce",
            entry: "demo/T.js",
            template: "public/tinymce.html",
            filename: "tinymce/index.html",
        },
    },


    //⚛️ Proxy ~
    devServer: {
        host: "localhost",
        // 统一走 api.js 的 /__proxy/*（开启 VUE_APP_PROXY_ENABLE=1 时）
        // 若未开启，则回退到旧的 /api/* 代理（兼容历史写法）
        proxy: Object.keys(envProxy).length ? envProxy : legacyProxy,
        disableHostCheck: true,
        port: process.env.DEV_PORT || 12028,
    },

    //❤️ Webpack configuration
    chainWebpack: (config) => {
        //💘 html-webpack-plugin ~
        // Multiple pages disable the block below
        // config.plugin("html").tap((args) => {
        //     args[0].meta = {
        //         //------设置SEO信息
        //         Keywords: setting.keys,
        //         Description: setting.desc,
        //     };
        //     args[0].title = setting.title; //------自动添加标题后缀
        //     return args;
        // });

        //💝 in-line small imgs ~
        config.module.rule("images").set("parser", {
            dataUrlCondition: {
                maxSize: 4 * 1024, // 4KiB
            },
        });

        //💝 in-line svg imgs ~
        config.module.rule("vue").use("vue-svg-inline-loader").loader("vue-svg-inline-loader");

        //💖 import common less var * mixin ~
        const types = ["vue-modules", "vue", "normal-modules", "normal"];
        types.forEach((type) => addStyleResource(config.module.rule("less").oneOf(type)));

        config.externals = {
            tinyMCE: "tinyMCE",
        }
    },
};

function addStyleResource(rule) {
    var preload_styles = [];
    preload_styles.push(
        path.resolve(__dirname, "./node_modules/@jx3box/jx3box-common/css/var.less"),
        path.resolve(__dirname, "./node_modules/@jx3box/jx3box-common/css/mixin.less"),
        path.resolve(__dirname, "./assets/css/var.less"),
        path.resolve(__dirname, "./assets/css/mixin.less"),
        path.resolve(__dirname, "./node_modules/csslab/base.less"),
    );
    rule.use("style-resource").loader("style-resources-loader").options({
        patterns: preload_styles,
    });
}
