import React, { Component } from 'react';
import {
	View,
	Pressable,
	Text,
	StyleSheet,
	Image,
	ScrollView,
} from 'react-native';
import Backend from 'backend';
import { BORDER_RADIUS } from 'utils/constants';
import colors from 'themes/colors';
import Uploader, { UploaderInstance } from 'utils/simpleUploader';
import helper from 'utils/helper';
import ProgressBar from 'components/progress/bar';
import DB from 'db';
import { RNSelectionMenu } from 'libs/Menu';

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
		if (result) {
			setTimeout(() => {
				UploaderInstance.onNewPhoto(result.data);
			}, 1000);
		}
		if (fileIndex !== -1) {
			uploadList.splice(fileIndex, 1);
			this.setState({
				uploadList,
			});
		}
	};

	uploadFile = (file, uri, params, endpoint = null) => {
		const uploadId = helper.uniqueId();
		const uploadList = this.state.uploadList;
		uploadList.unshift({
			file,
			params,
			uploadId,
			uri,
			endpoint,
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
						Uploading {uploadCount} File{uploadCount > 1 ? 's' : ''}
					</Text>
				</View>
				<ScrollView style={style.content}>
					{uploadList.map(this.renderUploadCard)}
				</ScrollView>
			</View>
		);
	}
}

class UploadCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			progress: 0,
			fileName: '',
			status: 'Uploading',
			statusColor: colors.holderColor,
		};
		this.uploader = null;
		this.called = null;
	}

	componentDidMount() {
		if (!this.called) {
			this.called = true;
			this.initiate();
		}
	}

	initiate = async () => {
		const { file, params, endpoint = null } = this.props;
		const token = await DB.Account.getCurrentToken();
		this.uploader = new Uploader({
			file,
			params,
			token,
			endpoint: endpoint || Backend.Photos.PhotoUploadEndpoint,
		});
		this.uploader.onError((e) => this.onError(e));
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
				status: 'Completed',
				progress: 100,
				statusColor: colors.greenDark,
			},
			() => {
				this.props.onEnd(data);
			}
		);
	};

	onError = (e) => {
		this.setState({
			status: 'Retry',
			progress: 0,
			statusColor: colors.rubyRed,
		});
	};

	onCancel = () => {
		this.setState(
			{
				status: 'Cancelled',
				progress: 0,
				statusColor: colors.rubyRed,
			},
			() => {
				this.props.onEnd(false);
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

	handleAction = () => {
		const values = [];
		if (this.state.status === 'Retry') {
			values.push({
				type: 0,
				value: 'Retry',
			});
		}
		values.push({
			type: 0,
			value: 'Cancel',
		});
		RNSelectionMenu.Show({
			values,
			selectedValues: [''],
			selectionType: 0,
			presentationType: 1,
			title: 'Select Option',
			onSelection: (value) => {
				if (value === 'Retry') {
					this.retry();
				} else {
					if (this.state.status === 'Retry') {
						this.props.onEnd(false);
					} else {
						this.cancel();
					}
				}
			},
		});
	};

	render() {
		const { uri, file } = this.props;
		const { statusColor, status, progress } = this.state;
		return (
			<Pressable onPress={this.handleAction} style={style.uploadCard}>
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
			</Pressable>
		);
	}
}

const style = StyleSheet.create({
	header: {
		height: headerHeight,
		width: uploaderWidth,
		justifyContent: 'center',
		paddingLeft: 10,
		backgroundColor: colors.primaryBlue,
		elevation: 5,
	},
	headerTitle: {
		fontSize: 15,
		fontWeight: '500',
		color: colors.buttonTxt,
	},
	main: {
		maxHeight: uploaderHeight,
		backgroundColor: colors.popupBg,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		overflow: 'hidden',
		position: 'absolute',
		bottom: 0,
		right: 10,
	},
	content: { height: contentHeight, width: uploaderWidth },
	uploadCard: {
		width: contentWidth,
		height: uploadCardHeight,
		borderRadius: BORDER_RADIUS,
		padding: 5,
		flexDirection: 'row',
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
		fontWeight: '500',
	},
	textContent: {
		flex: 1,
		paddingLeft: 10,
		justifyContent: 'center',
	},
	statusText: {
		fontSize: 12,
		fontWeight: '300',
		marginTop: 3,
		marginBottom: 5,
	},
});