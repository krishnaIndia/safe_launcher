import {loadLibrary} from '../app/ffi/loader';
import auth from '../app/ffi/api/auth';
import RESTServer from '../app/server/boot';
import should from 'should';

class MockApp {

  constructor() {
    loadLibrary();
    new RESTServer(8100);
  }

  getUnregisteredClient() {
    auth.getUnregisteredSession().should.be.fulfilled();
  }
}

const mockApp = new MockApp();
export default mockApp;
