import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BORDER_RADIUS, BUTTON_FORM_HEIGHT, FORM_FONT_SIZE } from "utils/constants";
import colors from "themes/colors";
import FeatherIcon from "feather-icons-react";

class Radio extends Component {
	constructor(props){
		super(props);
		this.state = {
			value: null
		}
	}

	componentWillReceiveProps(n) {
		const p = this.state;
	    if(p.value === n.value || p.value?.length === n.value?.length){
			return false;
		}
		if(n.multiple){
			if(!p.multiple || p.value?.length !== n.value?.length){
				const value = new Set(n?.value || []);
				this.setState({ value });
			}
			return true;
		}else{
			this.setState({ value: n.value });
			return true;
		}
  	}

	handleChange = (v) => {		
		let { value, onChange, multiple } = this.props;
		if(!multiple){
			onChange(v);
			return
		}
		const idx = (value || []).indexOf(v);
		if(idx !== -1){
			value.splice(idx, 1);
		}else if(value?.length > 0){
			value.push(v);
		}else{
			value = [v];
		}
		this.props.onChange(value);
	}

	renderOption = (option) => {
		const { multiple, iconSize, cardStyle, height, width, textStyle } = this.props;
		const { value } = this.state;
		const selected = multiple ? value?.has(option.value) : option.value === value;
		const color = selected ? colors.primaryBlue : colors.holderColor;
		const borderColor = selected ? colors.primaryBlue : colors.borderColor;
		const backgroundColor = selected ? colors.primaryLight : colors.popupBg;
		return (
			<TouchableOpacity
				onPress={() => this.handleChange(option.value)}
				style={[style.option, cardStyle, { height, minWidth:width, borderColor, backgroundColor }]}
				key={option.value}
			>
				<Text style={[style.optionText, { color }, textStyle]}>
					{option.label}
				</Text>
				{selected ? (
					<View style={style.icon}>
						<FeatherIcon
							icon="check"
							color={colors.primaryBlue}
							size={iconSize}
						/>
					</View>
				) : null}
			</TouchableOpacity>
		);
	};

	render() {
		const { options, bodyStyle } = this.props;
		return (
			<View style={[style.main, bodyStyle]}>
				{(options || []).map(this.renderOption)}
			</View>
		);
	}
}

const style = {
	main: {
		flexDirection: "row",
		flexWrap: "wrap"
	},
	option: {
		borderRadius: BORDER_RADIUS,
		borderColor: colors.borderColor,
		borderWidth: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 10,
		outline: "none"
	},
	optionText: {
		fontSize: FORM_FONT_SIZE,
	},
	icon: {
		justifyContent: "center",
		alignItems: "center",
	},
};

Radio.defaultProps = {
	height: BUTTON_FORM_HEIGHT,
	width: 150,
	iconSize: 20,
	bodyStyle: {},
	cardStyle: {
		marginRight: 20,
	},
	multiple: false,
	onChange: () => {},
	textStyle: {},
	value: []
};

export default Radio;