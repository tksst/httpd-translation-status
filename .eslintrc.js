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
        "react/jsx-indent-props": "off",

        "react/prop-types": "off",
        "react/jsx-key": "warn",
        // ignoreClassFields does not work
        "react/destructuring-assignment": "off",
        "no-param-reassign": "off",
        "no-prototype-builtins": "warn",
        "prefer-template": "warn",
        "import/prefer-default-export": "off",
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
