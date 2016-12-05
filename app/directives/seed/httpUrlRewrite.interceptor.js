/**
 * @ngdoc function
 * @name httpUrlRewrite.httpUrlRewriteInterceptor
 * @module httpUrlRewrite
 * @description
 * # httpUrlRewriteInterceptor
 * 
 * Interceptor that use httpUrlRewrite (provider) to rewrite requests config
 */ 
export default function httpUrlRewriteInterceptor(httpUrlRewrite) {
  return {
    request: function(config) {
      var i, url;

      config.headers = config.headers || {};
      for (i in httpUrlRewrite.addHeader) {
        config.headers[i] = httpUrlRewrite.addHeader[i];
      }

      for (i in httpUrlRewrite.startWith) {
        url = httpUrlRewrite.startWith[i];
        if (config.url.indexOf(i) === 0) {
          config.url = url + config.url.substring(i.length);
        }
      }

      return config;
    }
  };
}