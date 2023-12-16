const defaultVenueData = {
	id: null,
	name: "",
	country: "",
	state: "",
	city: "",
	postalCode: "",
};

const createVenueTableStructure = (venue, idx = 1) => {
	const data = { idx, ...defaultVenueData, ...venue };
	data.values = [
		{
			key: "name",
			value: venue.name,
		},
	];
	return data;
};

const createAllVenueTableStructure = (organizers = []) => {
	const values = [];
	for (const organizer of organizers) {
		values.push(
			createVenueTableStructure(organizer, organizer.relativeOrder)
		);
	}
	return values;
};

const getVenueTableStructure = (organizer) => {
	const {
		id,
		idx,
		address = "",
		city = "",
		state = "",
		country = "",
		postalCode = "",
		values = [],
	} = organizer;
	const data = {
		id,
		idx,
		name: values[0].value,
		address,
		city,
		state,
		country,
		postalCode,
	};
	return data;
};

const getAllVenueTableStructure = (tableValues = []) => {
	const values = [];
	for (const row of tableValues) {
		values.push(getVenueTableStructure(row));
	}
	return values;
};

const VenueModal = {
	defaultVenueData,

	getVenueTableStructure,
	getAllVenueTableStructure,

	createVenueTableStructure,
	createAllVenueTableStructure,
};

export default VenueModal;