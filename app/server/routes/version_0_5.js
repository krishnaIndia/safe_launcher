import express from 'express';
import bodyParser from 'body-parser';
import rawBodyParser from 'raw-body-parser';
import {addAppActivity} from '../utils';
import * as NFS from '../controllers/nfs';
import * as DNS from '../controllers/dns';
import * as Auth from '../controllers/auth';
import * as ImmutableData from '../controllers/immutable_data';
import * as DataId from '../controllers/data_id';
import * as CipherOpts from '../controllers/cipher_opts';
import * as StructuredData from '../controllers/structured_data';
import * as AppendableData from '../controllers/appendable_data';

var router = express.Router();

var jsonParser = bodyParser.json({strict: false});

var ActivityMiddleware = function (activityName) {
  this.onRequest = function (req, res, next) {
    addAppActivity(req, activityName);
    next();
  };
  return this.onRequest;
};

router.post('/auth', jsonParser,
  new ActivityMiddleware('Authorise app'), Auth.authorise);
router.get('/auth',
  new ActivityMiddleware('Validate app authorisation'), Auth.isTokenValid);
router.delete('/auth', new ActivityMiddleware('Revoke app'), Auth.revoke);

// NFS - DIRECTORY API
router.post('/nfs/directory/:rootPath/*', jsonParser,
  new ActivityMiddleware('Create directory'), NFS.createDirectory);
router.get('/nfs/directory/:rootPath/*',
  new ActivityMiddleware('Fetch directory'), NFS.getDirectory);
router.delete('/nfs/directory/:rootPath/*',
  new ActivityMiddleware('Delete directory'), NFS.deleteDirectory);
router.put('/nfs/directory/:rootPath/*', jsonParser,
  new ActivityMiddleware('Update directory'), NFS.modifyDirectory);
router.post('/nfs/movedir', jsonParser,
  new ActivityMiddleware('Move/copy directory'), NFS.moveDirectory);

// NFS - FILE API
router.post('/nfs/file/:rootPath/*',
  new ActivityMiddleware('Create file'), NFS.createFile);
router.delete('/nfs/file/:rootPath/*',
  new ActivityMiddleware('Delete file'), NFS.deleteFile);
router.put('/nfs/file/metadata/:rootPath/*', jsonParser,
  new ActivityMiddleware('Update file metadata'), NFS.modifyFileMeta);
// router.put('/nfs/file/:rootPath/*', new ActivityMiddleware('Update file'), NFS.modifyFileContent);
router.get('/nfs/file/:rootPath/*',
  new ActivityMiddleware('Read file'), NFS.getFile);
router.head('/nfs/file/:rootPath/*',
  new ActivityMiddleware('Fetch file metadata'), NFS.getFileMetadata);
router.post('/nfs/movefile', jsonParser,
  new ActivityMiddleware('Move/copy file'), NFS.moveFile);

// DNS API
router.post('/dns', jsonParser, new ActivityMiddleware('Register long name and service'), DNS.register);
router.post('/dns/:longName', new ActivityMiddleware('Create long name'), DNS.createPublicId);
router.put('/dns', jsonParser, new ActivityMiddleware('Add new service'), DNS.addService);
router.delete('/dns/:longName', new ActivityMiddleware('Delete DNS Record'), DNS.deleteDns);
router.delete('/dns/:serviceName/:longName', new ActivityMiddleware('Delete service'), DNS.deleteService);
router.get('/dns/:serviceName/:longName', new ActivityMiddleware('Get DNS home directory'), DNS.getHomeDirectory);
router.get('/dns/:serviceName/:longName/*', new ActivityMiddleware('Read public file'), DNS.getFile);
router.get('/dns', new ActivityMiddleware('List long names'), DNS.listLongNames);
router.get('/dns/:longName', new ActivityMiddleware('List services'), DNS.listServices);

// DATA-ID API
router.post('/data-id/structured-data', new ActivityMiddleware('Get dataId for Structured Data'),
  DataId.getDataIdForStructuredData);
