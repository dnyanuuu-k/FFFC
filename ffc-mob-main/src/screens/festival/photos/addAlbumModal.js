import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import Input from 'components/input';
import { fonts } from 'themes/topography';
import toast from 'libs/toast';
import SheetButtonModal from 'components/modal/sheetButtonModal';
import validation from 'utils/validation';
const defaultData = {
	id: undefined,
	name: '',
	festivalPhotoId: undefined,
	visible: false,
};
class AddAlbumModal extends Component {
	constructor(props) {
		super(props);
		this.state = defaultData;
		this.callback = null;
	}

	show = (previousData = null, cb) => {
		let finalData = {};
		if (previousData) {
			finalData = { ...previousData };
		} else {
			finalData = { ...defaultData };
		}
		finalData.visible = true;
		this.setState(finalData);
		this.callback = cb;
	};

	close = () => {
		this.setState({ visible: false });
		this.callback = null;
	};

	handleSubmit = () => {
		const { id, name, festivalPhotoId } = this.state;
		if (!validation.validName(name)) {
			toast.error('Please Enter Valid Name');
			return;
		}
		if (this.callback) {
			this.callback({ id, name, festivalPhotoId });
		}
		this.setState({ visible: false });
	};

	render() {
		const { name, id, visible } = this.state;
		return (
			<SheetButtonModal
				title={id ? 'Edit Album' : 'Create New Album'}
				onClose={this.close}
				visible={visible}
				onSubmit={this.handleSubmit}
			>
				<Input
					style={style.modalInput}
					placeholder="Album Name"
					value={name}
					onChangeText={(n) => this.setState({ name: n })}
				/>
			</SheetButtonModal>
		);
	}
}

const style = StyleSheet.create({
	modalInput: {
		width: '100%',
		height: 40,
		marginTop: 10,
		fontSize: fonts.small,
	},
});

export default AddAlbumModal;
