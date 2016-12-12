/**
 * @ngdoc factory
 * @class Auth
 * @memberOf module:JWTAuth
 *
 * @description
 * # Auth
 *
 * Auth factory.
 * * Keep user state (login/logout)
 * * Check permissions
 */
export default function Auth($location, $rootScope, $http, $cookies, $state, $log, JWTAuthConfig) {
  let currentUser = {};
  let logginInProgess = null;

  function _setCurrentUser(val) {
    $log.debug('(Auth) _setCurrentUser');

    $rootScope.user = val;
    currentUser = val;
  }

  function _logMeIn() {
    return $http({
      method: JWTAuthConfig.apiUsersMeta.method,
      url: JWTAuthConfig.apiUsersMeta.url
    })
    .then(function(response) {
      _setCurrentUser(response.data);
      $rootScope.$emit('$login');
    });
  }

  function _getToken() {
    return $cookies.get(JWTAuthConfig.cookie.name) || null;
  }
  // set token will set a cookie in current domain and parent domain
  // for no good reason :S
  function _setToken(data) {
    $cookies.put(JWTAuthConfig.cookie.name, data, {
      path: '/',
      secure: $location.protocol() === 'https',
      domain: JWTAuthConfig.cookie.domain
    });
  }
  // remove token will remove the cookie in current domain
  // and all parent domains
  function _removeToken() {
    // main domain
    $cookies.remove(JWTAuthConfig.cookie.name, {
      path: '/',
      secure: $location.protocol() === 'https',
      domain: JWTAuthConfig.cookie.domain
    });

    $log.debug('(Auth) _getToken() ', _getToken());
  }

  function base64URLDecode(base64UrlEncodedValue) {
    let res;
    const newValue = base64UrlEncodedValue.replace('-', '+').replace('_', '/');

    try {
      res = decodeURIComponent(escape(window.atob(newValue)));
    } catch (e) {
      throw new Error('Base64URL decode of JWT segment failed');
    }

    return res;
  }

  function _hasRole(roles, chkfn) {
    if (!roles) {
      return true;
    }

    if (!currentUser || !currentUser.roles) {
      return false;
    }

    let r = roles;

    if (typeof r === 'string') {
      r = [r];
    }

    return r[chkfn](function(role) {
      // drop nulls, empty strings
      if (!role) {
        return true;
      }

      return currentUser ? currentUser.roles.indexOf(role) !== -1 : false;
    });
  }

  // permissions can be:
  // * a list of strings
  // * an object-boolean-terminated user: { create: true, delete: false }
  function _hasPermission(perms, chkfn) {
    if (!perms) {
      return true;
    }

    if (!currentUser || !currentUser.permissions) {
      return false;
    }

    let p = perms;

    if (typeof p === 'string') {
      p = [p];
    }

    return p[chkfn](function(perm) {
      let ref;
      // drop nulls, empty strings
      if (!perm) {
        return true;
      }

      if (Array.isArray(currentUser.permissions)) {
        return currentUser ? currentUser.permissions.indexOf(perm) !== -1 : false;
      }
      // currentUser.permissions is an object
      ref = currentUser.permissions;
      return perm.split('.').every(function(k) {
        if (ref[k]) {
          ref = ref[k];
          return true;
        }
        return false;
      });
    });
  }

  $log.debug('(Auth) Token', _getToken());

  if (_getToken()) {
    logginInProgess = _logMeIn()
    .finally(function() {
      logginInProgess = null;
    });
  }

  return ($rootScope.Auth = {

    /**
     * Authenticate user and save token
     * @function
     * @memberOf module:JWTAuth.Auth
     * @param username {string}
     * @param password {String}
     * @param remindme {Boolean}
     * @returns {Promise}
     */
    login: function(username, password, remindme) {
      return (logginInProgess = $http({
        method: 'POST',
        url: JWTAuthConfig.apiAuthUrl,
        data: {
          username: username,
          password: password,
          remindme: remindme || false
        }
      })
      .then(function(response) {
        $log.debug('(Auth) login success', response.data);

        _setToken(response.data.token);

        return _logMeIn().then(function() {
          return response;
        });
      }, function(response) {
        $log.debug('(Auth) login err', response);
        this.logout();

        return response;
      }.bind(this))
      .finally(function() {
        logginInProgess = null;
      }));
    },
    /**
     * refresh user metadata
     * @function
     * @memberOf module:JWTAuth.Auth
     */
    refreshSession: function() {
      return _logMeIn();
    },
    /**
     * logout user first.
     * Then call logout API if configured.
     * Then broadcast $logout event
     *
     * @function
     * @memberOf module:JWTAuth.Auth
     * @param redirectTo {Boolean}
     */
    logout: function(redirectTo) {
      _setCurrentUser({});
      const token = _getToken();
      _removeToken();

      if (token && JWTAuthConfig.apiUsersLogout.url && JWTAuthConfig.apiUsersLogout.method) {
        const headers = {};
        headers[JWTAuthConfig.token.header] = token;
        $http({
          method: JWTAuthConfig.apiUsersLogout.method,
          url: JWTAuthConfig.apiUsersLogout.url,
          headers: headers
        })
        .finally(function() {
          // TODO review if this is the best site
          $rootScope.$emit('$logout');

          if (redirectTo) {
            $log.debug('(Auth) redirect logout', redirectTo);

            $state.go(redirectTo);
          }
        });
      } else if (redirectTo) {
        $log.debug('(Auth) redirect logout', redirectTo);

        $state.go(redirectTo);
      }
    },
    /**
     * Get metadata from current logged user, or null
     *
     * @function
     * @memberOf module:JWTAuth.Auth
     * @returns {Object | Null} metadata
     */
    getCurrentUser: function() {
      return currentUser;
    },

    /**
     * Check if a user is logged in
     *
     * @function
     * @memberOf module:JWTAuth.Auth
     * @return {Boolean}
     */
    isLoggedIn: function() {
      return currentUser.hasOwnProperty('id');
    },

    /**
     * Waits for currentUser to resolve before checking if user is logged in
     *
     * @example
     * Auth.isLoggedInAsync(function(loggedIn) {
     *   if (loggedIn) {
     *     // show your private staff...
     *   } else {
     *     // show login!
     *   }
     * })
     * @function
     * @memberOf module:JWTAuth.Auth
     * @param cb {Function} will recieve a boolean
     */
    isLoggedInAsync: function(cb) {
      $log.debug('(Auth) isLoggedInAsync', currentUser, logginInProgess);

      if (currentUser.hasOwnProperty('id')) {
        cb(true);
      } else if (logginInProgess) {
        logginInProgess
          .then(function() {
            cb(true);
          }).catch(function() {
            cb(false);
          });
      } else {
        cb(false);
      }
    },
    /**
     * Check if current user has role.
     * NOTE: return false is user is not logged in.
     *
     * @function
     * @memberOf module:JWTAuth.Auth
     * @param role {String}
     * @returns {Boolean}
     */
    hasRole: function hasRole(role) {
      return _hasRole([role], 'every');
    },
    /**
     * Check if current user has all roles sent.
     * NOTE: return false is user is not logged in.
     *
     * @function
     * @memberOf module:JWTAuth.Auth
     * @param roles {Array.<String>}
     * @returns {Boolean}
     */
    hasRoles: function(roles) {
      return _hasRole(roles, 'every');
    },
    /**
     * Check if current user has at least one of the roles sent.
     * NOTE: return false is user is not logged in.
     *
     * @function
     * @memberOf module:JWTAuth.Auth
     * @param roles {Array.<String>}
     * @returns {Boolean}
     */
    hasRolesAny: function(roles) {
      return _hasRole(roles, 'some');
    },
    /**
     * Check if current user has all permisions sent.
     * NOTE: return false is user is not logged in.
     *
     * @function
     * @memberOf module:JWTAuth.Auth
     * @param perms {Array.<String>}
     * @returns {Boolean}
     */
    hasPermissions: function(perms) {
      return _hasPermission(perms, 'every');
    },
    /**
     * Check if current user has at least one permisions
     *
     * @function
     * @memberOf module:JWTAuth.Auth
     * @param perms {Array.<String>}
     * @returns {Boolean} true if user logged and at least one role
     * false if user not logged or role not found
     */
    hasPermissionsAny: function(perms) {
      return _hasPermission(perms, 'some');
    },
    /**
     * Get JWT Token
     *
     * @function
     * @memberOf module:JWTAuth.Auth
     * @returns {String}
     */
    getToken: _getToken,
    /**
     * Get Expiration timestamp
     *
     * @function
     * @memberOf module:JWTAuth.Auth
     * @returns {Number|Null}
     */
    getTokenExp: function() {
      let tk = _getToken();
      if (!tk) {
        return null;
      }

      tk = tk.split('.');
      // If token does not have any expiration, return null
      if (tk.length < 2) {
        return null;
      }

      const payload = JSON.parse(base64URLDecode(tk[1]));
      return payload.exp * 1000;
    },
    /**
     * Manually set session token, after that will try to retrive the user
     * metadata
     *
     * @function
     * @memberOf module:JWTAuth.Auth
     * @param token {String}
     * @returns {Promise}
     */
    setToken: function(token) {
      _setToken(token);
      return _logMeIn();
    }
  });
}
