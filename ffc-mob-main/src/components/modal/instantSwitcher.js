// Switch User Work Type Instantly //
import React, { useMemo, useState, useEffect } from 'react';
import {
	View,
	ActivityIndicator,
	Text,
	StyleSheet,
	Pressable,
	Modal,
} from 'react-native';

// Custom Components
import Animated, {
	useSharedValue,
	Easing,
	withTiming,
	FadeIn,
	FadeOut,
} from 'react-native-reanimated';

// Hooks
import {
	useTheme,
	useNavigation,
	CommonActions,
} from '@react-navigation/native';

// Constants
import { fonts, weights } from 'themes/topography';
import {
	WORK_TYPE_MANAGE_FESTIVAL,
	WORK_TYPE_LIST,
	WORK_TYPE_SUBMIT_WORK,
	ERROR_TEXT,
} from 'utils/constants';

// Functions
import Backend from 'backend';
import toast from 'libs/toast';
import Tinode from 'libs/tinode';

const PressableAnimated = Animated.createAnimatedComponent(Pressable);
const MODAL_WIDTH = 300;
const MODAL_HEIGHT = 255;
const COMPACT_HEIGHT = 70;
const DEFAULT_STATE = 0.8;
const InstantSwitcher = ({
	onClose,
	visible = false,
	currentWorkType,
	onSuccess,
}) => {
	const { colors } = useTheme();
	const navigation = useNavigation();
	const [isSwitching, setIsSwitching] = useState(false);
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					backgroundColor: colors.bgTrans69,
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
					outline: 'none',
				},
				content: {
					width: MODAL_WIDTH,
					backgroundColor: colors.card,
					borderRadius: 10,
					overflow: 'hidden',
				},
				header: {
					height: 45,
					borderBottomWidth: 1,
					borderColor: colors.border,
					paddingLeft: 10,
					justifyContent: 'center',
				},
				body: {
					paddingHorizontal: 10,
					paddingVertical: 20,
					height: 120,
				},
				title: {
					fontSize: fonts.regular,
					color: colors.text,
					fontWeight: weights.semibold,
				},
				bodyText: {
					color: colors.holderColor,
					fontSize: fonts.small,
				},
				strong: {
					color: colors.text,
				},
				greenTxt: {
					color: colors.greenDark,
				},
				marginTF: {
					marginTop: 10,
				},
				button: {
					height: 45,
					borderTopWidth: 1,
					borderColor: colors.border,
					alignItems: 'center',
					justifyContent: 'center',
				},
				changeTxt: {
					color: colors.primary,
					fontSize: fonts.small,
				},
				cancelTxt: {
					color: colors.rubyRed,
					fontSize: fonts.small,
				},
				switchContent: {
					width: MODAL_WIDTH,
					height: COMPACT_HEIGHT,
					position: 'absolute',
					alignItems: 'center',
					justifyContent: 'space-between',
					flexDirection: 'row',
					paddingHorizontal: 20,
					backgroundColor: colors.card,
				},
				switchText: {
					fontSize: fonts.small,
					color: colors.holderColor,
				},
				switchStrong: {
					fontSize: fonts.title,
					color: colors.text,
					fontWeight: weights.semibold,
				},
			}),
		[colors]
	);
	const scaleAnim = useSharedValue(DEFAULT_STATE);
	const heightAnim = useSharedValue(MODAL_HEIGHT);
	const workContent = useMemo(() => {
		// eslint-disable-next-line eqeqeq
		const isFest = currentWorkType == WORK_TYPE_MANAGE_FESTIVAL;
		const newWorkType = isFest
			? WORK_TYPE_SUBMIT_WORK
			: WORK_TYPE_MANAGE_FESTIVAL;
		const currentWorkName = isFest
			? WORK_TYPE_LIST[1].title
			: WORK_TYPE_LIST[0].title;
		const newWorkName = isFest
			? WORK_TYPE_LIST[0].title
			: WORK_TYPE_LIST[1].title;
		const newWorkContent = isFest
			? 'if you want to submit films change your profile to '
			: 'if you want to manage festival change your profile to ';

		return {
			currentWorkName,
			newWorkName,
			newWorkType,
			newWorkContent: newWorkContent + newWorkName.toLowerCase() + ', ',
		};
	}, [currentWorkType]);

	useEffect(() => {
		scaleAnim.value = DEFAULT_STATE;
		heightAnim.value = MODAL_HEIGHT;
		setIsSwitching(false);
		if (visible) {
			scaleAnim.value = withTiming(1, {
				duration: 150,
				easing: Easing.inOut(Easing.quad),
			});
		}
	}, [visible]);

	const normalize = () => {
		setIsSwitching(false);
		heightAnim.value = withTiming(MODAL_HEIGHT, {
			duration: 500,
			easing: Easing.inOut(Easing.quad),
		});
	};

	const setCompactView = () => {
		heightAnim.value = withTiming(COMPACT_HEIGHT, {
			duration: 500,
			easing: Easing.inOut(Easing.quad),
		});
		setIsSwitching(true);
	};

	const handleClose = () => {
		if (typeof onClose === 'function') {
			onClose();
		}
	};

	const resetPage = (page) => {
		navigation.dispatch(
			CommonActions.reset({
				index: 0,
				routes: [{ name: page }],
			})
		);
	};

	const switchWorkType = async () => {
		setCompactView();
		try {
			const response = await Backend.Account.updateWorkType(
				workContent.newWorkType
			);
			if (response.success) {
				const { tinodeData } = response.data || {};
				Tinode.clearCurrent();
				if (!tinodeData) {
					if (workContent.newWorkType === WORK_TYPE_MANAGE_FESTIVAL) {
						resetPage('HomeOrganizer');
					} else {
						resetPage('HomeFilmMaker');
					}
					return;
				}
				setTimeout(() => {
					// Commenting this as it will done on home screen
					// Tinode.initClient(tinodeData.u, tinodeData.p);
					if (onSuccess) {
						onSuccess();
					} else {
						onClose();
					}
				}, 700);
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (tryErr) {
			normalize();
			toast.error(tryErr.message);
		}
	};

	return (
		<Modal
			transparent
			visible={visible}
			animationType="fade"
			onRequestClose={handleClose}
		>
			<Pressable onPress={handleClose} style={style.main}>
				<PressableAnimated
					style={[
						style.content,
						{ height: heightAnim, transform: [{ scale: scaleAnim }] },
					]}
				>
					<View style={style.header}>
						<Text style={style.title}>Switch work type</Text>
					</View>

					<View style={style.body}>
						<Text style={style.bodyText}>
							<Text style={style.strong}>{workContent.currentWorkName}</Text> is
							your current work type
						</Text>

						<Text style={[style.bodyText, style.marginTF]}>
							{workContent.newWorkContent}
							<Text style={style.greenTxt}>you can switch back any time</Text>.
						</Text>
					</View>

					<Pressable
						android_ripple={{ color: colors.primaryLight }}
						style={style.button}
						onPress={switchWorkType}
					>
						<Text style={style.changeTxt}>
							Switch to {workContent.newWorkName}
						</Text>
					</Pressable>
					<Pressable
						android_ripple={{ color: colors.rubyRedLight }}
						onPress={handleClose}
						style={style.button}
					>
						<Text style={style.cancelTxt}>Cancel</Text>
					</Pressable>

					{isSwitching ? (
						<Animated.View
							exiting={FadeOut}
							entering={FadeIn}
							style={style.switchContent}
						>
							<Text style={style.switchText}>
								Switching to{'\n'}
								<Text style={style.switchStrong}>
									{workContent.newWorkName}
								</Text>
							</Text>
							<ActivityIndicator color={colors.primary} size={24} />
						</Animated.View>
					) : null}
				</PressableAnimated>
			</Pressable>
		</Modal>
	);
};

export default InstantSwitcher;
