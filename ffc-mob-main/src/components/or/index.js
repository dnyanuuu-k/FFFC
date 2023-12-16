import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

const OR = () => {
	const { colors } = useTheme();
	const style = StyleSheet.create({
		main: {
			width: '100%',
			height: 30,
			flexDirection: 'row',
			alignItems: 'center',
			marginTop: 10,
			justifyContent: 'space-between',
		},
		line: {
			height: 1,
			backgroundColor: colors.border,
			width: '45%',
		},
		text: {
			color: colors.holderColor,
			fontWeight: '400',
			fontSize: 15,
		},
	});
	return (
		<View style={style.main}>
			<View style={style.line} />
			<Text style={style.text}>OR</Text>
			<View style={style.line} />
		</View>
	);
};

export default OR;
