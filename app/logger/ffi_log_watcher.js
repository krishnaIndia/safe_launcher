import fs from 'fs';
import path from 'path';

export default class FFILogWatcher {

  constructor(logFilePath, callback) {
    this.callback = callback;
    this.listening = false;
    this.logFilePath = logFilePath;
  }

  listen() {
    if (this.listening) {
      return;
    }
   this.listening = true;

    let fd;
    let buff;
    let tempSize;
    let self = this;
    let lastReadSize = 0;
    let onFileUpdated = function(event) {
      if (event === 'rename') {
        return;
      }
      if (!fd) {
        fd = fs.openSync(self.logFilePath, 'r');
      }
      tempSize = fs.statSync(self.logFilePath).size - lastReadSize;
      if (tempSize === 0) {
        return;
      }
      buff = new Buffer(tempSize);
      fs.read(fd, buff, 0, tempSize, lastReadSize, function(err) {
        if (err) {
          return console.error('File Read error');
        }
        lastReadSize += tempSize;
        buff.toString().split('\n').forEach(function(msg) {
          if (!msg) {
            return;
          }
          self.callback(msg);
        });
      });
    };

    setTimeout(function() {
      fs.watch(self.logFilePath, {
        persistent: true
      }, onFileUpdated);
    }, 500);
  }

}
