import React from "react";
import { StyleSheet } from "react-native";
import colors from "themes/colors";

const Rating = ({ color, progress, size }) => {
	return (
		<div style={style.cover}>
			<div
				style={{
					width: `${progress}%`,					
					color,
					...style.foreground,	
				}}
			>
				<span style={{ fontSize: size }} class="istar"></span>
				<span style={{ fontSize: size }} class="istar"></span>
				<span style={{ fontSize: size }} class="istar"></span>
				<span style={{ fontSize: size }} class="istar"></span>
				<span style={{ fontSize: size }} class="istar"></span>
			</div>
			<div style={style.background}>
				<span style={{ fontSize: size }} class="istar"></span>
				<span style={{ fontSize: size }} class="istar"></span>
				<span style={{ fontSize: size }} class="istar"></span>
				<span style={{ fontSize: size }} class="istar"></span>
				<span style={{ fontSize: size }} class="istar"></span>
			</div>
		</div>
	);
};

const style = StyleSheet.create({
	foreground: {
		display: "block",
		left: 0,
		overflow: "hidden",
		position: "absolute",
		top: 0,
	},
	background: {
		color: colors.darkCement,
	},
	cover: {
		display: "inline-block",
		position: "relative",
		whiteSpace: "nowrap",
		width: 'fit-content'
	},
});

Rating.defaultProps = {
	color: colors.primaryBlue,
	progress: 100,
	size: 20
};

export default Rating;