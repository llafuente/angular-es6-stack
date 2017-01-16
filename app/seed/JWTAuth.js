import angular from 'angular';
import 'angular-cookies';
import JWTAuthConfigProvider from './JWTAuthConfig.provider.js';
import JWTAuthInterceptor from './JWTAuth.interceptor.js';
import AuthFactory from './JWTAuth.factory.js';

/**
 * @ngdoc module
 * @name JWTAuth
 * @module JWTAuth
 *
 * @description
 * Module to handle user/session.
 * It's exposed to `$rootScope.Auth` for easy to use.
 */
/**
 * @ngdoc event
 * @event
 * @name $login
 * @memberOf module:JWTAuth
 * @eventType broadcast on root scope
 * @description
 * # JWTAuth#$login
 * Broadcasted when user is fully logged in
 */
/**
 * @ngdoc event
 * @event
 * @name $logout
 * @memberOf module:JWTAuth
 * @eventType broadcast on root scope
 * @description
 * # JWTAuth#$logout
 * Broadcasted when user is logged out (manually or automatically)
 */
export default angular
.module('JWTAuth', ['ui.router', 'ngCookies'])
.provider('JWTAuthConfig', JWTAuthConfigProvider)
.factory('Auth', AuthFactory)
.factory('JWTAuthInterceptor', JWTAuthInterceptor)
.config(function($httpProvider) {
  $httpProvider.interceptors.push('JWTAuthInterceptor');
})
// just run it so it can autologin
.run(function(Auth) {}); // eslint-disable-line no-unused-vars
