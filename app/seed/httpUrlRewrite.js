import angular from 'angular';
import httpUrlRewrite from './httpUrlRewrite.provider.js';
import httpUrlRewriteInterceptor from './httpUrlRewrite.interceptor.js';
export default 'httpUrlRewrite';
/**
 * @ngdoc module
 * @module httpUrlRewrite
 * @description
 * # httpUrlRewrite
 *
 * Rewrite all HTTP request base on some rules at
 * [httpUrlRewriteProvider]{@link module:httpUrlRewrite.httpUrlRewriteProvider} 
 * * Rewrite urls that start with
 * * Add custom header
 */
angular
.module('httpUrlRewrite', [])
.provider('httpUrlRewrite', httpUrlRewrite)
.factory('httpUrlRewriteInterceptor', httpUrlRewriteInterceptor)
.config(function($httpProvider) {
  $httpProvider.interceptors.push('httpUrlRewriteInterceptor');
});
