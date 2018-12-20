import {getTestBed, TestBed} from '@angular/core/testing';
import {RestfulConnectorsModule, RestfulConnectorsService} from '../';
import {MOCK_SERVER_PORT, environment} from '../../../environments/environment';

require('should');
const { Pact, Matchers } = require('@pact-foundation/pact');

const REQUEST_ID = '01234567890123456789012345678901';
const endpoint = `/dpo/requests/${REQUEST_ID}`;
const LOG_LEVEL = process.env.LOG_LEVEL || 'WARN';

const {term, somethingLike, eachLike} = Matchers;

const responseSpecification = {
  requestId: somethingLike('018f4f7f07508a2f4a5f74ebef59eea2'),
  type: 'ERASE',
  firstName: somethingLike('Ima'),
  lastName: somethingLike('Tester'),
  created: somethingLike(1516912129312),
  status: term({
    generate: 'IN_PROGRESS',
    matcher: 'PENDING_APPROVAL|IN_PROGRESS|COMPLETE|DECLINED'
  }),
  assignTo: somethingLike('gary'),
  userIds: [{cupid: '0123456789'}],
  history: eachLike({
    title: somethingLike('System Post'),
    createdBy: somethingLike('GaryMeech'),
    timestamp: somethingLike(1517515934159),
    message: somethingLike('Complete by GaryMeech'),
    internal: somethingLike(true)
  })
};

const responseCode200 = {
  state: 'has request details',
  uponReceiving: 'a get request for request details',
  withRequest: {
    method: 'GET',
    path: term({
      generate: endpoint,
      matcher: '/requests/[a-z0-9]{32}'
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  },
  willRespondWith: {
    status: 200,
    body: responseSpecification
  }
};

let provider;
describe('Request Details Service', () => {
  before(() => {
    provider = new Pact({
      consumer: 'Data Privacy Portal DPO',
      provider: 'Data Privacy Portal Request Service',
      port: MOCK_SERVER_PORT,
      log: process.cwd() + '/contracts/logs/mockserver-integration.log',
      dir: process.cwd() + '/contracts/pacts',
      pactfileWriteMode: 'merge',
      logLevel: LOG_LEVEL,
      cors: true,
      spec: 2
    });

    return provider.setup();
  });

  after(() => {
    return provider.finalize();
  });

  beforeEach(() => {
    return TestBed.configureTestingModule({
      imports: [RestfulConnectorsModule]
    });
  });

  afterEach(() => {
    getTestBed().resetTestingModule();
  });

  describe('fetches request details', () => {
    let service, details, cupid, history;

    beforeEach(async function () {
      service = TestBed.get(RestfulConnectorsService);
      await provider.addInteraction(responseCode200);
      details = await service.requestDetails(REQUEST_ID);
      cupid = details.userIds[0].cupid;
      history = details.history[0];
    });

    afterEach(async function () {
      await provider.verify();
    });

    describe('with a 200 server response', () => {
      it('an object with request details', () => {
        details.should.be.Object();
      });

      it('requestId', () => {
        details.requestId.should.equal('018f4f7f07508a2f4a5f74ebef59eea2');
      });

      it('type', () => {
        details.type.should.equal('ERASE');
      });

      it('firstName', () => {
        details.firstName.should.equal('Ima');
      });

      it('lastName', () => {
        details.lastName.should.equal('Tester');
      });

      it('created', () => {
        details.created.should.equal(1516912129312);
      });

      it('status', () => {
        details.status.should.equal('IN_PROGRESS');
      });

      it('assign to', () => {
        details.assignTo.should.equal('gary');
      });

      it('a list of cupids', () => {
        details.userIds.should.be.Array();
      });

      it('a list of histories', () => {
        details.history.should.be.Array();
      });

      describe('a single cupid contains', () => {
        it('a cupid', () => {
          cupid.should.equal('0123456789');
        });
      });

      describe('a single history contains', () => {
        it('title', () => {
          history.title.should.equal('System Post');
        });

        it('createdBy', () => {
          history.createdBy.should.equal('GaryMeech');
        });

        it('timestamp', () => {
          history.timestamp.should.equal(1517515934159);
        });

        it('message', () => {
          history.message.should.equal('Complete by GaryMeech');
        });

        it('an internal flag', () => {
          history.internal.should.be.true();
        });
      });
    });
  });
});
