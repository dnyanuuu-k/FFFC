import { perform } from "./request";

export const filmData = (filmId) => {
	return perform("film/film_data", {
		filmId,
	});
};

export const updateFilmDetails = ({
	id,
	title,
	shortSummary,
	storyline,
	hasNonEnglishTitle,
	nativeTitle,
	nativeShortSummary,
	nativeStoryLine,
	facebook,
	instagram,
	twitter,
	linkedin,
}) => {
	return perform("film/update_film_details", {
		id,
		title,
		shortSummary,
		storyline,
		hasNonEnglishTitle,
		nativeTitle,
		nativeShortSummary,
		nativeStoryLine,
		facebook,
		instagram,
		twitter,
		linkedin,
	});
};

export const updateSubmitterDetails = ({
	id,
	submitterEmail,
	submitterPhone,
	submitterAddress,
	submitterCity,
	submitterState,
	submitterPostalCode,
	submitterCountry,
	submitterDob,
	submitterGender,
}) => {
	return perform("film/update_submitter_details", {
		id,
		submitterEmail,
		submitterPhone,
		submitterAddress,
		submitterCity,
		submitterState,
		submitterPostalCode,
		submitterCountry,
		submitterDob,
		submitterGender,
	});
};

export const updateFilmCredits = ({
	id,
	filmCreditSections
}) => {
	return perform("film/update_film_credits", {
		id,
		filmCreditSections
	});
};

export const filmVideoData = (filmId) => {
	return perform("film/get_film_video", {
		filmId
	});
};

export const createFilmRecord = ({ filmId, mimetype, totalChunks, sizeInMb}) => {
	return perform("film/create_film_record", {
		filmId,
		mimetype,
		totalChunks,
		sizeInMb
	});
};

export const getFilms = ({ isPublished, isActive }) => {
	return perform("film/get_films", {
		isPublished,
		isActive
	});
}