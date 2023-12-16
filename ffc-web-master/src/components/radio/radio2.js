import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BORDER_RADIUS, FORM_SM_FONT_SIZE } from "utils/constants";
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
		const { multiple, cardStyle, height, width, textStyle } = this.props;
		const { value } = this.state;
		const selected = multiple ? value?.has(option.value) : option.value === value;
		const backgroundColor = selected ? colors.primaryBlue : colors.popupBg;
		return (
			<TouchableOpacity
				onPress={() => this.handleChange(option.value)}
				style={[style.option, cardStyle, { height, minWidth:width }]}
				key={option.value}
			>
				<View style={[style.icon, { backgroundColor }]}>
				{selected ? (
						<FeatherIcon
							icon="check"
							color={colors.buttonTxt}
							size={14}
						/>					
				) : null}
				</View>
				<Text style={[style.optionText, textStyle]}>
					{option.label}
				</Text>
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
		flexWrap: "wrap",
		borderWidth: 1,
		paddingLeft: 5,
		paddingBottom: 10,
		borderRadius: BORDER_RADIUS,
		borderColor: colors.borderColor,
		marginTop: 10
	},
	option: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 10,
		outline: "none"
	},
	optionText: {
		fontSize: FORM_SM_FONT_SIZE,
		marginLeft: 8
	},
	icon: {
		justifyContent: "center",
		alignItems: "center",
		borderRadius: BORDER_RADIUS,
		borderWidth: 1,
		width: 20,
		height: 20,
		borderColor: colors.borderColor
	},
};

Radio.defaultProps = {
	height: 30,
	width: 150,
	bodyStyle: {},
	cardStyle: {},
	multiple: false,
	onChange: () => {},
	textStyle: {},
	value: []
};

export default Radio;