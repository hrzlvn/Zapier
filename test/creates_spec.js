require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('creates', () => {

  describe('create recipe function', () => {
    it('should create a new recipe', (done) => {
      const bundle = {
        inputData: {
          data: {}
        }
      };

      appTester(App.creates.createRecipe.operation.perform, bundle)
        .then((result) => {
          console.log(result)
          done();
        })
        .catch(done);
    });
  });
});