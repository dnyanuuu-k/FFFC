const countryList = require('./list');

const countryObject = {};
const countryOptions = [];

countryList.forEach((country) => {
	countryObject[country.code] = country;
	countryOptions.push(`${country.name} - ${country.code}`);
});

const isValidCountry = (countryCode) =>
	countryObject[countryCode] ? true : false;

const getCountry = (countryCode) => {
	return countryObject[countryCode];
};

const Country = {
	countryOptions,
	countryList,
	isValidCountry,
	getCountry,
};

export default Country;
