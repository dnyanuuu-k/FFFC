import { Text } from "react-native";
import { festivalDetailStyles as style } from "./style";

const Title = ({ text, required = false, marginTop, whatIsThis = null, extraTopMargin = false }) => {
	const extraStyle = extraTopMargin ? { marginTop: 40 } : {};
	return (
		<Text style={[style.fieldTitle, extraStyle, { marginTop }]}>
			{text}
			{required ? <Text style={style.required}>*</Text> : null}
			{whatIsThis ? <Text style={style.note}>What is this?</Text> : null}
		</Text>
	);
};

export default Title;