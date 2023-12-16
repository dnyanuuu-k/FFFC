import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { formWidth, TOP_GAP, TOP_GAP2 } from './constants';
import { fonts, weights } from 'themes/topography';

const SectionText = ({ text, subText = null }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				sectionCover: {
					borderBottomWidth: 1,
					width: formWidth,
					marginTop: TOP_GAP,
					paddingBottom: TOP_GAP2,
					borderColor: colors.border,
				},
				sectionText: {
					fontSize: fonts.regular,
					color: colors.text,
					fontWeight: weights.bold,
				},
				sectionSubText: {
					marginTop: 3,
					fontSize: fonts.small,
					color: colors.holderColor,
				},
			}),
		[colors]
	);
	return (
		<View style={style.sectionCover}>
			<Text style={style.sectionText}>{text}</Text>
			{subText ? <Text style={style.sectionSubText}>{subText}</Text> : null}
		</View>
	);
};

export default SectionText;
