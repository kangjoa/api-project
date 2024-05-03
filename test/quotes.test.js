// run tests with:  mocha test/quotes.test.js --exit

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const should = chai.should();
const app = require('../server');
const User = require('../models/user');
const Quote = require('../models/quote');
const Character = require('../models/character');
const jwt = require('jsonwebtoken');
require('dotenv').config();

chai.use(chaiHttp);

describe('Quotes API Tests', function () {
  let testUser;
  let token;
  let testQuote;
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
    testQuote = await Quote.create({
      content: 'New Quote Content',
      season: 111,
      episode: 222,
      characterId: testCharacter._id,
    });
  });

  after(async () => {
    await User.deleteOne({ _id: testUser._id });
  });

  it('should get all quotes on /quotes GET', async () => {
    const res = await chai
      .request(app)
      .get('/quotes')
      .set('Cookie', `nToken=${token}`);
    console.log('Response Status:', res.status);
    console.log('Response Body:', res.body);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('quotes');
    res.body.should.have.property('quotes').with.lengthOf.at.least(1);
  });

  it('should get a single quote on /quotes/:id GET', async () => {
    const res = await chai
      .request(app)
      .get(`/quotes/${testQuote._id}`)
      .set('Cookie', `nToken=${token}`);
    console.log('Response Status:', res.status);
    console.log('Response Body:', res.body);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('quote');
    expect(res.body.quote)
      .to.have.property('content')
      .equal('New Quote Content');
  });

  it('should create a quote on /quotes POST', async () => {
    const res = await chai
      .request(app)
      .post('/quotes')
      .set('Cookie', `nToken=${token}`)
      .send({
        content: 'Exciting New Quote Content',
        season: 112,
        episode: 223,
        characterId: testCharacter._id,
      });
    console.log('Response Status:', res.status);
    console.log('Response Body:', res.body);

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('quote');
    expect(res.body.quote)
      .to.have.property('content')
      .equal('Exciting New Quote Content');
    expect(res.body.quote).to.have.property('season').equal(112);
  });

  it('should update a quote on /quotes/:id PUT', async () => {
    const res = await chai
      .request(app)
      .put(`/quotes/${testQuote._id}`)
      .set('Cookie', `nToken=${token}`)
      .send({
        content: 'Updated Exciting New Quote Content',
        season: 112,
        episode: 223,
        characterId: testCharacter._id,
      });
    console.log('Response Status:', res.status);
    console.log('Response Body:', res.body);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('quote');
    expect(res.body)
      .to.have.property('message')
      .equal('Quote successfully updated');
    expect(res.body.quote)
      .to.have.property('content')
      .equal('Updated Exciting New Quote Content');
    expect(res.body.quote).to.have.property('season').equal(112);
  });

  it('should delete a quote on /quotes/:id DELETE', async () => {
    const res = await chai
      .request(app)
      .delete(`/quotes/${testQuote._id}`)
      .set('Cookie', `nToken=${token}`);
    console.log('Response Status:', res.status);
    console.log('Response Body:', res.body);

    expect(res).to.have.status(200);
    expect(res.body)
      .to.have.property('message')
      .equal('Quote successfully deleted');
  });
});
