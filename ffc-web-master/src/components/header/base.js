import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import FeatherIcon from "feather-icons-react";

// Constants
import { NAV_HEADER_HEIGHT, FULLBAR_WIDTH } from "utils/constants";
import colors from "themes/colors";

// Helper Functions
import { useNavigate } from "react-router-dom";

const BaseHeader = ({ title, desc = null }) => {
	const navigate = useNavigate();

	return (
		<View style={style.header}>
			<TouchableOpacity style={style.icon} onPress={() => {
				navigate('../');
			}}>
				<FeatherIcon
					icon="arrow-left"
					color={colors.textBlack}
					size={26}
				/>
			</TouchableOpacity>
			<View style={style.left}>
				<Text style={style.title}>{title}</Text>
				{desc ? <Text style={style.desc}>{desc}</Text> : null}
			</View>
		</View>
	);
};

const style = {
	header: {
		height: NAV_HEADER_HEIGHT,
		width: FULLBAR_WIDTH,
		borderBottomWidth: 1,
		borderColor: colors.borderColor,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.popupBg
	},
	left: {
		marginLeft: 10
	},
	icon: {
		height: NAV_HEADER_HEIGHT,
		width: NAV_HEADER_HEIGHT,
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		fontSize: 18,
		color: colors.textBlack,
		fontWeight: '600'
	},
	desc: {
		fontSize: 14,
		marginTop: 2,
		color: colors.holderColor,
		fontWeight: '400'
	}
};

export default BaseHeader;