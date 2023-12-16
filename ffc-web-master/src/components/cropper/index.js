import React, {
	useState,
	useRef,
	forwardRef,
	useImperativeHandle,
} from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { Cropper, CircleStencil, RectangleStencil } from "react-mobile-cropper";
import {
	WINDOW_WIDTH,
	WINDOW_HEIGHT,
	W50,
	MODAL_TITLE_FONT_SIZE,
	FORM_FONT_SIZE,
	FOOTER_BUTTON_SM_HEIGHT,
	BORDER_RADIUS,
} from "utils/constants";
import filePicker from "utils/filePicker";
import Button from "../button";
import colors from "themes/colors";
import FeatherIcon from "feather-icons-react";

const contentHeight = WINDOW_HEIGHT - WINDOW_HEIGHT * 0.1;
const headerHeight = 50;
const footerHeight = 50;
const cropperHeight = contentHeight - (headerHeight + footerHeight);
export const COVER = 0;
export const LOGO = 1;
const COVER_SETTINGS = {
	aspectRatio: 3 / 1,
	type: "rectangle",
	component: RectangleStencil,
	title: "Cover Image",
	mode: COVER
};

const LOGO_SETTINGS = {
	aspectRatio: 1,
	type: "circle",
	component: CircleStencil,
	title: "Logo Image",
	mode: LOGO
};

const ImageCropper = (props, ref) => {
	useImperativeHandle(ref, () => ({
		startEditor,
	}));
	const cropperRef = useRef(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [cropperMounted, setComponentMounted] = useState(false);
	const [settings, setSettings] = useState(COVER_SETTINGS);
	const [image, setImage] = useState(null);

	const stopEditor = () => {
		setModalVisible(false);
		setComponentMounted(false);
		setImage(null);
	};

	const startEditor = (type, image) => {
		if (type === COVER) {
			setSettings(COVER_SETTINGS);
		} else if (type === LOGO) {
			setSettings(LOGO_SETTINGS);
		}
		setImage(image);
		setModalVisible(true);
		setTimeout(() => {
			setComponentMounted(true);
		}, 300)
	};

	const changePhoto = () => {
		filePicker.pickSingleImage((_image) => {
			if(_image)setImage(URL.createObjectURL(_image));
		});
	};

	const handleSelectImage = () => {
		if(props?.onSubmitImage){
			const imageCanvas = cropperRef.current.getCanvas();
			props.onSubmitImage(imageCanvas, settings.mode);
		}		
		stopEditor();
	};

	return (
		<Modal
			visible={modalVisible}
			onRequestClose={stopEditor}
			transparent
			animationType="fade"
		>
			<View style={style.main}>
				<View style={style.content}>
					<View style={style.header}>
						<Text style={style.title}>Cover Image</Text>
						<TouchableOpacity onPress={stopEditor}>
							<FeatherIcon
								icon="x"
								color={colors.textBlack}
								size={23}
							/>
						</TouchableOpacity>
					</View>
					<View style={style.cropper}>
						{cropperMounted ? <Cropper
							stencilType={settings.type}
							stencilComponent={settings.component}
							ref={cropperRef}
							stencilProps={{
								aspectRatio: settings.aspectRatio,
							}}
							src={image}
						/> : null}
					</View>
					<View style={style.footer}>
						<Button
							text="Change Photo"
							type={Button.OUTLINE_PRIMARY}
							style={style.btnStyle}
							onPress={changePhoto}
						/>
						<Button
							onPress={handleSelectImage}
							text="Apply"
							style={style.btnStyle}
						/>
					</View>
				</View>
			</View>
		</Modal>
	);
};

const style = {
	main: {
		backgroundColor: colors.bgTrans,
		height: WINDOW_HEIGHT,
		width: WINDOW_WIDTH,
		alignItems: "center",
		justifyContent: "center",
		outline: "none",
	},
	content: {
		width: W50,
		backgroundColor: colors.popupBg,
		height: contentHeight,
		borderRadius: BORDER_RADIUS,
		overflow: "hidden",
	},
	cropper: {
		width: W50,
		height: cropperHeight,
		backgroundColor: colors.blk,
		justifyContent: "center",
	},
	header: {
		height: headerHeight,
		width: W50,
		paddingHorizontal: 10,
		justifyContent: "space-between",
		alignItems: "center",
		flexDirection: "row",
	},
	footer: {
		height: footerHeight,
		width: W50,
		alignItems: "center",
		justifyContent: "flex-end",
		flexDirection: "row",
		paddingRight: 10,
	},
	title: {
		fontSize: MODAL_TITLE_FONT_SIZE,
		color: colors.textBlack,
		fontWeight: "500",
	},
	buttonText: {
		fontSize: FORM_FONT_SIZE,
		color: colors.primaryBlue,
		fontWeight: "bold",
	},
	btnStyle: {
		height: FOOTER_BUTTON_SM_HEIGHT,
		width: 150,
		marginLeft: 20,
	},
};

export default forwardRef(ImageCropper);