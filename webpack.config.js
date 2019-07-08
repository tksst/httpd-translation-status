const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const cssLoaders = (sourceMap, modules = false, additionalLoaders = []) => {

    const a = [
        {
            loader: MiniCssExtractPlugin.loader,
        },
        {
            loader: "css-loader",
            options: {
                url: true,
                sourceMap,
                modules,
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

    const sassLoaders = cssLoaders(DEV, false,{
        loader: "sass-loader",
        options: { sourceMap: DEV },
    });

    const mouleSassLoaders = cssLoaders(DEV,true, {
        loader: "sass-loader",
        options: { sourceMap: DEV },
    });

    const PolyfillChunk = "polyfills";

    return {
        entry: {
            "index": "./src/index.tsx",
            [PolyfillChunk]: "./src/globalPolyfills.ts",
        },
        output: {
            filename: chunkData => {
                return chunkData.chunk.name === PolyfillChunk ? "assets/[name].js" : "assets-immutable/[contentHash].js";
            },
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "src/index.html",
                // polyfills: Polyfills are loaded by index.html manually
                excludeChunks: [ PolyfillChunk ],
            }),
            new MiniCssExtractPlugin({ filename: "assets-immutable/[contentHash].css" }),
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
                    test: /(?<!\.modules)\.scss$/,
                    use: sassLoaders,
                },
                {
                    test: /\.modules\.scss$/,
                    use: mouleSassLoaders,
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
