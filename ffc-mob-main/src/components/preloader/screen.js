import React, { useMemo } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { HEADER_HEIGHT, WINDOW_WIDTH } from 'utils/constants';
import { useTheme } from '@react-navigation/native';

const ScreenLoader = () => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					height: '100%',
					width: WINDOW_WIDTH,
					backgroundColor: colors.background,
				},
				header: {
					width: WINDOW_WIDTH,
					height: HEADER_HEIGHT,
					justifyContent: 'flex-end',
					paddingHorizontal: 10,
				},
				arrowLeft: {
					backgroundColor: colors.bgTransd1,
					justifyContent: 'center',
					alignItems: 'center',
					width: 34,
					height: 34,
					borderRadius: 100,
				},
				activity: {
					justifyContent: 'center',
					alignItems: 'center',
					flex: 1,
				},
				icon: {
					width: 50,
					height: 50,
					justifyContent: 'center',
				},
			}),
		[colors]
	);
	return (
		<View style={style.main}>
			<View style={style.header}>
				<View style={style.icon}>
					<View style={style.arrowLeft}>
						<FeatherIcon color={colors.buttonTxt} size={20} name="arrow-left" />
					</View>
				</View>
			</View>
			<View style={style.activity}>
				<ActivityIndicator color={colors.primary} size={40} />
			</View>
		</View>
	);
};

export default ScreenLoader;
