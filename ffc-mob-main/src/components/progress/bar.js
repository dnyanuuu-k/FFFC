import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { BORDER_RADIUS } from 'utils/constants';
import Animated, {
	useSharedValue,
	withTiming,
	Easing,
} from 'react-native-reanimated';
import colors from 'themes/colors';
import useDebounce from 'hooks/useDebounce';

const ProgressBar = ({
	progress,
	width,
	height = 8,
	backgroundColor = colors.vectorBaseDip,
	foregroundColor = colors.primaryBlue,
}) => {
	const debounceProgress = useDebounce(progress);
	const progressAnimation = useSharedValue(-width);
	useEffect(() => {
		if (debounceProgress) {
			const progressValue = width - (debounceProgress / 100) * width;
			progressAnimation.value = withTiming(-progressValue, {
				duration: 300,
				easing: Easing.out(Easing.exp),
			});
		}
	}, [debounceProgress, progressAnimation, width]);

	return (
		<View style={[style.cover, { backgroundColor, width, height }]}>
			<Animated.View
				style={[
					style.progress,
					{
						backgroundColor: foregroundColor,
						transform: [
							{
								translateX: progressAnimation,
							},
						],
					},
				]}
			/>
		</View>
	);
};

const style = StyleSheet.create({
	cover: {
		borderRadius: BORDER_RADIUS,
		overflow: 'hidden',
	},
	progress: {
		borderRadius: BORDER_RADIUS,
		height: '100%',
		width: '100%',
	},
});

export default ProgressBar;