const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const cssLoaders = (sourceMap, additionalLoaders = []) => {

    const a = [
        {
            loader: MiniCssExtractPlugin.loader,
        },
        {
            loader: "css-loader",
            options: {
                url: true,
                sourceMap,
            },
        },
        {
            loader: "postcss-loader",
            options: {
                plugins: [
                    require("autoprefixer")({ grid: true }),
                    require("cssnano")({ cssDeclarationSorter: true }),
                ],
                sourceMap,
            },
        },
    ];

    const b = a.concat(additionalLoaders);
    // importLoaders should be number of loaders applied before CSS loader
    b[1].options.importLoaders = b.length - 2;

    return b;
};

module.exports = (_, argv) => {
    const DEV = argv.mode === "development";

    const sassLoaders = cssLoaders(DEV, {
        loader: "sass-loader",
        options: { sourceMap: DEV },
    });

    return {
        entry: "./src/index.tsx",
        output: {
            filename: "assets/[contentHash].js",
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "src/index.html",
            }),
            new MiniCssExtractPlugin({ filename: "assets/[contentHash].css" }),
        ],
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: ["ts-loader", "eslint-loader"],
                },
                {
                    test: /\.css$/,
                    use: cssLoaders(DEV),
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
        resolve: {
            extensions: [".tsx", ".ts", ".jsx", ".js"],
        },
        // eval-source-mapのほうが高速らしいのでdevelopmentで使いたいが
        // CSSのソースマップがおかしくなるので使えない
        devtool: "source-map",
    };
};
