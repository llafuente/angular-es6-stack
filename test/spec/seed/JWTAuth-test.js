import JWTAuth from 'directives/seed/JWTAuth';

var Auth;
// mocks
var $httpBackend;
var apiUserMe;
var apiUserLogout;
var apiAuth;

describe('JWTAuth', () => {
  beforeEach(angular.mock.module('JWTAuth'));
  beforeEach(inject(($injector) => {
    Auth = $injector.get('Auth');
    
    $httpBackend = $injector.get('$httpBackend');
    
    apiUserMe = $httpBackend.when('POST', '/api/users/me')
    .respond({id: 1, username: 'Admin'});
    
    apiUserLogout = $httpBackend.when('POST', '/api/logout')
    .respond({sucess: true});

    apiAuth = $httpBackend.when('POST', '/api/auth')
    .respond({token: 'imaginary-token'});
  }));

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should set application name on controller', () => {
    Auth.login('admin', 'admin', false);

    $httpBackend.flush();

    expect(Auth.isLoggedIn()).toEqual(true);
    expect(Auth.getToken()).toEqual('imaginary-token');
  });
});
