'use strict';

import sessionManager from '../session_manager';
import {ResponseError, ResponseHandler, updateAppActivity} from '../utils';
import structuredData from '../../ffi/api/structured_data';
import dataId from '../../ffi/api/data_id';
import cipherOpts from '../../ffi/api/cipher_opts';
import { ENCRYPTION_TYPE } from '../../ffi/model/enum';

const API_ACCESS_NOT_GRANTED = 'Low level api access is not granted';
const UNAUTHORISED_ACCESS = 'Unauthorised access';
const NAME_LENGTH = 32;
const PLAIN_ENCRYPTION = cipherOpts.getCipherOptPlain();

const TYPE_TAG = {
  VERSIONED: 500,
  UNVERSIONED: 501
};

export const create = async (req, res, next) => {
  try {
    const sessionInfo = sessionManager.get(req.headers.sessionId);
    if (!sessionInfo) {
      return next(new ResponseError(401, UNAUTHORISED_ACCESS));
    }
    const app = sessionInfo.app;
    if (!app.permission.lowLevelApi) {
      return next(new ResponseError(403, API_ACCESS_NOT_GRANTED));
    }
    const body = req.body;
    if (!body.name) {
      return next(new ResponseError(400, 'name is missing in request body'));
    }
    const name = new Buffer(body.name, 'base64');
    if (!name || name.length !== NAME_LENGTH) {
      return next(new ResponseError(400, 'Invalid id specified'));
    }
    let typeTag = body.typeTag || TYPE_TAG.UNVERSIONED;
    if (isNaN(typeTag)) {
      return next(new ResponseError(400, 'Tag type must be a valid number'));
    }
    typeTag = parseInt(typeTag);
    if (!(typeTag === TYPE_TAG.UNVERSIONED || typeTag === TYPE_TAG.VERSIONED || typeTag >= 15000)) {
      return next(new ResponseError(400, 'Invalid tag type specified'));
    }
    const cipherOptsHandle = body.cipherOpts || PLAIN_ENCRYPTION;
    const data = body.data ? new Buffer(body.data, 'base64'): null;
    const handleId = await structuredData.create(app, name, typeTag, cipherOptsHandle, data);
    res.send({
      handleId: handleId
    });
    updateAppActivity(req, res, true);
  } catch(e) {
    new ResponseHandler(req, res)(e);
  }
};

export const getHandle = async (req, res) => {
  try {
    const sessionInfo = sessionManager.get(req.headers.sessionId);
    const app = sessionInfo ? sessionInfo.app : null;
    const handleId = await structuredData.asStructuredData(app, req.params.dataIdHandle);
    const isOwner = await structuredData.isOwner(app, handleId);
    const version = await structuredData.getVersion(handleId);
    // TODO get typeTag
    res.send({
      handleId: handleId,
      isOwner: isOwner,
      version: version
    });
    updateAppActivity(req, res, true);
  } catch(e) {
    new ResponseHandler(req, res)(e);
  }
};

export const getMetadata = async (req, res) => {
  const responseHandler = new ResponseHandler(req, res);
  try {
    const sessionInfo = sessionManager.get(req.headers.sessionId);
    const app = sessionInfo ? sessionInfo.app : null;
    const handleId = req.params.handleId;
    const isOwner = await structuredData.isOwner(app, handleId);
    const version = await structuredData.getVersion(handleId);
    responseHandler(null, {
      isOwner: isOwner,
      version: version
    });
  } catch(e) {
    responseHandler(e);
  }
};

export const asDataId = async (req, res) => {
  const responseHandler = new ResponseHandler(req, res);
  try {
    const sessionInfo = sessionManager.get(req.headers.sessionId);
    const app = sessionInfo ? sessionInfo.app : null;
    const handleId = req.params.handleId;
    const dataIdHandle = await structuredData.asDataId(handleId);
    responseHandler(null, {
      handleId: dataIdHandle
    });
  } catch(e) {
    responseHandler(e);
  }
};

