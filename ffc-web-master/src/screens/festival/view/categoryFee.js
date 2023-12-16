import React, { PureComponent } from "react";
import {
	View,
	Text,
} from "react-native";
import FeatherIcon from "feather-icons-react";
import style from "./style";
import colors from "themes/colors";

export default class CategoryFee extends PureComponent {
	renderCategory = (data) => {
		return (
			<View style={style.categoryCard} key={data.id}>
				<Text style={style.categoryText}>{data.name}</Text>
				<FeatherIcon
					icon="chevron-right"
					color={colors.holderColor}
					size={22}
				/>
			</View>
		)
	}
	render(){
		const {
			data
		} = this.props;
		return (data || []).map(this.renderCategory);
	}
};
