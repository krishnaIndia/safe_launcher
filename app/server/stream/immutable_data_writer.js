import BaseWriter from './base_writer';
import immutableData from '../../ffi/api/immutable_data';

export default class ImmutableDataWriter extends BaseWriter {

  constructor(req, writerId, responseHandler) {
    super(req, writerId, responseHandler);
  }

  onData(data) {
    return immutableData.write(this.writerId, data);
  }
}
