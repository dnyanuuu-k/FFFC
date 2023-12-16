import { NativeModules, NativeEventEmitter } from 'react-native';

const { RNTusClient } = NativeModules;
const tusEventEmitter = new NativeEventEmitter();

const defaultOptions = {
  headers: {},
  metadata: {},
};

/** Class representing a tus upload */
class Upload {
  /**
   *
   * @param file The file absolute path.
   * @param settings The options argument used to setup your tus upload.
   */
  constructor() {
    this.subscriptions = [];
    this.file = null;
    this.options = defaultOptions;
  }

  /**
   *
   * @param file The file absolute path.
   * @param settings The options argument used to setup your tus upload.
   */
  init(file, options) {
    this.subscriptions = [];
    this.file = file;
    this.options = Object.assign({}, defaultOptions, options);
  }

  /**
   * Start or resume the upload using the specified file.
   * If no file property is available the error handler will be called.
   */
  start() {
    if (!this.file) {
      this.emitError(new Error('tus: no file or stream to upload provided'));
      return;
    }
    if (!this.options.endpoint) {
      this.emitError(new Error('tus: no endpoint provided'));
      return;
    }
    (this.uploadId ? Promise.resolve() : this.createUpload())
      .then((e) => this.resume())
      .catch((e) => this.emitError(e));
  }

  /**
   * Abort the currently running upload request and don't continue.
   * You can resume the upload by calling the start method again.
   */
  abort() {
    if (this.uploadId) {
      RNTusClient.abort(this.uploadId, (err) => {
        if (err) {
          this.emitError(err);
        } else {
          this.uploadId = null;
        }
      });
    }
  }

  resume() {
    RNTusClient.resume(this.uploadId, (hasBeenResumed) => {
      if (!hasBeenResumed) {
        this.emitError(new Error('Error while resuming the upload'));
      }
    });
  }

  emitError(error) {
    if (this.options.onError) {
      this.options.onError(error);
    } else {
      throw error;
    }
  }

  createUpload() {
    return new Promise((resolve, reject) => {
      const { metadata, headers, endpoint, uploadId } = this.options;
      const settings = { metadata, headers, endpoint, uploadId };
      console.log('CC:', uploadId);
      RNTusClient.createUpload(
        this.file,
        settings,
        (currentUploadId, errorMessage) => {
          console.log('CC:', currentUploadId, errorMessage);
          this.uploadId = currentUploadId;
          if (currentUploadId == null) {
            const error = errorMessage ? new Error(errorMessage) : null;
            reject(error);
          } else {
            this.subscribe();
            resolve();
          }
        }
      );
    });
  }

  subscribe() {
    this.subscriptions.push(
      tusEventEmitter.addListener('onSuccess', (payload) => {
        if (payload.uploadId === this.uploadId) {
          this.url = payload.uploadUrl;
          this.onSuccess();
          this.unsubscribe();
        }
      })
    );
    this.subscriptions.push(
      tusEventEmitter.addListener('onError', (payload) => {
        if (payload.uploadId === this.uploadId) {
          this.onError(payload.error);
        }
      })
    );
    this.subscriptions.push(
      tusEventEmitter.addListener('onProgress', (payload) => {
        if (payload.uploadId === this.uploadId) {
          this.onProgress(payload.bytesWritten, payload.bytesTotal);
        }
      })
    );
  }

  unsubscribe() {
    this.subscriptions.forEach((subscription) => subscription.remove());
  }

  onSuccess() {
    this.options.onSuccess && this.options.onSuccess();
  }

  onProgress(bytesUploaded, bytesTotal) {
    this.options.onProgress &&
      this.options.onProgress(bytesUploaded, bytesTotal);
  }

  onError(error) {
    this.options.onError && this.options.onError(error);
  }
}

const clientMap = new Map();

const addClient = (uploadId) => {
  const client = new Upload();
  clientMap.set(uploadId, client);
  return client;
};

const pauseUpload = (uploadId) => {
  if (clientMap.has(uploadId)) {
    clientMap.get(uploadId).abort();
  }
};

const startUpload = (uploadId, onNotPresent) => {
  if (clientMap.has(uploadId)) {
    clientMap.get(uploadId).start();
  } else if (onNotPresent) {
    onNotPresent();
  }
};

const removeClient = (uploadId) => {
  clientMap.delete(uploadId);
};

const getClient = (uploadId) => {
  return clientMap.get(uploadId);
};

const clear = (uploadId) => {
  if (clientMap.has(uploadId)) {
    clientMap.get(uploadId).unsubscribe();
    clientMap.delete(uploadId);
  }
};

const hasClient = (uploadId) => {
  if (clientMap.has(uploadId)) {
    return clientMap.get(uploadId).file !== null;
  } else {
    return false;
  }
};

const TusClient = {
  addClient,
  removeClient,
  getClient,
  clear,
  startUpload,
  pauseUpload,
  hasClient,
};

export default TusClient;