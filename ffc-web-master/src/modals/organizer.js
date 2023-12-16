const defaultOrganizerData = {
	id: null,
	name: "",
	designation: "",
};

const createOrganizerTableStructure = (organizer, idx = 1) => {
	const data = { idx };
	if (organizer.id) {
		data.id = organizer.id;
	}
	data.values = [
		{
			key: "name",
			value: organizer.name,
		},
		{
			key: "designation",
			value: organizer.designation,
		},
	];
	return data;
};

const createAllOrganizerTableStructure = (organizers = []) => {
	const values = [];
	for(const organizer of organizers){
		values.push(createOrganizerTableStructure(organizer, organizer.relativeOrder));
	}
	return values;
}

const getAllOrganizerTableStructure = (tableValues = []) => {
	const values = [];
	for(const row of tableValues){
		values.push(getOrganizerTableStructure(row));
	}
	return values;
}

const getOrganizerTableStructure = (organizer) => {
	const { id, idx, values = [] } = organizer;
	const data =  {
		id,
		idx,
		name: values[0].value || '',
		designation: values[1].value || ''
	}
	return data;
};

const OrganierModal = {
	createAllOrganizerTableStructure,
	createOrganizerTableStructure,
	getAllOrganizerTableStructure,
	getOrganizerTableStructure,
	defaultOrganizerData
};

export default OrganierModal;