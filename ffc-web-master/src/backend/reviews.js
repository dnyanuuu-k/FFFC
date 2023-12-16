import { perform } from "./request";

export const createFestivalReview = ({
	id,
	festivalId,
	review,
	overallRating,
	categoryRatings,
}) => {
	return perform("reviews/create_festival_review", {
		id,
		festivalId,
		review,
		overallRating,
		categoryRatings,
	});
};

export const festivalReviews = ({ festivalId, limit, offset }) => {
	return perform("reviews/festival_reviews", {
		includeAvgRatings: offset === 0,
		limit,
		offset,
		festivalId
	});
};

export const updateFestivalReviewReply = ({ festivalReviewId, festivalOrganizerReply }) => {
	return perform("reviews/update_festival_review_reply", {
		festivalReviewId,
		festivalOrganizerReply
	});
};

export const deleteFestivalReview = (festivalReviewId) => {
	return perform("reviews/delete_festival_review", {
		festivalReviewId
	});
};

export const reivewSubmissionData = ({festivalReviewId, festivalId}) => {
	return perform("reviews/festival_review_submission_data", {
		festivalReviewId,
		festivalId
	});
}