import React from "react";
import { View, Text } from "react-native";
import style from "./style";

const Organizers = ({ list } = {}) => {
	const render = (data, index) => (
		<View style={style.organizerCover} key={index}>
			<Text numberOfLines={1} style={style.organizerName}>{data.name}</Text>
			<Text numberOfLines={1} style={style.organizerDesignation}>{data.designation}</Text>
		</View>
	);
	return <View style={style.organizerRow}>{list.map(render)}</View>;
};

export default Organizers;