import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Uploader from 'utils/uploader';
import filePicker from 'utils/filePicker';
import helper from 'utils/helper';
import Backend from 'backend';

export default class VideoFile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			logs: [],
			currentFilm: null,
			filmId: 1,
		};
		this.uploader = null;
	}

	componentDidMount() {
		this.loadData();
	}

	loadData = async () => {
		try {
			const { filmId, currentFilm } = this.state;
			const filmData = await Backend.Film.filmVideoData(filmId);
			if (filmData?.success) {
				this.setState({
					currentFilm: filmData.data,
				});
			}
		} catch (tryErr) {
			console.log(tryErr);
		}
	};

	startUploader = async () => {
		const { filmId } = this.state;
		filePicker.pickSingleVideo(async (file) => {
			if (file) {
				const { mimetype, totalChunks, sizeInMb } = await helper.getFileInfo(
					file
				);
				const filmData = await Backend.Film.createFilmRecord({
					filmId,
					mimetype,
					totalChunks,
					sizeInMb,
				});
				if (filmData.success) {
					this.setState(
						{
							currentFilm: filmData.data,
						},
						() => {
							this.initUpload(file);
						}
					);
				}
			}
		});
	};

	initUpload = (file) => {
		const { currentFilm } = this.state;
		this.uploader = null;
		this.uploader = new Uploader({
			endpoint: 'http://localhost:3301/v1/film/upload_film_video',
			fileId: currentFilm.s3UploadId,
			file,
		});
		this.setListeners();
		if (currentFilm?.totalChunks > 0) {
			this.uploader.setChunkData(
				currentFilm.currentChunk || 0,
				currentFilm.totalChunks
			);
		}
		this.uploader.startUploading();
	};

	setListeners = () => {
		this.uploader.on('error', (err) => {
			this.log('Something bad happened', err.detail);
		});

		this.uploader.on('progress', (progress) => {
			this.log(`The upload is at ${progress.detail}%`);
		});

		this.uploader.on('finish', (body) => {
			this.log('yeahhh - last response body:', body.detail);
		});
		this.uploader.on('offline', () => this.log('no problem, wait and see…'));
	};

	toggle = () => {
		this.uploader.togglePause();
	};

	log = (log) => {
		const logs = this.state.logs;
		logs.push(log);
		this.setState({ logs });
	};

	render() {
		const { logs, currentFilm } = this.state;
		return (
			<View style={style.main}>
				<View style={style.buttons}>
					<TouchableOpacity onPress={this.startUploader} style={style.button}>
						<Text>{currentFilm ? 'Resume Upload' : 'Upload New File'}</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={this.toggle} style={style.button}>
						<Text>Toggle</Text>
					</TouchableOpacity>
				</View>
				{logs.map((log, index) => (
					<Text key={index} style={style.log}>
						{log}
					</Text>
				))}
			</View>
		);
	}
}

const style = {
	main: {
		width: '100%',
		height: '100%',
		backgroundColor: '#242424',
	},
	buttons: {
		flexDirection: 'row',
		width: 200,
		height: 50,
		marginVertical: 50,
		justifyContent: 'space-between',
	},
	button: {
		width: 150,
		height: 150,
		borderRadius: 10,
		marginLeft: 20,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#98b311',
	},
	log: {
		fontSize: 14,
		color: '#c7c7c7',
	},
};
