/*
	Header For Modal
*/
import React, { PureComponent } from "react";
import {
	View,
	Text,
	StyleSheet
} from "react-native";
import { MODAL_TITLE_FONT_SIZE, HEADER_HEIGHT } from "utils/constants";
import FeatherIcon from "feather-icons-react"
import colors from "themes/colors";
// import colors from "themes/colors";

export default class Header extends PureComponent {
	render(){
		const {
			title
		} = this.props;
		return (
			<View style={style.header}>
				<View style={style.button}>
					<FeatherIcon
						icon='arrow-left'
						color={colors.textBlack}
						size={22}
					/>
				</View>
				<View style={style.content}>
					<Text style={style.title}>
						{title}
					</Text>
				</View>
			</View>
		)
	}
}

const style = StyleSheet.create({
	header: {
		height: HEADER_HEIGHT,
		width: "100%",
		borderBottomWidth: 1,
		borderColor: colors.borderColor,
		flexDirection: "row",
	},
	content: {
		flex: 1,
		justifyContent: 'center'
	},
	button: {
		width: HEADER_HEIGHT,
		height: HEADER_HEIGHT,
		justifyContent: "center",
		alignItems: "center"
	},
	title: {
		fontSize: MODAL_TITLE_FONT_SIZE,
		color: colors.textBlack,
		fontWeight: '600'
	}
});