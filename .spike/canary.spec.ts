import * as should from 'should';

describe('automated test infrastructure', () => {
  it(`has a passing canary test`, () => {
    true.should.be.true(`something's bugging the automated test infrastructure`);
  });
});

export {};

