module.exports = {
  "extends": "standard",
  "plugins": [
    "standard",
    "promise"
  ],
  "rules": {
    "semi": [2, "always"], // because $%&# +&* ASI!
    "padded-blocks": 0
  },
  "env": {
    "mocha": true
  }
};