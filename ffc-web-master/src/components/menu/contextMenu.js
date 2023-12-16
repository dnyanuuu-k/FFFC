import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ZoomIn from "animations/zoomIn";
import FeatherIcon from "feather-icons-react";
import {
	BORDER_RADIUS,
	MENU_PADDING,
	WINDOW_HALF_HEIGHT,
	WINDOW_HALF_WIDTH,
} from "utils/constants";
import colors from "themes/colors";
import OverlayPortal from "../overlay/portal";
const POPUP_WIDTH = 200;
export default class ContextMenu extends Component {
	static transfromView = (event) => {
		const { nativeEvent } = event;
		const elm = nativeEvent.target;
		const measure = (cb) => {
			return cb(
				null,
				null,
				elm.clientWidth,
				elm.clientHeight,
				nativeEvent.clientX,
				nativeEvent.clientY
			);
		};
		const obj = {
			measure,
		};
		return obj;
	};
	constructor(props) {
		super(props);
		this.state = {
			zoomOrigin: "right top",
			position: {
				top: 0,
				left: 0,
			},
			visible: false,
			options: [],
		};
		this.callback = null;
	}

	show = (options, element, cb) => {
		if (this.state.visible) {
			return;
		}
		this.setState({ visible: true, options }, () => {
			if (element) {
				setTimeout(() => {
					this.init(element);
				}, 50);
				this.callback = cb;
			} else {
				this.close();
			}
		});
	};

	init = (element) => {
		if (!this.animator) {
			this.close();
		}
		this.animator?.reset();
		this.animator?.measure((ofx, ofy, ow, oh) => {
			element?.measure((fx, fy, width, height, left, top) => {
				const topAdjusted =
					top > WINDOW_HALF_HEIGHT ? top - oh : top + height;
				const leftAdjusted =
					left > WINDOW_HALF_WIDTH ? left - POPUP_WIDTH : left;
				let originX = left > WINDOW_HALF_WIDTH ? "right" : "left";
				let originY = top > WINDOW_HALF_HEIGHT ? "bottom" : "top";
				const position = {
					top: topAdjusted,
					left: leftAdjusted,
				};
				this.setState(
					{
						zoomOrigin: `${originX} ${originY}`,
						position,
						visible: true,
					},
					this.enter
				);
			});
		});
	};

	enter = () => {
		if (this.animator) {
			this.animator?.focus();
			setTimeout(() => {
				this.animator?.easeIn();
			}, 50);
		}
	};

	close = () => {
		if (this.state.showing) {
			return;
		}
		if (this.animator) {
			this.animator?.easeOut();
		}
		setTimeout(() => {
			this.setState({
				visible: false,
			});
			this.callback = null;
		}, 400);
	};

	handleSelect = (option, index) => {
		if (this.callback) {
			this.callback(option, index);
		}
		this.close();
	};

	render() {
		const { options, zoomOrigin, visible, position } = this.state;
		return (
			<OverlayPortal>
				{visible ? (
					<TouchableOpacity
						onPress={this.close}
						activeOpacity={1}
						style={style.cover}
					>
						<ZoomIn
							position={position}
							origin={zoomOrigin}
							ref={(ref) => (this.animator = ref)}
							sty={style.menu}
						>
							{options.map((option, index) => (
								<TouchableOpacity
									onPress={() =>
										this.handleSelect(option, index)
									}
									key={index}
									activeOpacity={0.5}
									style={style.option}
								>
									<View style={style.icon}>
										<FeatherIcon
											size={18}
											color={colors.holderColor}
											icon={option.icon}
										/>
									</View>
									<Text style={style.label}>
										{option.label}
									</Text>
								</TouchableOpacity>
							))}
						</ZoomIn>
					</TouchableOpacity>
				) : null}
			</OverlayPortal>
		);
	}
}

const style = StyleSheet.create({
	cover: {
		width: "100%",
		height: "100%",
		position: "absolute",
		top: 0,
		left: 0,
		cursor: "default",
		backgroundColor: colors.transparent
	},
	menu: {
		width: POPUP_WIDTH,
		borderRadius: BORDER_RADIUS,
		position: "absolute",
		padding: 5,
		right: 0,
		cursor: "default",
	},
	option: {
		height: 40,
		width: "100%",
		alignItems: "center",
		flexDirection: "row",
	},
	icon: {
		width: 30,
		height: 40,
		justifyContent: "center",
		alignItems: "center",
	},
	label: {
		fontWeight: "500",
		fontSize: 14,
		marginLeft: 10,
		color: colors.textBlack,
	},
});

ContextMenu.defaultProps = {
	options: [],
	onSelect: () => {},
};