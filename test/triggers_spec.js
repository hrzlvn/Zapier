require('should');
const zapier = require('zapier-platform-core');
const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('triggers', () => {

  describe('newRecord', () => {
    it('should fetch new record from FileMaker Cloud', (done) => {
      const bundle = {authData: {user: 'admin', password: '123', layout: 'email', solution: 'email', subdomian: 'lex'}};
      appTester(App.triggers.listRecipe.operation.perform, bundle)
        .then(results => {
          results.length.should.above(0);

          const firstRecord = results[0];
          firstRecord.should.have.property('id');
          firstRecord.should.have.property('data');
          firstRecord.should.have.property('portalData');
          firstRecord.should.have.property('modId');
          done();
        })
        .catch(done);
    });
  });

});