Prerequites

```bash
npm i -g gulp-cli
```

# Scripts

```bash
# run webpack and generate that dist folder with JS/CSS
npm run-script webpack
# run webpack and generate that dist folder with JS/CSS minified and sourcemaps
NODE_ENV=production npm run-script webpack
# lint and fix your code-style
npm run-script lint
# real build (no compression)
# * rm -rf dist
# * get version from package.json
# * get last commit hash
# * store those values at: /app/services/version-service.js
# * run webpack
gulp build
# run karma test once
gulp karma:ci
# run karma test & watch (development)
gulp karma
```


# What it does

* Bundle angular templates (using ngtemplate-loader)
* Allow you to write ES6 code (using babel)
* handle injector using `/*ngInject*/` (using ng-annotate-loader)
* Use bootstrap 4 (SASS is the CSS prepocessor)
* CSS is saved to a separate files
* karma for CI and development (use `gulp karma:ci` or `gulp karma`)
* dev server with `/api/*` proxied to `http://localhost:9090`
* jsDoc ready
* images versioning

On production
* generate source-maps
* minify CSS/JS


# TODO

* jade
* HMR (--inline --hot)
* JSON API
* protractor
* use dgeni for documentation
  * package.json.scripts: "dgeni": "node_modules/.bin/dgeni ./docs/config/index.js"
  * package.json.devDependencies: "dgeni": "^0.4.2",
* working example of ng-file-upload in ie9
* karma coverage using: babel-plugin-istanbul
