export const infoType = {
	description: 0,
	storyline: 1,
	film_type: 2,
	screening: 3,
};

const infoNote = {
	[infoType.description]:
		'Write eye catching short summary of your film in fews lines',
	[infoType.storyline]: 'Write about your storyline in breif',
	[infoType.film_type]: 'Select film type that is related to your film',
	[infoType.screening]: 'Add festival in which your film was selected',
};

export default infoNote;
