import { API_URL } from "./constants";
import DB from "db";

let currentUploader = null;
let photoListener = null;

const setCurrentUploader = (uploaderRef) => {
    currentUploader = uploaderRef;
}
const getCurrentUploader = (uploaderRef) => {
    return currentUploader;
}
const isValid = () => {
    return currentUploader != null;
}

const onNewPhoto = (data) => {
    if(photoListener){
        photoListener(data);
    }
}

const addPhotoListener = (listener) => {
    photoListener = listener;
}

const UPLOAD_LIMIT = 25;

export const UploaderInstance = {
    UPLOAD_LIMIT,

    setCurrentUploader,
    getCurrentUploader,
    onNewPhoto,
    addPhotoListener,
    isValid
}

class SimpleUploader {
    static LOAD_EVENT = 'load';
    static PROGRESS_EVENT = 'progress';
    static ABORT_EVENT = 'abort';
    static ERROR_EVENT = 'error';
    constructor(props){
        if(!props?.endpoint || !props.file){
            throw new Error("Id, endpoint and file is required")
        }
        const token = DB.Account.getCurrentToken();
        this.formData = new FormData();
        this.setFormData(props.params, props.file);

        this.xhr = new XMLHttpRequest();
        this.xhr.open("POST", API_URL + props.endpoint);
        this.xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }

    onLoad = (callback) => {
    	this.xhr.addEventListener(SimpleUploader.LOAD_EVENT, () => {
    		if ((this.xhr.status >= 200 && this.xhr.status < 300) || this.xhr.status === 304) {
	            var result = JSON.parse(this.xhr.responseText);
	            callback(result);
	        } else {
	            callback(false);
	        }
    	});        
    }

    onProgress = (callback) => {        
    	this.xhr.upload.addEventListener(SimpleUploader.PROGRESS_EVENT, (event) => {            
    		const percent = ((event.loaded / event.total) * 100).toFixed(1);
    		callback(percent);
    	});
    }

    onError = (callback) => {        
    	this.xhr.addEventListener(SimpleUploader.ERROR_EVENT, callback);    	
    }

    onAbort = (callback) => {        
        this.xhr.addEventListener(SimpleUploader.ABORT_EVENT,  () => {
            console.log("onAbort");
        	this.xhr.onreadystatechange = null;
        	this.xhr = null;
        	callback();
        });  
    }

    post = () => {
        this.xhr.send(this.formData);
    }

    setFormData = (params, file) => {
        for (var key in params) {
            this.formData.append(key, params[key]);
        }
        this.formData.append("file", file);
    }

    abort = () => {
        this.xhr.abort();
    }
};

export default SimpleUploader;
