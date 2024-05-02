const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const Character = require('../models/character');
const jwt = require('jsonwebtoken');
require('dotenv').config();

chai.use(chaiHttp);

function generateToken(payload) {
  return jwt.sign(payload, process.env.SECRET);
}

describe('API Tests', function () {
  let createdCharacter;

  // Create a character object before each test
  beforeEach((done) => {
    const token = generateToken({ _id: '6634078a62923d7cabdc96cd' });
    chai.request(app).set('Authorization', `Bearer ${token}`);

    Character.create({
      name: 'Regular Sized Rudy',
      age: 10,
    })
      .then((character) => {
        createdCharacter = character;
        done();
      })
      .catch((err) => done(err));
  });

  // Delete the created character after each test
  afterEach((done) => {
    if (createdCharacter) {
      Character.deleteOne({ _id: createdCharacter._id })
        .then(() => done())
        .catch((err) => done(err));
    } else {
      done();
    }
  });

  it('should get all characters on /characters GET', (done) => {
    // Adding a delay to allow the database to populate
    setTimeout(() => {
      chai
        .request(app)
        .get('/characters')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('characters').with.lengthOf.at.least(1);
          done();
        });
    }, 500);
  });

  it('should show a single character on /characters/:id GET', (done) => {
    chai
      .request(app)
      .get(`/characters/${createdCharacter._id}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.character.should.have.property('name');
        done();
      });
  });

  it('should create a single character on /characters POST', (done) => {
    let newCharacter = {
      name: 'Teddy',
      age: 50,
    };

    chai
      .request(app)
      .post('/characters')
      .send(newCharacter)
      .end((err, res) => {
        if (err) {
          console.error('Error:', err);
        }
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have
          .property('message')
          .eql('Character successfully created');
        res.body.character.should.have.property('name').eql('Teddy');
        done();
      });
  });

  it('should update a single character on /characters/:id PUT', (done) => {
    chai
      .request(app)
      .put(`/characters/${createdCharacter._id}`)
      .send({ name: 'Regular Sized Rudy' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.character.should.have
          .property('name')
          .eql('Regular Sized Rudy');
        done();
      });
  });

  it('should delete a single character on /characters/:id DELETE', (done) => {
    chai
      .request(app)
      .delete(`/characters/${createdCharacter._id}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have
          .property('message')
          .eql('Character successfully deleted');
        done();
      });
  });
});
