export default class BusyController {
  constructor($http) {
    this.$http = $http;
  }

  getRequest () {
    this.$http({
      method: 'GET',
      url: '/something'
    });
  }
}