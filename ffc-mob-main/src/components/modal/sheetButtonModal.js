import React, { useEffect, useState } from 'react';
import { Modal, Text, View, TouchableOpacity, Keyboard } from 'react-native';

// Custom Components
import {
	GestureHandlerRootView,
	ScrollView,
} from 'react-native-gesture-handler';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';

// Hooks
import { useTheme } from '@react-navigation/native';

// Constants
import {
	WINDOW_HEIGHT,
	W90,
	BORDER_RADIUS,
	BUTTON_HEIGHT,
	FORM_FONT_SIZE,
} from 'utils/constants';

const AnimatedView = Animated.createAnimatedComponent(TouchableOpacity);
const maxHeight = WINDOW_HEIGHT * 0.7;
const buttonWidth = W90 / 2;
const SheetButtonModal = ({
	children,
	onSubmit,
	onClose,
	title,
	width,
	minHeight,
	positiveText,
	visible = false,
	keyboardAware = true,
	customButtons,
}) => {
	const { colors } = useTheme();
	const style = {
		flex: {
			flex: 1,
		},
		main: {
			backgroundColor: colors.bgTrans,
			flex: 1,
			alignItems: 'center',
			justifyContent: 'center',
			outline: 'none',
		},
		content: {
			borderRadius: BORDER_RADIUS,
			backgroundColor: colors.background,
			overflow: 'hidden',
			width: W90,
		},
		title: {
			fontSize: 18,
			color: colors.text,
			fontWeight: 'bold',
		},
		header: {
			height: BUTTON_HEIGHT,
			borderBottomWidth: 1,
			paddingLeft: 10,
			borderColor: colors.border,
			justifyContent: 'center',
		},
		body: {
			maxHeight,
			padding: 10,
			width: '100%',
		},
		row: {
			justifyContent: 'space-between',
			flexDirection: 'row',
			marginBottom: 5,
			marginTop: 20,
		},
		errorRow: {
			height: BUTTON_HEIGHT,
			backgroundColor: colors.rubyRed,
			width: '100%',
			justifyContent: 'center',
			alignItems: 'center',
			position: 'absolute',
			top: 0,
		},
		buttonRow: {
			flexDirection: 'row',
			borderTopWidth: 1,
			borderColor: colors.border,
			marginTop: 10,
		},
		buttonCancel: {
			height: BUTTON_HEIGHT,
			justifyContent: 'center',
			alignItems: 'center',
			borderRightWidth: 1,
			borderColor: colors.border,
			width: buttonWidth,
		},
		buttonSubmit: {
			height: BUTTON_HEIGHT,
			justifyContent: 'center',
			alignItems: 'center',
			width: buttonWidth,
		},
		buttonText: {
			fontSize: FORM_FONT_SIZE,
			color: colors.primary,
			fontWeight: '500',
		},
		redColor: {
			color: colors.rubyRed,
		},
	};

	const animation = useSharedValue(100);
	const animatedHeight = useSharedValue(maxHeight);
	const [modalAreaHeight, setModalAreaHeight] = useState(0);

	const animate = (toValue) => {
		animation.value = withTiming(toValue);
	};

	const close = () => {
		if (typeof onClose === 'function') {
			onClose();
		}
		animation.value = 100;
	};

	const handleLayout = ({ nativeEvent: { layout } }) => {
		if (!keyboardAware) {
			return false;
		}
		const areaCovered = WINDOW_HEIGHT / 2 + layout.height / 2;
		setModalAreaHeight(areaCovered);
	};

	useEffect(() => {
		if (visible) {
			animate(0);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [visible]);

	useEffect(() => {
		const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
			const keyboardArea = WINDOW_HEIGHT - e.endCoordinates.height;
			const maxContentHeight = Math.min(keyboardArea / 1.7, maxHeight);
			if (modalAreaHeight > keyboardArea) {
				const translateY = modalAreaHeight - maxContentHeight;
				animation.value = withTiming(-(translateY / 2.6));
			}
			animatedHeight.value = withTiming(maxContentHeight);
		});
		const hideSubscription = Keyboard.addListener('keyboardDidHide', (e) => {
			animatedHeight.value = withTiming(maxHeight);
			animation.value = withTiming(0);
		});

		return () => {
			showSubscription.remove();
			hideSubscription.remove();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [keyboardAware, modalAreaHeight]);

	return (
		<Modal
			visible={visible}
			onRequestClose={close}
			animationType="fade"
			transparent
			statusBarTranslucent
		>
			<GestureHandlerRootView style={style.flex}>
				<TouchableOpacity onPress={close} activeOpacity={1} style={style.main}>
					<AnimatedView
						activeOpacity={1}
						onLayout={handleLayout}
						style={[style.content, { transform: [{ translateY: animation }] }]}
					>
						<View style={style.header}>
							<Text style={style.title}>{title}</Text>
						</View>
						<Animated.View style={[style.body, { maxHeight: animatedHeight }]}>
							<ScrollView>{children}</ScrollView>
						</Animated.View>
						<View style={style.buttonRow}>
							{customButtons ? (
								customButtons()
							) : (
								<>
									<TouchableOpacity style={style.buttonCancel} onPress={close}>
										<Text style={[style.buttonText, style.redColor]}>
											Cancel
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										onPress={onSubmit}
										style={style.buttonSubmit}
									>
										<Text style={style.buttonText}>{positiveText}</Text>
									</TouchableOpacity>
								</>
							)}
						</View>
					</AnimatedView>
				</TouchableOpacity>
			</GestureHandlerRootView>
		</Modal>
	);
};

SheetButtonModal.defaultProps = {
	onSubmit: () => {},
	title: '',
	positiveText: 'Submit',
};

export default SheetButtonModal;