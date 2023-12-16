import { perform } from "./request";

export const addFilmToCart = ({ filmId, festivalCategoryFeeId }) => {
	return perform("cart/add_film_to_cart", {
		filmId,
		festivalCategoryFeeId
	});
};

export const addFilmToCartMulti = ({ filmId, festivalCategoryFeeIds }) => {
	return perform("cart/add_film_to_cart_multi", {
		filmId,
		festivalCategoryFeeIds
	});
};

export const summary = () => {
	return perform("cart/generate_cart_summary", {});
};