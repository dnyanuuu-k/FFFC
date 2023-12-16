import React from "react";
import {
	View,
	Text
} from "react-native";
import FeatherIcon from "feather-icons-react";
import colors from "themes/colors";
import style from "./style";

const Link = ({ icon, url, label }) => {
	return (
		<View style={style.linkRow}>
			<View style={style.linkIcon}>
				<FeatherIcon
					icon={icon}
					size={20}
					color={colors.holderColor}
				/>
			</View>
			<Text style={style.link}>{label}</Text>
		</View>
	)
}

export default Link;