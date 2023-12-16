import React, {
	useImperativeHandle,
	useState,
	useRef,
	forwardRef,
	useEffect
} from "react";
import { Animated, StyleSheet, Easing, TouchableOpacity } from "react-native";
import colors from "themes/colors";
import shadows from "themes/shadows";
const AnimatedTouch = Animated.createAnimatedComponent(TouchableOpacity);
const ZoomIn = (props, ref) => {
	const viewRef = useRef();
	useImperativeHandle(ref, () => ({
		easeIn,
		easeOut,
		measure,
		focus,
		blur,
		reset
	}));
	const [currentScale] = useState(new Animated.Value(0.7));
	const [currentOpacity] = useState(new Animated.Value(0));

	const easeIn = () => {
		Animated.parallel([
			Animated.timing(currentScale, {
				toValue: 1,
				easing: Easing.out(Easing.exp),
				duration: 500,
				useNativeDriver: false,
			}),
			Animated.timing(currentOpacity, {
				toValue: 1,
				easing: Easing.out(Easing.exp),
				duration: 500,
				useNativeDriver: false,
			}),
		]).start();
	};

	const reset = () => {
		currentScale.setValue(0.7);
		currentOpacity.setValue(0);
	}

	const easeOut = (cb) => {
		Animated.parallel([
			Animated.timing(currentScale, {
				toValue: 0.7,
				easing: Easing.out(Easing.exp),
				duration: 500,
				useNativeDriver: false,
			}),
			Animated.timing(currentOpacity, {
				toValue: 0,
				easing: Easing.out(Easing.exp),
				duration: 500,
				useNativeDriver: false,
			}),
		]).start(cb);
	};

	const measure = (cb) => {
		return viewRef.current.measure(cb);
	};

	const focus = () => {
		viewRef.current.focus();
		return true;
	};

	const blur = () => {
		viewRef.current.blur();
		return true;
	};

	useEffect(() => {
		if(props.autoAnimate){
			easeIn();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<AnimatedTouch
			{...props}
			ref={viewRef}
			activeOpacity={1}
			style={[
				style.main,
				props.sty,
				props.position,
				{
					outline: 'none',
					transformOrigin: props.origin,
					opacity: currentOpacity,
					transform: [{ scale: currentScale }],
				},
			]}
		>
			{props.children}
		</AnimatedTouch>
	);
};

const style = StyleSheet.create({
	main: {
		backgroundColor: colors.popupBg,
		boxShadow: shadows.basic,		
		borderWidth: 0
	},
});

export default forwardRef(ZoomIn);