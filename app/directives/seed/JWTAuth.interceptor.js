/**
 * @ngdoc interceptor
 * @function
 * @name JWTAuthInterceptor
 * @memberOf module:JWTAuth
 * @description
 * # JWTAuthInterceptor
 * 
 * Add Authorization header.
 */
export default function JWTAuthInterceptor($injector, $q, $log) {
  return {
    // Add authorization token to headers
    request: function(config) {
      var JWTAuthConfig = $injector.get('JWTAuthConfig');
      var Auth = $injector.get('Auth');
      config.headers = config.headers || {};

      var t = Auth.getToken();
      var domain_blacklisted = JWTAuthConfig.domainBlacklistHeader.some(function(domain) {
        return config.url.indexOf(domain) !== -1;
      });

      $log.debug('(JWTAuthInterceptor)', config.url, domain_blacklisted, JWTAuthConfig.domainBlacklistHeader);

      if (t && !domain_blacklisted) {
        config.headers[JWTAuthConfig.token.header] = JWTAuthConfig.token.format.replace(/%token%/g, t);
      }
      return config;
    },
    responseError: function(response) {
      var JWTAuthConfig = $injector.get('JWTAuthConfig');
      var Auth = $injector.get('Auth');
      
      console.log('(responseError)', response.headers);

      if (response.headers && response.headers(JWTAuthConfig.apiExpirationHeader)) {
        Auth.logout();
      }

      return $q.reject(response);
    }
  };
}