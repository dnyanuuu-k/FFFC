import {
	View,
	Text
} from "react-native";
import colors from "themes/colors";

const Footer1 = ({ style = {}}) => {
	return (
		<View style={style}>
			<View style={defaultStyle.row}>
				<Text style={defaultStyle.option}>Privacy Policy</Text>
				<Text style={defaultStyle.option}>Terms and Condition</Text>
				<Text style={defaultStyle.option}>About</Text>
			</View>
			<Text numberOfLines={1} style={defaultStyle.rights}>© 2023 All Rights Reserved</Text>
		</View>
	)
}

const defaultStyle = {
	row: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 15
	},
	option: {
		color: colors.holderColor,
		fontWeight: 300,
		fontSize: 15,
	},
	rights: {
		fontSize: 13,
		color: colors.holderColor,
		fontWeight: 300,
		width: "100%",
		textAlign: "center"
	}
}

export default Footer1;