router.post('/data-id/appendable-data', new ActivityMiddleware('Get dataId for Appendable Data'),
  DataId.getDataIdForAppendableData);
router.get('/data-id/:handleId', new ActivityMiddleware('Get serialised dataId'), DataId.serialise);
router.post('/data-id', rawBodyParser(), new ActivityMiddleware('Deserialise dataId'), DataId.deserialise);
router.delete('/data-id/:handleId', new ActivityMiddleware('Drop dataId handle'), DataId.dropHandle);

// cipher-opts
router.get('/cipher-opts/:encType/:?key', new ActivityMiddleware('Get cipher-opts handle'), CipherOpts.getHandle);
router.delete('/cipher-opts/:handleId', new ActivityMiddleware('Drop cipher-opts handle'), CipherOpts.dropHandle);

// ImmutableData API
router.post('/immutableData', new ActivityMiddleware('Create immutable data chunks'), ImmutableData.write);
router.get('/immutableData/:handleId', new ActivityMiddleware('Read immutable data chunks'), ImmutableData.read);

// Structured Data
router.post('/structured-data/', jsonParser, new ActivityMiddleware('Create structured data'), StructuredData.create);
router.get('/structured-data/handle/:dataIdHandle', new ActivityMiddleware('Get structured data handle'),
  StructuredData.getHandle);
router.get('/structured-data/data-id/:handleId',
  new ActivityMiddleware('Get data-id handle from structured data handle'), StructuredData.asDataId);
router.get('/structured-data/:handleId', new ActivityMiddleware('Read structured data'), StructuredData.read);
router.put('/structured-data/:handleId', new ActivityMiddleware('Save structured data - PUT'), StructuredData.put);
router.post('/structured-data/:handleId', new ActivityMiddleware('Save structured data - POST'), StructuredData.post);
router.patch('/structured-data/:handleId', new ActivityMiddleware('Update data of structured data'),
  StructuredData.update);
router.get('/structured-data/serialise/:handleId', new ActivityMiddleware('Serialise structured data handle'),
  StructuredData.serialise);
router.post('/structured-data/deserialise', rawBodyParser(),
  new ActivityMiddleware('De-Serialise structured data handle'), StructuredData.deserialise);
router.delete('/structured-data/:handleId', new ActivityMiddleware('Delete structured data'),
  StructuredData.deleteStructureData);
router.delete('/structured-data/handle/:handleId', new ActivityMiddleware('Drop structured data handle'),
  StructuredData.dropHandle);

// AppendableData - encryptKey API
router.get('/appendableData/encryptKey/:handleId', new ActivityMiddleware('Get encrypt key'), AppendableData.getEncryptKey);
router.delete('/appendableData/encryptKey/:handleId', new ActivityMiddleware('Remove from appendable data'), AppendableData.dropEncryptKeyHandle);

// Appendable Data
router.post('/appendableData', jsonParser, new ActivityMiddleware('Create appendable data'), AppendableData.create);
router.get('/appendableData/handle/:id', new ActivityMiddleware('Get appendable data handle'), AppendableData.getHandle);
router.delete('/appendableData/clearDeletedData/:handleId', new ActivityMiddleware('Clear deleted data from appendable data'), AppendableData.clearDeletedData);
router.get('/appendableData/serialise/:handleId', new ActivityMiddleware('Serialise appendable data'), AppendableData.serialise);

router.head('/appendableData/:handleId', new ActivityMiddleware('Get appendable data length'), AppendableData.getMetadata);
router.put('/appendableData/:handleId/:dataIdHandle', new ActivityMiddleware('Append to appendable data'), AppendableData.append);
router.get('/appendableData/:handleId/:index', new ActivityMiddleware('Get DataId from appendable data'), AppendableData.getDataIdAt);
router.delete('/appendableData/:handleId/:index', new ActivityMiddleware('Remove from appendable data'), AppendableData.remove);

/*jscs:disable requireCamelCaseOrUpperCaseIdentifiers*/
export {router as router_0_5};
/*jscs:enable requireCamelCaseOrUpperCaseIdentifiers*/
