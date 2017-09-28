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
        res.should.be.json;
        res.body.length.should.be.at.least(1);
        // check keys
        const expectedKeys = ['id', 'title', 'content', 'author'];
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
        });
      });
  });

  // test POST endpoint
  it('should add a new blog', function() {
    // create blog
    const newBlog = {title: 'test title', content: 'test content', author: 'test author'};
    return chai.request(app)
      .post('/blog-posts')
      .send(newBlog)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('id','title','author');
      });
  });

  // test Put endpoint
  it('should modify a record on PUT', function() {
    // Create record edits - get id from get
    const recordToUpdate = {title: 'test title', content: 'test content', author: 'test author'};
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res){
        recordToUpdate.id = res.body[0].id;
        return chai.request(app)
          .put(`/blog-posts/${recordToUpdate.id}`)
          .send(recordToUpdate)
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });

  // test DELETE endpoint
  it('should delete record', function() {
    // get id
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        return chai.request(app)
          .delete(`/blog-posts/${res.body[0].id}`);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });
})
