export default function AuthFactory($location, $rootScope, $http, $cookies, $state, $log, JWTAuthConfig) {
  var currentUser = {};
  var login_in_prog = null;

  function set_current_user(val) {
    $log.debug('(Auth) set_current_user');

    $rootScope.user = val;
    currentUser = val;
  }

  function login_me() {
    return $http({
      method: JWTAuthConfig.api_users_data_method,
      url: JWTAuthConfig.api_users_data
    })
    .then(function(response) {
      set_current_user(response.data);
      $rootScope.$emit('$login');
    });
  }

  function get_token() {
    return $cookies.get(JWTAuthConfig.cookie_name);
  }
  // set token will set a cookie in current domain and parent domain
  // for no good reason :S
  function set_token(data) {
    $cookies.put(JWTAuthConfig.cookie_name, data, {
      path: '/',
      secure: $location.protocol() === 'https',
      domain: JWTAuthConfig.cookie_domain
    });
  }

  function Base64URLDecode(base64UrlEncodedValue) {
    var res;
    var newValue = base64UrlEncodedValue.replace('-', '+').replace('_', '/');

    try {
      res = decodeURIComponent(escape(window.atob(newValue)));
    } catch (e) {
      throw 'Base64URL decode of JWT segment failed';
    }

    return res;
  }

  // remove token will remove the cookie in current domain
  // and all parent domains
  function remove_token() {
    // main domain
    $cookies.remove(JWTAuthConfig.cookie_name, {
      path: '/',
      secure: $location.protocol() === 'https',
      domain: JWTAuthConfig.cookie_domain
    });

    $log.debug('(Auth) get_token() ', get_token());
  }

  function has_role(roles, chk_fn) {
    if (!roles) {
      return true;
    }

    if (!currentUser || !currentUser.roles) {
      return false;
    }

    if ('string' === typeof roles) {
      roles = [roles];
    }
    return roles[chk_fn](function(role) {
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
  function has_permission(perms, chk_fn) {
    if (!perms) {
      return true;
    }

    if (!currentUser || !currentUser.permissions) {
      return false;
    }

    if ('string' === typeof perms) {
      perms = [perms];
    }

    return perms[chk_fn](function(perm) {
      // drop nulls, empty strings
      if (!perm) {
        return true;
      }

      if (Array.isArray(currentUser.permissions)) {
        return currentUser ? currentUser.permissions.indexOf(perm) !== -1 : false;
      }
      // currentUser.permissions is an object
      var ref = currentUser.permissions;
      return perm.split('.').every(function(k) {
        if (ref[k]) {
          ref = ref[k];
          return true;
        }
        return false;
      });
    });
  }

  $log.debug('(Auth) Token', get_token());

  if (get_token()) {
    login_in_prog = login_me()
    .finally(function() {
      login_in_prog = null;
    });
  }


  return ($rootScope.Auth = {

    /**
     * Authenticate user and save token
     *
     * @param  {Object}   user     - login info
     * @return {Promise}
     */
    login: function(username, password, remindme) {
      return (login_in_prog = $http({
        method: 'POST',
        url: JWTAuthConfig.api_auth,
        data: {
          username: username,
          password: password,
          remindme: remindme || false
        }
      })
      .then(function(response) {
        $log.debug('(Auth) login success', response.data);

        set_token(response.data.token);

        return login_me().then(function() {
          return response;
        });
      }, function(response) {
        $log.debug('(Auth) login err', response);
        this.logout();

        return response;
      }.bind(this))
      .finally(function() {
        login_in_prog = null;
      }));
    },

    refreshSession: function() {
      return login_me();
    },

    /**
     * logout first, call logout API later
     * $emit $logout event to $rootScope after the api call
     *
     * @param  {Boolean}
     */
    logout: function(redirect_to) {
      set_current_user({});
      var token = get_token();
      remove_token();

      if (token && JWTAuthConfig.api_users_logout && JWTAuthConfig.api_users_logout_method) {
        var headers = {};
        headers[JWTAuthConfig.token_header] = token;
        $http({
          method: JWTAuthConfig.api_users_logout_method,
          url: JWTAuthConfig.api_users_logout,
          headers: headers
        })
        .finally(function() {
          // TODO review if this is the best site
          $rootScope.$emit('$logout');

          if (redirect_to) {
            $log.debug('(Auth) redirect logout', redirect_to);

            $state.go(redirect_to);
          }
        });
      } else if (redirect_to) {
        $log.debug('(Auth) redirect logout', redirect_to);

        $state.go(redirect_to);
      }
    },

    /**
     * Gets all available info on authenticated user
     *
     * @return {Object} user
     */
    getCurrentUser: function() {
      return currentUser;
    },

    /**
     * Check if a user is logged in
     *
     * @return {Boolean}
     */
    isLoggedIn: function() {
      return currentUser.hasOwnProperty('id');
    },

    /**
     * Waits for currentUser to resolve before checking if user is logged in
     */
    isLoggedInAsync: function(cb) {
      $log.debug('(Auth) isLoggedInAsync', currentUser, login_in_prog);

      if (currentUser.hasOwnProperty('id')) {
        cb(true);
      } else if (login_in_prog) {
        login_in_prog
          .then(function() {
            cb(true);
          }).catch(function() {
            cb(false);
          });
      } else {
        cb(false);
      }
    },
    hasRoles: function(roles) {
      return has_role(roles, 'every');
    },
    hasRolesAny: function(roles) {
      return has_role(roles, 'some');
    },
    hasPermissions: function(perms) {
      return has_permission(perms, 'every');
    },
    hasPermissionsAny: function(perms) {
      return has_permission(perms, 'some');
    },
    /**
     * Get auth token
     */
    getToken: get_token,
    getTokenExp: function() {
      var tk = get_token();
      if (!tk) {
        return null;
      }

      tk = tk.split('.');
      // If token does not have any expiration, return null
      if (tk.length < 2) {
        return null;
      }

      var payload = JSON.parse(Base64URLDecode(tk[1]));
      return payload.exp * 1000;
    },
    /**
     * Manually set session token
     */
    setToken: function(token) {
      set_token(token);
      return login_me();
    }
  });
}