import React from "react";
import { View, Text } from "react-native";
import Image from "components/image";
import style from "./style";

const PhotoRow = (props) => {
	const { list = [], more } = props?.data || {};
	return (
		<>
			<View style={style.photoRow}>
				{list.map((photo) => {
					return (
						<View style={style.photoCover}>
							<Image
								hash={photo.hash}
								url={photo.url}
								style={style.photoView}
							/>
						</View>
					);
				})}
				{more ?
					<View style={style.photoCover}>
						<Image
							hash={more.hash}
							url={more.url}
							style={style.photoView}
						/>
						<View style={style.photoMoreHolder}>
							<Text style={style.photoMoreText}>+{more.count}</Text>
						</View>
					</View>
				: null}
			</View>
		</>
	);
}

export default PhotoRow;