import React, { Component } from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Image from "../image";
import colors from "themes/colors";
import { WINDOW_WIDTH, WINDOW_HEIGHT, MMMMDDYYYY } from "utils/constants";
import helper from "utils/helper";
import FeatherIcon from "feather-icons-react";
import moment from "moment";
const barSize = 60;
const photoViewerWidth = WINDOW_WIDTH * 0.8;
const photoViewerHeight = WINDOW_HEIGHT * 0.9;
class PhotoViewer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentPhoto: {},
			header: {},
			photos: [],
			totalPhotos: 20,
			currentPhotoIndex: 0,
			visible: false,
			photoStyle: {},
		};
	}

	showPhotos = (photos, currentPhotoIndex, header = {}) => {
		if(photos.length === 0)return;
		const currentPhoto = photos[currentPhotoIndex];
		const photoStyle = helper.calculateAspectRatioFit(
			Number(currentPhoto.width),
			Number(currentPhoto.height),
			photoViewerWidth,
			photoViewerHeight
		);
		this.setState({
			currentPhotoIndex,
			currentPhoto,
			header,
			totalPhotos: photos.length,
			photos,
			photoStyle,
			visible: true,
		});
		helper.arrowPressListner((arrow) => {
			if (arrow === ">") {
				this.nextPhoto();
			} else if (arrow === "<") {
				this.previousPhoto();
			}
		});
	};

	previousPhoto = () => {
		const { currentPhotoIndex, photos } = this.state;
		if (currentPhotoIndex === 0) return;
		const newCurrentPhoto = photos[currentPhotoIndex - 1];
		this.setState(
			{
				currentPhoto: newCurrentPhoto,
				currentPhotoIndex: currentPhotoIndex - 1,
			},
			() => {
				this.updateImage(newCurrentPhoto);
			}
		);
	};

	nextPhoto = () => {
		const { currentPhotoIndex, photos } = this.state;
		if (currentPhotoIndex === photos.length - 1 || photos.length === 0) {
			return;
		}
		const newCurrentPhoto = photos[currentPhotoIndex + 1];
		this.setState(
			{
				currentPhoto: newCurrentPhoto,
				currentPhotoIndex: currentPhotoIndex + 1,
			},
			() => {
				this.updateImage(newCurrentPhoto);
			}
		);
	};

	updateImage = (currentPhoto) => {
		const photoStyle = helper.calculateAspectRatioFit(
			Number(currentPhoto.width),
			Number(currentPhoto.height),
			photoViewerWidth,
			photoViewerHeight
		);
		this.setState({
			currentPhoto,
			photoStyle,
		});
	};

	handleClose = () => {
		this.setState({
			photos: [],
			currentPhoto: {},
			header: {},
			visible: false,
			currentPhotoIndex: 0,
		});
		helper.arrowPressListner(null);
	};

	renderHeader = (image) => {
		const { header } = this.state;
		const dateText = moment(image.createAt).format(MMMMDDYYYY);
		return (
			<>
				<View style={style.barIcon}>
					<FeatherIcon
						icon="arrow-left"
						color={colors.buttonTxt}
						size={24}
					/>
				</View>
				<View style={style.titleContent}>
					<Text style={style.title}>{header.title}</Text>
					<Text style={style.subText}>{dateText}</Text>
				</View>
				<View style={style.headerIcons}>
					<View style={style.barIcon}>
						<FeatherIcon
							icon="download"
							color={colors.buttonTxt}
							size={24}
						/>
					</View>
					<View style={style.barIcon}>
						<FeatherIcon
							icon="share-2"
							color={colors.buttonTxt}
							size={24}
						/>
					</View>
				</View>
			</>
		);
	};
	renderFooter = (image) => {
		const { header, totalPhotos, currentPhotoIndex } = this.state;
		return (
			<>
				<TouchableOpacity
					onPress={this.previousPhoto}
					style={[style.arrowIcon, { alignItems: "flex-end" }]}
				>
					<FeatherIcon
						icon="chevron-left"
						color={colors.buttonTxt}
						size={28}
					/>
				</TouchableOpacity>
				<View style={style.footerTextContent}>
					<Text style={style.title}>{header.subTitle}</Text>
					<Text style={style.subText}>
						{currentPhotoIndex + 1} of {totalPhotos}
					</Text>
				</View>
				<TouchableOpacity
					style={style.arrowIcon}
					onPress={this.nextPhoto}
				>
					<FeatherIcon
						icon="chevron-right"
						color={colors.buttonTxt}
						size={28}
					/>
				</TouchableOpacity>
			</>
		);
	};
	render() {
		const { visible, photoStyle, currentPhoto } = this.state;
		return (
			<Modal
				visible={visible}
				transparent
				onRequestClose={this.handleClose}
				animationType="fade"
			>
				<TouchableOpacity
					style={style.body}
					activeOpacity={1}
					onPress={this.handleClose}
				>
					<TouchableOpacity style={style.content} activeOpacity={1}>
						<Image
							resizeMode="contain"
							style={photoStyle}
							url={currentPhoto.url}
							hash={currentPhoto.hash}
						/>
						<View style={style.overlay}>
							<View style={style.header}>
								{this.renderHeader(currentPhoto)}
							</View>
							<View style={style.footer}>
								{this.renderFooter(currentPhoto)}
							</View>
						</View>
					</TouchableOpacity>
				</TouchableOpacity>
			</Modal>
		);
	}
}

const style = StyleSheet.create({
	body: {
		width: WINDOW_WIDTH,
		height: WINDOW_HEIGHT,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#00000051",
		outline: "none",
		cursor: "default",
	},
	content: {
		width: photoViewerWidth,
		height: photoViewerHeight,
		backgroundColor: colors.textBlack,
		borderRadius: 10,
		overflow: "hidden",
		outline: "none",
		cursor: "default",
		alignItems: "center",
	},
	overlay: {
		position: "absolute",
		width: photoViewerWidth,
		height: photoViewerHeight,
		justifyContent: "space-between",
	},
	barIcon: {
		width: barSize,
		height: barSize,
		justifyContent: "center",
		alignItems: "center",
	},
	//Header Styles
	header: {
		height: barSize,
		flexDirection: "row",
		width: photoViewerWidth,
		backgroundColor: colors.bgTrans,
	},
	titleContent: {
		paddingLeft: 10,
		flex: 1,
		justifyContent: "center",
	},
	title: {
		color: colors.buttonTxt,
		fontSize: 15,
		fontWeight: "500",
	},
	subText: {
		color: colors.holderColor,
		fontSize: 13,
		fontWeight: "400",
		marginTop: 3,
		left: -2,
	},
	headerIcons: {
		height: photoViewerHeight,
		flexDirection: "row",
	},
	//Footer Styles
	footer: {
		height: barSize,
		width: photoViewerWidth,
		backgroundColor: colors.bgTrans,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	footerTextContent: {
		width: "40%",
		alignItems: "center",
		justifyContent: "center",
	},
	arrowIcon: {
		flex: 1,
		height: barSize,
		justifyContent: "center",
		outline: 'none'
	},
});

export default PhotoViewer;