var Writable = require('stream').Writable;
var util = require('util');

export var NfsWriter = function (req, filePath, startOffset, isPathShared, sessionInfo, responseHandler) {
  Writable.call(this);
  this.req = req;
  this.filePath = filePath;
  this.startOffset = startOffset;
  this.curOffset = startOffset;
  this.isPathShared = isPathShared;
  this.sessionInfo = sessionInfo;
  this.responseHandler = responseHandler;
  // this.total = total;
  this.data = new Buffer(0);
  return this;
};

util.inherits(NfsWriter, Writable);

NfsWriter.prototype._write = function(data, enc, next) {
  var self = this;
  self.data = Buffer.concat([self.data, data]);
  console.log('Data Read::', self.data.length);
  // if (self.data.length !== self.total) {
    return next();
  // }
};

NfsWriter.prototype.onClose = function() {
  console.log('close triggered');
  this.req.app.get('api').nfs.modifyFileContent(this.data.toString('base64'),
                                                this.startOffset, this.filePath, this.isPathShared,
                                                this.sessionInfo.appDirKey, this.sessionInfo.hasSafeDriveAccess(),
                                                this.responseHandler.onResponse);
}
