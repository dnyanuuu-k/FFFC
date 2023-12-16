import React, { useMemo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';

const SimpleRadio = ({ size = 18, selected, onChange }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				radio: {
					borderWidth: 2,
					borderRadius: 100,
					padding: 3,
				},
				selected: {
					width: '100%',
					height: '100%',
					borderRadius: 100,
					backgroundColor: colors.primary,
				},
			}),
		[colors]
	);
	return (
		<Pressable
			onPress={() => onChange(!selected)}
			style={[
				style.radio,
				{
					width: size,
					height: size,
					borderColor: selected ? colors.primary : colors.holderColor,
				},
			]}
		>
			{selected ? <View style={style.selected} /> : null}
		</Pressable>
	);
};

export default SimpleRadio;
