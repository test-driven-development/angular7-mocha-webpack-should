import 'jsdom-global/register';
import {getTestBed, TestBed} from '@angular/core/testing';
import {RestfulConnectorsModule, RestfulConnectorsService} from '../';
import {environment, MOCK_SERVER_PORT} from '../../../environments/environment';

require('should');

const { Pact, Matchers } = require('@pact-foundation/pact');
const requestId = '01234567890123456789012345678901';
const endpoint = `/dpo/requests/${requestId}/document`;
const LOG_LEVEL = process.env.LOG_LEVEL || 'WARN';
process.env.API_HOST = environment.api;

const {term, somethingLike, eachLike} = Matchers;

const expectedPayload = new FormData();
expectedPayload.append('file', new File(['{"some": "json"}'], 'file.json'), 'file.json');

const transformedPayload = '--5NS4TGhbFUqJo8OWBZCWvvDeLI2w6X\r\nContent-Disposition: ' +
  'form-data; name=\"file\"; filename=\"filename.txt\"\r\nContent-Type: application/json' +
  '\r\n\r\n{\"some\": \"json\"}\r\n--5NS4TGhbFUqJo8OWBZCWvvDeLI2w6X--\r\n"';


const responseCode201 = {
  state: 'a document is ready',
  uponReceiving: 'a request to upload a document',
  withRequest: {
    method: 'POST',
    path: endpoint,
    headers: {
      'Content-Type': term({
        matcher: 'multipart/form-data; \\s*boundary=.*',
        generate: 'multipart/form-data; boundary=5NS4TGhbFUqJo8OWBZCWvvDeLI2w6X'
      })
    },
    body: term({
      generate: transformedPayload,
      matcher: '^[-]{1,2}.{1,68}\r\n' +
          'Content-Disposition: form-data; .*'
    }),
  },
  willRespondWith: {
    status: 201,
    body: {
      message: somethingLike('success')
    }
  }
};

let provider;
describe('Post Service', () => {
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

  describe('post close request event', () => {
    let service, response;

    const actualPayload = new FormData();
    actualPayload.append('file', new File(['{"some": "json"}'], 'file.json'), 'file.json');

    beforeEach(async function () {
      service = TestBed.get(RestfulConnectorsService);
      await provider.addInteraction(responseCode201);
      response = await service.upload(requestId, actualPayload);
    });

    afterEach(async function () {
      await provider.verify();
    });

    describe('with a 201 server response', () => {
      it('post service response', () => {
        response.message.should.equal('success');
      });
    });
  });
});
