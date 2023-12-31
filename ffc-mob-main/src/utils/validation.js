import moment from 'moment';

const validPhoneNumber = (number) => {
	if (typeof number === 'number') {
		const numstring = `${number}`;
		if (numstring.length === 10) {
			return numstring;
		}
	} else if (
		typeof number === 'string' &&
		number.length === 10 &&
		typeof parseInt(number, 10) === 'number'
	) {
		return number;
	}
	return false;
};

const validateEmail = (email) => {
	if (typeof email !== 'string') {
		return false;
	}
	const lemail = email.toLowerCase();
	const passed = lemail.match(
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	);
	if (passed) {
		return lemail;
	}
	return false;
};

const validString = (str) => {
	if (typeof str !== 'string') {
		return false;
	}
	str = str.trimStart();
	str = str.trimEnd();
	if (str?.length > 0) {
		return str;
	}
	return false;
};

const validName = (str, validLength = 2) => {
	const str2 = validString(str);
	if (str2 && str2.length >= validLength) {
		return str;
	}
	return false;
};

const validBoolean = (bool) => typeof bool === 'boolean';

const validNumber = (num) => {
	if (isNaN(num)) {
		return false;
	}
	return typeof num === 'number';
};

const parseNum = (num, defaultValue = 0) => {
	const t = typeof num;
	if (t === 'number') {
		return num;
	} else if (t === 'string') {
		const parsed = parseInt(num, 10);
		return isNaN(parsed) ? defaultValue : parsed;
	}
	return defaultValue;
};

const validDate = (date) => {
	return moment.isMoment(date);
};

const mathRound = (value, decimals = 2) => {
	return isNaN(value)
		? 0
		: Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
};

const validUrl = (url) => {
	var pattern = new RegExp(
		'^(https?:\\/\\/)?' + // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
			'(\\#[-a-z\\d_]*)?$',
		'i'
	); // fragment locator
	return !!pattern?.test(url);
};

const validation = {
	validPhoneNumber,
	validateEmail,
	validBoolean,
	validNumber,
	validString,
	validDate,
	validName,
	validUrl,
	mathRound,
	parseNum,
};

export default validation;