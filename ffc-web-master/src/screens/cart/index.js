import React, { Component } from "react";
import { View, Pressable, StyleSheet, Text, Image } from "react-native";
import {
	PayPalScriptProvider,
	PayPalButtons,
	FUNDING,
} from "@paypal/react-paypal-js";
import Preloader from "components/preloader/basic";
import BaseHeader from "components/header/base";
import SimpleRadio from "components/radio/simple";
import Footer1 from "components/footer/footer1";
import Button from "components/button";
import Loading from "components/modal/loading";
import { Scrollbars } from "react-custom-scrollbars";
import CartItem from "./cartItem";
import colors from "themes/colors";
import helper from "utils/helper";
import reactRazorpay from "utils/razorpay";
import Backend from "backend";
import {
	CONTENT_HEIGHT2,
	BORDER_RADIUS,
	FULLBAR_WIDTH,
	ERROR_TEXT,
	paypalOptions,
} from "utils/constants";

// Third Party Components
import toast from "react-hot-toast";

const contentWidth = FULLBAR_WIDTH * 0.75;
const marginHorizontal = FULLBAR_WIDTH * 0.125;
const contentWidth2 = FULLBAR_WIDTH * 0.7;
const boxWidth = contentWidth2 / 2 - 10;
const boxContentWidth = boxWidth - 20;

export default class Cart extends Component {
	constructor(props) {
		super(props);
		this.state = {
			paymentMethods: [],
			paymentSummary: [],
			totalItems: 0,
			cartItems: [],
			currency: {},
			termDescription: "",
			currentPaymentOption: 0,
			loading: false,
			error: false,
			cartOrder: false,
			busy: false,
			paypalButton: false,
		};
	}

	componentDidMount() {
		this.loadCart();
	}

	loadCart = async () => {
		try {
			this.setState({
				loading: true,
				error: false,
				cartItems: [],
				cartOrder: false,
			});
			const response = await Backend.Cart.summary();
			if (response.success) {
				const {
					festivalCartItems,
					termDescription,
					totalItems,
					methods,
					currency,
					subTotal,
				} = response.data;
				const paymentMethods = helper.createPaymentMethods(methods);
				const paymentSummary = helper.createPaymentSummary({
					total: subTotal,
					currency: currency.symbol,
				});
				this.setState({
					cartItems: festivalCartItems,
					termDescription,
					totalItems,
					paymentMethods,
					currency: currency,
					paymentSummary,
					totalPayableAmount: subTotal,
				}, () => {
					this.setPayment(paymentMethods[0], 0);
				});
			} else {
				throw new Error(response.message || ERROR_TEXT);
			}
		} catch (err) {
			this.setState({
				error: true,
			});
		} finally {
			this.setState({
				loading: false,
			});
		}
	};

	setPayment = (option, index) => {
		let paypalButton = false;
		if (option.paypal) {
			paypalButton = {
				fundingSource: FUNDING.PAYPAL,
				color: "blue"
			};
		}
		this.setState({ currentPaymentOption: index, paypalButton });
	};

	createOrderId = async () => {
		const { cartOrder } = this.state;
		if (cartOrder) {
			return cartOrder;
		}
		const response = await Backend.Payment.createCartOrder();
		if (response.success) {
			this.setState({
				cartOrder: response.data,
			});
			return response.data;
		}
		throw new Error(response.message || ERROR_TEXT);
	};

	getPaypalOrderId = async () => {
		const data = await this.createOrderId();
		if (data) {
			return data.gatewayOrderId;
		}
		toast.error("Please try again!");
		return false;
	};

