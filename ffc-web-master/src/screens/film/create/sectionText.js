import { View, Text } from "react-native";
import { festivalDetailStyles as style } from "./style";

const SectionText = ({ text, subText = null }) => {
	return (
		<View style={style.sectionCover}>
			<Text style={style.sectionText}>{text}</Text>
			{subText ? (
				<Text style={style.sectionSubText}>{subText}</Text>
			) : null}
		</View>
	);
};

export default SectionText;