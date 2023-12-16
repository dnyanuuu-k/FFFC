import React, { useMemo, useState } from 'react';
import { Pressable, Text, Modal, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { fonts, weights } from 'themes/topography';
import {
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
	ScrollView,
} from 'react-native-gesture-handler';
import { WINDOW_HEIGHT, H50, H70, H40 } from 'utils/constants';
const AnimatedView = Animated.createAnimatedComponent(Pressable);
const MoreModal = ({ title, content, onClose }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					backgroundColor: colors.bgTrans69,
					minHeight: WINDOW_HEIGHT,
					width: '100%',
					paddingHorizontal: 10,
				},
				content: {
					backgroundColor: colors.card,
					borderRadius: 10,
					padding: 20,
					alignSelf: 'center',
					width: '100%',
				},
				text: {
					fontSize: fonts.small,
					color: colors.holderColor,
					marginTop: 10,
				},
				title: {
					fontSize: fonts.regular,
					fontWeight: weights.bold,
					color: colors.text,
				},
			}),
		[colors]
	);
	const start = useSharedValue(0);
	const [maxHeight, setMaxHeight] = useState(0);
	const translateY = useSharedValue(WINDOW_HEIGHT);
	const panGesture = Gesture.Pan()
		.onStart(({ translationY }) => {
			start.value = translateY.value;
		})
		.onUpdate(({ translationY }) => {
			const value = start.value + translationY;
			if (value > maxHeight) {
				translateY.value = value;
			}
		})
		.onEnd(({ translationY }) => {
			const value = start.value + translationY;
			if (value > H70) {
				close();
			} else if (value > H50) {
				translateY.value = withTiming(H50, { duration: 100 });
			} else if (value < H40 && value > 40) {
				const upValue = Math.max(maxHeight, 40);
				translateY.value = withTiming(upValue, { duration: 100 });
			}
			start.value = translateY.value;
		})
		.runOnJS(true);
	const handleLayout = (layout) => {
		const contentHeight = layout.nativeEvent.layout.height;
		const halfHeight = WINDOW_HEIGHT / 2;
		let toValue = 0;
		if (contentHeight > halfHeight) {
			toValue = halfHeight;
		}
		setMaxHeight(WINDOW_HEIGHT - contentHeight - 100);
		start.value = toValue;
		translateY.value = withTiming(toValue, { duration: 100 });
	};
	const close = () => {
		translateY.value = withTiming(WINDOW_HEIGHT, { duration: 100 });
		setTimeout(() => {
			onClose();
		}, 150);
	};
	return (
		<Modal transparent animationType="fade" onRequestClose={close}>
			<GestureHandlerRootView>
				<ScrollView showsVerticalScrollIndicator={false}>
					<Pressable activeOpacity={1} onPress={close} style={style.main}>
						<GestureDetector gesture={panGesture}>
							<AnimatedView
								onLayout={handleLayout}
								style={[style.content, { transform: [{ translateY }] }]}
							>
								<Text style={style.title}>{title}</Text>
								<Text style={style.text}>{content}</Text>
							</AnimatedView>
						</GestureDetector>
					</Pressable>
				</ScrollView>
			</GestureHandlerRootView>
		</Modal>
	);
};

export default MoreModal;
