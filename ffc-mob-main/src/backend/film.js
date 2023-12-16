import { perform, multipartUpload } from './request';
import cache from './cache';

export const filmData = (filmId) => {
	return perform('film/film_data', {
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
	return perform('film/update_film_details', {
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
	return perform('film/update_submitter_details', {
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

export const updateFilmSpecifications = ({
	id,
	filmGenres,
	filmTypes,
	filmLanguages,
	firstTime,
	filmColorId,
	aspectRatio,
	shootingFormat,
	countryOfOrgin,
	productionBudget,
	productionBudgetCurrencyId,
	runtimeSeconds,
	completionDate,
}) => {
	return perform('film/update_film_specifications', {
		id,
		filmGenres,
		filmTypes,
		filmLanguages,
		firstTime,
		filmColorId,
		aspectRatio,
		shootingFormat,
		countryOfOrgin,
		productionBudget,
		productionBudgetCurrencyId,
		runtimeSeconds,
		completionDate,
	});
};

export const updateFilmCredits = ({ id, filmCreditSections }) => {
	return perform('film/update_film_credits', {
		id,
		filmCreditSections,
	});
};

export const updateFilmScreenings = ({ id, filmScreenings }) => {
	return perform('film/update_film_screenings', {
		id,
		filmScreenings,
	});
};

export const filmVideoData = (filmId) => {
	return perform('film/get_film_video', {
		filmId,
	});
};

export const createTusFilmRecord = ({
	filmId,
	mimetype,
	totalBytes,
	sizeInMb,
}) => {
	return perform('film/create_tus_film_record', {
		filmId,
		mimetype,
		totalBytes,
		sizeInMb,
	});
};

export const resetTusFilmRecord = ({
	filmId,
	mimetype,
	totalBytes,
	sizeInMb,
}) => {
	return perform('film/reset_film_record', {
		filmId,
		mimetype,
		totalBytes,
		sizeInMb,
	});
};

export const getFilms = ({ isPublished, isActive }) => {
	return perform('film/get_films', {
		isPublished,
		isActive,
	});
};

export const getFilmsForSubmissions = ({ isPublished, isActive }) => {
	return perform('film/get_films_for_submission', {
		isPublished,
		isActive,
	});
};

export const generateFilmStages = ({ filmId }) => {
	return perform('film/generate_film_stages', {
		filmId,
	});
};

export const getStageWiseData = ({ stageId, filmId }) => {
	return perform('film/get_stage_wise_data', {
		stageId,
		filmId,
	});
};

export const getFormTypes = async () => {
	const key = 'film/get_form_types';
	if (cache.has(key)) {
		return cache.get(key);
	}
	const data = await perform(key, {});
	if (data?.success) {
		cache.set(key, data);
	}
	return data;
};

export const home = async () => {
	return perform('film/home', {});
};

export const submissions = async () => {
	return perform('film/submission_list', {});
};

export const filmViewData = async ({ filmId, submissionId }) => {
	return perform('film/view_data', {
		filmId,
		submissionId,
	});
};

export const uploadFilmPoster = async (filmId, file) => {
	return multipartUpload(
		'film/upload_film_poster',
		{
			filmId,
		},
		file
	);
};

export const getVideoStatus = async (s3FileId) => {
	return perform('film/get_video_status', {
		s3FileId,
	});
};

export const updateFilmVideoUrl = async ({ videoUrl, password, filmId }) => {
	return perform('film/update_film_video_url', { videoUrl, password, filmId });
};
