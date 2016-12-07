const path = require('path');

// Base kyt config.
// Edit these properties to make changes.

module.exports = {
  reactHotLoader: false,
  debug: false,
  modifyWebpackConfig(kytConfig) {
    const appConfig = Object.assign({}, kytConfig);
    const babelLoader = appConfig.module.rules.find(loader => loader.loader === 'babel-loader');

    babelLoader.options.plugins.push(path.resolve('./tools/babelRelayPlugin.js'));

    return appConfig;
  },
};
