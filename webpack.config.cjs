const CopyPlugin = require("copy-webpack-plugin");
const RemovePlugin = require('remove-files-webpack-plugin');
const path = require('path');

module.exports = {
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    // we copy .ts files too because browsers can step debug them
                    from: 'src/',
                    globOptions: {
                        ignore: ["**/tsconfig.tsbuildinfo"]
                    }
                },
            ]
        }),
        new RemovePlugin({
           after: {
               root: '.dist/development',
               include: [
                   '__JUST_HERE_BECAUSE_CANT_SKIP_WEBPACK_ENTRY.js',
               ]
           }
        })
    ],
    mode: "none",
    entry: './webpack-entry-SKIP.json',
    output: {
        path: path.resolve(__dirname, '.dist/development'),
        filename: '__JUST_HERE_BECAUSE_CANT_SKIP_WEBPACK_ENTRY.js',
    }
}
