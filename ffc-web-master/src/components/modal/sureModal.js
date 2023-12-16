import React, { Component } from "react";
import {
	Text
} from "react-native";
import SheetButtonModal from "./sheetButtonModal";
import { FORM_FONT_SIZE } from "utils/constants";
import colors from "themes/colors";

export default class SureModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			text: ""
		}
		this.callback = null;
	}

	show = (text, cb) => {
		this.setState({ text });
		this.callback = cb;
		this.modal.open();
	};

	close = () => {
		this.callback = null;
	};

	handleSubmit = () => {
		this.callback(true);
		this.modal.close();
	}

	render() {
		return (
			<SheetButtonModal
				title="Are you sure"
				onClose={this.close}
				onSubmit={this.handleSubmit}
				positiveText="Yes"
				ref={(ref) => (this.modal = ref)}
			>
				<Text style={style.text}>{this.state.text}</Text>
			</SheetButtonModal>
		);
	}
}

const style = {
	text: {
		fontSize: FORM_FONT_SIZE,
		color: colors.textBlack,
		marginTop: 10
	}
}