export default class ErrorHandlingController {
  constructor($http) {
    this.$http = $http;
  }

  err1() {
    this.$http({
      method: 'GET',
      url: '/api/seed/error404'
    });
  }

  err2() {
    this.$http({
      method: 'GET',
      url: '/api/seed/error500'
    });
  }
}