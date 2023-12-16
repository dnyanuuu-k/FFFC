import React, {
	useRef,
	forwardRef,
	useState,
	useImperativeHandle,
} from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';

//Custom Components

// import Cropper, { LOGO } from 'components/cropper';
import SheetButtonModal from 'components/modal/sheetButtonModal';
import ProfileInput from 'components/input/profileInput';
import Input from 'components/input';
import Image from 'components/image';
import Or from 'components/or';

//Third Party Components
import FeatherIcon from 'react-native-vector-icons/Feather';

// Helper Functions
import validation from 'utils/validation';
// import filePicker from 'utils/filePicker';
import Backend from 'backend';

// Third Party Functions
import toast from 'libs/toast';

// Constants
import { sharedStyle } from './constants';

// Hooks
import { useTheme } from '@react-navigation/native';

const avatarSize = 100;
const defaultData = {
	userId: null,
	firstName: '',
	lastName: '',
	middleName: '',
	avatarUrl: '',
	avatarHash: '',
	charecterName: '',
};
const AddPersonModal = ({ onSubmit }, ref) => {
	useImperativeHandle(ref, () => ({
		show,
	}));
	const profileInput = useRef();
	const { colors } = useTheme();
	const style = StyleSheet.create({
		hr: {
			marginTop: 25,
			marginBottom: 10,
			backgroundColor: colors.border,
			height: 1,
		},
		note: {
			marginTop: 10,
			fontSize: 13,
			width: '100%',
			color: colors.holderColor,
		},
		link: {
			color: colors.primary,
		},
		avatar: {
			width: avatarSize,
			height: avatarSize,
			borderRadius: 100,
			alignSelf: 'center',
			overflow: 'hidden',
			alignItems: 'center',
			backgroundColor: colors.vectorBaseDip,
		},
		avatarImage: {
			width: avatarSize,
			height: avatarSize,
		},
		avatarIcon: {
			backgroundColor: colors.bgTrans,
			position: 'absolute',
			bottom: 5,
			width: 30,
			height: 30,
			borderRadius: 100,
			justifyContent: 'center',
			alignItems: 'center',
		},
	});

	const [avatarBusy, setAvatarBusy] = useState(false);
	const [hasUserId, setHasUserId] = useState(false);
	const [state, setState] = useState(defaultData);
	const [visible, setVisible] = useState(false);

	const show = (previousData = null, filmCreditSectionId, cb) => {
		let data = {};
		if (previousData) {
			data = previousData;
		} else {
			data = defaultData;
		}
		const idx = previousData?.idx || new Date().getTime();
		setState({
			filmCreditSectionId,
			idx,
			...data,
		});
		setHasUserId(data?.userId != null);
		if (data.userId) {
			profileInput.current.setProfile(`${data.userId}`);
		}
		setVisible(true);
	};

	const handleSelectPhoto = () => {
		if (avatarBusy) {
			return;
		}
		// filePicker.pickSingleImage((image) => {
		// 	if (image) {
		// 		const imageURL = URL.createObjectURL(image);
		// 		this.imageCropper.startEditor(LOGO, imageURL);
		// 	}
		// });
	};

	const handleImageUpload = (imageCanvas) => {
		// if (imageCanvas) {
		// 	imageCanvas?.toBlob((blob) => {
		// 		this.sendImageToServer(blob);
		// 	});
		// 	return;
		// }
		// toast.error('Unable to upload image');
	};

	const sendImageToServer = async (fileBlob, type) => {
		try {
			setAvatarBusy(true);
			const response = await Backend.Photos.uploadTempAvatar(fileBlob);
			if (response?.success) {
				setState(response.data);
				toast.success('Image Updated Successfully');
			} else {
				throw new Error(response?.message || 'Unable to upload avatar');
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			setAvatarBusy(false);
		}
	};

	const close = () => {
		setVisible(false);
	};

	const handleSubmit = () => {
		const {
			id,
			avatarUrl,
			avatarHash,
			filmCreditSectionId,
			firstName,
			lastName,
			middleName,
			userId,
			charecterName,
			idx,
		} = state || {};
		if (avatarBusy) {
			toast.error('Please wait while we upload avatar');
		}
		if (!validation.validName(firstName)) {
			toast.error('First Name is required');
			return;
		}
		if (onSubmit) {
			onSubmit({
				id,
				avatarUrl,
				avatarHash,
				filmCreditSectionId,
				firstName,
				lastName,
				middleName,
				userId,
				charecterName,
				idx,
			});
		}
		setVisible(false);
	};

	const handleProfileData = (profileData) => {
		setHasUserId(profileData != null);
		setState({
			...state,
			firstName: profileData?.firstName || '',
			lastName: profileData?.lastName || '',
			middleName: profileData?.middleName || '',
			avatarUrl: profileData?.avatarUrl || '',
			avatarHash: profileData?.avatarHash || '',
			userId: profileData?.id || null,
		});
	};

	return (
		<>
			<SheetButtonModal
				title={`${state.id ? 'Edit' : 'Add'} Person`}
				onSubmit={handleSubmit}
				minHeight={320}
				visible={visible}
				onClose={close}
			>
				<View style={style.avatar}>
					<Image
						hash={state.avatarHash}
						url={state.avatarUrl}
						style={style.avatarImage}
					/>
					<TouchableOpacity
						disabled={hasUserId}
						onPress={handleSelectPhoto}
						style={style.avatarIcon}
					>
						{avatarBusy ? (
							<ActivityIndicator size={20} color={colors.buttonTxt} />
						) : (
							<FeatherIcon name="camera" size={18} color={colors.buttonTxt} />
						)}
					</TouchableOpacity>
				</View>
				<Input
					disabled={hasUserId}
					style={sharedStyle.modalInput}
					value={state.firstName}
					placeholder="First name"
					onChangeText={(x) => setState((p) => ({ ...p, firstName: x }))}
				/>
				<Input
					disabled={hasUserId}
					style={sharedStyle.modalInput}
					value={state.lastName}
					placeholder="Last name"
					onChangeText={(x) => setState((p) => ({ ...p, lastName: x }))}
				/>
				<Input
					disabled={hasUserId}
					style={sharedStyle.modalInput}
					value={state.middleName}
					placeholder="Middle name"
					onChangeText={(x) => setState((p) => ({ ...p, middleName: x }))}
				/>
				<Or />
				<ProfileInput
					ref={profileInput}
					inputStyle={sharedStyle.modalInput}
					onProfileData={handleProfileData}
				/>
				<Text style={style.note}>
					<Text style={style.link}>How to get profile ID?</Text> Linking profile
					ID helps you to load credits on your profile page
				</Text>
				<View style={style.hr} />
				<Input
					style={sharedStyle.modalInput}
					value={state.charecterName}
					placeholder="Charecter Name"
					onChangeText={(x) => setState((p) => ({ ...p, charecterName: x }))}
				/>
			</SheetButtonModal>
			{/*<Cropper
					ref={(ref) => (this.imageCropper = ref)}
					onSubmitImage={this.handleImageUpload}
				/>*/}
		</>
	);
};

export default forwardRef(AddPersonModal);