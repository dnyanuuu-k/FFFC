import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { fonts, weights } from 'themes/topography';

const SectionCover = ({ title, children }) => {
	const { colors } = useTheme();
	const style = {
		main: {
			backgroundColor: colors.card,
			marginTop: 10,
		},
		header: {
			height: 40,
			paddingLeft: 10,
			justifyContent: 'center',
			borderBottomWidth: 1,
			borderColor: colors.border,
		},
		title: {
			fontSize: fonts.small,
			color: colors.holderColor,
			fontWeight: weights.regular,
		},
	};
	return (
		<View style={style.main}>
			<View style={style.header}>
				<Text style={style.title}>{title}</Text>
			</View>
			{children}
		</View>
	);
};

export default SectionCover;
