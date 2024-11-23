const CopyPlugin = require("copy-webpack-plugin");
const RemovePlugin = require('remove-files-webpack-plugin');
const path = require('path');

module.exports = {
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: 'web/',
                    to: 'development/',
                    globOptions: {
                        ignore: ["**/tsconfig.tsbuildinfo"]
                    }
                },
                {
                    // we copy src/*.ts files too because browsers can step debug them
                    from: 'src/',
                    to: 'development/src',
                }
            ]
        }),
        new RemovePlugin({
           after: {
               root: '.dist',
               include: [
                   '__JUST_HERE_BECAUSE_CANT_SKIP_WEBPACK_ENTRY.js',
               ]
           }
        })
    ],
    mode: "none",
    entry: './webpack-entry-SKIP.json',
    output: {
        path: path.resolve(__dirname, '.dist'),
        filename: '__JUST_HERE_BECAUSE_CANT_SKIP_WEBPACK_ENTRY.js',
    }
}
