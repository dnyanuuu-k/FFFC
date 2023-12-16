import React, { useEffect } from 'react';
import {
	Modal,
	Image as NativeImage,
	Pressable,
	Text,
	View,
	TouchableOpacity,
} from 'react-native';
import Image from '../image';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme, useNavigation } from '@react-navigation/native';
import { W90, BORDER_RADIUS, COVER_ASPECT_RATIO } from 'utils/constants';
import { fonts, weights } from 'themes/topography';
import toast from 'libs/toast';

const msgIcon = require('assets/icons/messageOutline.png');
const coverImageHeight = W90 * COVER_ASPECT_RATIO;
const AnimatedView = Animated.createAnimatedComponent(TouchableOpacity);
const UserModal = ({ onClose, visible, data }) => {
	const { colors } = useTheme();
	const navigation = useNavigation();
	const style = {
		main: {
			backgroundColor: colors.bgTrans,
			flex: 1,
			alignItems: 'center',
			justifyContent: 'center',
			outline: 'none',
		},
		content: {
			borderRadius: BORDER_RADIUS,
			backgroundColor: colors.card,
			overflow: 'hidden',
			width: W90,
		},
		coverImage: {
			height: coverImageHeight,
			width: W90,
			backgroundColor: colors.background,
		},
		logoHolder: {
			width: 100,
			height: 100,
			top: 70,
			position: 'absolute',
			alignSelf: 'center',
			overflow: 'hidden',
			borderWidth: 5,
			borderColor: colors.card,
			borderRadius: 100,
			zIndex: 12,
			backgroundColor: colors.background,
		},
		logoImage: {
			width: 100,
			height: 100,
		},
		title: {
			fontSize: fonts.large,
			fontWeight: weights.bold,
			color: colors.text,
			marginTop: 10,
			textAlign: 'center',
			width: W90,
		},
		desig: {
			fontSize: fonts.regular,
			color: colors.holderColor,
			marginTop: 5,
			textAlign: 'center',
			width: W90,
		},
		headerContent: {
			paddingTop: 50,
			backgroundColor: colors.card,
			alignItems: 'center',
		},
		dataRow: {
			marginTop: 20,
			flexDirection: 'row',
			paddingHorizontal: 10,
			alignItems: 'center',
		},
		dataVal: {
			fontSize: fonts.small,
			color: colors.holderColor,
			marginLeft: 10,
		},
		msgBtn: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: colors.primary,
			borderRadius: BORDER_RADIUS,
			marginTop: 20,
			marginBottom: 10,
			height: 35,
			width: '95%',
			alignSelf: 'center',
		},
		msgIcon: {
			height: 18,
			width: 18,
			tintColor: colors.buttonTxt,
		},
		msgText: {
			marginLeft: 10,
			fontWeight: weights.semibold,
			color: colors.buttonTxt,
			fontSize: fonts.small,
		},
	};

	const animation = useSharedValue(100);

	const animate = (toValue) => {
		animation.value = withTiming(toValue);
	};

	const close = () => {
		if (typeof onClose === 'function') {
			onClose();
		}
		animation.value = 100;
	};

	const startMessage = () => {
		if (!data?.submitterTinode) {
			toast.notify('Submitter is not accepting direct message, prefer calling')
			return;
		} else {
			navigation.navigate('ChatScreen', {
				topic: data.submitterTinode.i,
			});
			onClose();
		}
	};

	useEffect(() => {
		if (visible) {
			animate(0);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [visible]);

	return (
		<Modal
			visible={visible}
			onRequestClose={close}
			animationType="fade"
			transparent
			statusBarTranslucent
		>
			<TouchableOpacity onPress={close} activeOpacity={1} style={style.main}>
				<AnimatedView
					activeOpacity={1}
					style={[style.content, { transform: [{ translateY: animation }] }]}
				>
					<Image
						style={style.coverImage}
						url={data.userCoverUrl}
						hash={data.userCoverHash}
					/>
					<View style={style.logoHolder}>
						<Image
							style={style.logoImage}
							url={data.userAvatarUrl}
							hash={data.userAvatarHash}
						/>
					</View>
					<View style={style.headerContent}>
						<Text style={style.title}>
							{data.firstName || ''} {data.lastName || ''}
						</Text>
						<Text style={style.desig}>FilmMaker</Text>
					</View>

					{data.submitterContact ? (
						<View style={style.dataRow}>
							<FeatherIcon size={15} color={colors.holderColor} name="phone" />
							<Text numberOfLines={1} style={style.dataVal}>
								{data.submitterContact}
							</Text>
						</View>
					) : null}

					{data.countryOfOrigin ? (
						<View style={style.dataRow}>
							<FeatherIcon size={15} color={colors.holderColor} name="globe" />
							<Text numberOfLines={1} style={style.dataVal}>
								{data.countryOfOrigin}
							</Text>
						</View>
					) : null}

					{data.submitterAddress || data.submitterState ? (
						<View style={style.dataRow}>
							<FeatherIcon
								size={15}
								color={colors.holderColor}
								name="map-pin"
							/>
							<Text numberOfLines={1} style={style.dataVal}>
								{data.submitterAddress || data.submitterState}
							</Text>
						</View>
					) : null}

					<Pressable onPress={startMessage} style={style.msgBtn}>
						<NativeImage source={msgIcon} style={style.msgIcon} />
						<Text style={style.msgText}>Direct Message</Text>
					</Pressable>
				</AnimatedView>
			</TouchableOpacity>
		</Modal>
	);
};

export default UserModal;
