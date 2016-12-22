/**
 * @ngdoc provider
 * @function
 * @name httpUrlRewriteProvider
 * @memberOf module:httpUrlRewrite
 * @description
 * # httpUrlRewriteProvider
 * 
 * The provider contains to keys:
 * * startWith (Object).
 *   key is string to test
 *   value to string to replace
 * * addHeader (Object)
 *   key is the name of the header,
 *   value is the value of the header
 * @example
   angular.module('app').config(function(httpUrlRewriteProvider) {
     // always sent this header
     httpUrlRewriteProvider.addHeader['X-App-Version'] = '1.0.0';
     // redirect: /api/latest -> /api/v2
     httpUrlRewriteProvider.startWith['/api/latest'] = '/api/v2';

   })
 */ 
export default function httpUrlRewriteProvider() {
  // Rewrite urls that start with
  this.startWith = {};
  // Add custom header to all request
  this.addHeader = {};

  this.$get = function() {
    return this;
  };
}