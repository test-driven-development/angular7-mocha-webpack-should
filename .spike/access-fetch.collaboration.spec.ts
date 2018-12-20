import * as should from 'should';
const td = require('testdouble');
const {replace, verify, reset, when, constructor} = td;

describe('access', () => {
  afterEach(() => {
    reset();
  });

  it(`has a passing canary test`, () => {
    true.should.be.true(`something's bugging the automated test infrastructure`);
  });

  it(`collaborates with fetch, navigate, user and details transformer`, () => {
    const service = constructor(
        require('../src/app/restful-connectors/restful-connectors.service')
            .RestfulConnectorsService);

    const navigator = constructor(
        require('./navigate/navigator.service').NavigatorService);

    const user = constructor(require('../src/user/user.service').UserService);

    const detailsTransformer =
        require('../src/app/restful-connectors/transformers/transform-details');

    replace(detailsTransformer, 'transformDetails');

    const requestId = 'dummy request id';
    const details = {dummy: 'details'};
    const requestorDetails = [{dummy: 'requestor details'}];

    when(user.prototype.getLoggedInName()).thenResolve('Gary');
    when(navigator.prototype.id()).thenReturn(requestId);
    when(service.prototype.requestDetails(requestId)).thenResolve(details);
    when(detailsTransformer.transformDetails(details)).thenReturn(requestorDetails);

    const AccessComponent = require('../src/app/access/access.component.ts').AccessComponent;
    const access = new AccessComponent(new service(), new navigator(), new user());

    return access.ngOnInit().then(() => {
      access.details.should.deepEqual(requestorDetails);
    });
  });
});

export {};

