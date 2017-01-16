/**
 * @ngdoc function
 * @function
 * @name httpUrlRewriteInterceptor
 * @memberOf module:httpUrlRewrite
 * @description
 * # httpUrlRewriteInterceptor
 *
 * Interceptor that use httpUrlRewrite (provider) to rewrite requests config
 */
export default function httpUrlRewriteInterceptor(httpUrlRewrite) {
  return {
    request: function(config) {
      config.headers = config.headers || {};
      for (const i in httpUrlRewrite.addHeader) { // eslint-disable-line guard-for-in
        config.headers[i] = httpUrlRewrite.addHeader[i];
      }

      for (const i in httpUrlRewrite.startWith) { // eslint-disable-line guard-for-in
        const url = httpUrlRewrite.startWith[i];
        if (config.url.indexOf(i) === 0) {
          config.url = url + config.url.substring(i.length);
        }
      }

      return config;
    }
  };
}
