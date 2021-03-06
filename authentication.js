const testAuth = (z /*, bundle*/) => {
  // Normally you want to make a request to an endpoint that is either specifically designed to test auth, or one that
  // every user will have access to, such as an account or profile endpoint like /me.
  // In this example, we'll hit httpbin, which validates the Authorization Header against the arguments passed in the URL path
  const promise = z.request({
    url: 'https://{{bundle.authData.subdomain}}.fmi-beta.filemaker-cloud.com/fmi/rest/api/layout/{{bundle.authData.solution}}/{{bundle.authData.layout}}',
    method: 'GET'
  });

  // This method can return any truthy value to indicate the credentials are valid.
  // Raise an error to show
  return promise.then((response) => {

    if (response.status === 401) {
      throw new Error('The Session Key you supplied is invalid');
    }
    return response;
  });
};

const getSessionKey = (z, bundle) => {
  const promise = z.request({
    method: 'POST',
    url: 'https://{{bundle.authData.subdomain}}.fmi-beta.filemaker-cloud.com/fmi/rest/api/auth/{{bundle.authData.solution}}',
    body: {
      'user': bundle.authData.user,
      'password': bundle.authData.password,
      'layout': bundle.authData.layout
    }
  });

  return promise.then((response) => {
    if (response.status === 401) {
      throw new Error('The username/password you supplied is invalid');
    }
    const json = JSON.parse(response.content);
    return {
      sessionKey: json.token || 'new session key!'
    };
  });
};

const connectionLabel = (z, bundle) => { // Can also be a string, check basic auth above for an example
    // bundle.inputData has whatever comes back from the .test function/request, assuming it returns a JSON object
    return bundle.inputData.user;
};

module.exports = {
  type: 'session',
  // Define any auth fields your app requires here. The user will be prompted to enter this info when
  // they connect their account.
  connectionLabel: connectionLabel,
  fields: [
    {key: 'user', label: 'Username', required: true, type: 'text'},
    {key: 'password', label: 'Password', required: true, type: 'text'},
    {key: 'layout', label: 'layout', required: true, type: 'text', helpText: 'the layout of your database'},
    {key: 'solution', label: 'solution', required: true, type: 'text', helpText: 'you database name'},
    {key: 'subdomain', label: 'subdomain', required: true, type: 'text', helpText: 'Your filemaker host name'}
  ],
  // The test method allows Zapier to verify that the credentials a user provides are valid. We'll execute this
  // method whenver a user connects their account for the first time.
  test: testAuth,
  // The method that will exchange the fields provided by the user for session credentials.
  sessionConfig: {
    perform: getSessionKey
  }
};