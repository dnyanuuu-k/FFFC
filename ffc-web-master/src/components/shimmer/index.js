import React from "react";
import { View, StyleSheet } from "react-native";
import colors from "themes/colors";

const Shimmer = (props) => (
	<div className="shimmer">
		{props.children}
	</div>
);

export const ShimmerView = (props) => (
	<View style={[props.style, style.base]} />
);

const style = StyleSheet.create({
	base: {
		backgroundColor: colors.shimmerColor
	}
})

export default Shimmer;