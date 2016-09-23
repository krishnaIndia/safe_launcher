import ref from 'ref';
import Enum from 'enum';

import FfiApi from '../ffi_api';
import misc from './misc';

import appManager from '../util/app_manager';
import { FILTER_TYPE } from '../model/enum';
const int32 = ref.types.int32;
const u8 = ref.types.uint8;
const u64 = ref.types.uint64;
const Void = ref.types.void;
const size_t = ref.types.size_t;
const bool = ref.types.bool;
const AppHandle = ref.refType(Void);
const u8Pointer = ref.refType(u8);
const u64Pointer = ref.refType(u64);
const boolPointer = ref.refType(bool);
const size_tPointer = ref.refType(size_t);

Enum.register();
const Ffi_FilterType = new Enum([ 'BlackList', 'WhiteList' ]);

const filterTypePointer = ref.refType(size_t);

class AppendableData extends FfiApi {

  constructor() {
    super();
  }

  getFunctionsToRegister() {
    return {
      'appendable_data_new_priv': [int32, [AppHandle, u8Pointer, u64Pointer]],
      'appendable_data_new_pub': [int32, [AppHandle, u8Pointer, u64Pointer]],
      'appendable_data_get': [int32, [AppHandle, u64, u64Pointer]],
      'appendable_data_extract_data_id': [int32, [u64, u64Pointer]],
      'appendable_data_put': [int32, [AppHandle, u64]],
      'appendable_data_post': [int32, [AppHandle, u64, bool]],
      'appendable_data_encrypt_key': [int32, [u64, u64Pointer]],
      'appendable_data_num_of_data': [int32, [u64, size_tPointer]],
      'appendable_data_nth_data_id': [int32, [AppHandle, u64, size_t, u64Pointer]],
      'appendable_data_append': [int32, [AppHandle, u64, u64]],
      'appendable_data_remove_nth_data': [int32, [u64, size_t]],
      'appendable_data_toggle_filter': [int32, [u64]],
      'appendable_data_free': [int32, [u64]],
      'appendable_data_insert_to_filter': [int32, [u64, u64]],
      'appendable_data_is_owned': [int32, [AppHandle, u64, boolPointer]],
      'appendable_data_version': [int32, [u64]],
      'appendable_data_num_of_deleted_data': [int32, [u64, size_tPointer]],
      'appendable_data_nth_deleted_data_id': [int32, [AppHandle, u64, size_t, u64Pointer]],
      'appendable_data_nth_data_sign_key': [int32, [AppHandle, u64, size_t, u64Pointer]],
      'appendable_data_nth_deleted_data_sign_key': [int32, [AppHandle, u64, size_t, u64Pointer]],
      'appendable_data_restore_nth_deleted_data': [int32, [u64, size_t]],
      'appendable_data_clear_data': [int32, [u64]],
      'appendable_data_clear_deleted_data': [int32, [u64]],
      'appendable_data_remove_nth_deleted_data': [int32, [u64, size_t]],
      'appendable_data_remove_from_filter': [int32, [u64, u64]],
      'appendable_data_filter_type': [int32, [u64, filterTypePointer]]
    };
  }

  save(app, appendHandleId, isPost) {
    return new Promise((resolve, reject) => {
      const onResult = (err, res) => {
        if (err || res !== 0) {
          return reject(err || res);
        }
        resolve();
      };
      if (isPost) {
        this.safeCore.appendable_data_post.async(appManager.getHandle(app), appendHandleId, false, onResult);
      } else {
        this.safeCore.appendable_data_put.async(appManager.getHandle(app), appendHandleId, onResult);
      }
    });
  }

  getDataId(appendHandleId, fromDeleted) {
    return new Promise((resolve, reject) => {
      let dataHandleRef = ref.alloc(u64);
      const onResult = (err, res) => {
        if (err || res !== 0) {
          return reject(err || res);
        }
        resolve(dataHandleRef.deref());
      };
      if (fromDeleted) {
        this.safeCore.appendable_data_nth_deleted_data_id.async(appendHandleId, dataHandleRef, onResult);
      } else {
        this.safeCore.appendable_data_extract_data_id.async(appendHandleId, dataHandleRef, onResult);
      }
    });
  }

  getAppendableDataHandle(app, dataIdHandle) {
    return new Promise((resolve, reject) => {
      const handleRef = ref.alloc(u64);
      const onResult = (err, res) => {
        if (err || res !== 0) {
          return reject(err || res);
        }
        resolve(handleRef.deref());
      };
      this.safeCore.appendable_data_get.async(appManager.getHandle(app), dataIdHandle, handleRef, onResult);
    });
  }

  toggleFilter(appendDataHandle) {
    return new Promise((resolve, reject) => {
      const onResult = (err, res) => {
        if (err || res !== 0) {
          return reject(err || res);
        }
        resolve();
      };
      this.safeCore.appendable_data_toggle_filter.async(appendDataHandle, onResult);
    });
  }

  insertToFilter(appendDataHandle, signKeyHandle) {
    return new Promise((resolve, reject) => {
      const onResult = (err, res) => {
        if (err || res !== 0) {
          return reject(err || res);
        }
        resolve();
      };
      this.safeCore.appendable_data_insert_to_filter.async(appendDataHandle, signKeyHandle, onResult);
    });
  }

  removeFromFilter(appendDataHandle, signKeyHandle) {
    return new Promise((resolve, reject) => {
      const onResult = (err, res) => {
        if (err || res !== 0) {
          return reject(err || res);
        }
        resolve();
      };
      this.safeCore.appendable_data_remove_from_filter.async(appendDataHandle, signKeyHandle, onResult);
    });
  }

