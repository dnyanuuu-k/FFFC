import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

// Hooks
import { useTheme } from '@react-navigation/native';

import { WINDOW_WIDTH, MODAL_HEADER_HEIGHT } from 'utils/constants';
import { fonts, weights } from 'themes/topography';

const ModalHeader = ({ title, onBackPress }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				header: {
					height: MODAL_HEADER_HEIGHT,
					width: WINDOW_WIDTH,
					backgroundColor: colors.card,
					flexDirection: 'row',
					alignItems: 'center',
					borderBottomWidth: 1,
					borderColor: colors.border,
				},
				icon: {
					width: 50,
					height: 30,
					justifyContent: 'center',
					alignItems: 'center',
				},
				title: {
					color: colors.text,
					fontSize: fonts.regular,
					fontWeight: weights.bold,
				},
			}),
		[colors]
	);
	return (
		<View style={style.header}>
			<TouchableOpacity
				onPress={() => {
					onBackPress();
				}}
				style={style.icon}
			>
				<FeatherIcon name="arrow-left" color={colors.text} size={20} />
			</TouchableOpacity>
			<Text style={style.title}>{title}</Text>
		</View>
	);
};

export default ModalHeader;