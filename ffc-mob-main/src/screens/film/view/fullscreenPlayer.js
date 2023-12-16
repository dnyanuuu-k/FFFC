import React, { useEffect } from 'react';
import { StyleSheet, Modal } from 'react-native';
import { WebView } from 'react-native-webview';
import VideoPlayer from 'react-native-video-controls';
import Orientation from 'react-native-orientation-locker';

const FullscreenPlayer = ({
	url,
	canPlay = true,
	isNativePlayer,
	visible,
	onClose,
}) => {
	useEffect(() => {
		if (visible) {
			Orientation.lockToLandscape();
		} else {
			Orientation.lockToPortrait();
		}
		return () => {
			Orientation.lockToPortrait();
		};
	}, [visible]);
	return (
		<Modal statusBarTranslucent visible={visible} onRequestClose={onClose}>
			{isNativePlayer ? (
				<VideoPlayer onBack={onClose} source={{ uri: url }} />
			) : (
				<WebView source={{ uri: url }} style={style.fullscreen} />
			)}
		</Modal>
	);
};

const style = StyleSheet.create({
	fullscreen: {
		width: '100%',
		height: '100%',
		backgroundColor: 'black',
	},
});

export default FullscreenPlayer;