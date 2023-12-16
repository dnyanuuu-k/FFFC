import { perform } from "./request";

export const create = async ({ email, phoneNo, password }) => {
	return perform('account/create', {		
		phoneNo,
		password,
		email
	}, false);
};

export const profileBasicData = async ({ profileId }) => {
	return perform('account/basic_profile_data', {		
		profileId
	});
};

export const login = async ({ email, password }) => {
	return perform('account/login', {
		password,
		email	
	}, false);
};

export const sendOTP = async ({ email, password }) => {
	return perform('account/send_otp', {
		email
	}, false);
};

export const verifyOTP = async ({ email, password }) => {
	return perform('account/verify_otp', {
		email
	}, false);
};

export const resetPassword = async ({ email, password }) => {
	return perform('account/reset_password', {
		email
	});
};

export const updatePassword = async ({ email, password }) => {
	return perform('account/update_password', {
		email
	});
};

export const refreshToken = async ({ email, password }) => {
	return perform('account/refresh_token', {
		email
	});
};

export const getWorkTypes = async () => {
	return perform('account/get_work_types', {});
};

export const updateWorkType = async (workType) => {
	return perform('account/update_work_type', {
		workType
	});
};
