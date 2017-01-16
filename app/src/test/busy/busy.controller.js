export default /*@ngInject*/ class BusyController {
  constructor($http) {
    this.$http = $http;
  }

  getRequest () {
    this.$http({
      method: 'GET',
      url: '/api/seed/busy-delay'
    });
  }
}
