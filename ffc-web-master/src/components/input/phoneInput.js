import React, { Component } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { BORDER_RADIUS, BUTTON_HEIGHT } from "utils/constants";
import colors from "themes/colors";
import shadows from "themes/shadows";
import toast from "react-hot-toast";

import FeatherIcon from "feather-icons-react";
import Backend from "backend";

class PhoneInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			busy: false,
			err: false,
			pickerVisible: false,
			countries: [],
			visibleCountries: [],
			popupStyle: {},
			selected: {
				code: "IN",
				flag: "🇮🇳",
				dial_code: "+91",
			},
		};
		this.timeout = null;
	}

	componentDidMount() {
		this.loadCountries();
	}

	loadCountries = async () => {
		try {
			this.setState({ busy: true, err: false });
			const response = await Backend.Country.getAll();
			if (response?.success) {
				this.setState({
					countries: response.data,
					visibleCountries: response.data,
				});
			}
		} catch (err) {
			this.setState({ err: true });
		} finally {
			this.setState({ busy: false });
		}
	};

	showPicker = () => {
		const { busy, err } = this.state;
		if (busy || err) {
			toast.error("Please wait!");
			return;
		}
		//Show Picker
		this.setState({ pickerVisible: true }, () => {
			this.pickerInput.focus();
		});
	};

	handleSelect = (selected) => {
		this.setState({ selected, pickerVisible: false });
	};

	closePicker = (event) => {
		const countryPicker = document.getElementById("countryPicker");
		if (!countryPicker.contains(event.relatedTarget)) {
			this.setState({ pickerVisible: false });
		}
	};

	handleLayout = ({
		nativeEvent: {
			layout: { x, y, width, height },
		},
	}) => {
		this.setState({
			popupStyle: {
				top: y + height + 10,
				left: x,
				width,
			},
		});
	};

	searchCountries = (text) => {
		clearTimeout(this.timeout);
		const setCountries = () => {
			const { countries } = this.state;
			const visibleCountries = countries.filter((c) =>
				c.name.toLowerCase().includes(text.toLowerCase())
			);
			this.setState({ visibleCountries });
		};
		this.timeout = setTimeout(setCountries, 600);
	};

	renderVisibleCountries = (country) => {
		const { flag, name } = country;
		return (
			<TouchableOpacity
				onPress={() => this.handleSelect(country)}
				style={style.countryCard}
			>
				<Text style={style.countryFlag}>{flag}</Text>
				<Text style={style.countryName}>{name}</Text>
			</TouchableOpacity>
		);
	};

	render() {
		const props = this.props;
		const {
			selected,
			focused,
			popupStyle,
			pickerVisible,
			visibleCountries,
		} = this.state;
		const borderColor = focused ? colors.primaryBlue : colors.borderColor;
		return (
			<>
				<View
					style={[defaultStyle, props.style, { borderColor }]}
					onLayout={this.handleLayout}
				>
					<TouchableOpacity
						onPress={this.showPicker}
						style={style.country}
					>
						<Text style={style.codeStyle}>{selected.flag}</Text>
						<FeatherIcon
							icon="chevron-down"
							size={17}
							color={colors.holderColor}
						/>
					</TouchableOpacity>
					<TextInput
						{...props.inputProps}
						onFocus={() => this.setState({ focused: true })}
						onBlur={() => this.setState({ focused: false })}
						style={style.inputStyle}
						placeholderTextColor={colors.holderColor}
					/>
				</View>
				{pickerVisible ? (
					<View
						id="countryPicker"
						style={[style.popup, popupStyle]}
						onBlur={this.closePicker}
					>
						<View style={style.pickerHeader}>
							<FeatherIcon
								style={style.iconStyle}
								icon="search"
								color={colors.holderColor}
								size={17}
							/>
							<TextInput
								style={style.searchInputStyle}
								placeholderTextColor={colors.holderColor}
								placeholder="Search Country Name"
								onChangeText={this.searchCountries}
								onBlur={this.closePicker}
								ref={(ref) => (this.pickerInput = ref)}
							/>
						</View>
						<View style={style.countryContent}>
							{visibleCountries.map(this.renderVisibleCountries)}
						</View>
					</View>
				) : null}
			</>
		);
	}
}

const defaultStyle = {
	borderColor: colors.borderColor,
	borderRadius: BORDER_RADIUS,
	borderWidth: 1,
	height: BUTTON_HEIGHT,
	flexDirection: "row",
	paddingHorizontal: 10,
	overflow: "hidden"
};

const style = {
	inputStyle: {
		height: BUTTON_HEIGHT,
		fontSize: 18,
		fontWeight: 300,
		paddingLeft: 5,
		outline: "none",
	},
	country: {
		width: 60,
		height: BUTTON_HEIGHT,
		justifyContent: "space-around",
		alignItems: "center",
		flexDirection: "row",
		outline: "none"
	},
	codeStyle: {
		fontSize: 22,
		fontWeight: 300,
	},
	popup: {
		position: "absolute",
		borderRadius: BORDER_RADIUS,
		borderColor: colors.borderColor,
		height: 210,
		backgroundColor: colors.popupBg,
		borderWidth: 1,
		zIndex: 1,
		elevation: 20,
		boxShadow: shadows.basic,
	},
	pickerHeader: {
		height: 40,
		width: "100%",
		borderBottomWidth: 1,
		borderColor: colors.borderColor,
		flexDirection: "row",
		alignItems: "center",
	},
	searchInputStyle: {
		height: 40,
		fontSize: 15,
		fontWeight: 300,
		paddingLeft: 5,
		outline: "none",
	},
	iconStyle: {
		marginLeft: 10,
		marginRight: 10,
	},
	countryCard: {
		height: 40,
		outline: "none",
		flexDirection: "row",
		alignItems: "center",
	},
	countryFlag: {
		fontSize: 15,
		marginLeft: 10,
	},
	countryName: {
		marginLeft: 10,
		fontSize: 15,
		color: colors.textBlack,
	},
	countryContent: {
		overflowY: "auto",
		height: 160,
	},
};

PhoneInput.defaultProps = {
	style: {},
	inputProps: {},
};

export default PhoneInput;