export default class RedirectController {
  constructor($state, $stateParams, redirectTo, redirectBack) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.redirectTo = redirectTo;
    this.redirectBack = redirectBack;
  }

  to() {
    this.redirectTo(undefined, {
      saveThisVar: 1
    }, 'redirect.redirect3');
  }
  back() {
    this.redirectBack('redirect.redirect2');
  }
}
