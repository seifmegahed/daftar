/** @type {import("eslint").Linter.Config} */
const config = {
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": true
  },
  "plugins": [
    "@typescript-eslint",
    "drizzle"
  ],
  "ignorePatterns": [
    "node_modules",
    "next-env.d.ts",
    "next.config.mjs",
    "postcss.config.cjs",
    "tailwind.config.cjs",
    "admin"
  ],
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked"
  ],
  "rules": {
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        "prefer": "type-imports",
        "fixStyle": "inline-type-imports"
      }
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_"
      }
    ],
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        "checksVoidReturn": {
          "attributes": false
        }
      }
    ],
    "drizzle/enforce-delete-with-where": [
      "error",
      {
        "drizzleObjectName": [
          "db",
          "ctx.db"
        ]
      }
    ],
    "drizzle/enforce-update-with-where": [
      "error",
      {
        "drizzleObjectName": [
          "db",
          "ctx.db"
        ]
      }
    ]
    // "no-restricted-imports": [
    //   "error",
    //   {
    //     paths: [
    //       {
    //         name: "@/server/db/tables/user/queries",
    //         importNames: ["sensitiveGetUserPasswordById", "sensitiveGetUserByUsername"],
    //         message: "This function can only be imported from within the actions/auth folder or the actions/users folder.",
    //       },
    //     ],
    //     patterns: [
    //       "!**/server/db/actions/auth/login/index.ts",
    //       "!**/server/actions/users/index.ts"
    //     ],
    //   },
    // ],
  }
}
module.exports = config;