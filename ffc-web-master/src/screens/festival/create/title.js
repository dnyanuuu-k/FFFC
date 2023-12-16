import React, { useState } from "react";
import { View, Text } from "react-native";
import { festivalDetailStyles as style } from "./style";
import colors from "themes/colors";
import shadows from "themes/shadows";
import { FORM_SM_FONT_SIZE } from "utils/constants";
import OverlayPortal from "components/overlay/portal";
import ZoomIn from 'animations/zoomIn';

const Title = ({
	text,
	required = false,
	marginTop,
	whatIsThis = null,
	extraTopMargin = false,
}) => {
	const [tooltipVisible, setTooltipVisible] = useState(false);
	const [tooltipPosition, setTooltipPosition] = useState({});
	const extraStyle = extraTopMargin ? { marginTop: 40 } : {};

	const showTooltip = ({ nativeEvent: { relatedTarget } }) => {
		if (typeof whatIsThis === "string") {
			setTooltipVisible(true);
			let targetRect = relatedTarget.getBoundingClientRect();
			console.log(targetRect.top, targetRect.left);
			setTooltipPosition({
				top: -targetRect.top,
				left:  targetRect.left,
			});
		}
	};

	const hideTooltip = () => {
		setTooltipVisible(false);
		setTooltipPosition({});
	};

	const handleLayout = ({
		nativeEvent: {
			layout: { height, width },
		},
	}) => {		
		setTimeout(() => {
			const tp = {...tooltipPosition};
			tp.top = -tooltipPosition.top - (height + 15);
			setTooltipPosition(tp);
		}, 100);
	};

	return (
		<>
			<Text style={[style.fieldTitle, extraStyle, { marginTop }]}>
				{text}
				{required ? <Text style={style.required}>*</Text> : null}
				{whatIsThis ? (
					<Text
						onMouseEnter={showTooltip}
						onMouseLeave={hideTooltip}
						style={style.tooltip}
					>
						What is this?
					</Text>
				) : null}
			</Text>
			<OverlayPortal>
				{tooltipVisible ? (
						<ZoomIn
							autoAnimate
							origin="left bottom"
							onLayout={handleLayout}
							sty={{...tooltipStyle.main, ...tooltipPosition}}
						>
							<Text style={tooltipStyle.text}>{whatIsThis}</Text>
						</ZoomIn>
				) : null}
			</OverlayPortal>
		</>
	);
};

const tooltipStyle = {
	main: {
		fontSize: 15,
		padding: 10,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomRightRadius: 10,
		borderBottomLeftRadius: 0,
		position: "absolute",
		maxWidth: 200,
	},
	text: {
		color: colors.textBlack,
		fontSize: FORM_SM_FONT_SIZE,
	},
};

export default Title;