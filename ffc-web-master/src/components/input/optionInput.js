import React, { Component, PureComponent } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
} from "react-native";
import {
	BORDER_RADIUS,
	BUTTON_HEIGHT,
	WINDOW_HALF_HEIGHT,
	WINDOW_HEIGHT
} from "utils/constants";
import colors from "themes/colors";
import FeatherIcon from "feather-icons-react";
import OverlayPortal from "../overlay/portal";
import shadows from "themes/shadows";

const POPUP_HEIGHT = 210;
class OptionInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			busy: false,
			err: false,
			pickerVisible: false,
			popupStyle: {},
			hasSelected: false,
		};
		this.timeout = null;
	}

	showPicker = () => {
		const visibleOptions = this.props.options;		
		this.inputHolder.measure((fx, fy, width, height, leftx, topy) => {
			const popupStyle = {
				width,
				left: leftx,
			};
			if(topy > WINDOW_HALF_HEIGHT){
				popupStyle.bottom = WINDOW_HEIGHT - topy;
			}else{
				popupStyle.top = topy + height;
			}
			this.setState({
				pickerVisible: true,
				hasSelected: false,
				visibleText: "",
				visibleOptions,
				popupStyle
			});
		});
	};

	handleSelect = (selected) => {
		this.setState(
			{ pickerVisible: false, visibleText: selected.label, hasSelected: true },
			() => {
				this.props?.onSelect(selected);
			}
		);
	};

	closePicker = (event, tag) => {
		const countryPicker = document.getElementById("optionPicker");
		if (!countryPicker?.contains(event.relatedTarget)) {
			const { hasSelected, visibleText } = this.state;
			this.setState({ pickerVisible: false, visibleText: hasSelected ? visibleText : undefined });
		}
	};

	handleChangeText = (visibleText) => {
		const { options } = this.props;
		const searchText = visibleText.toLowerCase();
		const visibleOptions = options?.filter(({ label }) =>
			label?.toLowerCase()?.includes(searchText)
		);
		this.setState({ visibleText }, () => {
			this.setState({ visibleOptions });
		});
	};

	renderOverlay = () => {
		const { popupStyle, visibleOptions } = this.state;
		return (
			<TouchableOpacity
				id="optionPicker"
				activeOpacity={1}
				style={[style.popup, popupStyle]}
				// onBlur={(d) => this.closePicker(d, "buttn")}
			>
				<OptionViewer
					value={this.props?.selectedOption?.value}
					visibleOptions={visibleOptions}
					width={popupStyle.width}
					onSelect={this.handleSelect}
				/>
			</TouchableOpacity>
		);
	};

	render() {
		const props = this.props;
		const { pickerVisible, visibleText } = this.state;
		const borderColor = pickerVisible
			? colors.primaryBlue
			: colors.borderColor;
		const label = visibleText === undefined ? props.selectedOption?.label : visibleText;
		return (
			<>
				<View
					style={[defaultStyle, props.style, { borderColor }]}
					ref={ref => this.inputHolder = ref}
				>
					<TextInput
						{...props.inputProps}
						value={label}
						ref={ref => this.currentInput = ref}
						onFocus={this.showPicker}
						onBlur={(d, c) => this.closePicker(d, "Inout")}
						style={[style.inputStyle, props.textStyle]}
						onChangeText={this.handleChangeText}
						placeholderTextColor={colors.holderColor}
					/>
					<TouchableOpacity onPress={() => this.currentInput.focus()} style={style.downIcon}>
						<FeatherIcon
							icon="chevron-down"
							size={20}
							color={colors.holderColor}
						/>
					</TouchableOpacity>
				</View>
				<OverlayPortal>
					{pickerVisible ?
						this.renderOverlay()
					: null}
				</OverlayPortal>
			</>
		);
	}
}

class OptionViewer extends PureComponent {
	render(){
		const { visibleOptions, value } = this.props		
		return visibleOptions.map((option, idx) => {
			const selected = value === option?.value;
			const backgroundColor = selected ? colors.primaryBlue : colors.popupBg;
			const color = selected ? colors.buttonTxt : colors.textBlack;
			return (
				<TouchableOpacity onPress={() => this.props?.onSelect(option)} style={[style.option, {backgroundColor}]} key={option.value}>
					<Text style={[style.optionText, { color }]}>{option?.label}</Text>
				</TouchableOpacity>
			)
		})
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
		outline: 'none'
	},
	downIcon: {
		width: 30,
		outline: "none",
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
		maxHeight: POPUP_HEIGHT,
		outline: "none",
		cursor: "default",
		overflow: 'hidden',
		elevation: 20,
		overflowY: "auto",
		boxShadow: shadows.basic,
	},
	option: {
		height: 40,
		outline: "none",
		flexDirection: "row",
		alignItems: "center",
	},
	optionText: {
		marginLeft: 10,
		fontSize: 15,
		color: colors.textBlack,
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

OptionInput.defaultProps = {
	style: {},
	onSelect: () => {},
	inputProps: {},
	textStyle: {},
	selectedOption: {},
	options: []
};

export default OptionInput;