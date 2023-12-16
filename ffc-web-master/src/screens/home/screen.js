import React, { Component } from "react";
import { View, StyleSheet } from "react-native";

// Constants
import colors from "themes/colors";
import helper from "utils/helper";
import {
	CONTENT_HEIGHT2,
	BORDER_RADIUS,
	FULLBAR_WIDTH,
	ERROR_TEXT
} from "utils/constants";

// Custom Components
import BaseHeader from "components/header/base";
import FestivalContent from "./festival";
import UserContent from "./user";

// Third Party Components
import toast from "react-hot-toast";

export default class HomeScreen extends Component {
	render() {
		return (
			<View>
				<BaseHeader title="Home Screen" />
				<View style={style.main}>
					<FestivalContent />
					<UserContent />					
				</View>
			</View>
		);
	}
}

const style = StyleSheet.create({
	main: {
		width: FULLBAR_WIDTH,
		height: CONTENT_HEIGHT2,
		backgroundColor: colors.vectorBase,
		flexDirection: "row"
	}	
});