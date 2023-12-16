import { perform, multipartUpload } from './request';

export const create = async ({ email, countryCode, phoneNo, password }) => {
	return perform(
		'account/create',
		{
			phoneNo,
			password,
			email,
			countryCode,
		},
		false
	);
};

export const profileBasicData = async ({ profileId }) => {
	return perform('account/basic_profile_data', {
		profileId,
	});
};

export const login = async ({ email, password }) => {
	return perform(
		'account/login',
		{
			password,
			email,
		},
		false
	);
};

export const sendOTP = async ({ email, password }) => {
	return perform(
		'account/send_otp',
		{
			email,
		},
		false
	);
};

export const verifyOTP = async ({ email, password }) => {
	return perform(
		'account/verify_otp',
		{
			email,
		},
		false
	);
};

export const resetPassword = async ({ email, password }) => {
	return perform('account/reset_password', {
		email,
	});
};

export const updatePassword = async ({ email, password }) => {
	return perform('account/update_password', {
		email,
	});
};

export const refreshToken = async ({ email, password }) => {
	return perform('account/refresh_token', {
		email,
	});
};

export const getWorkTypes = async () => {
	return perform('account/get_work_types', {});
};

export const updateWorkType = async (workType) => {
	return perform('account/update_work_type', {
		workType,
	});
};

export const initialSetupData = async () => {
	return perform('account/initial_setup_data', {});
};

export const updateSetupData = async ({ firstName, lastName, workType }) => {
	return perform('account/update_setup_data', {
		firstName,
		lastName,
		workType,
	});
};

export const getUserData = async () => {
	return perform('account/get_user_data', {});
};

export const updateUserData = async ({
	firstName,
	lastName,
	fbUrl,
	instaUrl,
	twitterUrl,
	linkedinUrl,
}) => {
	return perform('account/update_user_data', {
		firstName,
		lastName,
		fbUrl,
		instaUrl,
		twitterUrl,
		linkedinUrl,
	});
};

export const uploadUserCover = async (file) => {
	return multipartUpload('account/upload_user_cover', {}, file);
};

export const uploadUserAvatar = async (file) => {
	return multipartUpload('account/upload_user_avatar', {}, file);
};