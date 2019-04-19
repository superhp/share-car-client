module.exports = {
    webpack: function (config, env) {
      return config;
    },
    jest: function (config) {
      config.testEnvironment = "jsdom";

      config.setupFiles = ["jest-canvas-mock"];
  
      config.transformIgnorePatterns = [
        "/node_modules/(?!(ol|labelgun|mapbox-to-ol-style|ol-mapbox-style)/).*/"
      ];

      config.snapshotSerializers = [
        "enzyme-to-json/serializer"
      ];
      config.moduleNameMapper = {
        "\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.js"
      }
  
      config.coveragePathIgnorePatterns = [
        "/node_modules/",
        "env-setup.js"
      ];
  
      config.snapshotSerializers = [
          "enzyme-to-json/serializer"
      ];
      return config;
    }
  }