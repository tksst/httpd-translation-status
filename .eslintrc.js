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
        "unicorn",
        "@typescript-eslint",
        "react",
        "prettier",
    ],
    "extends": [
        "airbnb",
        "plugin:unicorn/recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
        "prettier",
        "prettier/unicorn",
        "prettier/react",
        "prettier/@typescript-eslint",
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

        "unicorn/prevent-abbreviations": "off",
        "unicorn/prefer-query-selector": "off",
        "unicorn/filename-case": [
            "error",
            { "case": "camelCase" },
        ],
        "react/prop-types": "off",
        "react/jsx-key": "warn",
        "react/destructuring-assignment": "off",
        "no-param-reassign": "off",
        "no-prototype-builtins": "warn",
        "prefer-template": "warn",
        "import/prefer-default-export": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/explicit-function-return-type": "off",

        "prettier/prettier": [
            "warn",
            {
                "printWidth": 120,
                "tabWidth": 4,
                "trailingComma": "es5",
                "endOfLine": "lf",
            }
        ],
    }
}
