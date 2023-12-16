import { Text, TouchableOpacity } from "react-native";
import FeatherIcon from "feather-icons-react";
import { festivalDetailStyles as style } from "./style";
import colors from "themes/colors";

const Header = ({title, subTitle}) => {
	return (
		<>
			<Text style={style.title}>{title}</Text>
			<Text style={style.subTitle}>
				{subTitle}
			</Text>
			<TouchableOpacity style={style.previewButton}>
				<FeatherIcon icon="eye" color={colors.textBlack} size={20} />
				<Text style={style.previewText}>Preview</Text>
			</TouchableOpacity>
		</>
	);
};

export default Header;