import React from "react";
import {
	View,
	StyleSheet,
	TouchableOpacity
} from "react-native";
import FeatherIcon from "feather-icons-react";
import colors from "themes/colors";

const STARS = [ 1, 2, 3, 4, 5 ];
const ReviewInput = ({selected = 5, starSize = 20, starGap = 2, onChange }) => {
	return (
		<View style={style.main}>
			{STARS.map((star) => {
				const isFilled = star <= selected;
				const iconSize = starSize - 4;
				return (
					<TouchableOpacity style={[style.button, {
						marginHorizontal: starGap,
						width: starSize,
						height: starSize
					}]} onPress={() => onChange(star)}>
						<FeatherIcon
							key={star}
							icon='star'
							fill={isFilled ? colors.primaryBlue : 'none'}
							color={isFilled ? colors.primaryBlue : colors.holderColor}
							size={iconSize}
						/>
					</TouchableOpacity>
				)
			})}
		</View>
	)
}

const style = StyleSheet.create({
	main: {
		flexDirection: 'row',
	},
	button: {
		justifyContent: 'center',
		alignItems: 'center',
		outline: 'none'
	}
});

export default ReviewInput;