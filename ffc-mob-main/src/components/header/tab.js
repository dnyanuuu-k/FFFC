import React, { useMemo } from 'react';
import { View, Text, StatusBar, StyleSheet } from 'react-native';

// Hooks
import { useTheme } from '@react-navigation/native';

import { WINDOW_WIDTH, HEADER_HEIGHT } from 'utils/constants';
import { fonts, weights } from 'themes/topography';

const TabHeader = ({ title, desc }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				header: {
					height: HEADER_HEIGHT,
					width: WINDOW_WIDTH,
					backgroundColor: colors.card,
					paddingTop: StatusBar.currentHeight,
					flexDirection: 'row',
					alignItems: 'center',
					borderBottomWidth: 1,
					borderColor: colors.border,
				},
				title: {
					color: colors.text,
					fontSize: fonts.large,
					fontWeight: weights.bold,
					paddingLeft: 10,
				},
				desc: {
					fontSize: fonts.small,
					color: colors.holderColor,
				},
			}),
		[colors]
	);
	return (
		<View style={style.header}>
			<Text style={style.title}>{title}</Text>
			{desc ? <Text style={style.desc}>{desc}</Text> : null}
		</View>
	);
};

export default TabHeader;
