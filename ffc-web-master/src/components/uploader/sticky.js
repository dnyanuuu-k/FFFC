import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Backend from "backend";
import { BORDER_RADIUS } from "utils/constants";
import colors from "themes/colors";
import shadows from "themes/shadows";
import Uploader from "utils/simpleUploader";
import helper from "utils/helper";
import ProgressBar from "components/progress/bar";
import { Scrollbars } from "react-custom-scrollbars";
import { UploaderInstance } from "utils/simpleUploader";

const uploaderWidth = 290;
const uploadCardHeight = 70;
const uploaderHeight = 300;
const contentWidth = 280;
const contentHeight = uploaderHeight - 60;
const headerHeight = 50;
const progressBarWidth = contentWidth - 100;
export default class StickyUploader extends Component {
	constructor(props) {
		super(props);
		this.state = {
			uploadList: [],
		};
	}

	componentDidMount() {
		if (this.props.onLoad) {
			this.props.onLoad();
		}
	}

	handleEnd = (result, data) => {
		const { uploadList } = this.state;
		const fileIndex = uploadList.findIndex((file) => file.id === data.id);
		if (result && fileIndex !== -1) {
			setTimeout(() => {
				uploadList.splice(fileIndex, 1);
				this.setState({
					uploadList,
				});
				UploaderInstance.onNewPhoto(result.data);
			}, 1000);
		}
	};

	uploadFile = (file, params) => {
		const uploadId = helper.uniqueId();
		const uploadList = this.state.uploadList;
		const uri = URL.createObjectURL(file);
		uploadList.unshift({
			file,
			params,
			uploadId,
			uri,
		});
		this.setState({ uploadList });
	};

	renderUploadCard = (data) => {
		return (
			<UploadCard
				onEnd={(res) => this.handleEnd(res, data)}
				{...data}
				key={data.uploadId}
			/>
		);
	};

	render() {
		const { uploadList } = this.state;
		const uploadCount = uploadList.length;
		if (uploadCount === 0) {
			return null;
		}
		return (
			<View style={style.main}>
				<View style={style.header}>
					<Text style={style.headerTitle}>
						Uploading {uploadCount} File{uploadCount > 1 ? "s" : ""}
					</Text>
				</View>
				<Scrollbars autoHide style={style.content}>
					{uploadList.map(this.renderUploadCard)}
				</Scrollbars>
			</View>
		);
	}
}

class UploadCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			progress: 0,
			fileName: "",
			status: "Uploading",
			statusColor: colors.holderColor,
		};
		this.uploader = null;
		this.called = null;
	}

	componentDidMount() {
		if(!this.called){
			this.called = true;
			this.initiate();
		}		
	}

	initiate = () => {
		const { file, params } = this.props;
		this.uploader = new Uploader({
			file,
			params,
			endpoint: Backend.Photos.PhotoUploadEndpoint,
		});
		this.uploader.onError(this.onError);
		this.uploader.onAbort(this.onCancel);
		this.uploader.onProgress(this.onProgress);
		this.uploader.onLoad(this.onUploadEnd);

		this.uploader.post();
	};

	onUploadEnd = (data) => {
		if (!data) {
			this.onError();
			return;
		}
		this.setState(
			{
				status: "Completed",
				progress: 100,
				statusColor: colors.greenDark,
			},
			() => {
				this.props.onEnd(data);
			}
		);
	};

	onError = () => {
		this.setState({
			status: "Error",
			progress: 0,
			statusColor: colors.rubyRed,
		});
	};

	onCancel = () => {
		this.setState(
			{
				status: "Cancelled",
				progress: 0,
				statusColor: colors.rubyRed,
			},
			() => {
				this.props.onEnd(true);
			}
		);
	};

	onProgress = (progress) => {
		this.setState({
			progress,
		});
	};

	retry = () => {
		if (this.uploader) {
			this.uploader.post();
		}
	};

	cancel = () => {
		if (this.uploader) {
			this.uploader.abort();
		}
	};

	render() {
		const { uri, file } = this.props;
		const { statusColor, status, progress } = this.state;
		return (
			<View style={style.uploadCard}>
				<Image style={style.uploadImage} source={{ uri }} />
				<View style={style.textContent}>
					<Text numberOfLines={1} style={style.fileName}>
						{file.name}
					</Text>
					<Text style={[style.statusText, { color: statusColor }]}>
						{status}
					</Text>
					<ProgressBar width={progressBarWidth} progress={progress} />
				</View>
			</View>
		);
	}
}

const style = StyleSheet.create({
	header: {
		height: headerHeight,
		width: uploaderWidth,
		justifyContent: "center",
		paddingLeft: 10,
		backgroundColor: colors.primaryBlue,
		boxShadow: shadows.material,
	},
	headerTitle: {
		fontSize: 15,
		fontWeight: "500",
		color: colors.buttonTxt,
	},
	main: {
		boxShadow: shadows.basic,
		maxHeight: uploaderHeight,
		backgroundColor: colors.popupBg,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		overflow: "hidden",
		position: "absolute",
		bottom: 0,
		right: 60,
	},
	content: { height: contentHeight, width: uploaderWidth },
	uploadCard: {
		width: contentWidth,
		height: uploadCardHeight,
		borderRadius: BORDER_RADIUS,
		padding: 5,
		flexDirection: "row",
		borderWidth: 1,
		marginVertical: 10,
		borderColor: colors.borderGrey,
		marginLeft: 5,
	},
	uploadImage: {
		width: 60,
		height: 60,
		backgroundColor: colors.vectorBase,
		borderRadius: BORDER_RADIUS,
		borderWidth: 1,
		borderColor: colors.borderColor,
	},
	fileName: {
		fontSize: 13,
		color: colors.textBlack,
		fontWeight: "500",
	},
	textContent: {
		flex: 1,
		paddingLeft: 10,
		justifyContent: "center",
	},
	statusText: {
		fontSize: 12,
		fontWeight: "300",
		marginTop: 3,
		marginBottom: 5,
	},
});