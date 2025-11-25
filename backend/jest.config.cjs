module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js"],
  reporters: [
    "default",
    [
      "jest-html-reporters",
      {
        publicPath: "./jest-report",
        filename: "report.html",
        openReport: false,
        inlineSource: true,
      },
    ],
  ],
  transform: {},
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
