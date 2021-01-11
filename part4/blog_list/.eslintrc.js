module.exports = {
    "env": {
        "commonjs": true,
        "es2021": true,
        "node": true,
        "jest": true
    },
    "extends": [
        "airbnb-base"
    ],
    "parserOptions": {
        "ecmaVersion": 12
    },
    "rules": {
        "no-param-reassign": "off",
        "no-underscore-dangle": "off",
        "no-console": 0,
        "consistent-return": "off",
        "prefer-destructuring": 0,
    }
};
