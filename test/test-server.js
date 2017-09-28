const chai = require('chai');
const chaiHTTP = require('chai-http');

const {app, runServer, closeServer} = require('../server');

// define should
const should = chai.should();

chai.use(chaiHTTP);

// start DESCRIBE
describe('BlogAPI', function() {
  // start and close server
  before(function() {
    return runServer();
  });
  after(function() {
    return closeServer();
  });

  // test GET eendpoint
  it('should return all blog posts', function(){
    // chai request
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res){
        res.should.have.status(200);
      });
  });
})
