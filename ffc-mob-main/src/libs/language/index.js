const languageList = require('./list');

const langObject = {};

languageList.forEach((lang) => {
	langObject[lang.code] = lang;
});

const isValidLangId = (langCode) => (langObject[langCode] ? true : false);

const getLanguage = (langCode) => {
	return langObject[langCode];
};

const Language = {
	languageList,
	isValidLangId,
	getLanguage,
};

export default Language;
