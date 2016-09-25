'use strict';

import sessionManager from '../session_manager';
import {ResponseError, ResponseHandler, updateAppActivity} from '../utils';
import { FILTER_TYPE } from '../../ffi/model/enum';
import appendableData from '../../ffi/api/appendable_data';
import dataId from '../../ffi/api/data_id';
import misc from '../../ffi/api/misc';

const API_ACCESS_NOT_GRANTED = 'Low level api access is not granted';
const UNAUTHORISED_ACCESS = 'Unauthorised access';
const ID_LENGTH = 32;

// post /
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
    const payload = req.body;
    if (!payload.name) {
      return next(new ResponseError(400, 'name field is missing'));
    }
    const name = new Buffer(payload.name, 'base64');
    if (name.length !== ID_LENGTH) {
      return next(new ResponseError(400, 'Invalid name field'));
    }
    const isPrivate = payload.isPrivate || false;
    const filterType = FILTER_TYPE[payload.filterType] || FILTER_TYPE.BLACK_LIST;
    const filterKeys = payload.filterKeys || [];
    const handleId = await appendableData.create(app, name, isPrivate, filterType, filterKeys);
    res.send({
      handleId: handleId
    });
    updateAppActivity(req, res, true);
  } catch(e) {
    new ResponseHandler(req, res)(e);
  }
};

export const post = async (req, res, next) => {
  try {
    const sessionInfo = sessionManager.get(req.headers.sessionId);
    if (!sessionInfo) {
      return next(new ResponseError(401, UNAUTHORISED_ACCESS));
    }
    const app = sessionInfo.app;
    if (!app.permission.lowLevelApi) {
      return next(new ResponseError(403, API_ACCESS_NOT_GRANTED));
    }
    const handleId = req.params.handleId;
    await appendableData.save(app, handleId, false);
    res.sendStatus(200);
  } catch (e) {
    new ResponseHandler(req, res)(e);
  }
};

export const put = async (req, res, next) => {
  try {
    const sessionInfo = sessionManager.get(req.headers.sessionId);
    if (!sessionInfo) {
      return next(new ResponseError(401, UNAUTHORISED_ACCESS));
    }
    const app = sessionInfo.app;
    if (!app.permission.lowLevelApi) {
      return next(new ResponseError(403, API_ACCESS_NOT_GRANTED));
    }
    const handleId = req.params.handleId;
    await appendableData.save(app, handleId, true);
    res.sendStatus(200);
  } catch (e) {
    new ResponseHandler(req, res)(e);
  }
};

// GET /dataIdHandle
export const getHandle = async (req, res, next) => {
  try {
    const sessionInfo = sessionManager.get(req.headers.sessionId);
    let app;
    if (sessionInfo) {
      app = sessionInfo.app;
    }
    const handleId = await appendableData.getAppendableDataHandle(app, req.params.handleId);
    const isOwner = await appendableData.isOwner(app, handleId);
    const version = await appendableData.getVersion(handleId);
    // TODO const isPrivate = await appendableData.
    const filterType = await appendableData.getFilterType(handleId);
    const dataLength = await appendableData.getLength(handleId, false);
    const deletedDataLength = await appendableData.getLength(handleId, true);
    res.send({
      handleId: handleId,
      isOwner: isOwner,
      version: version,
      filterType: filterType,
      dataLength: dataLength,
      deletedDataLength: deletedDataLength
    });
    updateAppActivity(req, res, true);
  } catch(e) {
    new ResponseHandler(req, res)(e);
  }
};

// HEAD /handleId
export const getDataIdHandle = async (req, res, next) => {
  try {
    const sessionInfo = sessionManager.get(req.headers.sessionId);
    const app = sessionInfo ? sessionInfo.app : null;
    const handleId = await appendableData.asDataId(req.params.handleId);
    res.send({
      handleId: handleId
    });
    updateAppActivity(req, res, true);
  } catch(e) {
    new ResponseHandler(req, res)(e);
  }
};

// GET /encryptKey/handleId
export const getEncryptKey = async (req, res, next) => {
  try {
    const sessionInfo = sessionManager.get(req.headers.sessionId);
    if (!sessionInfo) {
      return next(new ResponseError(401, UNAUTHORISED_ACCESS));
    }
    if (!sessionInfo.app.permission.lowLevelApi) {
      return next(new ResponseError(403, API_ACCESS_NOT_GRANTED));
    }
    const app = sessionInfo.app;
    const encryptKeyHandle = await appendableData.getEncryptKey(app, req.params.handleId);
    res.send({
      handleId: encryptKeyHandle
    });
    updateAppActivity(req, res, true);
  } catch(e) {
    new ResponseHandler(req, res)(e);
  }
};

