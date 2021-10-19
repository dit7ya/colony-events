module.exports = {
  extends: ["alloy", "alloy/typescript", "airbnb-typescript"],
  env: {
    browser: true,
  },
  globals: {},
  rules: {
    // Customize your rules
  },
  parserOptions: {
    project: "./tsconfig.json",
  },
};
