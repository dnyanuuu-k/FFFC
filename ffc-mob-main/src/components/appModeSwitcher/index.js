import React, { useState, useEffect } from 'react';

//React Native Components
import { StyleSheet, Modal, Image } from 'react-native';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'utils/constants';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';

import AppMode from 'libs/appMode';

const AppModeSwitcher = ({ onChange }) => {
	const width = useSharedValue(WINDOW_WIDTH);
	const [direction, setDirection] = useState('flex-start');
	const [showImage, setShowImage] = useState(false);
	const [imagePath, setImagePath] = useState('');

	useEffect(() => {
		AppMode.addListener((uri, mode) => {
			setDirection(mode === 'dark' ? 'flex-end' : 'flex-start');
			setShowImage(true);
			setImagePath(uri);
			width.value = WINDOW_WIDTH;
			setTimeout(() => {
				onChange(mode);
				width.value = withTiming(0, { duration: 400 });
				setTimeout(() => {
					setShowImage(false);
				}, 500);
			}, 100);
		});
		return () => {
			AppMode.removeListener();
		};
	});

	return (
		<Modal statusBarTranslucent transparent visible={showImage}>
			<Animated.View
				style={[
					{ width, alignSelf: direction, alignItems: direction },
					style.main,
				]}
				reveal
				revealPositionArray={{ bottom: true, left: true }}
			>
				<Image
					fadeDuration={0}
					style={style.image}
					source={{ uri: imagePath }}
				/>
			</Animated.View>
		</Modal>
	);
};

const style = StyleSheet.create({
	image: {
		width: WINDOW_WIDTH,
		position: 'absolute',
		height: '100%',
	},
	main: {
		height: '100%',
		overflow: 'hidden',
	},
});

export default AppModeSwitcher;