import React, { useState } from 'react';
import { Animated, ImageBackground } from 'react-native';
import { Blurhash } from 'react-native-blurhash';
import { STATIC_URL } from 'utils/constants';

const defaultStyle = { overflow: 'hidden' };
const Image = (props) => {
	const { animated = true } = props;
	const [imageLoaded, setImageLoaded] = useState(false);
	const uri = STATIC_URL + props.url;
	const [opacity] = useState(new Animated.Value(1));

	const handleLoad = (e) => {
		const src = e?.nativeEvent?.source;
		if (uri && src && src?.width > 1) {
			if (animated) {
				Animated.timing(opacity, {
					toValue: 0,
					duration: 250,
					useNativeDriver: false,
				}).start(() => setImageLoaded(true));
			} else {
				setImageLoaded(true);
			}
		}
	};

	return (
		<ImageBackground
			style={[props.style, defaultStyle]}
			source={{ uri }}
			resizeMode={props.resizeMode}
			imageStyle={{ borderRadius: props?.style?.borderRadius }}
			onLoad={handleLoad}
		>
			{animated && props?.hash && !imageLoaded ? (
				<Animated.View style={{ opacity }}>
					<Blurhash
						blurhash={props.hash}
						width={props?.style?.width}
						height={props?.style?.height}
					/>
				</Animated.View>
			) : null}
		</ImageBackground>
	);
};

export default Image;
