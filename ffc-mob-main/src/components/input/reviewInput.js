import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
const icon = require('assets/icons/star.png');

const STARS = [1, 2, 3, 4, 5];
const ReviewInput = ({
	selected = 5,
	starSize = 20,
	starGap = 2,
	onChange,
	selectedColor,
	unselectedColor,
}) => {
	return (
		<View style={style.main}>
			{STARS.map((star) => {
				const isFilled = star <= selected;
				const tintColor = isFilled ? selectedColor : unselectedColor;
				return (
					<TouchableOpacity
						style={[
							style.button,
							{
								marginHorizontal: starGap,
								width: starSize,
								height: starSize,
							},
						]}
						onPress={() => onChange(star)}
					>
						<Image
							source={icon}
							style={{ width: starSize, height: starSize, tintColor }}
						/>
					</TouchableOpacity>
				);
			})}
		</View>
	);
};

const style = StyleSheet.create({
	main: {
		flexDirection: 'row',
	},
	button: {
		justifyContent: 'center',
		alignItems: 'center',
		outline: 'none',
	},
});

export default ReviewInput;
