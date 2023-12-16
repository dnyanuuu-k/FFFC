import { perform } from './request';

export const updateInvitation = ({ festivalJudgeId, accepted }) => {
	return perform('judge/accept_invitation', {
		festivalJudgeId,
		accepted,
	});
};