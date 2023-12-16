import React, { useEffect, useMemo, useState } from 'react';
import {
	View,
	Pressable,
	StyleSheet,
	Text,
	Image,
	ScrollView,
	RefreshControl,
} from 'react-native';
import GoldMembershipCard from 'components/subscription/card';
import Preloader from 'components/preloader/basic';
import BaseHeader from 'components/header/basic';
import SimpleRadio from 'components/radio/simple';
import Button from 'components/button';
import Loading from 'components/modal/loading';
import CartItem from './cartItem';

// Functions
import helper from 'utils/helper';
import Razorpay from 'react-native-razorpay';
import Backend from 'backend';
import toast from 'libs/toast';
import Paypal from 'libs/paypal';
import { RNSelectionMenu } from 'libs/Menu';

// Hooks
import { useTheme, useNavigation } from '@react-navigation/native';

// Constants
import {
	BORDER_RADIUS,
	WINDOW_WIDTH,
	ERROR_TEXT,
	PAYPAL_CLIENT_ID,
	RAZORPAY_API_KEY,
} from 'utils/constants';

const contentWidth2 = WINDOW_WIDTH * 0.95;
const boxContentWidth = contentWidth2 - 20;

const Cart = () => {
	const { colors, dark } = useTheme();
	const navigation = useNavigation();
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					width: WINDOW_WIDTH,
					backgroundColor: colors.background,
				},
				cover: {
					width: contentWidth2,
					backgroundColor: colors.card,
					alignSelf: 'center',
					alignItems: 'center',
				},
				content: {
					width: boxContentWidth,
				},
				row: {
					flexDirection: 'row',
					justifyContent: 'space-between',
				},
				box: {
					width: boxContentWidth,
					borderWidth: 1,
					borderRadius: BORDER_RADIUS,
					borderColor: colors.border,
					marginTop: 30,
				},
				boxHeader: {
					height: 50,
					paddingLeft: 10,
					justifyContent: 'center',
					width: boxContentWidth,
					borderBottomWidth: 1,
					borderColor: colors.border,
				},
				boxTitle: {
					fontSize: 16,
					color: colors.text,
					fontWeight: 'bold',
				},
				boxContent: {
					width: boxContentWidth,
					alignSelf: 'center',
					paddingHorizontal: 10,
				},
				paymentOption: {
					flexDirection: 'row',
					alignItems: 'center',
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
					color: colors.text,
					fontWeight: '500',
					paddingLeft: 20,
				},
				summaryRow: {
					flexDirection: 'row',
					justifyContent: 'space-between',
					width: '100%',
					height: 40,
					alignItems: 'center',
				},
				summaryKey: {
					fontSize: 15,
					color: colors.holderColor,
					fontWeight: '400',
				},
				summaryValue: {
					fontSize: 15,
					color: colors.text,
					fontWeight: '600',
				},
				termDesc: {
					fontSize: 14,
					marginTop: 20,
					color: colors.holderColor,
				},
				payButton: {
					width: WINDOW_WIDTH,
					height: 50,
					backgroundColor: colors.greenDark,
					position: 'absolute',
					bottom: 0,
					justifyContent: 'center',
					alignItems: 'center',
					borderRadius: 0,
				},
				payText: {
					fontSize: 16,
					fontWeight: '400',
				},
				gapBottom: {
					height: 150,
				},
			}),
		[colors]
	);
	const [paymentMethods, setPaymentMethods] = useState([]);
	const [paymentSummary, setPaymentSummary] = useState([]);
	const [totalItems, setTotalItems] = useState(0);
	const [cartItems, setCartItems] = useState([]);
	const [currency, setCurrency] = useState({});
	const [goldMembership, setGoldMembership] = useState(false);
	const [termDescription, setTermDescription] = useState('');
	const [currentPaymentOption, setCurrentPaymentOption] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [cartOrder, setCartOrder] = useState(false);
	const [busy, setBusy] = useState(false);
	const itemCount = useMemo(() => {
		return `${totalItems} Item${totalItems > 1 ? 's' : ''}`;
	}, [totalItems]);

	const loadCart = async () => {
		try {
			setLoading(true);
			setError(false);
			setCartItems([]);
			setCartOrder(false);
			const response = await Backend.Cart.summary();
			if (response.success) {
				const data = response.data;
				const payMethods = helper.createPaymentMethods(data.methods);
				const summary = helper.createPaymentSummary({
					total: data.subTotal,
					currency: data.currency.symbol,
					goldSaving: data.goldSubscriptionSavings,
					alreadySubscribed: data.goldMembershipAdded,
				});
				setCartItems(data.cartItems);
				setTermDescription(data.termDescription);
				setTotalItems(data.totalItems);
				setPaymentMethods(payMethods);
				setCurrency(data.currency);
				setPaymentSummary(summary);
				// setTotalPayableAmount(subTotal);
				setGoldMembership({
					added: data.goldMembershipAdded,
					saving: data.goldSubscriptionSavings,
					...(data.membershipData || {})
				});
				setCurrentPaymentOption(0);
			} else {
				throw new Error(response.message || ERROR_TEXT);
			}
		} catch (err) {
			setError(true);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadCart();
	}, []);

	const createOrderId = async () => {
		if (cartOrder) {
			return cartOrder;
		}
		const response = await Backend.Payment.createCartOrder();
		if (response.success) {
			setCartOrder(response.data);
			return response.data;
		}
		throw new Error(response.message || ERROR_TEXT);
	};

	const processPayment = async () => {
		try {
			setBusy(true);
			const currentPaymentMethod = paymentMethods[currentPaymentOption];
			const { razorpay, paypal } = currentPaymentMethod;
			const orderData = await createOrderId();
			if (razorpay) {
				var options = {
					name: 'FilmFestBook',
					key: RAZORPAY_API_KEY,
					order_id: orderData.gatewayOrderId,
					prefill: {
						email: orderData.email,
						contact: orderData.phoneNo || '',
						name: orderData.name || '',
					},
				};
				Razorpay.open(options)
					.then((d) =>
						paymentCallbackHandler(orderData.orderId, d.razorpay_payment_id)
					)
					.catch((e) => {
						toast.error(e.message);
					});
			} else if (paypal) {
				Paypal.startWithOrderId({
					clientId: PAYPAL_CLIENT_ID,
					useSandbox: true, // you should use 'false' for live environment
					orderId: orderData.gatewayOrderId, //should be fetched from your backend
					returnUrl: 'com.ffcmob://paypalpay',
					cancelErrorCode: 'ON_CANCEL', //optional, default value - PAYPAL_CANCELLED
				})
					.then((approvalData) =>
						paypalPaymentCallback(approvalData, orderData.orderId)
					)
					.catch((e) => {
						toast.error(e.message);
					});
			} else {
				// TODO: Ignore now
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			setBusy(false);
		}
	};

	const paymentCallbackHandler = async (orderId, gatewayPaymentId) => {
		try {
			setBusy(true);
			const response = await Backend.Payment.captureRazorpayPayment({
				gatewayPaymentId,
				orderId,
			});
			if (!response?.success) {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (err) {
			// Ignore
		} finally {
			setBusy(false);
			successCallback();
		}
	};

	const paypalPaymentCallback = async (paypal, orderId) => {
		try {
			const response = await Backend.Payment.capturePaypalPayment({
				gatewayOrderId: paypal.orderId,
				orderId,
			});
			if (response.success) {
				if (response.data.restart) {
					loadCart();
				} else {
					successCallback();
				}
			} else {
				throw new Error(response.message || ERROR_TEXT);
			}
		} catch (err) {
			toast.error(err.message);
		}
	};

	const successCallback = () => {
		toast.success('Payment Successfull!');
		navigation.goBack();
	};

	const explore = () => {
		navigation.navigate('Festivals');
	};

	const askRemove = (cartItem) => {
		const values = [
			{
				value: 'Yes',
				type: 0,
			},
			{
				value: 'No',
				type: 0,
			},
		];
		RNSelectionMenu.Show({
			values: values,
			selectedValues: [''],
			selectionType: 0,
			presentationType: 1,
			theme: dark ? 1 : 0,
			title: 'Are you sure',
			subtitle: 'You want to delete ' + cartItem.title,
			onSelection: (value) => {
				const index = values.findIndex((v) => v.value === value);
				if (index === 0) {
					removeCartItem(cartItem.id);
				}
			},
		});
	};

	const addMembershipToCart = async (productId) => {
		try {
			setBusy(true);
			const response = await Backend.Cart.addMembershipToCart({ productId });
			if (response.success) {
				toast.success('Membership added to cart successfully!');
				loadCart();
			} else {
				throw new Error(response.message || ERROR_TEXT);
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			setBusy(false);
		}
	};

	const removeCartItem = async (cartId) => {
		try {
			setBusy(true);
			const response = await Backend.Cart.removeItemFromCart({ cartId });
			if (response.success) {
				toast.success('Removed successfully!');
				loadCart();
			} else {
				throw new Error(response.message || ERROR_TEXT);
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			setBusy(false);
		}
	};

	const renderPayments = (option, index) => {
		const selected = currentPaymentOption === index;
		return (
			<Pressable
				onPress={() => setCurrentPaymentOption(index)}
				style={style.paymentOption}
				key={option.id}
			>
				<SimpleRadio
					onChange={() => setCurrentPaymentOption(index)}
					selected={selected}
				/>
				{option.image ? (
					<Image source={{ uri: option.image }} style={style.optionImg} />
				) : null}
				<Text style={style.optionText}>{option.name}</Text>
			</Pressable>
		);
	};

	const renderSummary = (row) => (
		<View style={style.summaryRow} key={row.key}>
			<Text style={style.summaryKey}>{row.key}</Text>
			<Text
				style={[
					style.summaryValue,
					{
						color: row.isFree ? colors.greenDark : colors.text,
					},
				]}
			>
				{row.value}
			</Text>
		</View>
	);

	const renderCartItems = (data, index) => (
		<CartItem
			key={index}
			data={data}
			currency={currency.symbol}
			onRemove={askRemove}
		/>
	);

	return (
		<>
			<View>
				<BaseHeader title="Cart Summary" desc={itemCount} />
				<ScrollView
					refreshControl={
						<RefreshControl refreshing={false} onRefresh={loadCart} />
					}
					nestedScrollEnabled
					style={style.main}
				>
					<View style={style.cover}>
						<View style={style.content}>
							<Preloader
								onRetry={loadCart}
								hasError={error}
								isBusy={loading}
								isEmpty={cartItems.length === 0}
								emptyIcon="shopping-bag"
								emptyText="Your cart is currently empty"
								emptyButtonText="Explore"
								onEmptyPress={explore}
							>
								{cartItems.map(renderCartItems)}

								{goldMembership.added ? null : (
									<GoldMembershipCard
										width={boxContentWidth}
										currency={currency.symbol}
										productList={goldMembership.productList}
										featureList={goldMembership.featureList}
										saving={goldMembership.saving}
										onSubscribe={addMembershipToCart}
									/>
								)}

								<View style={style.box}>
									<View style={style.boxHeader}>
										<Text style={style.boxTitle}>Payment Method</Text>
									</View>

									<View style={style.boxContent}>
										{paymentMethods.map(renderPayments)}
									</View>
								</View>

								<View style={style.box}>
									<View style={style.boxHeader}>
										<Text style={style.boxTitle}>Payment Summary</Text>
									</View>

									<View style={style.boxContent}>
										{paymentSummary.map(renderSummary)}
									</View>
								</View>
								<Text style={style.termDesc}>{termDescription}</Text>
								<View style={style.gapBottom} />
							</Preloader>
						</View>
					</View>
				</ScrollView>
			</View>
			<Button
				text="Pay & Complete Order"
				type={Button.SUCCESS}
				style={style.payButton}
				textStyle={style.payText}
				onPress={processPayment}
			/>

			<Loading busy={busy} />
		</>
	);
};

export default Cart;
