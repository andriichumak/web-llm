const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const models = require('./src/models/models.json');

module.exports = Object.keys(models).map((modelClass) => ({
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: `bundle.${modelClass}.[name].js`,
    },
    resolve: {
        extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: "ts-loader",
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader",
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: modelClass === "HuggingfaceSearchDefault" ? "index.html" : `index.${modelClass}.html`,
            template: path.resolve(__dirname, "src", "index.html"),
        }),
        new webpack.DefinePlugin({
            "SELECTED_MODEL": JSON.stringify(modelClass),
        }),
    ],
}));
