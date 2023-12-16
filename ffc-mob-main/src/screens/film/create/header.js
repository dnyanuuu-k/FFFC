import React, { useMemo } from 'react';
import {
	View,
	Text,
	StatusBar,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

// Hooks
import { useTheme, useNavigation } from '@react-navigation/native';

import { WINDOW_WIDTH, HEADER_HEIGHT } from 'utils/constants';
import { fonts, weights } from 'themes/topography';

const Basic = ({ title, subTitle }) => {
	const { colors } = useTheme();
	const { navigation } = useNavigation();
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
				icon: {
					width: 60,
					height: 30,
					justifyContent: 'center',
					alignItems: 'center',
				},
				title: {
					color: colors.text,
					fontSize: fonts.title,
					fontWeight: weights.bold,
				},
				subTitle: {
					width: '100%',
					fontSize: fonts.small,
					color: colors.holderColor,
				},
			}),
		[colors]
	);
	return (
		<View style={style.header}>
			<TouchableOpacity onPress={() => navigation.goBack()} style={style.icon}>
				<FeatherIcon name="arrow-left" color={colors.text} size={22} />
			</TouchableOpacity>
			<View>
				<Text style={style.title}>{title}</Text>
				<Text numberOfLines={1} style={style.subTitle}>
					{subTitle}
				</Text>
			</View>
		</View>
	);
};

export default Basic;