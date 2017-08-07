require('should');
const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App, {authData: {user: 'admin', password: '123', layout: 'email', solution: 'email', subdomian: 'lex'}});

describe('creates', () => {

  describe('create new record', () => {
    it('should create a new record in FileMaker cloud', (done) => {
      const bundle = {
        authData: {user: 'admin', password: '123', layout: 'email', solution: 'email', subdomian: 'lex'},
        inputData: {data: {}}
      };

      appTester(App.creates.createRecipe.operation.perform, bundle)
        .then((result) => {
          console.log(result)
          //no output field for record creation 
          done();
        })
        .catch(done);
    });
  });
});