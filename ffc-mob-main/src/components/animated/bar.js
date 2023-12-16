import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import Animated, { withTiming, useSharedValue } from 'react-native-reanimated';
import { useTheme } from '@react-navigation/native';

const Bar = ({ width, height }) => {
	const intervalRef = useRef();
	const { colors } = useTheme();

	const absoluteStyle = {
		position: 'absolute',
		zIndex: 2,
	};
	const innerWidth = useSharedValue(0);
	const outerWidth = useSharedValue(0);

	const startAnimation = () => {
		innerWidth.value = withTiming(width, { duration: 500 }, () => {
			outerWidth.value = withTiming(width, { duration: 500 }, () => {
				outerWidth.value = 0;
				innerWidth.value = 0;
			});
		});
		intervalRef.current = setTimeout(() => {
			startAnimation();
		}, 1200);
	};

	useEffect(() => {
		startAnimation(true);
		return () => {
			clearTimeout(intervalRef.current);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<Animated.View
				style={{
					backgroundColor: colors.primary,
					width: innerWidth,
					height,
				}}
			/>
			<Animated.View
				style={[
					absoluteStyle,
					{
						backgroundColor: colors.background,
						width: outerWidth,
						height,
					},
				]}
			/>
		</>
	);
};

const AnimatedBar = ({ width, height, busy }) => {
	const mainStyle = {
		width,
		height,
		alignItems: 'center',
	};
	return (
		<View style={mainStyle}>
			{busy ? <Bar width={width} height={height} /> : null}
		</View>
	);
};

export default AnimatedBar;
