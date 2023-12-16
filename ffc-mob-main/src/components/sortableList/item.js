import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	useAnimatedReaction,
	withTiming,
	Easing,
	scrollTo,
	runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { WINDOW_HEIGHT, HEADER_HEIGHT } from 'utils/constants';

const containerHeight = WINDOW_HEIGHT - HEADER_HEIGHT;
const animationConfig = {
	easing: Easing.inOut(Easing.ease),
	duration: 350,
};
const Item = ({
	children,
	scrollView,
	scrollY,
	id,
	size,
	positions,
	numColumns,
	contentHeight,
	triggerComponent,
	isEnabled = true,
	onUpdate,
}) => {
	const position = getPosition(positions.value[id], numColumns, size);
	const isGestureActive = useSharedValue(false);
	const translateX = useSharedValue(position.x);
	const translateY = useSharedValue(position.y);
	const start = useSharedValue({ x: position.x, y: position.y });
	useAnimatedReaction(
		() => positions.value[id],
		(newOrder) => {
			const p = getPosition(newOrder, numColumns, size);
			translateX.value = withTiming(p.x, animationConfig);
			translateY.value = withTiming(p.y, animationConfig);
		}
	);
	const gesture = Gesture.Pan()
		.runOnJS(true)
		.enabled(isEnabled)
		.onStart(() => {
			const p = getPosition(positions.value[id], numColumns, size);
			isGestureActive.value = true;
			start.value.x = p.x;
			start.value.y = p.y;
		})
		.onUpdate(({ translationX, translationY }) => {
			translateX.value = start.value.x + translationX;
			translateY.value = start.value.y + translationY;

			const newOrder = getOrder(
				translateX.value,
				translateY.value,
				numColumns,
				size
			);
			const oldOrder = positions.value[id];
			if (oldOrder !== newOrder) {
				const idToSwap = Object.keys(positions.value).find(
					(key) => positions.value[key] === newOrder
				);
				if (idToSwap) {
					const newPositions = JSON.parse(JSON.stringify(positions.value));
					newPositions[id] = newOrder;
					newPositions[idToSwap] = oldOrder;
					positions.value = newPositions;
				}
			}

			const lowerBound = scrollY.value;
			const upperBound = lowerBound + containerHeight - size;
			const maxScroll = contentHeight - containerHeight;
			const scrollLeft = maxScroll - scrollY.value;
			if (translateY.value < lowerBound) {
				const diff = Math.min(lowerBound - translateY.value, lowerBound);
				scrollY.value -= diff;
				start.value.y -= diff;
				translateY.value = start.value.y + translationY;
				scrollTo(scrollView, 0, scrollY.value, false);
			}

			if (translateY.value > upperBound) {
				const diff = Math.min(translateY.value - upperBound, scrollLeft);
				scrollY.value += diff;
				start.value.y += diff;
				translateY.value = start.value.y + translationY;
				scrollTo(scrollView, 0, scrollY.value, false);
			}
		})
		.onEnd(() => {
			const p = getPosition(positions.value[id], numColumns, size);
			translateX.value = withTiming(p.x, animationConfig, () => {
				isGestureActive.value = false;
			});
			translateY.value = withTiming(p.y, animationConfig);
		})
		.onFinalize(() => {
			sendPositions();
		});
	// TODO: Avoid to run on js
	const sendPositions = () => {
		const sorted = [];
		const data = positions.value;
		Object.keys(data).forEach((key) => {
			sorted[data[key]] = key;
		});
		onUpdate(sorted);
	};

	const style = useAnimatedStyle(() => {
		const scale = isGestureActive.value ? 1.1 : 1;
		const zIndex = isGestureActive.value ? 100 : 0;
		return {
			position: 'absolute',
			width: size,
			height: size,
			top: 0,
			left: 0,
			zIndex,
			transform: [
				{ translateX: translateX.value },
				{ translateY: translateY.value },
				{ scale },
			],
		};
	});
	return (
		<Animated.View style={style} id={id}>
			<Animated.View style={StyleSheet.absoluteFill} id={id}>
				{children}
				<GestureDetector gesture={gesture}>
					{triggerComponent || <View />}
				</GestureDetector>
			</Animated.View>
		</Animated.View>
	);
};

const getPosition = (order, columns, size) => {
	'worklet';
	return {
		x: (order % columns) * size,
		y: Math.floor(order / columns) * size,
	};
};

const getOrder = (x, y, columns, size) => {
	'worklet';
	const col = Math.round(x / size);
	const row = Math.round(y / size);
	return row * columns + col;
};

export default Item;
