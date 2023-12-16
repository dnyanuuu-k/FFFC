import React, {
	useState,
	useImperativeHandle,
	useMemo,
	forwardRef,
} from 'react';
import { View, Modal, Text, Animated, StyleSheet } from 'react-native';
import {
	WINDOW_WIDTH,
	WINDOW_HEIGHT,
	MODAL_HEADER_HEIGHT,
	BORDER_RADIUS,
	FORM_FONT_SIZE,
} from '../../utils/constants';
import { useTheme } from '@react-navigation/native';

const ModalBase = (
	{ onClose, newError, visible, children, width, height },
	ref
) => {
	useImperativeHandle(ref, () => ({
		error,
		success
	}));
	const { colors } = useTheme();
	const [toastColor, setToastColor] = useState(colors.rubyRed);
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					height: WINDOW_HEIGHT,
					width: WINDOW_WIDTH,
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: colors.bgTrans,
				},
				content: {
					overflow: 'hidden',
					borderRadius: BORDER_RADIUS,
					backgroundColor: colors.card,
				},
				errorRow: {
					height: MODAL_HEADER_HEIGHT,
					backgroundColor: toastColor,
					width: '100%',
					justifyContent: 'center',
					alignItems: 'center',
					position: 'absolute',
					top: 0,
				},
				errorText: {
					color: colors.buttonTxt,
					fontSize: FORM_FONT_SIZE,
				},
			}),
		[colors, toastColor]
	);
	const [errorPosition] = useState(new Animated.Value(-MODAL_HEADER_HEIGHT));
	const [errorText, setErrorText] = useState('');

	const showToast = (err, callback = null) => {
		setErrorText(err);
		Animated.spring(errorPosition, {
			toValue: 0,
			useNativeDriver: true,
		}).start();
		setTimeout(() => {
			Animated.timing(errorPosition, {
				toValue: -MODAL_HEADER_HEIGHT,
				useNativeDriver: true,
			}).start();
			if (typeof callback === 'function') {
				callback();
			}
		}, 2000);
	};

	const error = (err, callback = null) => {
		setToastColor(colors.rubyRed);
		showToast(err, callback);
	};

	const success = (msg, callback = null) => {
		setToastColor(colors.greenDark);
		showToast(msg, callback);
	};

	return (
		<Modal
			onRequestClose={onClose}
			visible={visible}
			transparent
			animationType="fade"
		>
			<View style={style.main}>
				<View style={[style.content, { width, height }]}>
					{children}
					<Animated.View
						style={[
							style.errorRow,
							{ transform: [{ translateY: errorPosition }] },
						]}
					>
						<Text style={style.errorText}>{errorText}</Text>
					</Animated.View>
				</View>
			</View>
		</Modal>
	);
};

export default forwardRef(ModalBase);
