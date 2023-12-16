import React, { useRef, useState, useMemo } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { useTheme } from '@react-navigation/native';
import { fonts } from 'themes/topography';

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);
const heartAnim = require('assets/anims/heart.json');

const START_PROGRESS = 0.1;
const END_PROGRESS = 0.4;

const LikeButton = ({ isLiked = false, onLikeChange }) => {
	const [currentIsLiked, setCurrentIsLiked] = useState(isLiked);
	const animationProgress = useRef(
		new Animated.Value(isLiked ? END_PROGRESS : START_PROGRESS)
	);
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				buttonTxt: {
					fontSize: fonts.small,
				},
				anim: {
					width: 55,
					height: 55,
					top: 1,
				},
				main: {
					backgroundColor: colors.bgTransd1,
					justifyContent: 'center',
					alignItems: 'center',
					width: 34,
					height: 34,
					borderRadius: 100,
					marginLeft: 12
				},
			}),
		[colors]
	);

	const toggle = () => {
		Animated.timing(animationProgress.current, {
			toValue: currentIsLiked ? START_PROGRESS : END_PROGRESS,
			useNativeDriver: true,
			duration: currentIsLiked ? 1000 : 2000,
		}).start();
		const newLikeState = !currentIsLiked;
		setCurrentIsLiked(newLikeState);
		if (onLikeChange) {
			onLikeChange(newLikeState);
		}
	};

	return (
		<Pressable style={style.main} onPress={toggle}>
			<AnimatedLottieView
				progress={animationProgress.current}
				source={heartAnim}
				style={style.anim}
			/>
		</Pressable>
	);
};

export default LikeButton;
