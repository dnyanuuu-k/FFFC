import { NativeModules, NativeEventEmitter } from 'react-native';

const { RNTinodeClient } = NativeModules;
const tinodeEventEmitter = new NativeEventEmitter();
const coversationListeners = new Map();
let currentEmail = null;
let hostname = 'sandbox.tinode.co';
tinodeEventEmitter.addListener('conversationChange', (contacts) => {
	dispatchConversationChange(contacts);
});

const addConversationListener = (key, listener) => {
	if (!key || coversationListeners.has(key)) {
		return;
	}
	coversationListeners.set(key, listener);
};

const removeConversationListener = (key) => {
	coversationListeners.delete(key);
};

const dispatchConversationChange = (contacts) => {
	for (var [key, value] of coversationListeners) {
		value(contacts);
	}
};

const setHost = (newHost) => {
	hostname = newHost;
};

const isAuth = async () => {
	const auth = await RNTinodeClient.isAuthenticated();
	return auth;
};

const initClient = async (email, password) => {
	try {
		if (!hostname) {
			throw new Error('Host not set');
		}
		const isLogged = await isAuth();
		if (isLogged && currentEmail === email) {
			return;
		}
		console.log(isLogged, hostname, email, password);
		currentEmail = email;
		RNTinodeClient.stopMeListener();
		RNTinodeClient.login(hostname, email, password, (data, error) => {
			console.log('Login', data);
			if (data) {
				RNTinodeClient.initClient();
				setTimeout(() => {
					RNTinodeClient.startMeListener();
				}, 1000);
			}
		});
	} catch (err) {}
};

const logout = async () => {
	currentEmail = null;
	const isLogged = await isAuth();
	if (isLogged) {
		RNTinodeClient.logout();
		return;
	}
};

const clearCurrent = async () => {
	currentEmail = null;
	RNTinodeClient.invalidate();
};

const getTinode = () => {
	return RNTinodeClient;
};

const getConnversations = async () => {
	const isLogged = await isAuth();
	if (isLogged) {
		return new Promise((resolve) => {
			RNTinodeClient.getConversationList(resolve);
		});
	}
	return [];
};

module.exports = {
	removeConversationListener,
	addConversationListener,
	getConnversations,
	clearCurrent,
	getTinode,
	initClient,
	setHost,
	isAuth,
	logout,
};