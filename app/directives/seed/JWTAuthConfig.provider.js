/**
 * @ngdoc object
 * @name JWTAuth.JWTAuthProvider
 * @module httpUrlRewrite
 * @description
 * # JWTAuthProvider
 * 
 * The provider contains:
 * * api_users_data: method that return user metadata
 * * api_users_data_method: HTTP method that return user metadata
 * * api_auth: url (must be POST for security reason) that return the token
 * * state_after_login: after used is logged in where to redirect him
 * * api_users_logout_method: HTTP method for logout
 * * api_users_logout: logout url, null to disable request
 * * no_token_header: list of domain list where not send Auth header
 * * token_header: name of the header to store the Authorization token
 * * token_format: format of the token to send: 'Bearer %token%' is the default
 * * cookie_name: name of the cookie to store the token
 * * cookie_domain: domain of the cookie
 * * expiration_header: server side header to force session expired, force logout.
 *
 * @example
   angular.module('app').config(function(JWTAuthProvider) {
     JWTAuthProvider.

   })
 */
export default function JWTAuthConfigProvider() {
  this.api_users_data_method = 'POST';
  this.api_users_data = '/api/users/me';
  this.api_auth = '/api/auth';
  this.state_after_login = 'users';
  this.api_users_logout_method = 'POST';
  this.api_users_logout = '/api/logout';
  this.no_token_header = [];
  this.token_header = 'X-Access-Token';
  this.token_format = 'Bearer %token%';
  this.cookie_name = 'token';
  this.cookie_domain = null;
  this.expiration_header = 'X-Session-Expired';

  this.$get = function() {
    return this;
  };
}