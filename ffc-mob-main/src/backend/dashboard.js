import { perform } from './request';

export const salesSummary = ({ festivalDateId }) => {
	return perform('dashboard/festival/sales_summary', {
		festivalDateId,
		numberLocale: true,
	});
};

export const paymentSummary = ({ festivalDateId }) => {
	return perform('dashboard/festival/payment_summary', {
		festivalDateId,
	});
};

export const submissionSummary = ({ festivalDateId }) => {
	return perform('dashboard/festival/submission_summary', {
		festivalDateId
	});
};

export const filterPayments = ({ festivalId, festivalCategoryId }) => {
	return perform('dashboard/festival/filter_payments', {
		festivalId,
		festivalCategoryId,
	});
};

export const filterPayouts = ({ festivalId, festivalCategoryId }) => {
	return perform('dashboard/festival/filter_payouts', {
		festivalId,
		festivalCategoryId,
	});
};

export const filterSubmissions = ({ festivalId, festivalCategoryId }) => {
	return perform('dashboard/festival/filter_submissions', {
		festivalId,
		festivalCategoryId,
	});
};

export const filterSubmissionGroup = ({ festivalId, festivalCategoryId }) => {
	return perform('dashboard/festival/filter_submission_group', {
		festivalId,
		festivalCategoryId,
	});
};