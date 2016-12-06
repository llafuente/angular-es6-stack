import JWTAuth from 'directives/seed/JWTAuth';

var $$rootScope;
var $$http;
var Auth;
// mocks
var $httpBackend;
var apiUserMe;
var apiUserLogout;
var apiAuth;

describe('JWTAuth', () => {
  beforeEach(angular.mock.module('JWTAuth'));
  beforeEach(inject(($rootScope, $injector, $http) => {
    Auth = $injector.get('Auth');
    $$rootScope = $rootScope;
    $$http = $http;
    
    $httpBackend = $injector.get('$httpBackend');
    
    apiUserMe = $httpBackend.when('POST', '/api/users/me')
    .respond({
      id: 1,
      username: 'Admin',
      roles: ['super-admin', 'user-admin'],
      permissions: ['access users', 'modify users', 'delete users']
    });
    
    apiUserLogout = $httpBackend.when('POST', '/api/logout')
    .respond({sucess: true});

    apiAuth = $httpBackend.when('POST', '/api/auth')
    .respond({token: 'imaginary-token'});
  }));

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('JWTAuth login/logout', () => {
    Auth.login('admin', 'admin', false);

    $httpBackend.flush();

    expect(Auth.isLoggedIn()).toEqual(true);
    expect(Auth.getToken()).toEqual('imaginary-token');
    expect(Auth.getTokenExp()).toEqual(null);
    expect(Auth.hasRole('super-admin')).toEqual(true);
    expect(Auth.hasRole('no-admin')).toEqual(false);
    expect(Auth.hasRoles('super-admin', 'user-admin')).toEqual(true);
    expect(Auth.hasRolesAny('super-admin', 'user-admin')).toEqual(true);
    expect(Auth.hasRolesAny('super-admin', 'no-admin')).toEqual(true);

    Auth.logout()
    $httpBackend.flush();

    expect(Auth.isLoggedIn()).toEqual(false);
    expect(Auth.getToken()).toEqual(null);
    expect(Auth.getTokenExp()).toEqual(null);
    expect(Auth.hasRole('super-admin')).toEqual(false);
    expect(Auth.hasRole('no-admin')).toEqual(false);
    expect(Auth.hasRoles('super-admin', 'user-admin')).toEqual(false);
    expect(Auth.hasRolesAny('super-admin', 'user-admin')).toEqual(false);
    expect(Auth.hasRolesAny('super-admin', 'no-admin')).toEqual(false);
  });

  it('JWTAuth login & header logout', () => {
    var loginCounter = 0
    var logoutCounter = 0;

    $$rootScope.$on('$login', function() {
      ++loginCounter;
    });
    $$rootScope.$on('$logout', function() {
      ++logoutCounter;
    });

    $httpBackend.expectPOST('/api/users/me');
    Auth.login('admin', 'admin', false); // $login

    $httpBackend.flush();

    expect(Auth.isLoggedIn()).toEqual(true);


    Auth.refreshSession(); // $login
    $httpBackend.flush();

    $httpBackend.when('GET', '/test/session-expired')
    .respond(403, ['session expired'], {
      'X-Force-Logout': true
    });
    $$http.get('/test/session-expired');
    $httpBackend.flush();

    expect(loginCounter).toEqual(2);
    expect(logoutCounter).toEqual(1);


  });
});
