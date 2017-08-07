const createRecipe = require('./creates/recipe')
const listRecipe = require('./triggers/recipe')
const authentication = require('./authentication')


const includeSessionKeyHeader = (request, z, bundle) => {
  if (bundle.authData.sessionKey) {
    request.headers = request.headers || {};
    request.headers['FM-Data-token'] = bundle.authData.sessionKey;
  }
  return request;
};

const sessionRefreshIf401 = (response, z, bundle) => {
    if (bundle.authData.sessionKey) {
        if (response.status === 401) {
            throw new z.errors.RefreshAuthError('Session key needs refreshing.');
        }
    }
    return response;
};

// We can roll up all our behaviors in an App.
const App = {
  // This is just shorthand to reference the installed dependencies you have. Zapier will
  // need to know these before we can upload
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: authentication,
  
  // beforeRequest & afterResponse are optional hooks into the provided HTTP client
  beforeRequest: [
    includeSessionKeyHeader
  ],

  afterResponse: [
      sessionRefreshIf401
  ],

  // If you want to define optional resources to simplify creation of triggers, searches, creates - do that here!
  resources: {
  },

  // If you want your trigger to show up, you better include it here!
  triggers: {
    [listRecipe.key]:listRecipe
  },

  // If you want your searches to show up, you better include it here!
  searches: {
  },

  // If you want your creates to show up, you better include it here!
  creates: {
    [createRecipe.key]:createRecipe
  }
};

// Finally, export the app.
module.exports = App;
