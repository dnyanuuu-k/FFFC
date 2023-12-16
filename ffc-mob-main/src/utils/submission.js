import {
	// Submission Related Start
	SUBMISSION_IN_CONSIDERATION,
	SUBMISSION_INCOMPLETE,
	SUBMISSION_DISQUALIFIED,
	SUBMISSION_WITHDRAWN,
	// Submission Related End

	// Not Selected
	JUDGE_UNDECIDED,
	JUDGE_NOT_SELECTED,
	// Selected
	JUDGE_SELECTED,
	JUDGE_AWARD_WINNER,
	JUDGE_FINALIST,
	JUDGE_SEMI_FINALIST,
	JUDGE_QUATER_FINALIST,
	JUDGE_NOMINEE,
	JUDGE_HONARABLE_MENTION,
} from './constants';

export const SUBMISSION_STATUS_LIST = [
	{
		label: 'In Consideration',
		value: SUBMISSION_IN_CONSIDERATION,
		color: '#2db483',
		lightColor: '#bce4d3',
	},
	{
		label: 'Incomplete',
		value: SUBMISSION_INCOMPLETE,
		color: '#c4ae31',
		lightColor: '#e9e2ba',
	},
	{
		label: 'Disqualified',
		value: SUBMISSION_DISQUALIFIED,
		color: '#c43630',
		lightColor: '#ecb9b6',
	},
	{
		label: 'Withdrawn',
		value: SUBMISSION_WITHDRAWN,
		color: '#607d8b',
		lightColor: '#c6d0d6',
	},
];

export const JUDGE_STATUS_LIST = [
	{
		label: 'Undecided',
		value: JUDGE_UNDECIDED,
	},
	{
		label: 'Selected',
		value: JUDGE_SELECTED,
	},
	{
		label: 'Not Selected',
		value: JUDGE_NOT_SELECTED,
	},
	{
		label: 'Award Winner',
		value: JUDGE_AWARD_WINNER,
	},
	{
		label: 'Finalist',
		value: JUDGE_FINALIST,
	},
	{
		label: 'Semi - Finalist',
		value: JUDGE_SEMI_FINALIST,
	},
	{
		label: 'Quarter - Finalist',
		value: JUDGE_QUATER_FINALIST,
	},
	{
		label: 'Nominee',
		value: JUDGE_NOMINEE,
	},
	{
		label: 'Honorable Mention',
		value: JUDGE_HONARABLE_MENTION,
	},
];
