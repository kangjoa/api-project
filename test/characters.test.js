// run tests with:  mocha test/characters.test.js --exit

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const should = chai.should();
const app = require('../server');
const User = require('../models/user');
const Character = require('../models/character');
const jwt = require('jsonwebtoken');
require('dotenv').config();

chai.use(chaiHttp);

describe('Character API Tests', function () {
  let testUser;
  let token;
  let testCharacter;

  before(async () => {
    try {
      testUser = await User.create({
        username: 'testUser2',
        password: 'testPassword2',
      });
      token = jwt.sign({ _id: testUser._id }, process.env.SECRET, {
        expiresIn: '2h',
      });
    } catch (error) {
      console.error('Error during user creation:', error);
    }
    testCharacter = await Character.create({
      name: 'Regular Sized Rudy',
      age: 10,
    });
  });

  after(async () => {
    await User.deleteOne({ _id: testUser._id });
  });

  it('should get all characters on /characters GET', async () => {
    const res = await chai
      .request(app)
      .get('/characters')
      .set('Cookie', `nToken=${token}`);
    console.log('Response Status:', res.status);
    console.log('Response Body:', res.body);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('characters');
    res.body.should.have.property('characters').with.lengthOf.at.least(1);
  });

  it('should get a single character on /characters/:id GET', async () => {
    const res = await chai
      .request(app)
      .get(`/characters/${testCharacter._id}`)
      .set('Cookie', `nToken=${token}`);
    console.log('Response Status:', res.status);
    console.log('Response Body:', res.body);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('character');
    expect(res.body.character)
      .to.have.property('name')
      .equal('Regular Sized Rudy');
  });

  it('should create a character on /characters POST', async () => {
    const res = await chai
      .request(app)
      .post('/characters')
      .set('Cookie', `nToken=${token}`)
      .send({
        name: 'Teddy',
        age: 50,
      });
    console.log('Response Status:', res.status);
    console.log('Response Body:', res.body);

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('character');
    expect(res.body.character).to.have.property('name').equal('Teddy');
    expect(res.body.character).to.have.property('age').equal(50);
  });

  it('should update a character on /characters/:id PUT', async () => {
    const res = await chai
      .request(app)
      .put(`/characters/${testCharacter._id}`)
      .set('Cookie', `nToken=${token}`)
      .send({
        name: 'Rudy',
        age: 10,
      });
    console.log('Response Status:', res.status);
    console.log('Response Body:', res.body);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('character');
    expect(res.body)
      .to.have.property('message')
      .equal('Character successfully updated');
    expect(res.body.character).to.have.property('name').equal('Rudy');
    expect(res.body.character).to.have.property('age').equal(10);
  });

  it('should delete a character on /characters/:id DELETE', async () => {
    const res = await chai
      .request(app)
      .delete(`/characters/${testCharacter._id}`)
      .set('Cookie', `nToken=${token}`);
    console.log('Response Status:', res.status);
    console.log('Response Body:', res.body);

    expect(res).to.have.status(200);
    expect(res.body)
      .to.have.property('message')
      .equal('Character successfully deleted');
  });
});
