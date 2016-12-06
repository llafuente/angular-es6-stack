/**
 * @ngdoc object
 * @function
 * @name JWTAuthProvider
 * @memberOf module:JWTAuth
 * @description
 * # JWTAuthProvider
 * 
 * The provider contains:
 * * apiUsersMeta.url: HTTP method that return user metadata
 * * apiUsersMeta.method: method that return user metadata
 * * apiAuthUrl: url (must be POST for security reason) that return the token
 * * stateAfterLogin: after used is logged in where to redirect him
 * * apiUsersLogout.method: HTTP method for logout
 * * apiUsersLogout.url: logout url, null to disable request
 * * domainBlacklistHeader: list of domains where not send Auth header
 * * token.header: name of the header to store the Authorization token
 * * token.format: format of the token to send: 'Bearer %token%' is the default
 * * cookie.name: name of the cookie to store the token
 * * cookie.domain: domain of the cookie
 * * expirationHeader: server side header to force session expired, force logout.
 *
 * @example
 * angular.module('app').config(function(JWTAuthProvider) {
 *   JWTAuthProvider.apiUsersMeta.url = '/user/meta'
 * });
 */
export default function JWTAuthConfigProvider() {
  this.apiUsersMeta = {
    method: 'POST',
    url: '/api/users/me'
  };
  this.apiAuthUrl = '/api/auth';
  //this.stateAfterLogin = 'users';
  this.apiUsersLogout = {
    method: 'POST',
    url: '/api/logout'
  };
  this.domainBlacklistHeader = [];
  this.token = {
    header: 'X-Access-Token',
    format: 'Bearer %token%'
  }
  this.cookie = {
    name: 'token',
    domain: null
  };
  this.apiExpirationHeader = 'X-Force-Logout';

  this.$get = function() {
    return this;
  };
}