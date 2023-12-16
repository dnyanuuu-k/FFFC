import React from 'react';
import { View, StatusBar, TouchableOpacity, StyleSheet } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useTheme } from '@react-navigation/native';
import { HEADER_HEIGHT } from 'utils/constants';

const Header = ({ onBackPress }) => {
	const { colors } = useTheme();
	const style = StyleSheet.create(
		{
			main: {
				height: HEADER_HEIGHT,
				backgroundColor: colors.card,
				borderBottomWidth: 1,
				borderColor: colors.border,
				paddingRight: 10,
				justifyContent: 'space-between',
				flexDirection: 'row',
				paddingTop: StatusBar.currentHeight,
			},
			icon: {
				height: 50,
				width: 50,
				justifyContent: 'center',
				alignItems: 'center',
			},
			end: {
				width: 110,
				justifyContent: 'space-between',
				flexDirection: 'row',
			},
		},
		[colors]
	);
	return (
		<View style={style.main}>
			<TouchableOpacity onPress={onBackPress} style={style.icon}>
				<FeatherIcon size={22} name="arrow-left" color={colors.text} />
			</TouchableOpacity>
			<View style={style.end}>
				<TouchableOpacity style={style.icon}>
					<FeatherIcon size={22} name="share-2" color={colors.text} />
				</TouchableOpacity>
				<TouchableOpacity style={style.icon}>
					<FeatherIcon size={22} name="heart" color={colors.text} />
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default Header;
