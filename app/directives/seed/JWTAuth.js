import angular from 'angular';
import 'angular-cookies';
import JWTAuthConfigProvider from './JWTAuthConfig.provider.js';
import JWTAuthInterceptor from './JWTAuth.interceptor.js';
import AuthFactory from './JWTAuth.factory.js';

export default 'JWTAuth';
// factory fast access via $rootScope.auth
// current user: $rootScope.user
// emit $logout & $login event to rootScope
angular
.module('JWTAuth', ['ui.router', 'ngCookies'])
.provider('JWTAuthConfig', JWTAuthConfigProvider)
.factory('Auth', AuthFactory)
.factory('JWTAuthInterceptor', JWTAuthInterceptor)
.config(function($httpProvider) {
  $httpProvider.interceptors.push('JWTAuthInterceptor');
})
// just run it so it can autologin
.run(function(Auth) {});
