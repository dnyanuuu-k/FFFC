import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
const star = require('./star.png');

const Rating = ({ color, progress = 0, size = 30, starCount = 5 }) => {
	const { colors } = useTheme();
	const coverWidth = size * starCount;
	const progressWidth = coverWidth * (progress / 100);
	const style = StyleSheet.create({
		foreground: {
			position: 'absolute',
			width: coverWidth,
			height: size,
			flexDirection: 'row',
		},
		star: {
			tintColor: colors.card,
			width: size,
			height: size,
		},
		background: {
			height: size,
			width: progressWidth,
			backgroundColor: colors.primaryBlue,
		},
		cover: {
			width: coverWidth,
			height: size,
			backgroundColor: colors.border,
		},
	});
	return (
		<View style={[style.cover, { width: coverWidth }]}>
			<View style={style.background} />
			<View style={style.foreground}>
				<Image source={star} style={style.star} />
				<Image source={star} style={style.star} />
				<Image source={star} style={style.star} />
				<Image source={star} style={style.star} />
				<Image source={star} style={style.star} />
			</View>
		</View>
	);
};
export default React.memo(Rating);