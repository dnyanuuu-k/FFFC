import React, { Component } from "react";
import { StyleSheet, Text } from "react-native";
import Input from "components/input";
import { FORM_FONT_SIZE, W24 } from "utils/constants";
import SheetButtonModal from "components/modal/sheetButtonModal";
import validation from "utils/validation";
import colors from "themes/colors";
const defaultData = {
	reply: "",
	id: null,
};
class AddReplyModal extends Component {
	constructor(props) {
		super(props);
		this.state = defaultData;
		this.callback = null;
	}

	show = (data, cb) => {
		this.setState({
			reply: "",
			...data
		});
		this.callback = cb;
		this.modal.open();
	};

	close = () => {
		this.callback = null;
	};

	handleSubmit = () => {
		const { reply, festivalReviewId } = this.state;
		if (!validation.validName(reply) || reply?.length < 3) {
			this.reviewInput.setError("Review too short");
			return;
		}
		if (this.callback) {
			this.callback({ festivalOrganizerReply: reply, festivalReviewId });
		}
		this.modal.close();
	};

	render() {
		const { review, reply } = this.state;
		return (
			<SheetButtonModal
				title={"Add reply"}
				onClose={this.close}
				onSubmit={this.handleSubmit}
				ref={(ref) => (this.modal = ref)}
			>
				<Text numberOfLines={4} style={style.review}>{review}</Text>
				<Input
					style={style.modalInput}
					multiline
					value={reply}
					placeholder="Reply to film maker review"
					ref={(ref) => (this.reviewInput = ref)}
					onChangeText={(reply) => this.setState({ reply })}
				/>
			</SheetButtonModal>
		);
	}
}

const style = StyleSheet.create({
	modalInput: {
		width: "100%",
		height: 100,
		paddingTop: 10,
		marginTop: 10,
		fontSize: FORM_FONT_SIZE,
	},
	review: {
		fontSize: FORM_FONT_SIZE,
		fontWeight: '300',
		marginTop: 10,
		width: W24,
		paddingRight: 20,
		marginBottom: 10,
		color: colors.textBlack
	}
});

export default AddReplyModal;