import React, { Component } from "react";
import { View, Text, Animated, Image, StyleSheet } from "react-native";
import {
	// WINDOW_WIDTH,
	WINDOW_HEIGHT,
	SIDEBAR_FULL_WIDTH,
	// SIDEBAR_SMALL_WIDTH,
	NAV_HEADER_HEIGHT,
} from "utils/constants";
import {
	HomeIcon,
	MessageIcon,
	CartIcon,
	BellIcon,
	FilmIcon,
	FestivalIcon,
	PhoneIcon,
	SupportIcon
} from "components/icons";
import colors from "themes/colors";
import logoImage from "assets/images/logo.png";

class SideBar extends Component {
	render() {
		return (
			<Animated.View style={style.sideBar}>
				<View style={style.header}>
					<Image
						resizeMode="contain"
						source={logoImage}
						style={style.logoImage}
					/>
				</View>

				<View style={style.tab}>
					<HomeIcon filled />
					<Text style={style.label}>Home</Text>
				</View>

				<View style={style.tab}>
					<FestivalIcon />
					<Text style={style.label}>Festivals</Text>
				</View>

				<View style={style.tab}>
					<FilmIcon />
					<Text style={style.label}>Films</Text>
				</View>

				<View style={style.tab}>
					<CartIcon />
					<Text style={style.label}>Cart</Text>
				</View>

				<View style={style.tab}>
					<MessageIcon />
					<Text style={style.label}>Messages</Text>
				</View>

				<View style={style.tab}>
					<BellIcon />
					<Text style={style.label}>Notifications</Text>
				</View>

				<View style={style.hr} />

				<View style={style.tab}>
					<SupportIcon />
					<Text style={style.label}>Support</Text>
				</View>

				<View style={style.tab}>
					<PhoneIcon />
					<Text style={style.label}>Mobile Apps</Text>
				</View>
			</Animated.View>
		);
	}
}

const style = StyleSheet.create({
	sideBar: {
		height: WINDOW_HEIGHT,
		backgroundColor: colors.popupBg,
		borderRightWidth: 1,
		borderColor: colors.borderColor,
		width: SIDEBAR_FULL_WIDTH,
	},
	header: {
		height: NAV_HEADER_HEIGHT,
		width: SIDEBAR_FULL_WIDTH,
		borderBottomWidth: 1,
		borderColor: colors.borderColor,
		justifyContent: "center",
		paddingLeft: 10,
	},
	logoImage: {
		height: 28,
		width: 160,
		tintColor: colors.textBlack
	},
	tab: {
		flexDirection: "row",
		height: 50,
		marginTop: 30,
		alignItems: "center",
		paddingLeft: 16,
	},
	label: {
		fontSize: 18,
		color: colors.textBlack,
		fontWeight: "500",
		marginLeft: 24,
	},
	hr: {
		width: "90%",
		height: 1,
		marginTop: 30,
		alignSelf: "center",
		backgroundColor: colors.borderColor,
	},
});

export default SideBar;