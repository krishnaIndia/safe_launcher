import { Writable } from 'stream';

export default class BaseWriter extends Writable {

  constructor(req, writerId, responseHandler) {
    super();
    this.writerId = writerId;
    this.responseHandler = responseHandler;
    this.eventEmitter = req.app.get('eventEmitter');
    this.uploadEvent = req.app.get('EVENT_TYPE').DATA_UPLOADED;
    req.on('end', ::this._closeWriter);
    req.on('aborted', ::this._onAborted);
  }

  _onAborted() {
    this.responseHandler('Request aborted by client');
  }

  _closeWriter = async () => {
    try {
      await this.onCloseWriter();
      this.responseHandler();
    } catch(e) {
      this.responseHandler(e);
    }
  };

  _write = async (data, _enc, next) => {
    try {
      await this.onData(data);
      this.eventEmitter.emit(this.uploadEvent, data.length);
      next();
    } catch(err) {
      this.responseHandler(err);
    }
  };

  onCloseWriter() {
    return new Promise((resolve) => {
      resolve();
    });
  }

  onData(data) {
    return new Promise((_resolve, reject) => {
      reject('onData not implemented');
    });
  }
}
