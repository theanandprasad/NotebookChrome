const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        app: './src/app/app.js',
        background: './src/background/background.js',
        content: './src/content/content.js',
        options: './src/options/options.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { 
                    from: "src/app/index.html",
                    to: "app/index.html"
                },
                { 
                    from: "src/app/styles.css",
                    to: "app/styles.css"
                },
                {
                    from: "src/app/styles/components.css",
                    to: "app/styles/components.css"
                },
                {
                    from: "src/app/styles/modal.css",
                    to: "app/styles/modal.css"
                },
                {
                    from: "src/content/content.css",
                    to: "content.css"
                },
                {
                    from: "src/options/options.html",
                    to: "options/options.html"
                },
                {
                    from: "src/options/options.css",
                    to: "options/options.css"
                },
                {
                    from: "manifest.json",
                    to: "manifest.json"
                },
                {
                    from: "icons",
                    to: "icons"
                }
            ],
        }),
    ],
    optimization: {
        minimize: true
    }
}; 