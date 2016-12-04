export default 'httpUrlRewrite';
/**
 * @ngdoc module
 * @name httpUrlRewrite
 * @module httpUrlRewrite
 * @description
 * # httpUrlRewrite
 * 
 * hook ui-router supporting loading screens, no extra code is required
 * just include!
 */
angular
.module('httpUrlRewrite', [])
/**
 * @ngdoc object
 * @name httpUrlRewrite.httpUrlRewriteConfigProvider
 * @module httpUrlRewrite
 * @description
 * # httpUrlRewriteConfigProvider
 * 
 * The provider contains to keys:
 * * startWith (Object).
 *   key is string to test
 *   value to string to replace
 * * addHeader (Object)
 *   key is the name of the header,
 *   value is the value of the header
 * @example
   angular.module('app').config(function(httpUrlRewriteConfig) {
     // always sent this header
     httpUrlRewriteConfig.addHeader['X-App-Version'] = '1.0.0';
     // redirect: /api/latest -> /api/v2
     httpUrlRewriteConfig.startWith['/api/latest'] = '/api/v2';

   })
 */ 
.provider('httpUrlRewriteConfig', function() {
  // Rewrite urls that start with
  this.startWith = {};
  // Add custom header to all request
  this.addHeader = {};

  this.$get = function() {
    return this;
  };
})
.factory('httpUrlRewriteInterceptor', function(httpUrlRewriteConfig) {
  return {
    request: function(config) {
      var i, url;

      config.headers = config.headers || {};
      for (i in httpUrlRewriteConfig.addHeader) {
        config.headers[i] = httpUrlRewriteConfig.addHeader[i];
      }

      for (i in httpUrlRewriteConfig.startWith) {
        url = httpUrlRewriteConfig.startWith[i];
        if (config.url.indexOf(i) === 0) {
          config.url = url + config.url.substring(i.length);
        }
      }

      return config;
    }
  };
})
.config(function($httpProvider) {
  $httpProvider.interceptors.push('httpUrlRewriteInterceptor');
});