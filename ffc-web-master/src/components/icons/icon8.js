import React from "react";
import { Pressable, Image } from "react-native";

const baseURL = "https://img.icons8.com/?size=30&format=svg&id=";
const Icon8 = (props) => (
	<Pressable onPress={props.onPress}>
		<Image source={{ uri: baseURL + props.icon }} {...props} />
	</Pressable>
);

Icon8.fb = 8818;
Icon8.linkedin = 8808;
Icon8.insta = 59813;
Icon8.twitter = "01GWmP9aUoPj";

export default Icon8;