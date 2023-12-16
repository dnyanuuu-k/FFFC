import { REQUEST_NAME_CHANGE } from 'utils/constants';
import { perform, multipartUpload } from './request';
import cache from './cache';

export const festivalData = (festivalId) => {
	return perform('festival/get_festival_data', {
		festivalId,
	});
};

export const categoryData = ({ festivalId, festivalCategoryId }) => {
	return perform('festival/get_festival_category_data', {
		festivalId,
		festivalCategoryId,
	});
};

export const festivalTypes = async () => {
	const key = 'festival/festivalTypes';
	if (cache.has(key)) {
		return cache.get(key);
	}
	const data = await perform('festival/get_festival_types', {
		uiFriendly: true,
	});
	if (data?.success) {
		cache.set(key, data);
	}
	return data;
};

export const uploadFestivalLogo = async (festivalId, file) => {
	return multipartUpload(
		'festival/upload_festival_logo',
		{
			festivalId,
		},
		file
	);
};

export const uploadFestivalCover = async (festivalId, file) => {
	return multipartUpload(
		'festival/upload_festival_cover',
		{
			festivalId,
		},
		file
	);
};

export const updateFestivalDetails = async ({
	id,
	name,
	description,
	festivalOrganizers,
	festivalType,
	yearsRunning,
	terms,
	awards,
} = {}) => {
	return perform('festival/update_festival_details', {
		id,
		name,
		festivalOrganizers,
		description,
		festivalType,
		yearsRunning,
		terms,
		awards,
	});
};

export const updateFestivalContactDetails = async ({
	id,
	email,
	phone,
	city,
	address,
	country,
	postalCode,
	state,
	facebook,
	instagram,
	twitter,
	website,
	festivalVenues,
} = {}) => {
	return perform('festival/update_festival_contact_details', {
		id,
		email,
		phone,
		address,
		city,
		country,
		postalCode,
		state,
		facebook,
		instagram,
		twitter,
		website,
		festivalVenues,
	});
};

export const updateFestivalDeadlineDetails = async ({
	id,
	festivalId,
	openingDate,
	notificationDate,
	festivalStart,
	festivalEnd,
	festivalDateDeadlines,
} = {}) => {
	return perform('festival/update_festival_deadline_details', {
		id,
		festivalId,
		openingDate,
		notificationDate,
		festivalStart,
		festivalEnd,
		festivalDateDeadlines,
	});
};

export const updateFestivalCategoryDetails = async ({
	id,
	name,
	festivalId,
	description,
	runtimeType,
	runtimeStart,
	runtimeEnd,
	projectOrigins,
	festivalCategoryFees,
}) => {
	return perform('festival/update_festival_category_details', {
		id,
		name,
		festivalId,
		description,
		runtimeType,
		runtimeStart,
		runtimeEnd,
		projectOrigins,
		festivalCategoryFees,
	});
};

export const updateListingDetails = async ({
	id,
	festivalTags,
	festivalFocus,
	minimumRuntime,
	maximumRuntime,
	listingUrl,
	trackingPrefix,
	startingNumber,
	acceptsAllLength,
}) => {
	return perform('festival/update_festival_listing_details', {
		id,
		festivalTags,
		festivalFocus,
		minimumRuntime,
		maximumRuntime,
		listingUrl,
		trackingPrefix,
		startingNumber,
		acceptsAllLength,
	});
};

export const deleteCategory = async ({ festivalCategoryId } = {}) => {
	return perform('festival/delete_festival_category', {
		festivalCategoryId,
	});
};

export const updateCategoryOrder = async (festivalCategories) => {
	return perform('festival/update_festival_category_order', {
		festivalCategories,
	});
};

export const submissionCategories = async ({ filmId, festivalId }) => {
	return perform('festival/festival_submission_categories', {
		filmId,
		festivalId,
	});
};

export const requestNameChange = async ({ festivalName, festivalId }) => {
	return perform('festival/create_update_request', {
		value: festivalName,
		type: REQUEST_NAME_CHANGE,
		festivalId,
	});
};

export const generateFestivalStages = async () => {
	return perform('festival/generate_festival_stages', {});
};

export const getStageWiseData = async ({ festivalId, stageId = 0 }) => {
	return perform('festival/get_stage_wise_data', {
		festivalId,
		stageId,
	});
};

export const home = async () => {
	return perform('festival/home', {
		includeUser: true,
	});
};

export const view = async ({ festivalId }) => {
	return perform('festival/view_data', {
		festivalId,
	});
};

export const listingUrl = async () => {
	return perform('festival/listing_url', {});
};

export const buttonAndLogo = async ({ festivalId }) => {
	return perform('festival/button_and_logo', {
		festivalId,
	});
};

export const getFestivalFlags = async ({ festivalId }) => {
	return perform('festival/get_festival_flags', {
		festivalId,
	});
};

export const saveFestivalFlags = async ({ festivalId, flags }) => {
	return perform('festival/save_festival_flags', {
		festivalId,
		flags,
	});
};

export const createFestivalJudge = async ({
	festivalId,
	email,
	permissions,
	id,
}) => {
	return perform('festival/create_festival_judge', {
		festivalId,
		email,
		permissions,
		id,
	});
};

export const deleteFestivalJudge = async ({ festivalJudgeId }) => {
	return perform('festival/delete_festival_judge', {
		festivalJudgeId,
	});
};
export const getFestivalJudges = async ({ festivalId }) => {
	return perform('festival/get_festival_judges', {
		festivalId,
	});
};

export const getNotificationPerf = async ({ festivalId }) => {
	return perform('festival/get_notification_perf', {
		festivalId,
	});
};

export const updateNotificationPerf = async ({ festivalId, notifyPerf }) => {
	return perform('festival/update_notification_pref', {
		festivalId,
		notifyPerf,
	});
};

export const getFestivalSeasons = async ({ festivalId }) => {
	return perform('festival/get_festival_seasons', {
		festivalId,
	});
};

export const getSubmissionFilters = async ({ festivalId }) => {
	return perform('festival/get_submission_filters', {
		festivalId,
	});
};

export const getSubmissions = async ({ festivalDateId }) => {
	return perform('festival/get_submissions', {
		festivalDateId,
	});
};

export const filterFestivals = async (filters) => {
	return perform('festival/filter_festivals', {
		...filters,
	});
};

export const publishFestival = async () => {
	return perform('festival/publish_festival', {});
};

export const contactAndVenue = async ({ festivalId }) => {
	return perform('festival/contact_and_venue', {
		festivalId,
	});
};

export const updateLikeState = async ({ festivalId, isLiked = true }) => {
	return perform('festival/update_like_state', {
		festivalId,
		isLiked,
	});
};
