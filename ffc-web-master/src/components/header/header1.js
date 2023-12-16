import { View, Text, Image } from "react-native";
import style from "./style";

const logoAsset = require("assets/images/logo.png");

const Header = () => {
	return (
		<View style={style.main}>
			<Image
				resizeMode="contain"
				style={style.logo}
				source={logoAsset}
			/>
			<View style={style.optionCover}>
				<Text style={style.optionText}>Get Mobile App</Text>
				<Text style={style.optionText}>View Festivals</Text>
				<Text style={style.optionText}>Login</Text>
				<Text style={style.optionSelected}>Create Account</Text>
			</View>
		</View>
	)
}

export default Header;