const chai = require('chai');
const expect = chai.expect;
const app = require('../server.js');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('SERVER', () => {

  afterEach((done) => {
    app.locals.items = []
    done()
  })

  it('should exist', () => {
    expect(app).to.exist
  })

  it('should have a GET / to return the html file', (done) => {
    chai.request(app)
    .get('/')
    .end((err, res) => {
      if(err) { done(err) }
      expect(res).to.have.status(200)
      expect(res).to.be.html
      done()
    })
  })

  it('should have GET request that returns all items', (done) => {
      app.locals.items = [{ id: 1, name: 'Spikeball', purpose: 'unlimited entertainment'}, { id: 2, name: 'Ping Pong', purpose: 'dust collector'}]
      chai.request(app)
      .get('/api/v1/items')
      .end((err, res) => {
        if(err) { done(err)}
        expect(res).to.have.status(200)
        expect(res).to.be.json
        expect(res.body).to.have.length(2)
        expect(res.body[0].name).to.equal('Spikeball')
        done()
      })
  })

  it('should have GET request that returns 404 if items storage does\'t exist', (done) => {
      app.locals.items = null
      chai.request(app)
      .get('/api/v1/items')
      .end((err, res) => {
        expect(err).to.have.status(404)
        done()
      })
  })

  it('should have GET/:id request that returns a specific item', (done) => {
      app.locals.items = [{ id: 1, name: 'Spikeball', purpose: 'unlimited entertainment'}, { id: 2, name: 'Ping Pong', purpose: 'dust collector'}]
      chai.request(app)
      .get('/api/v1/items/2')
      .end((err, res) => {
        if(err) { done(err)}
        expect(res).to.have.status(200)
        expect(res).to.be.json
        expect(res.body).to.be.an('object')
        expect(res.body.name).to.equal('Ping Pong')
        done()
      })
  })

  it('should have GET/:id sad path that returns an error if ID doesn\'t exist', (done) => {
      app.locals.items = [{ id: 1, name: 'Spikeball', purpose: 'unlimited entertainment'}, { id: 2, name: 'Ping Pong', purpose: 'dust collector'}]
      chai.request(app)
      .get('/api/v1/items/15')
      .end((err, res) => {
        expect(err).to.have.status(404)
        done()
      })
  })

  it('should have POST request that saves an item', (done) => {
      const item = { name: 'Spikeball', purpose: 'So sick' }

      chai.request(app)
      .post('/api/v1/items')
      .send({ item: item })
      .end((err, res) => {
        if(err) { done(err) }
        expect(res).to.have.status(200)
        expect(res).to.be.an('object')
        expect(res.body).to.have.length(1)
        done()
      })
  })

  it('should have POST sad path with error 400 if request is bad', (done) => {

      chai.request(app)
      .post('/api/v1/items')
      .end((err, res) => {
        expect(err).to.have.status(400)
        done()
      })
  })

  it('should have PUT request that saves an item', (done) => {
      app.locals.items = [{ id: 1, name: 'Spikeball', quality: 'Dusty'}]
      const item = { id: 1, name: 'Spikeball', quality: 'Shiny AF' }

      chai.request(app)
      .put('/api/v1/items/1')
      .send({ updatedItem: item })
      .end((err, res) => {
        if(err) { done(err) }
        expect(res).to.have.status(200)
        expect(res).to.be.an('object')
        expect(res.body).to.have.length(1)
        expect(res.body[0].quality).to.equal('Shiny AF')
        done()
      })
  })

  it('should have PUT sad path with error 400 if request is bad', (done) => {
      const item = null

      chai.request(app)
      .put('/api/v1/items/14')
      .send({ updatedItem: item })
      .end((err, res) => {
        expect(err).to.have.status(400)
        done()
      })
  })

  it('should have DELETE request that deletes an item', (done) => {
      app.locals.items = [{ id: 1, name: 'Spikeball', purpose: 'unlimited entertainment'}, { id: 2, name: 'Ping Pong', purpose: 'dust collector'}]


      chai.request(app)
      .delete('/api/v1/items/1')
      .end((err, res) => {
        if(err) { done(err) }
        expect(res).to.have.status(200)
        expect(res).to.be.an('object')
        expect(res.body).to.have.length(1)
        expect(res.body[0].name).to.equal('Ping Pong')
        done()
      })
  })

})
