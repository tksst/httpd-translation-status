module.exports = {
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "./tsconfig.json",
        "tsconfigRootDir": "."
    },
    "env": {
        "browser": true
    },
    "plugins": [
        "@typescript-eslint",
        "react",
        "prettier",
    ],
    "extends": [
        "airbnb",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
        "prettier/@typescript-eslint"
    ],
    "settings": {
        "react": {
            "version": "detect"
        },
        "import/resolver": "webpack",        
    },
    "rules": {
        "react/jsx-filename-extension": [
            "error",
            {
                "extensions": [
                    ".jsx",
                    ".tsx"
                ]
            }
        ],
        // strange behavior, conflict with prettier?
        "react/jsx-indent": "off",

        "react/prop-types": "off",
        "react/jsx-key": "warn",
        "no-param-reassign": "off",
        "no-prototype-builtins": "warn",
        "prefer-template": "warn",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/explicit-function-return-type": "off",

        "prettier/prettier": [
            "error",
            {
                "printWidth": 120,
                "tabWidth": 4,
                "trailingComma": "es5",
                "endOfLine": "lf",
            }
        ],
    }
}
