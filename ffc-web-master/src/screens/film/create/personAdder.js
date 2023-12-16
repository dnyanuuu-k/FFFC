import React, { Component } from "react";
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";

//Custom Components
import Cropper, { LOGO } from "components/cropper";
import SheetButtonModal from "components/modal/sheetButtonModal";
import ProfileInput from "components/input/profileInput";
import Input from "components/input";
import Image from "components/image";
import Or from "components/or";

//Third Party Components
import FeatherIcon from "feather-icons-react";

// Helper Functions
import validation from "utils/validation";
import filePicker from "utils/filePicker";
import Backend from "backend";

// Third Party Functions
import toast from "react-hot-toast";

// Constants
import {
	BUTTON_FORM_HEIGHT,
	FORM_FONT_SIZE,
	TOP_GAP10,
	W22,
} from "utils/constants";
import colors from "themes/colors";

const avatarSize = 100;
const defaultData = {
	avatarBusy: false,
	hasUserId: false,
	userId: null,
	firstName: "",
	lastName: "",
	middleName: "",
	avatarUrl: "",
	avatarHash: "",
	charecterName: ""
};
class AddPersonModal extends Component {
	constructor(props) {
		super(props);
		this.state = defaultData;
		this.callback = null;
	}

	show = (previousData = null, filmCreditSectionId, cb) => {
		let data = {};
		if (previousData) {
			data = previousData;
		} else {
			data = defaultData;
		}
		const idx = previousData?.idx || new Date().getTime();
		this.setState({
			filmCreditSectionId,
			idx,
			...data,
			hasUserId: data?.userId != null
		}, () => {
			if(this.state.userId){
				this.profileInput.setProfileId(`${this.state.userId}`)
			}
		});
		this.callback = cb;
		this.modal.open();
	};

	handleSelectPhoto = () => {
		if (this.state.avatarBusy) return;
		filePicker.pickSingleImage((image) => {
			if (image) {
				const imageURL = URL.createObjectURL(image);
				this.imageCropper.startEditor(LOGO, imageURL);
			}
		});
	};

	handleImageUpload = (imageCanvas) => {
		if (imageCanvas) {
			imageCanvas?.toBlob((blob) => {
				this.sendImageToServer(blob);
			});
			return;
		}
		toast.error("Unable to upload image");
	};

	sendImageToServer = async (fileBlob, type) => {
		try {
			this.setState({ avatarBusy: true });
			const response = await Backend.Photos.uploadTempAvatar(fileBlob);
			if (response?.success) {
				this.setState(response.data);
				toast.success(`Image Updated Successfully`);
			} else {
				throw new Error(response?.message || "Unable to upload avatar");
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			this.setState({ avatarBusy: false });
		}
	};

	close = () => {
		this.callback = null;
	};

	handleSubmit = () => {
		const {
			avatarBusy,
			id,
			avatarUrl,
			avatarHash,
			filmCreditSectionId,
			firstName,
			lastName,
			middleName,
			userId,
			charecterName,
			idx
		} = this.state;
		if (avatarBusy) {
			toast.error("Please wait while we upload avatar");
		}
		if (!validation.validName(firstName)) {
			this.firstNameInput.setError("First Name is required");
			return;
		}
		if (this.callback) {
			this.callback({
				id,
				avatarUrl,
				avatarHash,
				filmCreditSectionId,
				firstName,
				lastName,
				middleName,
				userId,
				charecterName,
				idx
			});
		}
		this.modal.close();
	};

	handleProfileData = (profileData) => {
		this.setState({
			hasUserId: profileData != null,
			firstName: profileData?.firstName || "",
			lastName: profileData?.lastName || "",
			middleName: profileData?.middleName || "",
			avatarUrl: profileData?.avatarUrl || "",
			avatarHash: profileData?.avatarHash || "",
			userId: profileData?.id || null,
		});
	};

	render() {
		const {
			avatarUrl,
			avatarHash,
			avatarBusy,

			middleName,
			firstName,
			lastName,
			charecterName,

			hasUserId,

			id,
		} = this.state;
		return (
			<>
				<SheetButtonModal
					title={`${id ? "Edit" : "Add"} Person`}
					ref={(ref) => (this.modal = ref)}
					onSubmit={this.handleSubmit}
					minHeight={320}
					onClose={this.close}
				>
					<View style={style.avatar}>
						<Image
							hash={avatarHash}
							url={avatarUrl}
							style={style.avatarImage}
						/>
						<TouchableOpacity
							disabled={hasUserId}
							onPress={this.handleSelectPhoto}
							style={style.avatarIcon}
						>
							{avatarBusy ? (
								<ActivityIndicator
									size={20}
									color={colors.buttonTxt}
								/>
							) : (
								<FeatherIcon
									icon="camera"
									size={18}
									color={colors.buttonTxt}
								/>
							)}
						</TouchableOpacity>
					</View>
					<Input
						disabled={hasUserId}
						style={style.modalInput}
						value={firstName}
						placeholder="First name"
						ref={(ref) => (this.firstNameInput = ref)}
						onChangeText={(firstName) =>
							this.setState({ firstName })
						}
					/>
					<Input
						disabled={hasUserId}
						style={style.modalInput}
						value={lastName}
						placeholder="Last name"
						onChangeText={(lastName) => this.setState({ lastName })}
					/>
					<Input
						disabled={hasUserId}
						style={style.modalInput}
						value={middleName}
						placeholder="Middle name"
						onChangeText={(middleName) =>
							this.setState({ middleName })
						}
					/>
					<Or />
					<ProfileInput
						ref={(ref) => (this.profileInput = ref)}
						inputStyle={style.modalInput}
						onProfileData={this.handleProfileData}
					/>
					<Text style={style.note}>
						<Text style={style.link}>How to get profile ID?</Text>{" "}
						Linking profile ID helps you to load credits on your
						profile page
					</Text>
					<View style={style.hr} />
					<Input
						style={style.modalInput}
						value={charecterName}
						placeholder="Charecter Name"
						onChangeText={(charecterName) =>
							this.setState({ charecterName })
						}
					/>
				</SheetButtonModal>
				<Cropper
					ref={(ref) => (this.imageCropper = ref)}
					onSubmitImage={this.handleImageUpload}
				/>
			</>
		);
	}
}

const style = StyleSheet.create({
	modalInput: {
		width: "100%",
		height: BUTTON_FORM_HEIGHT,
		marginTop: TOP_GAP10,
		fontSize: FORM_FONT_SIZE,
	},
	hr: {
		marginTop: 25,
		marginBottom: 10,
		backgroundColor: colors.borderColor,
		height: 1,
	},
	note: {
		marginTop: TOP_GAP10,
		fontSize: 13,
		width: W22,
		color: colors.holderColor,
	},
	link: {
		color: colors.primaryBlue,
	},
	avatar: {
		width: avatarSize,
		height: avatarSize,
		borderRadius: 100,
		alignSelf: "center",
		overflow: "hidden",
		alignItems: "center",
		backgroundColor: colors.vectorBase,
	},
	avatarImage: {
		width: avatarSize,
		height: avatarSize,
	},
	avatarIcon: {
		backgroundColor: colors.bgTrans,
		position: "absolute",
		bottom: 5,
		width: 30,
		height: 30,
		borderRadius: 100,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default AddPersonModal;
