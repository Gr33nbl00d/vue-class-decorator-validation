var path = require('path')
let mainInit = path.resolve(__dirname, './src/index.ts');


module.exports = {
    mode: 'development',
    watch:true,
    target:"web",
    entry: {
        index: mainInit
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'vue-class-decorator-umd.js',
        libraryTarget: "umd",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /(node_modules)/,
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                }
            }
        ]
    },
    resolve: {
        extensions: ['.ts','.js'],
        alias: {
            //'vue$': path.resolve(__dirname, './node_modules/vue/dist/vue.esm.js')
        }
    },
    performance: {
        hints: false
    },
}