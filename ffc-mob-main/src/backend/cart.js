import { perform } from './request';

export const addFilmToCart = ({ filmId, festivalCategoryFeeId }) => {
	return perform('cart/add_film_to_cart', {
		filmId,
		festivalCategoryFeeId,
	});
};

export const removeItemFromCart = ({ cartId }) => {
	return perform('cart/remove_item_from_cart', {
		cartId,
	});
};

export const addFilmToCartMulti = ({
	filmId,
	festivalCategoryFeeIds,
	includeGoldMembership = false,
}) => {
	return perform('cart/add_film_to_cart_multi', {
		filmId,
		festivalCategoryFeeIds,
		includeGoldMembership,
	});
};

export const summary = () => {
	return perform('cart/generate_cart_summary', {});
};

export const addMembershipToCart = ({ productId }) => {
	return perform('cart/add_membership_to_cart', {
		productId,
	});
};
