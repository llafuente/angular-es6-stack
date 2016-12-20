export default /*@ngInject*/ class LoginController {
  constructor(Auth) {
    this.Auth = Auth;
    this.data = {
      username: 'admin@admin.com',
      password: 'admin'
    };
  }

  login() {
    this.Auth.login(this.data.username, this.data.password, false);
  }
}
