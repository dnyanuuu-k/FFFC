import React, { useState } from "react";
import { Animated, ImageBackground } from "react-native";
import { Blurhash } from "react-blurhash";
import { STATIC_URL } from "utils/constants";
const Image = (props) => {
	const { animated = true } = props;
	const [imageLoaded, setImageLoaded] = useState(false);
	const uri = props.url ? STATIC_URL + props.url : props.source;
	const [opacity] = useState(new Animated.Value(1));

	const handleLoad = () => {
		if(animated){
			Animated.timing(opacity, {
				toValue: 0,
				duration: 250,
				useNativeDriver: false
			}).start(() => setImageLoaded(true));
		}else{
			setImageLoaded(true)
		}		
	}

	return (
		<ImageBackground
			style={props.style}
			source={{ uri }}
			resizeMode={props.resizeMode}
			imageStyle={{ borderRadius: props?.style?.borderRadius }}
			onLoad={handleLoad}
		>
			{animated && props?.hash && !imageLoaded ? 
				<Animated.View style={{ opacity }}><Blurhash
					hash={props.hash}
					width={props?.style?.width}
					height={props?.style?.height}
				/></Animated.View>
			: null}
		</ImageBackground>
	)
};

export default Image;