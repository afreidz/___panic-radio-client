const overrides = {
  "import/first": "off",
  "import/order": "off",
  "import/extensions": "off",
  "no-nested-ternary": "off",
  "import/no-unresolved": "off",
  "no-multiple-empty-lines": "off",
  "import/no-mutable-exports": "off",
  "import/prefer-default-export": "off",
}

module.exports = {
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: "module"
  },
  env: {
    es6: true,
    browser: true
  },
  extends: ["airbnb-base"],
  plugins: [
    "svelte3",
  ],
  overrides: [
    {
      files: ["**/*.svelte"],
      processor: "svelte3/svelte3",
      rules: { ...overrides },
    },{
      files: ["**/*.js"],
      rules: { ...overrides },
    }
  ],
  settings: {
    "svelte3/ignore-styles": () => true,
  },
  rules: {
    "comma-dangle": ["error", "always-multiline"],
  },
};