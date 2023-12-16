const defaultScreeningData = {
	id: null,
	festivalName: '',
	city: '',
	country: '',
	screeningDate: '',
	premiere: '',
	awardSelection: '',
};

const createScreeningTableStructure = (screening, idx = 1) => {
	const data = { idx, ...screening };
	data.values = [
		{
			key: 'name',
			value: screening.festivalName,
		},
	];
	return data;
};

const createAllScreeningTableStructure = (screenings = []) => {
	const values = [];
	for (const screening of screenings) {
		values.push(
			createScreeningTableStructure(screening, screening.relativeOrder)
		);
	}
	return values;
};

const getAllScreeningTableStructure = (tableValues = []) => {
	const values = [];
	for (const row of tableValues) {
		values.push(getScreeningTableStructure(row));
	}
	return values;
};

const getScreeningTableStructure = (screening) => {
	delete screening.values;
	return screening;
};

const OrganierModal = {
	createAllScreeningTableStructure,
	createScreeningTableStructure,
	getAllScreeningTableStructure,
	getScreeningTableStructure,
	defaultScreeningData,
};

export default OrganierModal;
