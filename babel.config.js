debugger;
console.log("Loaded up to the very top of babel.config.js");

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};