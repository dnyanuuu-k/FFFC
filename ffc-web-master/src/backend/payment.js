import { perform } from "./request";

export const createCartOrder = () => {
	return perform("payment/create_cart_order", {});
};

export const capturePaypalPayment = ({ gatewayOrderId, orderId }) => {
	return perform("payment/capture_paypal_payment", {
		gatewayOrderId,
		orderId
	});
};