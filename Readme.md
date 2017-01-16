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


Done

* process images in css, sass & htmls
* save css in other file
* bable al js
* eslint js
* css/js source map
* bootstrap v4
* karma test (ci/dev)
* karma coverage using: babel-plugin-istanbul
* source-map working (at least on chrome)
* API proxy
* jsdoc


TODO

* jade
* HMR (--inline --hot)
* JSON API
* inetsys-seed
* protractor

* use dgeni for documentation
  * package.json.scripts: "dgeni": "node_modules/.bin/dgeni ./docs/config/index.js"
  * package.json.devDependencies: "dgeni": "^0.4.2",

asset inline
    "resolve-url-loader": "^1.6.0",
    "url-loader": "^0.5.7",
