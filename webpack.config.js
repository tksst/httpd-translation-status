const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (_, argv) => {
    const DEV = argv.mode === "development";

    const cssLoaders = num => [
        {
            loader: MiniCssExtractPlugin.loader,
        },
        {
            loader: "css-loader",
            options: {
                url: true,
                sourceMap: DEV,
                importLoaders: num,
            },
        },
        {
            loader: "postcss-loader",
            options: {
                plugins: [
                    require("autoprefixer")({ grid: true }),
                    require("cssnano")({ cssDeclarationSorter: true }),
                ],
                sourceMap: DEV,
            },
        },
    ];

    const sassLoaders = cssLoaders(2);
    sassLoaders.push({
        loader: "sass-loader",
        options: { sourceMap: DEV },
    });

    const conf = {
        entry: "./src/index.tsx",
        output: {
            filename: "[contentHash].js",
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "src/index.html",
            }),
            new MiniCssExtractPlugin({ filename: "[contentHash].css" }),
        ],
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: ["ts-loader", "eslint-loader"],
                },
                {
                    test: /\.css$/,
                    use: cssLoaders(1),
                },
                {
                    test: /\.scss$/,
                    use: sassLoaders,
                },
                {
                    test: /\.(jpe?g|png)$/,
                    use: {
                        loader: "url-loader",
                        options: { limit: 1024 },
                    },
                },
            ],
        },
        // eval-source-mapのほうが高速らしいのでdevelopmentで使いたいが
        // CSSのソースマップがおかしくなるので使えない
        devtool: "source-map",
    };

    return conf;
};
