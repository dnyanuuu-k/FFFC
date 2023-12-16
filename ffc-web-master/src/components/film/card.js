import React from "react";
import {
	View,
	Text,
	Image,
	StyleSheet
} from "react-native";
import PropTypes from "prop-types";
import shadows from "../../themes/shadows";
import colors from "../../themes/colors";
import { Blurhash } from "react-blurhash";

const thumbUrl =
	"https://m.media-amazon.com/images/M/MV5BYzczMzllN2UtNDJmOS00MmE5LWE2MWYtNGEwODcwMDc2M2YyXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_FMjpg_UX450_.jpg";
const thumbHash = "LQJ?1+n5TIa#}tjZs-jG03o|Vtae";

const FilmCard = ({ currency, width, height, data, imageWidth, imageHeight }) => {
	if(!data) return null;
	return (
		<View style={{ width, height }}>
			<Blurhash
				hash={thumbHash}
				width={width}
				height={height}
			/>
			<View style={[style.content, { width, height }]}>
				<Image
					source={{ uri: thumbUrl }}
					style={[{width: imageWidth, height: imageHeight}, style.image]}
				/>
				<Text style={style.title}>
					{data.title}
				</Text>
				<Text style={style.description}>
					{data.shortSummary}
				</Text>
			</View>
		</View>
	)
}

FilmCard.defaultProps = {
	width: 300,
	height: 400,
	imageWidth: 120,
	imageHeight: 150
}


FilmCard.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	imageWidth: PropTypes.number,
	imageHeight: PropTypes.number
}

const style = StyleSheet.create({
	content: {
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		backgroundColor: colors.bgTrans69
	},
	image: {
		boxShadow: shadows.material,
		backgroundColor: colors.vectorBase
	},
	title: {
		fontSize: 20,
		marginTop: 20,
		textAlign: "center",
		fontWeight: "bold",
		color: colors.wht,
		paddingHorizontal: 20
	},
	description: {
		fontSize: 15,
		marginTop: 10,
		fontWeight: "400",
		color: colors.wht,
		paddingHorizontal: 20,
		textAlign: "center"
	}
});

export default FilmCard;