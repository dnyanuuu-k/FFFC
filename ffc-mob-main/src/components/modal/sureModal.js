import React, { Component } from 'react';
import { Text } from 'react-native';
import SheetButtonModal from './sheetButtonModal';
import colors from 'themes/colors';
import { fonts } from 'themes/topography';

export default class SureModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			text: '',
			visible: false,
		};
		this.callback = null;
	}

	show = (text, cb) => {
		this.setState({ text });
		this.callback = cb;
		this.setState({ visible: true });
	};

	close = () => {
		this.callback = null;
		this.setState({ visible: false });
	};

	handleSubmit = () => {
		this.callback(true);
		this.setState({ visible: false });
	};

	render() {
		return (
			<SheetButtonModal
				title="Are you sure"
				onClose={this.close}
				onSubmit={this.handleSubmit}
				positiveText="Yes"
				visible={this.state.visible}
			>
				<Text style={style.text}>{this.state.text}</Text>
			</SheetButtonModal>
		);
	}
}

const style = {
	text: {
		fontSize: fonts.small,
		color: colors.holderColor,
		marginTop: 10,
	},
};