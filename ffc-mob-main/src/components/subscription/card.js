import React, { useState, useMemo } from 'react';
import {
	View,
	Text,
	Modal,
	StyleSheet,
	ImageBackground,
	Pressable,
	Image,
} from 'react-native';

// Third-Party Components
import { LinearGradient } from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';

// Assets
import goldAnim from 'assets/anims/goldAnim.json';

// Constants
import { colors } from './sharedTheme';
import { fonts, weights } from 'themes/topography';
import Animated, { FlipInXDown, ZoomIn } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const titleText = 'FILMFESTBOOK GOLD';
const patternURL =
	'https://b.zmtcdn.com/data/o2_assets/3e101ba1df3e50c47dec2b4c6355814d1692773881.png';
const GoldMembershipCard = ({
	width = 300,
	currency,
	saving,
	productList = [],
	featureList = [],
	onSubscribe,
}) => {
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					backgroundColor: colors.background,
					borderRadius: 10,
					padding: 14,
					width: width,
					marginTop: 25,
				},
				title: {
					fontSize: fonts.regular,
					fontWeight: weights.bold,
					color: colors.text,
				},
				subTitle: {
					marginTop: 3,
					fontSize: fonts.small,
					color: colors.textGrey,
				},
				button: {
					width: '100%',
					height: 35,
					justifyContent: 'center',
					alignItems: 'center',
					marginTop: 10,
					borderRadius: 5,
				},
				strong: {
					color: colors.text,
				},
				buttonTxt: {
					fontSize: fonts.small,
					fontWeight: weights.bold,
					color: colors.background,
				},
				modalMain: {
					backgroundColor: '#00000064',
					height: '100%',
					width: '100%',
				},
				contentUp: {
					justifyContent: 'flex-end',
					height: '100%',
					width: '100%',
				},
				modalContent: {
					borderTopLeftRadius: 10,
					borderTopRightRadius: 10,
					backgroundColor: colors.background,
				},
				headerContent: {
					height: 190,
					justifyContent: 'center',
					alignItems: 'center',
				},
				desc: {
					fontSize: fonts.small,
					marginTop: 3,
					textAlign: 'center',
					color: colors.text,
					width: '90%',
				},
				box: {
					backgroundColor: colors.card,
					borderRadius: 10,
					marginTop: 10,
					width: '90%',
					alignSelf: 'center',
				},
				goldAnim: {
					height: 120,
					width: 120,
				},
				feature: {
					flexDirection: 'row',
					alignItems: 'center',
					height: 70,
					paddingHorizontal: 10,
					borderColor: colors.border,
				},
				product: {
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					height: 70,
					borderColor: colors.border,
					paddingHorizontal: 10,
				},
				prdContent: {
					flexDirection: 'row',
					alignItems: 'center',
				},
				checkBox: {
					height: 23,
					width: 23,
					marginRight: 20,
					borderWidth: 1,
					borderColor: colors.border,
					justifyContent: 'center',
					alignItems: 'center',
					borderRadius: 60,
				},
				boxFilled: {
					height: 15,
					width: 15,
					borderRadius: 60,
					backgroundColor: colors.goldLight,
				},
				planName: {
					fontSize: fonts.regular,
					color: colors.text,
					fontWeight: weights.semibold,
				},
				planDesc: {
					fontSize: fonts.small,
					color: colors.textGrey,
				},
				iconBg: {
					width: 35,
					height: 35,
					borderRadius: 80,
					justifyContent: 'center',
					alignItems: 'center',
					marginRight: 10,
				},
				icon: {
					width: 20,
					height: 20,
					tintColor: colors.text,
				},
				button2: {
					height: 45,
					width: '90%',
					justifyContent: 'center',
					alignItems: 'center',
					marginTop: 20,
					marginBottom: 10,
					borderRadius: 10,
					alignSelf: 'center',
				},
				widthFix: { flex: 1 },
			}),
		[width]
	);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(
		productList?.length ? productList[0] : { id: null }
	);

	const viewModal = () => {
		setModalVisible(true);
	};

	const closeModal = () => {
		setModalVisible(false);
	};

	const renderProduct = (product, idx) => {
		const isSelected = selectedProduct.id === product.id;
		const borderBottomWidth = productList?.length - 1 === idx ? 0 : 1;
		const borderColor = isSelected ? colors.goldLight : colors.border;
		return (
			<Pressable
				onPress={() => setSelectedProduct(product)}
				style={[style.product, { borderBottomWidth }]}
				key={product.id}
			>
				<View style={style.prdContent}>
					<View style={[style.checkBox, { borderColor }]}>
						{isSelected ? (
							<Animated.View entering={ZoomIn} style={style.boxFilled} />
						) : null}
					</View>
					<View>
						<Text style={style.planName}>{product.planName}</Text>
						{product?.planDesc ? (
							<Text style={style.planDesc}>{product.planDesc}</Text>
						) : null}
					</View>
				</View>
				<Text style={style.planDesc}>{product.perMonthFee} / Month</Text>
			</Pressable>
		);
	};

	const renderFeature = (feature, idx) => {
		const borderBottomWidth = featureList?.length - 1 === idx ? 0 : 1;
		return (
			<View style={[style.feature, { borderBottomWidth }]} key={feature.id}>
				<View style={[style.iconBg, { backgroundColor: feature.iconBg }]}>
					<Image style={style.icon} source={{ uri: feature.icon }} />
				</View>
				<View style={style.widthFix}>
					<Text style={style.planName}>{feature.name}</Text>
					<Text style={style.planDesc}>{feature.desc}</Text>
				</View>
			</View>
		);
	};

	return (
		<>
			<Pressable onPress={viewModal}>
				<ImageBackground
					source={{
						uri: patternURL,
					}}
					style={style.main}
				>
					<Text style={style.title}>{titleText}</Text>
					<Text style={style.subTitle}>
						Save {currency}
						{saving} on this submission with our gold membership
					</Text>
					<LinearGradient
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 0 }}
						style={style.button}
						colors={[colors.goldDark, colors.goldLight]}
					>
						<Text style={style.buttonTxt}>Join Gold Now</Text>
					</LinearGradient>
				</ImageBackground>
			</Pressable>
			<Modal
				visible={modalVisible}
				onRequestClose={closeModal}
				transparent
				statusBarTranslucent
				animationType="fade"
			>
				<View style={style.modalMain}>
					<AnimatedPressable
						onPress={closeModal}
						entering={FlipInXDown}
						style={style.contentUp}
					>
						<Pressable style={style.modalContent}>
							<ImageBackground
								source={{ uri: patternURL }}
								style={style.headerContent}
							>
								<LottieView
									autoPlay
									loop
									source={goldAnim}
									style={style.goldAnim}
								/>
								<Text style={style.title}>{titleText}</Text>
								<Text style={style.desc}>
									Unlock amazing deals with our exclusive membership
								</Text>
							</ImageBackground>
							<View style={style.box}>{productList.map(renderProduct)}</View>
							<View style={style.box}>{featureList.map(renderFeature)}</View>
							<Pressable
								onPress={() => {
									onSubscribe(selectedProduct.id);
									closeModal();
								}}
							>
								<LinearGradient
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 0 }}
									style={style.button2}
									colors={[colors.goldDark, colors.goldLight]}
								>
									<Text style={style.buttonTxt}>
										Subscribe {selectedProduct.planName} Plan
									</Text>
								</LinearGradient>
							</Pressable>
						</Pressable>
					</AnimatedPressable>
				</View>
			</Modal>
		</>
	);
};

export default GoldMembershipCard;