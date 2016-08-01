import path from 'path';
import env from './../env';
import { log } from './../logger/log';
import childProcess from 'child_process';
import { remote } from 'electron';

export default class ProxyController {

  constructor(exePath) {
    this.process = null;
    this.exePath = exePath;
  }
  
  start(proxyListener) {
    if (this.process) {
      log.warn('Trying to start proxy server which is already running');
      return;
    }
    let self = this;
    log.info('Starting proxy server');
    this.process = childProcess.fork(path.resolve(__dirname, 'server/web_proxy.js'), [     
      '--proxyPort',
      env.proxyPort,
      '--serverPort',
      env.serverPort
    ]);
    this.process.on('exit', function() {
      log.info('Proxy server stopped');
      remote.getGlobal('cleanUp').proxy = null;
      proxyListener.onExit('Proxy server closed');
    });
    this.process.on('message', function(event) {
      log.debug('Proxy Server - onMessage event - received - ');
      event = JSON.parse(event);
      switch (event.type) {
        case 'connection':
          if (event.msg.status) {
            log.info('Proxy server started');
            remote.getGlobal('cleanUp').proxy = self.process.pid;
            return proxyListener.onStart(event.msg.data);
          }
          proxyListener.onError(event.msg.data);
          break;
        case 'log':
          log.error(event.msg.log);
          break;
        default:
          log.warn('Invalid event type from proxy');
      }
    });
  }

  stop() {
    if (!this.process) {
      return;
    }
    log.info('Stopping proxy server');
    this.process.kill();
    this.process = null;
  }
}
