// Run with: mocha test/quote.js

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const Quote = require('../models/quote');
const Character = require('../models/character');
const mongoose = require('mongoose');

chai.use(chaiHttp);

describe('Quote API Tests', function () {
  let createdQuote;
  let createdCharacter;

  beforeEach((done) => {
    Character.create({
      name: 'Regular Sized Rudy',
      age: 10,
    })
      .then((character) => {
        createdCharacter = character;
        return Quote.create({
          content: "I've tasted life, but I'm hungry for more",
          season: 3,
          episode: 22,
          characterId: character._id,
        });
      })
      .then((quote) => {
        createdQuote = quote;
        console.log('Created quote successfully:', quote);
        done();
      })
      .catch((err) => {
        console.error('Error creating character or quote:', err);
        done(err);
      });
  });

  afterEach((done) => {
    // Delete both the quote and the character
    Promise.all([
      Quote.deleteOne({ _id: createdQuote._id }),
      Character.deleteOne({ _id: createdCharacter._id }),
    ])
      .then(() => done())
      .catch((err) => done(err));
  });

  it('should get all quotes on /quotes GET', (done) => {
    // Adding a delay to allow the database to populate
    setTimeout(() => {
      chai
        .request(app)
        .get('/quotes')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('quotes').with.lengthOf.at.least(1);
          done();
        });
    }, 500);
  });

  it('should show a single quote on /quotes/:id GET', (done) => {
    chai
      .request(app)
      .get(`/quotes/${createdQuote._id}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('quote');
        res.body.quote.should.have
          .property('content')
          .eql("I've tasted life, but I'm hungry for more");
        done();
      });
  });

  it('should create a single quote on /quotes POST', (done) => {
    let newQuote = {
      content: "I've tasted life, but I'm hungry for more",
      season: 3,
      episode: 22,
      characterId: createdCharacter._id,
    };

    chai
      .request(app)
      .post('/quotes')
      .send(newQuote)
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have
          .property('message')
          .eql('Quote successfully created');
        res.body.quote.should.have
          .property('content')
          .eql("I've tasted life, but I'm hungry for more");
        done();
      });
  });

  it('should update a single quote on /quotes/:id PUT', (done) => {
    chai
      .request(app)
      .put(`/quotes/${createdQuote._id}`)
      .send({ content: 'Updated quote content here.' })
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have
          .property('message')
          .eql('Quote successfully updated');
        res.body.quote.should.have
          .property('content')
          .eql('Updated quote content here.');
        console.log('Response body:', res.body);
        done();
      });
  });

  it('should delete a quote on /quotes/:id DELETE', (done) => {
    chai
      .request(app)
      .delete(`/quotes/${createdQuote._id}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have
          .property('message')
          .eql('Quote successfully deleted');
        done();
      });
  });
});
