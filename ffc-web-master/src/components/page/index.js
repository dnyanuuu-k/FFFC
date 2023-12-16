import { WINDOW_WIDTH, WINDOW_HEIGHT, CONTENT_HEIGHT } from "utils/constants";
import { View } from "react-native";

const Page = (props) => {
	return (
		<View style={[style.main, props.bodyStyle]}>
			{props.headerComponent}
			<View style={[style.content, props.contentStyle]}>
				{props.children}
			</View>
		</View>
	);
};

const style = {
	main: {
		height: WINDOW_HEIGHT,
		width: WINDOW_WIDTH,
	},
	content: {
		height: CONTENT_HEIGHT,
		width: WINDOW_WIDTH,
	},
};

Page.defaultProps = {
	bodyStyle: {},
	contentStyle: {},
};

export default Page;