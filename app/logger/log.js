import util from 'util';
import env from '../env';

class Logger {

  init(id) {
    var winston = require('winston');
    var consoleFormatter = function(log) {
      return util.format('%s: %s', log.level, log.message);
    };
    this.meta = {
      id: id
    };
    this.logger = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)({
          level: 'debug',
          formatter: consoleFormatter
        }),
        new (winston.transports.File)({
          filename: 'safe_launcher_ui.log',
          maxsize: env.log.file.maxFileSize,
          maxFiles: env.log.file.maxFiles,
          tailable: true,
          level: 'debug'
        })
      ]
    });
    if (env.log.http) {
      this.logger.add(winston.transports.Http, {
        host: env.log.http.host,
        port: env.log.http.port,
        path: env.log.http.path,
        level: 'silly'
      });
    }
  }

  info(msg) {
    this.logger.info(msg, this.meta);
  }

  warn(msg) {
    this.logger.warn(msg, this.meta);
  }

  error(msg) {
    this.logger.error(msg, this.meta);
  }

  debug(msg) {
    this.logger.debug(msg, this.meta);
  }

  verbose(msg) {
    this.logger.verbose(msg, this.meta);
  }

  ffi(msg) {
    this.logger.silly(msg, this.meta);
  }
}

export var log = new Logger();
