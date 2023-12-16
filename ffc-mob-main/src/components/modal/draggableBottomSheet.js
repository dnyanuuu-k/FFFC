import React, { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, {
	useSharedValue,
	SlideInDown,
	FadeIn,
	FadeOut,
	SlideOutDown,
	withSpring,
	useAnimatedStyle,
	withTiming,
	runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { WINDOW_WIDTH } from 'utils/constants';

const entering = SlideInDown.springify().damping(17);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const DraggableBottomSheet = ({
	colors,
	height = 300,
	visible,
	onClose,
	children,
	padding,
}) => {
	const style = StyleSheet.create({
		backdrop: {
			...StyleSheet.absoluteFillObject,
			backgroundColor: colors.bgTrans21,
			zIndex: 1,
		},
		sheet: {
			backgroundColor: colors.card,
			height,
			width: WINDOW_WIDTH,
			position: 'absolute',
			bottom: -20 * 1.1,
			borderTopRightRadius: 20,
			borderTopLeftRadius: 20,
			zIndex: 1,
			borderWidth: 1,
			padding,
			borderColor: colors.border,
		},
	});
	const offset = useSharedValue(0);
	const thirdHeight = height / 3;

	const handleClose = () => {
		onClose();
		offset.value = 0;
	};

	const pan = Gesture.Pan()
		.onChange((event) => {
			const offsetDelta = event.changeY + offset.value;
			const clamp = Math.max(-20, offsetDelta);
			offset.value = offsetDelta > 0 ? offsetDelta : withSpring(clamp);
		})
		.onFinalize(() => {
			if (offset.value < thirdHeight) {
				offset.value = withSpring(0);
			} else {
				offset.value = withTiming(height, {}, () => {
					runOnJS(handleClose)();
				});
			}
		});
	const translateY = useAnimatedStyle(() => ({
		transform: [{ translateY: offset.value }],
	}));
	const navigation = useNavigation();
	useEffect(
		() =>
			navigation.addListener('beforeRemove', (e) => {
				if (!visible) {
					return;
				}
				e.preventDefault();

				handleClose();
			}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[navigation, visible]
	);

	return visible ? (
		<>
			<AnimatedPressable
				entering={FadeIn}
				exiting={FadeOut}
				onPress={handleClose}
				style={style.backdrop}
			/>
			<GestureDetector gesture={pan}>
				<Animated.View
					entering={entering}
					exiting={SlideOutDown}
					style={[style.sheet, translateY]}
				>
					{children}
				</Animated.View>
			</GestureDetector>
		</>
	) : null;
};

export default DraggableBottomSheet;
