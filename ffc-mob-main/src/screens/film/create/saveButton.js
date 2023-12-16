import React, { useEffect } from 'react';
import { Text, TouchableOpacity } from 'react-native';
// Hooks
import useKeyboardVisible from 'hooks/useKeyboardVisible';

import { fonts } from 'themes/topography';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
const Touchable = Animated.createAnimatedComponent(TouchableOpacity);
const SaveButton = ({ colors, onPress, label }) => {
	const translateY = useSharedValue(0);
	const visible = useKeyboardVisible();
	const style = {
		saveButton: {
			height: 50,
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: colors.primary,
			position: 'absolute',
			bottom: 0,
			width: '100%',
		},
		saveButtonTxt: {
			fontSize: fonts.small,
			fontWeight: 'bold',
			color: colors.buttonTxt,
		},
	};
	useEffect(() => {
		translateY.value = withTiming(visible ? 100 : 0);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [visible]);
	return (
		<Touchable
			activeOpacity={0.9}
			style={[style.saveButton, { transform: [{ translateY }] }]}
			onPress={onPress}
		>
			<Text style={style.saveButtonTxt}>{label || 'Save & Continue'}</Text>
		</Touchable>
	);
};
export default SaveButton;