export const getSigningKey = async (req, res, next) => {
  try {
    const sessionInfo = sessionManager.get(req.headers.sessionId);
    if (!sessionInfo) {
      return next(new ResponseError(401, UNAUTHORISED_ACCESS));
    }
    if (!sessionInfo.app.permission.lowLevelApi) {
      return next(new ResponseError(403, API_ACCESS_NOT_GRANTED));
    }
    const app = sessionInfo.app;
    const signingKeyHandle = await appendableData.getSigningKey(app, req.params.index, req.params.handleId, false);
    res.send({
      handleId: signingKeyHandle
    });
    updateAppActivity(req, res, true);
  } catch(e) {
    new ResponseHandler(req, res)(e);
  }
};

export const getSigningKeyFromDeletedData = async (req, res, next) => {
  try {
    const sessionInfo = sessionManager.get(req.headers.sessionId);
    if (!sessionInfo) {
      return next(new ResponseError(401, UNAUTHORISED_ACCESS));
    }
    if (!sessionInfo.app.permission.lowLevelApi) {
      return next(new ResponseError(403, API_ACCESS_NOT_GRANTED));
    }
    const app = sessionInfo.app;
    const signingKeyHandle = await appendableData.getSigningKey(app, req.params.index, req.params.handleId, true);
    res.send({
      handleId: signingKeyHandle
    });
    updateAppActivity(req, res, true);
  } catch(e) {
    new ResponseHandler(req, res)(e);
  }
};

// PUT /hanldeId/dataHandleId
export const append = async (req, res, next) => {
  try {
    const sessionInfo = sessionManager.get(req.headers.sessionId);
    if (!sessionInfo) {
      return next(new ResponseError(401, UNAUTHORISED_ACCESS));
    }
    if (!sessionInfo.app.permission.lowLevelApi) {
      return next(new ResponseError(403, API_ACCESS_NOT_GRANTED));
    }
    const app = sessionInfo.app;
    await appendableData.append(app, req.params.handleId, req.params.dataIdHandle);
    res.sendStatus(200);
    updateAppActivity(req, res, true);
  } catch(e) {
    new ResponseHandler(req, res)(e);
  }
};

// GET /id/at
export const getDataIdAt = async (req, res) => {
  try {
    const handleId = await appendableData.getDataId(req.params.handleId, req.params.index);
    res.send({
      handleId: handleId
    });
    res.sendStatus(200);
    updateAppActivity(req, res, true);
  } catch(e) {
    new ResponseHandler(req, res)(e);
  }
};

export const toggleFilter = async (req, res) => {
  const responseHandler = new ResponseHandler(req, res);
  try {
    const sessionInfo = sessionManager.get(req.headers.sessionId);
    if (!sessionInfo) {
      return next(new ResponseError(401, UNAUTHORISED_ACCESS));
    }
    if (!sessionInfo.app.permission.lowLevelApi) {
      return next(new ResponseError(403, API_ACCESS_NOT_GRANTED));
    }
    await appendableData.toggleFilter(req.params.handleId);
    responseHandler();
  } catch(e) {
    responseHandler(e);
  }
};

export const addToFilter = async (req, res) => {
  const responseHandler = new ResponseHandler(req, res);
  try {
    const sessionInfo = sessionManager.get(req.headers.sessionId);
    if (!sessionInfo) {
      return next(new ResponseError(401, UNAUTHORISED_ACCESS));
    }
    if (!sessionInfo.app.permission.lowLevelApi) {
      return next(new ResponseError(403, API_ACCESS_NOT_GRANTED));
    }
    const keys = req.body;
    for (let key of keys) {
      await appendableData.insertToFilter(req.params.handleId, key);
    }
    responseHandler();
  } catch(e) {
    responseHandler(e);
  }
};

export const removeFromFilter = async (req, res) => {
  const responseHandler = new ResponseHandler(req, res);
  try {
    const sessionInfo = sessionManager.get(req.headers.sessionId);
    if (!sessionInfo) {
      return next(new ResponseError(401, UNAUTHORISED_ACCESS));
    }
    if (!sessionInfo.app.permission.lowLevelApi) {
      return next(new ResponseError(403, API_ACCESS_NOT_GRANTED));
    }
    const keys = req.body;
    for (let key of keys) {
      await appendableData.removeFromFilter(req.params.handleId, key);
    }
    responseHandler();
  } catch(e) {
    responseHandler(e);
  }
};

