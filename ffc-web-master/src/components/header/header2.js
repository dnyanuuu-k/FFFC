import React, { Component } from "react";
import { View, Text, Image, Pressable } from "react-native";
import FeatherIcon from "feather-icons-react";
import style from "./style";
import colors from "themes/colors";
// import Backend from "backend";

const logoAsset = require("assets/images/logo.png");

export default class Header extends Component {
	render() {
		return (
			<View style={style.main}>
				<Image
					resizeMode="contain"
					style={style.logo}
					source={logoAsset}
				/>
				<View style={style.optionCover}>
					<Text style={[style.optionText, { marginRight: 40 }]}>
						Get Mobile App
					</Text>
					<Pressable style={style.optionIcon}>
						{({ pressed, focused }) => (
							<FeatherIcon
								icon="bell"
								color={
									pressed || focused
										? colors.primaryBlue
										: colors.textBlack
								}
								size={23}
							/>
						)}
					</Pressable>
					<Pressable style={style.optionIcon}>
						{({ pressed, focused }) => (
							<FeatherIcon
								icon="user"
								color={
									pressed || focused
										? colors.primaryBlue
										: colors.textBlack
								}
								size={23}
							/>
						)}
					</Pressable>
				</View>
			</View>
		);
	}
}