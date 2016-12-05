import httpUrlRewrite from './httpUrlRewrite.provider.js'
import httpUrlRewriteInterceptor from './httpUrlRewrite.interceptor.js'
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
.provider('httpUrlRewrite', httpUrlRewrite)
.factory('httpUrlRewriteInterceptor', httpUrlRewriteInterceptor)
.config(function($httpProvider) {
  $httpProvider.interceptors.push('httpUrlRewriteInterceptor');
});