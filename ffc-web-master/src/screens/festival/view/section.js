import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-web-linear-gradient";
import { WINDOW_HALF_HEIGHT } from "utils/constants";
import colors from "themes/colors";
import style from "./style";
const Section = ({
	width,
	title,
	children,
	showOverflow,
	renderButtons,
	readMoreText,
}) => {
	const maxHeight = showOverflow ? WINDOW_HALF_HEIGHT : undefined;
	const [isOverflowing, setIsOverflowing] = useState(false);
	const divRef = useRef();
	const isOverflown = () => {
		const current = divRef?.current;
		if (current) {
			return (
				current.scrollHeight > current.clientHeight ||
				current.scrollWidth > current.clientWidth
			);
		}
		return false;
	};
	useEffect(() => {
		if (showOverflow) {
			const overflowState = isOverflown();
			setIsOverflowing(overflowState);
		}
	}, [children, showOverflow]);

	const renderShowMore = () => {
		return (
			<LinearGradient
				colors={[colors.transparent, colors.wht]}
				style={style.overflowCover}
			>
				<TouchableOpacity style={style.spread}>
					<Text style={style.readMoreText}>{readMoreText}</Text>
				</TouchableOpacity>
			</LinearGradient>
		);
	};

	return (
		<View ref={divRef} style={[style.section, { width, maxHeight }]}>
			{renderButtons ? (
				<View style={style.sectionRow}>
					<Text style={style.sectionTitle}>{title}</Text>
					<View style={style.sectionTabButtons}>
						{renderButtons()}
					</View>
				</View>
			) : (
				<Text style={style.sectionTitle}>{title}</Text>
			)}
			<View style={style.sectionHr} />
			{children}
			{showOverflow && isOverflowing ? renderShowMore() : null}
		</View>
	);
};

Section.defaultProps = {
	width: "100%",
	title: "",
	showOverflow: true,
	readMoreText: "Show More",
};

export default Section;