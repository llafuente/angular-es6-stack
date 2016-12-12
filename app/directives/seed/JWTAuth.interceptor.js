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
      const JWTAuthConfig = $injector.get('JWTAuthConfig');
      const Auth = $injector.get('Auth');
      config.headers = config.headers || {};

      const tk = Auth.getToken();
      const domainBlacklisted = JWTAuthConfig.domainBlacklistHeader.some(function(domain) {
        return config.url.indexOf(domain) !== -1;
      });

      $log.debug('(JWTAuthInterceptor)', config.url, domainBlacklisted, JWTAuthConfig.domainBlacklistHeader);

      if (tk && !domainBlacklisted) {
        config.headers[JWTAuthConfig.token.header] = JWTAuthConfig.token.format.replace(/%token%/g, tk);
      }
      return config;
    },
    responseError: function(response) {
      const JWTAuthConfig = $injector.get('JWTAuthConfig');
      const Auth = $injector.get('Auth');

      $log.debug('(responseError)', response.headers);

      if (response.headers && response.headers(JWTAuthConfig.apiExpirationHeader)) {
        Auth.logout();
      }

      return $q.reject(response);
    }
  };
}
