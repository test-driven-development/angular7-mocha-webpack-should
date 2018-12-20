import * as R from 'ramda';
import * as timekeeper from 'timekeeper';
import {transformDetails} from './transform-details';
import * as moment from 'moment';

require('should');

const {clone} = R;

const details = {
  'requestId': '0106ef8273320eb372de1afaf304a89b',
  'firstName': 'Bill',
  'lastName': 'Smith',
  'created': 157515934159,
  'status': 'IN_PROGRESS',
  'assignTo': 'giselle',
  'userIds': [
    {
      'advantageNumber': '15FY3L6',
      'cupid': '00000'
    },
    {'cupid': '99999'},
    {'advantageNumber': '15FY3L6'}
  ],
  'history': [{
    'title': 'System Post',
    'createdBy': 'giselle',
    'timestamp': 15159,
    'message': 'Complete by eswar and marcella',
    'isInternal': true
  }, {
    'title': 'Request Submitted',
    'createdBy': 'tatiana',
    'timestamp': 157515934159,
    'message': 'Complete by eswar and marcella',
    'isInternal': true
  }]
};
const nullAssignTo = {
  'id': '0106ef8273320eb372de1afaf304a89b',
  'requestId': '0106ef8273320eb372de1afaf304a89b',
  'status': 'IN_PROGRESS',
  'assignTo': null,
  'userIds': [],
  'history': []
};

const emptyAssignTo = {
  'id': '0106ef8273320eb372de1afaf304a89b',
  'requestId': '0106ef8273320eb372de1afaf304a89b',
  'status': 'IN_PROGRESS',
  'assignTo': '',
  'userIds': [],
  'history': []
};

const undefinedAssignTo = {
  'id': '0106ef8273320eb372de1afaf304a89b',
  'requestId': '0106ef8273320eb372de1afaf304a89b',
  'status': 'IN_PROGRESS',
  'userIds': [],
  'history': []
};

const noCupids = {
  'requestId': '0106ef8273320eb372de1afaf304a89b',
  'firstName': 'Bill',
  'lastName': 'Smith',
  'created': 157515934159,
  'status': 'IN_PROGRESS',
  'assignTo': 'giselle',
  // 'userIds': [
  //   {'advantageNumber': '15FY3L6',
  //   'cupid': '00000'},
  //   {'cupid': '99999'},
  //   {'advantageNumber': '15FY3L6'}
  // ],
  'history': [{
    'title': 'System Post',
    'createdBy': 'giselle',
    'timestamp': 15159,
    'message': 'Complete by eswar and marcella',
    'isInternal': true
  }, {
    'title': 'Request Submitted',
    'createdBy': 'tatiana',
    'timestamp': 157515934159,
    'message': 'Complete by eswar and marcella',
    'isInternal': true
  }]
};

const expectedNoCupids = {
  'requestId': '0106ef8273320eb372de1afaf304a89b',
  'firstName': 'Bill',
  'lastName': 'Smith',
  'created': moment(157515934159).format('MM-DD-YY'),
  'status': 'IN_PROGRESS',
  'assignTo': 'giselle',
  'cupids': [],
  'history': [{
    'title': 'Request Submitted',
    'createdBy': 'tatiana',
    'timestamp': moment(new Date(157515934159)).format('hh:mm DD MMMM YYYY'),
    'message': 'Complete by eswar and marcella',
    'isInternal': true
  }, {
    'title': 'System Post',
    'createdBy': 'giselle',
    'timestamp': moment(new Date(15159)).format('hh:mm DD MMMM YYYY'),
    'message': 'Complete by eswar and marcella',
    'isInternal': true
  }]
};

const expectedRequestorDetails = {
  'requestId': '0106ef8273320eb372de1afaf304a89b',
  'firstName': 'Bill',
  'lastName': 'Smith',
  'created': moment(157515934159).format('MM-DD-YY'),
  'status': 'IN_PROGRESS',
  'assignTo': 'giselle',
  'cupids': [
    '00000',
    '99999'
  ],
  'history': [{
    'title': 'Request Submitted',
    'createdBy': 'tatiana',
    'timestamp': moment(new Date(157515934159)).format('hh:mm DD MMMM YYYY'),
    'message': 'Complete by eswar and marcella',
    'isInternal': true
  }, {
    'title': 'System Post',
    'createdBy': 'giselle',
    'timestamp': moment(new Date(15159)).format('hh:mm DD MMMM YYYY'),
    'message': 'Complete by eswar and marcella',
    'isInternal': true
  }],
  'userIds': [
    {
      'advantageNumber': '15FY3L6',
      'cupid': '00000'
    },
    {'cupid': '99999'},
    {'advantageNumber': '15FY3L6'}
  ]
};

describe('transform details', () => {
  it(`has a passing canary test`, () => {
    true.should.be.true(`something's bugging the automated test infrastructure`);
  });

  it(`builds the requestor details`, () => {
    transformDetails(clone(details)).should.deepEqual(expectedRequestorDetails);
  });

  it(`sets default value to assignTo if it is empty`, () => {
    const assignTo = transformDetails(clone(emptyAssignTo)).assignTo;
    assignTo.should.equal('unassigned');
  });

  it(`sets default value to assignTo if it is null`, () => {
    const assignTo = transformDetails(clone(nullAssignTo)).assignTo;
    assignTo.should.equal('unassigned');
  });

  it(`sets default value to assignTo if it is undefined`, () => {
    const assignTo = transformDetails(clone(undefinedAssignTo)).assignTo;
    assignTo.should.equal('unassigned');
  });

  it(`handles absence of cupids`, () => {
    transformDetails(clone(noCupids)).should.deepEqual(expectedNoCupids);
  });

  before(() => {
    timekeeper.freeze(new Date(15159));
  });

  after(() => {
    timekeeper.reset();
  });
});
