'use strict';

import sessionManager from '../session_manager';
import {ResponseError, ResponseHandler, updateAppActivity} from '../utils';
import structuredData from '../../ffi/api/structured_data';
import dataId from '../../ffi/api/data_id';
import cipherOpts from '../../ffi/api/cipher_opts';
import { ENCRYPTION_TYPE } from '../../ffi/model/enum';

const API_ACCESS_NOT_GRANTED = 'Low level api access is not granted';
const UNAUTHORISED_ACCESS = 'Unauthorised access';
const HANDLE_ID_KEY = 'handleId';
const NAME_LENGTH = 32;
const PLAIN_ENCRYPTION = cipherOpts.getCipherOptPlain();

const TYPE_TAG = {
  VERSIONED: 500,
  UNVERSIONED: 501
};

const createOrUpdate = async (req, res, next, isCreate = true) => {
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
    let handleId;
    if (isCreate) {
      handleId = await structuredData.create(app, name, typeTag, cipherOptsHandle, data);
    } else {
      handleId = await structuredData.update(app, name, cipherOptsHandle, data);
    }
    res.send({
      HANDLE_ID_KEY: handleId
    });
    updateAppActivity(req, res, true);
  } catch(e) {
    console.error(e);
    new ResponseHandler(req, res)(e);
  }
};

export const create = (req, res, next) => {
  createOrUpdate(req, res, next, true);
};

// GET /handle/{id}
export const getHandle = async (req, res, next) => {
  try {
    const sessionInfo = sessionManager.get(req.headers.sessionId);
    const app = sessionInfo ? sessionInfo.app : null;
    const id = new Buffer(req.params.dataIdHandle, 'base64');
    const handleId = await structuredData.asStructuredData(app, id);
    const isOwner = await structuredData.isOwner(app, handleId);
    const version = await structuredData.getVersion(handleId);
    // TODO get typeTag
    res.send({
      HANDLE_ID_KEY: handleId,
      isOwner: isOwner,
      version: version
    });
    updateAppActivity(req, res, true);
  } catch(e) {
    new ResponseHandler(req, res)(e);
  }
};

export const update = (req, res, next) => {
  createOrUpdate(req, res, next, false);
};

export const read = async (req, res) => {
  const responseHandler = new ResponseHandler(req, res);
  try {
    const sessionInfo = sessionManager.get(req.headers.sessionId);
    const app = sessionInfo ? sessionInfo.app : null;
    const handleId = parseInt(req.params.handleId);
    const data = await structuredData.read(app, handleId);
    res.send(data || new Buffer(0));
    updateAppActivity(req, res, true);
  } catch (e) {
    console.error(e);
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
    res.sendStatus(200);
    updateAppActivity(req, res, true);
  } catch (e) {
    console.error(e);
    responseHandler(e);
  }
};

export const dropHandle = (req, res) => {
  const responseHandler = new ResponseHandler(req, res);
  try {
    const handleId = parseInt(req.params.handleId);
    await structuredData.dropHandle(handleId);
    res.sendStatus(200);
    updateAppActivity(req, res, true);
  } catch (e) {
    console.error(e);
    responseHandler(e);
  }
};