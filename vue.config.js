const path = require("path");
module.exports = {
    //❤️ define path for static files ~
    publicPath: process.env.NODE_ENV === "development" ? "/" : process.env.STATIC_PATH,

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
        proxy: {
            "/api/vip": {
                target: "https://pay.jx3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/api/inspire": {
                target: "https://pay.jx3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/api/team": {
                target: "https://team.api.jx3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/api/cms": {
                target: "https://cms.jx3box.com",
            },
            "/api/article": {
                target: "https://next2.jx3box.com",
            },
            "/api/messages": {
                target: "https://helper.jx3box.com",
            },
            "/api/post/favorite": {
                target: "https://helper.jx3box.com",
            },
            "/api/wiki": {
                target: "https://helper.jx3box.com",
            },
            "/api/personal": {
                target: "https://pay.jx3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/api/cny": {
                target: "https://pay.jx3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/api": {
                target: "https://next2.jx3box.com",
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
        },
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
