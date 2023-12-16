import { setData, deleteData, getData } from './storage';

const key = '@tkn';
let currentToken = null;

function setCurrentToken(token) {
	try {
		setData(key, token);
		currentToken = token;
	} catch (err) {
		console.log(err);
		return false;
	}
}

async function getCurrentToken() {
	try {
		if (currentToken) {
			return currentToken;
		}
		const data = await getData(key);
		return data;
	} catch (err) {
		console.log(err);
		return false;
	}
}

function deleteCurrentToken() {
	try {
		deleteData(key);
		currentToken = null;
		return true;
	} catch (err) {
		console.log(err);
		return true;
	}
}

const Account = {
	deleteCurrentToken,
	setCurrentToken,
	getCurrentToken,
};

export default Account;
