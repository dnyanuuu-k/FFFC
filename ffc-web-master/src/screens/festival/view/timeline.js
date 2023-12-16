import React, { PureComponent } from "react";
import { View, Text } from "react-native";
import style from "./style";
import colors from "themes/colors";

const getStateData = (isExpired, isCurrent) => {
	const stateDate = {};
	stateDate.fontSize = 16;
	stateDate.fontWeight = "300";
	stateDate.color2 = colors.holderColor;	
	if (isExpired) {
		stateDate.text = "Expired";
		stateDate.color = colors.holderColor;
		stateDate.ballColor = colors.holderColor;
	} else if (isCurrent) {
		stateDate.color2 = colors.greenDark;
		stateDate.color = colors.greenDark;
		stateDate.ballColor = colors.greenDark;
		stateDate.fontSize = 20;
		stateDate.text = null;
		stateDate.fontWeight = "600";
	} else {
		stateDate.text = "Upcoming";
		stateDate.color = colors.textBlack;
		stateDate.ballColor = colors.primaryBlue;
	}
	return stateDate;
};

export default class Timeline extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {};
	}

	renderEvent = (event, index) => {
		const stateData = getStateData(event.isExpired, event.isCurrent);
		return (
			<View key={index} style={style.timeCard}>
				<Text style={[style.timeDate, {color: stateData.color2 }]}>{event.date}</Text>
				<View style={style.timeBar}>
					<View style={[style.timeBall, {
						backgroundColor: stateData.ballColor
					}]} />
				</View>
				<View style={style.timeText}>
					<Text
						style={{
							color: stateData.color,
							fontSize: stateData.fontSize,
							fontWeight: stateData.fontWeight,
						}}
						numberOfLines={2}
					>
						{event.title}
					</Text>
					{stateData.text ? <Text
						style={style.timeSubText}
						numberOfLines={2}
					>
						{stateData.text}
					</Text> : null}
				</View>
			</View>
		);
	};

	render() {
		const { events } = this.props;
		return (
			<View style={style.timeline}>{events.map(this.renderEvent)}</View>
		);
	}
}