	processPayment = async () => {
		try {
			this.setState({ busy: true });
			const { currentPaymentOption, paymentMethods } = this.state;
			const currentPaymentMethod = paymentMethods[currentPaymentOption];
			const { razorpay, paypal } = currentPaymentMethod;
			const orderData = await this.createOrderId();
			if (razorpay) {
				reactRazorpay.open(orderData, this.paymentCallbackHandler);
			} else if (paypal) {
			} else {
				// TODO: Ignore now
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			this.setState({ busy: false });
		}
	};

	paymentCallbackHandler = () => {
		alert("Payment Successfull");
	};

	paypalPaymentCallback = async (data, actions) => {
		try {
			const { cartOrder } = this.state;
			const response = await Backend.Payment.capturePaypalPayment({
				gatewayOrderId: data.orderID,
				orderId: cartOrder.orderId
			});
			if (response.success) {
				if (response.data.restart) {
					actions.restart();
				} else {
					alert("Payment Successfull");
				}
			} else {
				throw new Error(response.message || ERROR_TEXT);
			}
		} catch (err) {
			toast.error(err.message);
		}
	};

	explore = () => {};

	removeCartItem = () => {};

	renderPayments = (option, index) => {
		const { currentPaymentOption } = this.state;
		const selected = currentPaymentOption === index;
		return (
			<Pressable
				onPress={() => this.setPayment(option, index)}
				style={style.paymentOption}
				key={option.id}
			>
				<SimpleRadio onChange={() => this.setPayment(option, index)} selected={selected} />
				{option.image ? (
					<Image
						source={{ uri: option.image }}
						style={style.optionImg}
					/>
				) : null}
				<Text style={style.optionText}>{option.name}</Text>
			</Pressable>
		);
	};

	renderSummary = (row) => (
		<View style={style.summaryRow} key={row.key}>
			<Text style={style.summaryKey}>{row.key}</Text>
			<Text
				style={[
					style.summaryValue,
					{
						color: row.isFree ? colors.greenDark : colors.textBlack,
					},
				]}
			>
				{row.value}
			</Text>
		</View>
	);

	renderCartItems = (data) => (
		<CartItem
			data={data}
			currency={this.state.currency.symbol}
			onRemove={this.removeCartItem}
		/>
	);

	render() {
		const {
			paypalButton,
			paymentMethods,
			paymentSummary,
			termDescription,
			cartItems,
			totalItems,
			loading,
			error,
			busy,
		} = this.state;
		const itemCount = `${totalItems} Item${totalItems > 1 ? "s" : ""}`;
		return (
			<>
				<View>
					<BaseHeader title="Cart Summary" desc={itemCount} />
					<Scrollbars style={style.main} autoHide>
						<View style={style.cover}>
							<View style={style.content}>
								<Preloader
									onRetry={this.loadCart}
									hasError={error}
									isBusy={loading}
									isEmpty={cartItems.length === 0}
									emptyIcon="shopping-bag"
									emptyText="Your cart is currently empty"
									emptyButtonText="Explore"
									onEmptyPress={this.explore}
								>
									{cartItems.map(this.renderCartItems)}
									<View style={style.row}>
										<View style={style.box}>
											<View style={style.boxHeader}>
												<Text style={style.boxTitle}>
													Payment Method
												</Text>
											</View>

											<View style={style.boxContent}>
												{paymentMethods.map(
													this.renderPayments
												)}
											</View>
										</View>

										<View style={style.box}>
											<View style={style.boxHeader}>
												<Text style={style.boxTitle}>
													Payment Summary
												</Text>
											</View>

											<View style={style.boxContent}>
												{paymentSummary.map(
													this.renderSummary
												)}
											</View>
										</View>
									</View>

									<Text style={style.termDesc}>
										{termDescription}
									</Text>

									{paypalButton ? (
										<PayPalScriptProvider
											options={paypalOptions}
										>
											<View style={style.payButton}>
												<PayPalButtons
													fundingSource={
														paypalButton.fundingSource
													}
													style={{
														layout: "vertical",
														shape: "rect",
														color: paypalButton.color,
													}}
													createOrder={
														this.getPaypalOrderId
													}
													onApprove={
														this
															.paypalPaymentCallback
													}
												/>
											</View>
										</PayPalScriptProvider>
									) : (
										<Button
											text="Pay & Complete Order"
											type={Button.SUCCESS}
											style={style.payButton}
											textStyle={style.payText}
											onPress={this.processPayment}
										/>
									)}

									<View style={style.footer}>
										<Footer1 />
									</View>
								</Preloader>
							</View>
						</View>
					</Scrollbars>
				</View>
				<Loading busy={busy} />
			</>
		);
	}
}

const style = StyleSheet.create({
	main: {
		width: FULLBAR_WIDTH,
		height: CONTENT_HEIGHT2,
		backgroundColor: colors.vectorBase,
	},
	cover: {
		width: contentWidth,
		backgroundColor: colors.popupBg,
		marginLeft: marginHorizontal,
		alignItems: "center",
	},
	content: {
		width: contentWidth2,
		minHeight: CONTENT_HEIGHT2,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	box: {
		width: boxWidth,
		borderWidth: 1,
		borderRadius: BORDER_RADIUS,
		borderColor: colors.borderColor,
		marginTop: 30,
	},
	boxHeader: {
		height: 50,
		paddingLeft: 10,
		justifyContent: "center",
		width: boxWidth,
		borderBottomWidth: 1,
		borderColor: colors.borderColor,
	},
	boxTitle: {
		fontSize: 16,
		color: colors.textBlack,
		fontWeight: "bold",
	},
	boxContent: {
		width: boxContentWidth,
		alignSelf: "center",
	},
	paymentOption: {
		flexDirection: "row",
		alignItems: "center",
		width: boxContentWidth,
		height: 40,
	},
	optionImg: {
		marginLeft: 20,
		height: 26,
		width: 26,
	},
	optionText: {
		fontSize: 15,
		color: colors.textBlack,
		fontWeight: "500",
		paddingLeft: 20,
	},
	summaryRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: boxContentWidth,
		height: 40,
		alignItems: "center",
	},
	summaryKey: {
		fontSize: 15,
		color: colors.holderColor,
		fontWeight: "400",
	},
	summaryValue: {
		fontSize: 15,
		color: colors.textBlack,
		fontWeight: "600",
	},
	termDesc: {
		fontSize: 14,
		marginTop: 30,
		color: colors.holderColor,
	},
	payButton: {
		height: 46,
		width: boxWidth,
		marginTop: 30,
	},
	payText: {
		fontSize: 16,
		fontWeight: "400",
	},
	footer: {
		paddingTop: 30,
		borderTopWidth: 1,
		borderColor: colors.borderColor,
		marginVertical: 30,
		width: boxWidth,
		alignSelf: "center",
	},
});