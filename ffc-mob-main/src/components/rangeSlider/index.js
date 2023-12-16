import React, { useMemo, useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	withTiming,
	Extrapolate,
	interpolate,
	useDerivedValue,
	runOnJS,
} from 'react-native-reanimated';
import {
	gestureHandlerRootHOC,
	GestureDetector,
	Gesture,
} from 'react-native-gesture-handler';

const RangeSlider = ({
	width = 200,
	indicatorWidth = 35,
	minValue = 1,
	maxValue = 100,
	onChange,
	inactiveBarColor = '#f2f2f2',
	activeBarColor = 'blue',
	scrubberColor = 'blue',
	scrubberBorderColor = 'black',
	barBorderColor = 'black',
	badgeColor = 'green',
	suffix = '',
	prefix = '',
	valueFontSize = 10,
	valueTextColor = '#ffffff',
	value = [],
}) => {
	const pinCenter = (indicatorWidth - 20) / 2;
	const style = useMemo(
		() =>
			StyleSheet.create({
				outerBar: {
					width,
					height: 22,
					overflow: 'hidden',
					borderRadius: 20,
					backgroundColor: activeBarColor,
					borderWidth: 1,
					borderColor: barBorderColor,
				},
				indicator: {
					width: 35,
					height: 35,
					justifyContent: 'center',
					alignItems: 'center',
					borderRadius: 100,
					backgroundColor: badgeColor,
				},
				value: {
					fontWeight: 'bold',
					fontSize: valueFontSize,
					color: valueTextColor,
				},
				indicatorPointer: {
					width: 0,
					height: 0,
					position: 'absolute',
					bottom: -5,
					left: pinCenter,
					backgroundColor: 'transparent',
					borderStyle: 'solid',
					borderTopWidth: 10,
					borderRightWidth: 10,
					borderBottomWidth: 0,
					borderLeftWidth: 10,
					borderTopColor: badgeColor,
					borderRightColor: 'transparent',
					borderBottomColor: 'transparent',
					borderLeftColor: 'transparent',
				},
				indicatorSpace: {
					height: 60,
				},
				scrubber: {
					position: 'absolute',
					width: 20,
					top: 0,
					borderWidth: 3,
					height: 20,
					borderRadius: 50,
					backgroundColor: scrubberColor,
					borderColor: scrubberBorderColor,
				},
				scrubberOut: {
					position: 'absolute',
					width: width,
					height: 20,
					borderRadius: 50,
					backgroundColor: inactiveBarColor,
				},
			}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);
	const translateX = useSharedValue(0);
	const translateX2 = useSharedValue(width - 22);

	const indicatorScale = useSharedValue(1);
	const tiltVelocity = useSharedValue(0);

	const indicatorScale2 = useSharedValue(1);
	const tiltVelocity2 = useSharedValue(0);

	const indicatorHalf = indicatorWidth / 2 + 2;

	const translateXOuter = useDerivedValue(() => {
		return translateX.value - width + 20;
	}, [translateX.value]);

	const [startValue, setStartValue] = useState(minValue);
	const [endValue, setEndValue] = useState(maxValue);

	const dispatchResults = () => {
		const startPercent = translateX.value / width;
		const endPercent = (translateX2.value + (indicatorHalf + 2)) / width;
		const sv = Math.round(maxValue * startPercent);
		const ev = Math.min(Math.round(maxValue * endPercent), maxValue);
		setStartValue(sv);
		setEndValue(ev);
		if (onChange) {
			onChange([sv, ev]);
		}
	};

	const tapGesture = Gesture.Tap().onTouchesDown(() => {
		indicatorScale.value = withTiming(1);
	});
	const panGesture = Gesture.Pan()
		.onChange((e) => {
			const changed = translateX.value + e.x;
			if (changed > translateX2.value - indicatorHalf) {
				return;
			}
			if (changed >= 0) {
				tiltVelocity.value = e.velocityX;
				translateX.value = changed;
			} else {
				translateX.value = 0;
			}
		})
		.onEnd((e) => {
			indicatorScale2.value = withTiming(0);
			tiltVelocity.value = 0;

			runOnJS(dispatchResults)();
		});

	const tapGesture2 = Gesture.Tap().onTouchesDown(() => {
		indicatorScale2.value = withTiming(1);
	});
	const panGesture2 = Gesture.Pan()
		.onChange((e) => {
			const changed = translateX2.value + e.x;
			if (changed > width - indicatorHalf) {
				return;
			}
			if (changed > translateX.value + indicatorHalf) {
				tiltVelocity2.value = e.velocityX;
				translateX2.value = changed;
			}
		})
		.onEnd((e) => {
			indicatorScale.value = withTiming(0);
			tiltVelocity2.value = 0;

			runOnJS(dispatchResults)();
		});

	const composed = Gesture.Simultaneous(tapGesture, panGesture);
	const composed2 = Gesture.Simultaneous(tapGesture2, panGesture2);
	const animatedStyles = useAnimatedStyle(() => {
		const rotate = interpolate(
			tiltVelocity.value,
			[-5, 0, 5],
			[15, 0, -15],
			Extrapolate.CLAMP
		);
		return {
			position: 'absolute',
			transform: [
				{ scaleY: indicatorScale.value },
				{ translateX: translateX.value },
				{ translateY: 10 },
				{ rotate: withSpring(rotate + 'deg') },
			],
		};
	});

	const animatedStyles2 = useAnimatedStyle(() => {
		const rotate = interpolate(
			tiltVelocity2.value,
			[-5, 0, 5],
			[15, 0, -15],
			Extrapolate.CLAMP
		);
		return {
			position: 'absolute',
			translateY: 10,
			transform: [
				{ scaleY: indicatorScale2.value },
				{ translateX: translateX2.value },
				{ translateY: 10 },
				{ rotate: withSpring(rotate + 'deg') },
			],
		};
	});

	useEffect(() => {
		if (value?.length === 2) {
			const start = value[0];
			const end = value[1];
			if (start !== startValue || end !== endValue) {
				const startPercent = start / maxValue;
				const endPercent = end / maxValue;

				const startX = width * startPercent;
				const endX = Math.min(width * endPercent, width - 22);

				setStartValue(start);
				setEndValue(end);

				translateX.value = startX;
				translateX2.value = endX;
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<View style={{ width }}>
			<View style={style.indicatorSpace}>
				<Animated.View style={animatedStyles}>
					<View style={style.indicator}>
						<Text style={style.value}>
							{prefix}
							{startValue}
							{suffix}
						</Text>
					</View>
					<View style={style.indicatorPointer} />
				</Animated.View>

				<Animated.View style={animatedStyles2}>
					<View style={style.indicator}>
						<Text style={style.value}>
							{prefix}
							{endValue}
							{suffix}
						</Text>
					</View>
					<View style={style.indicatorPointer} />
				</Animated.View>
			</View>
			<View style={style.outerBar}>
				<Animated.View
					style={[style.scrubberOut, { translateX: translateXOuter }]}
				/>
				<Animated.View
					style={[style.scrubberOut, { translateX: translateX2 }]}
				/>
				<GestureDetector gesture={composed}>
					<Animated.View style={[style.scrubber, { translateX }]} />
				</GestureDetector>
				<GestureDetector gesture={composed2}>
					<Animated.View
						style={[style.scrubber, { translateX: translateX2 }]}
					/>
				</GestureDetector>
			</View>
		</View>
	);
};

export default gestureHandlerRootHOC(RangeSlider);