export const update = async (req, res, next) => {
  const responseHandler = new ResponseHandler(req, res);
  try {
    const sessionInfo = sessionManager.get(req.headers.sessionId);
    if (!sessionInfo) {
      return next(new ResponseError(401, UNAUTHORISED_ACCESS));
    }
    const app = sessionInfo.app;
    if (!app.permission.lowLevelApi) {
      return next(new ResponseError(403, API_ACCESS_NOT_GRANTED));
    }
    const cipherOptsHandle = req.body.cipherOpts || PLAIN_ENCRYPTION;
    const data = new Buffer(req.body, 'base64');
    await structuredData.update(app, req.params.handleId, cipherOptsHandle, data);
    responseHandler();
  } catch (e) {
    responseHandler(e);
  }
};

export const read = async (req, res) => {
  const responseHandler = new ResponseHandler(req, res);
  try {
    const sessionInfo = sessionManager.get(req.headers.sessionId);
    const app = sessionInfo ? sessionInfo.app : null;
    const data = await structuredData.read(app, req.params.handleId);
    res.send(data);
    updateAppActivity(req, res, true);
  } catch (e) {
    responseHandler(e);
  }
};

export const deleteStructureData = async (req, res, next) => {
  const responseHandler = new ResponseHandler(req, res);
  try {
    const sessionInfo = sessionManager.get(req.headers.sessionId);
    if (!sessionInfo) {
      return next(new ResponseError(401, 'Unauthorized'));
    }
    const app = sessionInfo ? sessionInfo.app : null;
    const handleId = parseInt(req.params.handleId);
    await structuredData.delete(app, handleId);
    responseHandler();
  } catch (e) {
    console.error(e);
    responseHandler(e);
  }
};

export const post = async (req, res, next) => {
  const responseHandler = new ResponseHandler(req, res);
  try {
    const sessionInfo = sessionManager.get(req.headers.sessionId);
    if (!sessionInfo) {
      return next(new ResponseError(401, 'Unauthorized'));
    }
    const app = sessionInfo ? sessionInfo.app : null;
    const handleId = req.params.handleId;
    await structuredData.save(app, handleId, true);
    responseHandler();
  } catch (e) {
    responseHandler(e);
  }
};

export const put = async (req, res, next) => {
  const responseHandler = new ResponseHandler(req, res);
  try {
    const sessionInfo = sessionManager.get(req.headers.sessionId);
    if (!sessionInfo) {
      return next(new ResponseError(401, 'Unauthorized'));
    }
    const app = sessionInfo ? sessionInfo.app : null;
    const handleId = req.params.handleId;
    await structuredData.save(app, handleId, false);
    responseHandler();
  } catch (e) {
    responseHandler(e);
  }
};

export const deleteStructuredData = async (req, res, next) => {
  const responseHandler = new ResponseHandler(req, res);
  try {
    const sessionInfo = sessionManager.get(req.headers.sessionId);
    if (!sessionInfo) {
      return next(new ResponseError(401, UNAUTHORISED_ACCESS));
    }
    const app = sessionInfo.app;
    if (!app.permission.lowLevelApi) {
      return next(new ResponseError(403, API_ACCESS_NOT_GRANTED));
    }
    await structuredData.delete(app, req.params.handleId);
    responseHandler();
  } catch (e) {
    responseHandler(e);
  }
};

export const dropHandle = async (req, res) => {
  const responseHandler = new ResponseHandler(req, res);
  try {
    const handleId = req.params.handleId;
    await structuredData.dropHandle(handleId);
    responseHandler();
  } catch (e) {
    console.error(e);
    responseHandler(e);
  }
};

export const serialise = async (req, res) => {
  const responseHandler = new ResponseHandler(req, res);
  try {
    const handleId = req.params.handleId;
    const data = await structuredData.serialise(handleId);
    res.send(data);
    updateAppActivity(req, res, true);
  } catch (e) {
    console.error(e);
    responseHandler(e);
  }
};

export const deserialise = async (req, res) => {
  const responseHandler = new ResponseHandler(req, res);
  try {
    const sessionInfo = sessionManager.get(req.headers.sessionId);
    const app = sessionInfo ? sessionInfo.app : null;
    const handleId = await structuredData.deserialise(req.rawBody);
    const isOwner = app ? await structuredData.isOwner(app, handleId) : false;
    const version = await structuredData.getVersion(handleId);
    responseHandler(null, {
      handleId: handleId,
      isOwner: isOwner,
      version: version
    });
  } catch (e) {
    console.error(e);
    responseHandler(e);
  }
};
