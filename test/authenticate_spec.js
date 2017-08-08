require('should');
const zapier = require('zapier-platform-core');
const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('authentication', () => {

  describe('authenticate', () => {
    it('should fetch a valid sessionKey given correct password and username', (done) => {
      var bundle = {authData: {user: 'admin', password: '123', layout: 'email', solution: 'email', subdomain: 'lex'}};
      appTester(App.authentication.sessionConfig.perform, bundle)
        // .then(App.triggers.listRecipe.operation.perform, bundle)
        .then(results => {
          console.log(results);
          results.should.have.property('sessionKey');      
          done();
        })
        .catch(done);
    });
  });

});