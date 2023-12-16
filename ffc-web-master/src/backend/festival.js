import { REQUEST_NAME_CHANGE } from 'utils/constants';
import { perform, multipartUpload } from "./request";
import cache from "./cache";

export const festivalData = (festivalId) => {
	return perform("festival/get_festival_data", {
		festivalId,
	});
};

export const categoryData = ({ festivalId, festivalCategoryId }) => {
	return perform("festival/get_festival_category_data", {
		festivalId,
		festivalCategoryId,
	});
};

export const festivalTypes = async () => {
	const key = "festival/festivalTypes";
	if (cache.has(key)) return cache.get(key);
	const data = await perform("festival/get_festival_types", {
		uiFriendly: true,
	});
	if (data?.success){
		cache.set(key, data);
	}
	return data;
};

export const uploadFestivalLogo = async (festivalId, file) => {
	return multipartUpload(
		"festival/upload_festival_logo",
		{
			festivalId,
		},
		file
	);
};

export const uploadFestivalCover = async (festivalId, file) => {
	return multipartUpload(
		"festival/upload_festival_cover",
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
	return perform("festival/update_festival_details", {
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
	festivalVenues,
} = {}) => {
	return perform("festival/update_festival_contact_details", {
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
	return perform("festival/update_festival_deadline_details", {
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
	return perform("festival/update_festival_category_details", {
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
	acceptsAllLength
}) => {
	return perform("festival/update_festival_listing_details", {
		id,
		festivalTags,
		festivalFocus,
		minimumRuntime,
		maximumRuntime,
		listingUrl,
		trackingPrefix,
		startingNumber,
		acceptsAllLength
	});
};

export const deleteCategory = async ({ festivalCategoryId } = {}) => {
	return perform("festival/delete_festival_category", {
		festivalCategoryId,
	});
};

export const updateCategoryOrder = async (festivalCategories) => {
	return perform("festival/update_festival_category_order", {
		festivalCategories,
	});
};

export const submissionCategories = async ({filmId, festivalId}) => {
	return perform("festival/festival_submission_categories", {
		filmId, festivalId,
	});
};

export const requestNameChange = async ({ festivalName, festivalId }) => {
	return perform("festival/create_update_request", {
		value: festivalName,		
		type: REQUEST_NAME_CHANGE,
		festivalId,
	});
}


