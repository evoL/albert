const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "albert.js",
    path: path.resolve(__dirname, "dist"),
    library: "albert",
    libraryTarget: "umd"
  },
  devtool: "source-map",
  devServer: {
    contentBase: "./dist"
  }
};
