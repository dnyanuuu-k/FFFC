import React, { useMemo } from 'react';
import {
	View,
	TextInput,
	StatusBar,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

// Hooks
import { useTheme, useNavigation } from '@react-navigation/native';

import { WINDOW_WIDTH, HEADER_HEIGHT } from 'utils/constants';
import { fonts, weights } from 'themes/topography';

const SearchableHeader = ({ placeholder, onChangeText }) => {
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
				},
				icon: {
					width: 60,
					height: 30,
					justifyContent: 'center',
					alignItems: 'center',
				},
				input: {
					fontSize: fonts.small,
					color: colors.text,
					backgroundColor: colors.background,
					borderRadius: 5,
					width: WINDOW_WIDTH - 70,
					height: 34,
					paddingLeft: 10,
					padding: 0,
				},
			}),
		[colors]
	);
	return (
		<View style={style.header}>
			<TouchableOpacity onPress={() => navigation.goBack()} style={style.icon}>
				<FeatherIcon name="arrow-left" color={colors.text} size={22} />
			</TouchableOpacity>
			<TextInput
				onChangeText={onChangeText}
				style={style.input}
				placeholder={placeholder}
				selectionColor={colors.holderColor}
				placeholderTextColor={colors.holderColor}
			/>
		</View>
	);
};

export default SearchableHeader;