// DELETE /id/at
export const remove = async (req, res, next) => {
  const responseHandler = new ResponseHandler(req, res);
  try {
    const sessionInfo = sessionManager.get(req.headers.sessionId);
    if (!sessionInfo) {
      return next(new ResponseError(401, UNAUTHORISED_ACCESS));
    }
    if (!sessionInfo.app.permission.lowLevelApi) {
      return next(new ResponseError(403, API_ACCESS_NOT_GRANTED));
    }
    await appendableData.removeDataAt(req.params.handleId, req.params.index, false);
    responseHandler();
  } catch(e) {
    responseHandler(e);
  }
};

export const removeDeletedData = async (req, res, next) => {
  const responseHandler = new ResponseHandler(req, res);
  try {
    const sessionInfo = sessionManager.get(req.headers.sessionId);
    if (!sessionInfo) {
      return next(new ResponseError(401, UNAUTHORISED_ACCESS));
    }
    if (!sessionInfo.app.permission.lowLevelApi) {
      return next(new ResponseError(403, API_ACCESS_NOT_GRANTED));
    }
    await appendableData.removeDataAt(req.params.handleId, req.params.index, true);
    responseHandler();
  } catch(e) {
    responseHandler(e);
  }
};

export const clearData = async (req, res, next) => {
  const responseHandler = new ResponseHandler(req, res);
  try {
    const sessionInfo = sessionManager.get(req.headers.sessionId);
    if (!sessionInfo) {
      return next(new ResponseError(401, UNAUTHORISED_ACCESS));
    }
    if (!sessionInfo.app.permission.lowLevelApi) {
      return next(new ResponseError(403, API_ACCESS_NOT_GRANTED));
    }
    await appendableData.clearAll(req.params.handleId, false);
    responseHandler();
  } catch(e) {
    responseHandler(e);
  }
};

export const clearDeletedData = async (req, res, next) => {
  const responseHandler = new ResponseHandler(req, res);
  try {
    const sessionInfo = sessionManager.get(req.headers.sessionId);
    if (!sessionInfo) {
      return next(new ResponseError(401, UNAUTHORISED_ACCESS));
    }
    if (!sessionInfo.app.permission.lowLevelApi) {
      return next(new ResponseError(403, API_ACCESS_NOT_GRANTED));
    }
    await appendableData.clearAll(req.params.handleId, true);
    responseHandler();
  } catch(e) {
    responseHandler(e);
  }
};

// DELETE /encryptKey/id
export const dropEncryptKeyHandle = async (req, res, next) => {
  const responseHandler = new ResponseHandler(req, res);
  try {
    const sessionInfo = sessionManager.get(req.headers.sessionId);
    if (!sessionInfo) {
      return next(new ResponseError(401, UNAUTHORISED_ACCESS));
    }
    if (!sessionInfo.app.permission.lowLevelApi) {
      return next(new ResponseError(403, API_ACCESS_NOT_GRANTED));
    }
    await misc.dropEncryptKeyHandle(req.params.handleId);
    responseHandler();
  } catch(e) {
    responseHandler(e);
  }
};

export const serialise = async (req, res, next) => {
  try {
    const sessionInfo = sessionManager.get(req.headers.sessionId);
    if (!sessionInfo) {
      return next(new ResponseError(401, UNAUTHORISED_ACCESS));
    }
    if (!sessionInfo.app.permission.lowLevelApi) {
      return next(new ResponseError(403, API_ACCESS_NOT_GRANTED));
    }
    const data = await appendableData.serialise(req.params.handleId);
    res.send(data);
    updateAppActivity(req, res, true);
  } catch(e) {
    new ResponseHandler(req, res)(e);
  }
};

export const deserialise = async (req, res) => {
  const responseHandler = new ResponseHandler(req, res);
  try {
    const handleId = await appendableData.deserialise(req.rawBody);
    const isOwner = await appendableData.isOwner(app, handleId);
    const version = await appendableData.getVersion(handleId);
    // TODO const isPrivate = await appendableData.
    const filterType = await appendableData.getFilterType(handleId);
    const dataLength = await appendableData.getLength(handleId, false);
    const deletedDataLength = await appendableData.getLength(handleId, true);
    responseHandler({
      handleId: handleId,
      isOwner: isOwner,
      version: version,
      filterType: filterType,
      dataLength: dataLength,
      deletedDataLength: deletedDataLength
    });
  } catch(e) {
    responseHandler(e);
  }
};

export const dropHandle = async (req, res) => {
  const responseHandler = new ResponseHandler(req, res);
  try {
    await appendableData.dropHandle(req.params.handleId);
    responseHandler();
  } catch(e) {
    responseHandler(e);
  }
};