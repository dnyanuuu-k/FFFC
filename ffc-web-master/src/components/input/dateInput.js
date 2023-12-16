import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
	BORDER_RADIUS,
	BUTTON_HEIGHT,
	WINDOW_HALF_HEIGHT,
	YYYYMMDD,
	MMMMDDYYYY
} from "utils/constants";
import colors from "themes/colors";
import FeatherIcon from "feather-icons-react";
import DatePicker from "../dateTime/date";
import OverlayPortal from "../overlay/portal";
import shadows from "themes/shadows";
import moment from 'moment';

class DateInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			busy: false,
			err: false,
			pickerVisible: false,
			countries: [],
			visibleCountries: [],
			popupStyle: {},
			selected: "",
		};
		this.timeout = null;
	}

	showPicker = (selected) => {
		this.inputHolder.measure((fx, fy, width, height, leftx, top) => {
			const topAdjusted =
				top > WINDOW_HALF_HEIGHT ? top - 300 : top + height;
			const popupStyle = {
				top: topAdjusted,
				left: leftx,
			};
			this.setState({
				popupStyle,
				pickerVisible: true,
			});
		});
	};

	handleSelect = (selected) => {
		this.setState({ pickerVisible: false }, () => {
			this.props?.onSelect(selected);
		});
	};

	closePicker = (event) => {
		const countryPicker = document.getElementById("datePicker");
		if (!countryPicker?.contains(event.relatedTarget)) {
			this.setState({ pickerVisible: false });
		}
	};

	handleLayout = ({
		nativeEvent: {
			layout: { top, left, height },
		},
	}) => {
		const topAdjusted = top > WINDOW_HALF_HEIGHT ? top - 300 : top + height;
		this.setState({
			popupStyle: {
				top: topAdjusted,
				left,
			},
		});
	};

	renderOverlay = () => {
		const props = this.props;
		const { popupStyle } = this.state;
		return (
			<TouchableOpacity
				id="datePicker"
				activeOpacity={1}
				style={[style.popup, popupStyle]}
				onBlur={this.closePicker}
			>
				<DatePicker
					value={props?.value}
					width={popupStyle.width}
					onChange={this.handleSelect}
				/>
			</TouchableOpacity>
		);
	};

	render() {
		const props = this.props;
		const { pickerVisible } = this.state;
		const borderColor = pickerVisible
			? colors.primaryBlue
			: colors.borderColor;
		const formattedDate = props?.value
			? moment(props?.value, YYYYMMDD).format(MMMMDDYYYY)
			: "";
		return (
			<>
				<TouchableOpacity
					style={[defaultStyle, props.style, { borderColor }]}
					ref={(ref) => (this.inputHolder = ref)}
					onPress={this.showPicker}
					onBlur={this.closePicker}
				>
					<Text style={[style.inputStyle, props?.textStyle]}>
						{formattedDate}
					</Text>
					<View style={style.dateIcon}>
						<FeatherIcon
							icon="calendar"
							size={17}
							color={colors.holderColor}
						/>
					</View>
				</TouchableOpacity>
				<OverlayPortal>
					{pickerVisible ? this.renderOverlay() : null}
				</OverlayPortal>
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
	alignItems: "center",
	paddingHorizontal: 10,
	overflow: "hidden",
	outline: "none",
};

const style = {
	inputStyle: {
		fontSize: 18,
		fontWeight: 300,
		paddingLeft: 5,
		width: "100%",
	},
	dateIcon: {
		width: 30,
		height: "100%",
		justifyContent: "space-around",
		alignItems: "center",
		flexDirection: "row",
	},
	popup: {
		position: "absolute",
		borderRadius: BORDER_RADIUS,
		borderColor: colors.borderColor,
		backgroundColor: colors.popupBg,
		borderWidth: 1,
		zIndex: 1000000,
		width: 290,
		outline: "none",
		cursor: "default",
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
};

DateInput.defaultProps = {
	style: {},
	onSelect: () => {},
	inputProps: {},
	textStyle: {},
	value: "",
};

export default DateInput;
