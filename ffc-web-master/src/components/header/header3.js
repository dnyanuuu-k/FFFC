/*
	Header For Festival Preview Page
*/
import React, { PureComponent } from "react";
import {
	View,
	Text,
	StyleSheet
} from "react-native";
import { FESTIVAL_HEADER_HEIGHT, FORM_SM_FONT_SIZE, WINDOW_WIDTH, FESTIVAL_TITLE_FONTSIZE } from "utils/constants";
import FeatherIcon from "feather-icons-react"
import colors from "themes/colors";
// import colors from "themes/colors";

export default class Header extends PureComponent {
	render(){
		const {
			title,
			subTitle
		} = this.props;
		return (
			<View style={style.header}>
				<View style={style.button}>
					<FeatherIcon
						icon='arrow-left'
						color={colors.buttonTxt}
						size={25}
					/>
				</View>
				<View style={style.content}>
					<Text style={style.title}>
						{title}
					</Text>
					<Text style={style.subTitle}>
						{subTitle}
					</Text>
				</View>
				<View style={style.button}>
					<FeatherIcon
						icon='share-2'
						color={colors.buttonTxt}
						size={25}
					/>					
				</View>
				<View style={style.button}>
					<FeatherIcon
						icon='bookmark'
						color={colors.buttonTxt}
						size={25}
					/>					
				</View>
				<View style={style.button}>
					<FeatherIcon
						icon='edit'
						color={colors.buttonTxt}
						size={25}
					/>					
				</View>
			</View>
		)
	}
}

const style = StyleSheet.create({
	header: {
		height: FESTIVAL_HEADER_HEIGHT,
		width: WINDOW_WIDTH,
		backdropFilter: 'brightness(70%) blur(5px)',
		backgroundColor: 'rgba(0, 0, 0, .4)',
		position: "fixed",
		top: 0,
		flexDirection: "row",
	},
	content: {
		flex: 1,
		justifyContent: 'center'
	},
	button: {
		width: FESTIVAL_HEADER_HEIGHT,
		height: FESTIVAL_HEADER_HEIGHT,
		justifyContent: "center",
		alignItems: "center"
	},
	title: {
		fontSize: FESTIVAL_TITLE_FONTSIZE,
		color: colors.buttonTxt,
		fontWeight: '600'
	},
	subTitle: {
		fontSize: FORM_SM_FONT_SIZE,
		color: colors.darkCement,
		fontWeight: '300',
		marginTop: 5,
	}
});