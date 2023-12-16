import React, { Component } from "react";
import { StyleSheet } from "react-native";
import Input from "components/input";
import { BUTTON_FORM_HEIGHT, FORM_FONT_SIZE } from "utils/constants";
import SheetButtonModal from "components/modal/sheetButtonModal";
import validation from "utils/validation";
const defaultData = {
	id: undefined,
	name: "",
	festivalPhotoId: undefined
};
class AddAlbumModal extends Component {
	constructor(props) {
		super(props);
		this.state = defaultData;
		this.callback = null;
	}

	show = (previousData = null, cb) => {
		if (previousData) {
			this.setState(previousData);
		} else {
			this.setState(defaultData);
		}
		this.callback = cb;
		this.modal.open();
		setTimeout(() => {
			this.albumName?.focus();
		}, 600);
	};

	close = () => {
		this.callback = null;
	};

	handleSubmit = () => {
		const { id, name, festivalPhotoId } = this.state;
		if (!validation.validName(name)) {
			this.albumName.setError("Please Enter Valid Name");
			return;
		}
		if (this.callback) {
			this.callback({ id, name, festivalPhotoId });
		}
		this.modal.close();
	};

	render() {
		const { name, id } = this.state;
		return (
			<SheetButtonModal
				title={id ? "Edit Album" : "Create New Album"}
				onClose={this.close}
				onSubmit={this.handleSubmit}
				ref={(ref) => (this.modal = ref)}
			>
				<Input
					style={style.modalInput}
					placeholder="Album Name"
					value={name}
					ref={(ref) => (this.albumName = ref)}
					onChangeText={(name) => this.setState({ name })}
				/>
			</SheetButtonModal>
		);
	}
}

const style = StyleSheet.create({
	modalInput: {
		width: "100%",
		height: BUTTON_FORM_HEIGHT,
		marginTop: 10,
		fontSize: FORM_FONT_SIZE,
	},
});

export default AddAlbumModal;