  getFilterType(handleId) {
    return new Promise((resolve, reject) => {
      let filterTypeRef = ref.alloc(Ffi_FilterType);
      const onResult = (err, res) => {
        if (err || res !== 0) {
          return reject(err || res);
        }
        // TODO deref filter
        resolve();
      };
      this.safeCore.appendable_data_remove_from_filter.async(handleId, filterTypeRef, onResult);
    });
  }

  create(app, id, isPrivate = true, filterType, filterKeys = []) {
    return new Promise((resolve, reject) => {
      if (!app) {
        return reject('App parameter is mandatory');
      }
      let handleRef = ref.alloc(u64);
      const onResult = async(err, res) => {
        if (err || res !== 0) {
          return reject(err || res);
        }
        try {
          const appendDataHandle = handleRef.deref();
          if (filterType === FILTER_TYPE.WHITE_LIST) {
            await this.toggleFilter(appendDataHandle);
          }
          let key;
          for (key of filterKeys) {
            await this.insertToFilter(appendDataHandle, key);
          }
          resolve(appendDataHandle);
        } catch (e) {
          reject(e);
        }
      };
      if (isPrivate) {
        this.safeCore.appendable_data_new_priv.async(appManager.getHandle(app), id, handleRef, onResult);
      } else {
        this.safeCore.appendable_data_new_pub.async(appManager.getHandle(app), id, handleRef, onResult);
      }
    });
  }

  getEncryptKey(handleId) {
    return new Promise((resolve, reject) => {
      const keyHandleRef = ref.alloc(u64);
      const onResult = (err, res) => {
        if (err || res !== 0) {
          return reject(err || res);
        }
        resolve(keyHandleRef.deref());
      };
      this.safeCore.appendable_data_encrypt_key.async(handleId, keyHandleRef, onResult);
    });
  }

  getSigningKey(handleId, index, fromDeleted) {
    return new Promise((resolve, reject) => {
      const keyHandleRef = ref.alloc(u64);
      const onResult = (err, res) => {
        if (err || res !== 0) {
          return reject(err || res);
        }
        resolve(keyHandleRef.deref());
      };
      if (fromDeleted) {
        this.safeCore.appendable_data_nth_deleted_data_sign_key.async(handleId, index, keyHandleRef, onResult);
      } else {
        this.safeCore.appendable_data_nth_data_sign_key.async(handleId, index, keyHandleRef, onResult);
      }
    });
  }

  restore(handleId, index) {
    return new Promise((resolve, reject) => {
      const onResult = (err, res) => {
        if (err || res !== 0) {
          return reject(err || res);
        }
        resolve();
      };
      this.safeCore.appendable_data_restore_nth_deleted_data.async(handleId, index, onResult);
    });
  }

  append(app, appendableDataHandle, dataIdHandle) {
    return new Promise((resolve, reject) => {
      const onResult = (err, res) => {
        if (err || res !== 0) {
          return reject(err || res);
        }
        resolve();
      };
      this.safeCore.appendable_data_append.async(appManager.getHandle(app),
        appendableDataHandle, dataIdHandle, onResult);
    });
  }

  getLength(handleId, isDeleted) {
    return new Promise((resolve, reject) => {
      const lengthRef = ref.alloc(size_t);
      const onResult = (err, res) => {
        if (err || res !== 0) {
          return reject(err || res);
        }
        resolve(lengthRef.deref());
      };
      if (isDeleted) {
        this.safeCore.appendable_data_num_of_deleted_data.async(handleId, lengthRef, onResult);
      } else {
        this.safeCore.appendable_data_num_of_data.async(handleId, lengthRef, onResult);
      }
    });
  }

  getDataIdAt(app, handleId, index) {
    return new Promise((resolve, reject) => {
      const dataIdRef = ref.alloc(u64);
      const onResult = (err, res) => {
        if (err || res !== 0) {
          return reject(err || res);
        }
        resolve(dataIdRef.deref());
      };
      this.safeCore.appendable_data_nth_data_id.async(appManager.getHandle(app),
        handleId, index, dataIdRef, onResult);
    });
  }

  removeDataAt(handleId, index, fromDeleted) {
    return new Promise((resolve, reject) => {
      const onResult = async (err, res) => {
        if (err || res !== 0) {
          return reject(err || res);
        }
        resolve();
      };
      if (fromDeleted) {
        this.safeCore.appendable_data_remove_nth_delete_data.async(handleId, index, onResult);
      } else {
        this.safeCore.appendable_data_remove_nth_data.async(handleId, index, onResult);
      }
    });
  }

  clearAll(handleId, fromDeleted) {
    return new Promise((resolve, reject) => {
      const onResult = async (err, res) => {
        if (err || res != 0) {
          reject(err);
        }
        resolve();
      };
      if (fromDeleted) {
        this.safeCore.appendable_data_clear_deleted_data.async(handleId, onResult);
      } else {
        this.safeCore.appendable_data_clear_data.async(handleId, onResult);
      }
    });
  }

  getVersion(handleId) {
    return new Promise((resolve, reject) => {
      let versionRef = ref.alloc(u64);
      this.safeCore.appendable_data_version.async(handleId, versionRef, (err, res) => {
        if (err || res !== 0) {
          return reject(err || res);
        }
        resolve(versionRef.deref());
      });
    });
  }

  isOwner(app, handleId) {
    return new Promise((resolve, reject) => {
      let boolRef = ref.alloc(bool);
      this.safeCore.appendable_data_is_owned.async(appManager.getHandle(app), handleId, boolRef, (err, res) => {
        if (err || res !== 0) {
          return reject(err || res);
        }
        resolve(boolRef.deref());
      });
    });
  }

  serialise(handleId) {
    return misc.serialiseAppendableData(handleId);
  }

}

const appendableData = new AppendableData();
export default appendableData;
