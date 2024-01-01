module.exports = function override(config, env) {
    // config.optimization = {
    //     splitChunks: {
    //         chunks: "all",
    //         minSize: 100000,
    //         maxSize: 1000000,
    //     },
    // };

    config.ignoreWarnings = [
        {
            module: /node_modules/,
            message: /Failed to parse source map/,
        },
    ];

    return config;
};
