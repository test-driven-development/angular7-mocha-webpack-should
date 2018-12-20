import 'jsdom-global/register';
import {getTestBed, TestBed} from '@angular/core/testing';
import {RestfulConnectorsModule, RestfulConnectorsService} from '../';
import {environment, MOCK_SERVER_PORT} from '../../../environments/environment';

require('should');

const {Pact, Matchers} = require('@pact-foundation/pact');
const docId = '01234567890';
const endpoint = `/files/${docId}`;
const LOG_LEVEL = process.env.LOG_LEVEL || 'WARN';
process.env.API_HOST = environment.api;

const {term, somethingLike, eachLike} = Matchers;

const responseCode201 = {
  state: 'a valid document exists for download',
  uponReceiving: 'a request to download the document',
  withRequest: {
    method: 'GET',
    path: Matchers.term({
      generate: '/files/37b90f18',
      matcher: '/files/[a-z0-9-]+'
    }),
    headers: {}
  },
  willRespondWith: {
    status: 200,
    headers: {'Content-Type': 'application/octet-stream'}
  }
};

let provider;
describe('Post Service for Download document', () => {
  before(() => {
    provider = new Pact({
      consumer: 'Data Privacy Portal DPO',
      provider: 'Data Privacy Portal Document Service',
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

  describe('download document', () => {
    let service, response;

    beforeEach(async function () {
      service = TestBed.get(RestfulConnectorsService);
      await provider.addInteraction(responseCode201);
      response = await service.download(docId);
    });

    afterEach(async function () {
      await provider.verify();
    });

    describe('with a 200 server response', () => {
      it('post service response', () => {
      });
    });
  });
});
