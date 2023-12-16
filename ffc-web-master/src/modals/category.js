const createCategoryTableStructure = (category) => {
	const data = { ...category };
	data.values = [
		{
			key: "name",
			value: category.name,
		},
	];
	return data;
};

const createAllCategoryTableStructure = (categories = []) => {
	const values = [];
	for (const category of categories) {
		values.push(
			createCategoryTableStructure(category, category.relativeOrder)
		);
	}
	return values;
};

const VenueModal = {
	createCategoryTableStructure,
	createAllCategoryTableStructure
};

export default VenueModal;