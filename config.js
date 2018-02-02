const proxy = require('http-proxy-middleware')

/**
 * 不添加hash的图片 src/img-not-hash
 * 不进行代码检测与压缩的JS src/js-not-lint
 * ESLint忽略文件 .eslintignore
 * Stylelint忽略文件 .stylelintrc -> ignoreFiles
 */
module.exports = {
    host: '192.168.0.134',
    port: '8040',
    // publicPath: 'https://www.acdog.hk',
    // publicPath: 'http://47.52.198.203/acdog',
    // publicPath: 'http://192.168.84.27', // 簡
    publicPath: '../', // 本地
    // publicPath: 'http://192.168.67.22', // 馮
    // publicPath: 'http://47.52.198.203/gm/acdogofficial',
    // publicPath: 'http://47.52.198.203/gm/acdog',
    vendors: [],
    proxy: [
        // proxy('/community/login/createtoken.do', {
        //     target: 'http://play.linekong.com',
        //     changeOrigin: true
        // }),
        // proxy('/otherServer', {
        //     target: 'https://IP:Port',
        //     changeOrigin: true
        // })
    ]
}
