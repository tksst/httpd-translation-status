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
        "import",
        "react",
        "jsx-a11y",
        "prettier",
    ],
    "extends": [
        "airbnb",
        "plugin:unicorn/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:prettier/recommended",
        "prettier",
        "prettier/unicorn",
        "prettier/@typescript-eslint",
        "prettier/react",
    ],
    "settings": {
        "react": {
            "version": "detect"
        },
        "import/resolver": "webpack",        
    },
    "rules": {
        "no-param-reassign": "off",
        "no-prototype-builtins": "warn",
        "prefer-template": "warn",

        "unicorn/prevent-abbreviations": "off",
        "unicorn/prefer-query-selector": "off",
        "unicorn/filename-case": [
            "error",
            { "case": "camelCase" },
        ],

        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/explicit-function-return-type": "off",

        "import/prefer-default-export": "off",

        "react/jsx-filename-extension": [
            "error",
            {
                "extensions": [
                    ".jsx",
                    ".tsx"
                ]
            }
        ],
        "react/prop-types": "off",
        "react/jsx-key": "warn",
        "react/destructuring-assignment": "off",

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
