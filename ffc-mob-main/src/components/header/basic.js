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

const Basic = ({ title, desc }) => {
	const { colors } = useTheme();
	const navigation = useNavigation();
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
					fontWeight: weights.semibold,
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
			<TouchableOpacity onPress={() => navigation.goBack()} style={style.icon}>
				<FeatherIcon name="arrow-left" color={colors.text} size={20} />
			</TouchableOpacity>
			<View>
				<Text style={style.title}>{title}</Text>
				{desc ? <Text style={style.desc}>{desc}</Text> : null}
			</View>
		</View>
	);
};

export default Basic;
