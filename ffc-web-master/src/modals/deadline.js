import { YYYYMMDD } from "utils/constants";
import moment from "moment";

const TODAY_MOMENT = moment().format(YYYYMMDD);

const defaultDeadlineData = {
	id: null,
	name: "Edit Deadline",
	date: TODAY_MOMENT,
	allCategories: true,
};

const createDeadlineTableStructure = (deadline = {}, idx = 1) => {
	const data = { idx, ...defaultDeadlineData, ...deadline };
	data.values = [
		{
			key: "name",
			value: data.name,
		},
		{
			key: "date",
			value: data.date,
		},
	];
	return data;
};

const createAllDeadlineTableStructure = (dealines = []) => {
	const values = [];
	let idx = 1;
	for (const dealine of dealines) {
		values.push(createDeadlineTableStructure(dealine, idx));
		idx++;
	}
	return values;
};

const getDeadlineTableStructure = (organizer) => {
	const { id, idx, allCategories, values = [] } = organizer;
	const data = {
		id,
		idx,
		name: values[0].value,
		date: values[1].value,
		allCategories,
	};
	return data;
};

const getAllDeadlineTableStructure = (tableValues = []) => {
	const values = [];
	for (const row of tableValues) {
		values.push(getDeadlineTableStructure(row));
	}
	return values;
};

const DeadlineModal = {
	defaultDeadlineData,

	getDeadlineTableStructure,
	getAllDeadlineTableStructure,

	createDeadlineTableStructure,
	createAllDeadlineTableStructure,
};

export default DeadlineModal;