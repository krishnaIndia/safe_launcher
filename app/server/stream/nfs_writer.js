import nfs from '../../ffi/api/nfs';
import BaseWriter from './base_writer';

export default class NfsWriter extends BaseWriter {

  constructor(req, writerId, responseHandler) {
    super(req, writerId, responseHandler);
  }

  onCloseWriter() {
    return nfs.closeWriter(this.writerId);
  };

  onData(data) {
    return nfs.writeToFile(this.writerId, data);
  }
}
