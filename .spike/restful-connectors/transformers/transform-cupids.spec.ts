import * as R from 'ramda';
import {transformCupids} from './transform-cupids';

require('should');

const {clone} = R;

const cupids = [
  {'advantageNumber': '15FY3L6',
  'cupid': '00000'},
  {'cupid': '99999'},
  {'advantageNumber': '15FY3L6'}
];

const expectedCupids = [
  '00000',
  '99999'
];

describe('transform cupids', () => {
  it(`has a passing canary test`, () => {
    true.should.be.true(`something's bugging the automated test infrastructure`);
  });

  it('creates a list of cupids', () => {
    transformCupids(cupids).should.deepEqual(expectedCupids);
  });
});
