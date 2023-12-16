export const infoType = {
	year_running: 0,
	description: 1,
	awards: 2,
	terms: 3,
	location: 4,
	opening_date: 5,
	notification_date: 6,
	category: 7,
	festival_focus: 8,
	runtime_search: 9,
	visibility: 10,
	sequence: 11,
};

const infoNote = {
	[infoType.year_running]:
		'Number many years has your festival been running, including the upcoming one',
	[infoType.description]:
		"Describe your unique film festival experience here. Let others immerse themselves in the world you've created, from captivating screenings to memorable interactions. Your words can inspire fellow filmmakers and enthusiasts alike.",
	[infoType.awards]:
		'Share the remarkable awards and prizes that your festival offers, everyone loves prizes',
	[infoType.terms]: 'Terms and Conditions to which your submitters must agree',
	[infoType.location]: 'Location of your event taking place',
	[infoType.opening_date]:
		'Date from which festival starts accepting submissions',
	[infoType.notification_date]:
		'Date on which submitters will be notified of their selection or rejections',
	[infoType.category]: 'Select categories that your festival accepts',
	[infoType.festival_focus]: 'If your festival focuses on perticular category select those',
	[infoType.runtime_search]:
		'Set runtime that your festival accepts for all categories',
	[infoType.visibility]:
		'Public: Visible to everyone on FilmFestBook\n\nPrivate: Only visible to people with festival link',
	[infoType.sequence]:
		'Track submission for festival with custom tracking id\n\nPrefix is starting of tracking number',
};

export default infoNote;