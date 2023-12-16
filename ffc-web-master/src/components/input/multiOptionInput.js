import React, { Component, PureComponent } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import {
	BUTTON_HEIGHT,
	WINDOW_HALF_HEIGHT,
	FORM_SM_FONT_SIZE,
	BORDER_RADIUS,
	WINDOW_HEIGHT
} from "utils/constants";
import OverlayPortal from "../overlay/portal";
import colors from "themes/colors";
import FeatherIcon from "feather-icons-react";
import shadows from "themes/shadows";

const POPUP_HEIGHT = 300;
class MultiOptionInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			busy: false,
			err: false,
			pickerVisible: false,
			visibleOptions: [],
			popupStyle: {},
			hasSelected: false,
			selectedOptions: [],
			selectedOptionMap: {},
			optionMap: {},
		};
		this.timeout = null;
	}

	componentDidMount(){
		this.invalidate();
	}

	invalidate = () => {
		const visibleText = this.getLabel(this.props?.value?.length || 0);
		this.setState({ visibleText });
	}

	getLabel = (count) => {
		const { label, emptyText } = this.props;
		if (count === 0) {
			return emptyText || `No ${label} Selected`;
		}
		return `${count} ${label}${count > 1 ? "s" : ""} Selected`;
	};

	showPicker = () => {
		const { value, options } = this.props;
		if(this.state.overrideFocus){
			this.setState({ overrideFocus: false });
			return;
		}
		const selectedOptions = [];
		const selectedOptionMap = {};
		const optionMap = {};
		(value || []).forEach((opt) => {
			selectedOptionMap[opt] = 1;
			selectedOptions.push(opt)
		});
		options.forEach((opt) => {
			optionMap[opt.value] = opt;
		});
		

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
			this.setState(
				{
					popupStyle,
					visibleOptions: options,
					pickerVisible: true,
					hasSelected: false,				
					visibleText: "",
					selectedOptionMap,
					selectedOptions,
					optionMap,
				}
			);
		});
	};

	handleSelect = (selected) => {
		const selectedOptionMap = this.state.selectedOptionMap;
		if (selectedOptionMap[selected.value]) {
			delete selectedOptionMap[selected.value];
		} else {
			selectedOptionMap[selected.value] = 1;
		}
		const selectedOptions = Object.keys(selectedOptionMap);
		this.setState(
			{
				selectedOptions,
				selectedOptionMap,
				visibleText: "",
				overrideFocus: true
			},
			() => {
				this.currentInput?.focus()
			}
		);
	};

	closePicker = (event) => {
		if(this.state.overrideFocus){
			return;
		}
		const countryPicker = document.getElementById("multiOptionPicker");
		if (!countryPicker?.contains(event.relatedTarget)) {
			const selected = this.state.selectedOptions;
			const visibleText = this.getLabel(selected.length);
			this.setState(
				{
					pickerVisible: false,
					visibleText
				},
				() => {
					this.selectCurrent();
				}
			);
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

	selectCurrent = () => {
		const { optionMap, selectedOptions } = this.state;
		const values = [];
		selectedOptions.forEach(key => {
			values.push(optionMap[key].value);
		});
		this.props.onSelect(values);
	}

	renderOverlay = () => {
		const { popupStyle, visibleOptions, optionMap, selectedOptionMap, selectedOptions } =
			this.state;
		return (
			<TouchableOpacity
				id="multiOptionPicker"
				activeOpacity={1}
				style={[style.popup, popupStyle]}
				// onBlur={this.closePicker}
			>
				<OptionViewer
					visibleOptions={visibleOptions}
					selectedOptionMap={selectedOptionMap}
					selectedOptions={selectedOptions}
					optionMap={optionMap}
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
		return (
			<>
				<View
					style={[defaultStyle, props.style, { borderColor }]}
					ref={ref => this.inputHolder = ref}
				>
					<TextInput
						{...props.inputProps}
						value={visibleText}
						ref={(ref) => (this.currentInput = ref)}
						onFocus={this.showPicker}
						onBlur={this.closePicker}
						style={[style.inputStyle, props.textStyle]}
						onChangeText={this.handleChangeText}
						placeholderTextColor={colors.holderColor}
					/>
					<TouchableOpacity
						onPress={() => this.currentInput?.focus()}
						style={style.downIcon}
					>
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
	render() {
		const { visibleOptions, selectedOptionMap, selectedOptions, optionMap } = this.props;		
		return (
			<>
				<View style={style.optionList}>
					{visibleOptions.map((option, idx) => {
						const selected = selectedOptionMap[option?.value];
						return (
							<TouchableOpacity
								onPress={() => this.props?.onSelect(option)}
								style={style.option}
								key={option.value}
							>
								<Text style={style.optionText}>
									{option?.label}
								</Text>
								{selected ? <FeatherIcon
									color={colors.primaryBlue}
									size={20}
									icon="check"
								/> : null}
							</TouchableOpacity>
						);
					})}
				</View>

				<View style={style.selectedCover}>
					{selectedOptions.map((t) => {
						return (
							<TouchableOpacity onPress={() => this.props?.onSelect(optionMap[t])} style={style.tagCover} key={t}>
								<Text style={style.tagText}>
									{optionMap[t].label}
								</Text>
								<FeatherIcon
									color={colors.primaryBlue}
									size={16}
									icon="x"
								/>
							</TouchableOpacity>
						);
					})}
				</View>
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
		outline: "none",
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
		minHeight: 100,		
		outline: "none",
		cursor: "default",
		overflow: "hidden",
		elevation: 20,
		boxShadow: shadows.basic,
	},
	option: {
		height: 40,
		outline: "none",
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 10,
		justifyContent: "space-between"
	},
	optionText: {		
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
	optionList: {
		borderColor: colors.borderColor,
		borderBottomWidth: 1,
		marginBottom: 5,
		maxHeight: POPUP_HEIGHT,
		overflowY: "auto"
	},
	selectedCover: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	tagCover: {
		flexDirection: "row",
		outline: "none",
		height: 30,
		padding: 5,
		borderRadius: BORDER_RADIUS,
		borderWidth: 1,
		borderColor: colors.primaryBlue,
		backgroundColor: colors.primaryLight,
		alignItems: "center",
		marginBottom: 5,
		marginLeft: 5
	},
	tagText: {
		fontSize: FORM_SM_FONT_SIZE,
		color: colors.primaryBlue,
		fontWeight: "500",
		marginRight: 5
	},
};

MultiOptionInput.defaultProps = {
	style: {},
	onSelect: () => {},
	inputProps: {},
	textStyle: {},
	label: "Item",
	value: [],
	visibleOptions: []
};

export default MultiOptionInput;