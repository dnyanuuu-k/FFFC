const yourFirst = (action = "Add", entity = "photo") => {
	return `${action} your first ${entity}\n by clicking on below button`;
};

const textGenerator = {
	yourFirst,
};

export default textGenerator;