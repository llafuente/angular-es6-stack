export default function JWTAuthInterceptor($injector, $q, $log) {
  return {
    // Add authorization token to headers
    request: function(config) {
      var JWTAuthConfig = $injector.get('JWTAuthConfig');
      var Auth = $injector.get('Auth');
      config.headers = config.headers || {};

      var t = Auth.getToken();
      var domain_blacklisted = JWTAuthConfig.no_token_header.some(function(domain) {
        return config.url.indexOf(domain) !== -1;
      });

      $log.debug('(JWTAuthInterceptor)', config.url, domain_blacklisted, JWTAuthConfig.no_token_header);

      if (t && !domain_blacklisted) {
        config.headers[JWTAuthConfig.token_header] = JWTAuthConfig.token_format.replace(/%token%/g, t);
      }
      return config;
    },
    responseError: function(response) {
      var JWTAuthConfig = $injector.get('JWTAuthConfig');
      var Auth = $injector.get('Auth');

      if (response.headers && response.headers(JWTAuthConfig.expiration_header)) {
        Auth.logout();
      }

      return $q.reject(response);
    }
  };
}