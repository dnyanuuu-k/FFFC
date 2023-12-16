import { perform } from './request';

export const updateSubmissionStatus = ({
	submissionId,
	submissionStatusId,
}) => {
	return perform('submission/update_submission_status', {
		submissionId,
		submissionStatusId,
	});
};

export const updateSubmissionFlag = ({ submissionId, festivalFlagId }) => {
	return perform('submission/update_submission_flag', {
		submissionId,
		festivalFlagId,
	});
};

export const updateSubmissionJudgement = ({ submissionId, judgeStatusId }) => {
	return perform('submission/update_submission_judgement', {
		submissionId,
		judgeStatusId,
	});
};