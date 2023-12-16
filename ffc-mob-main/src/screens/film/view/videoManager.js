import React, { useMemo, useEffect, useState } from 'react';
import {
	View,
	Pressable,
	Text,
	StyleSheet,
	ActivityIndicator,
} from 'react-native';

// Components
import FeatherIcon from 'react-native-vector-icons/Feather';
import VideoDecoder from './videoDecoder';
import VideoLinkInput from './videoLinkInput';
import Button from 'components/button';

import Backend from 'backend';
import Animated, {
	FadeIn,
	FadeOut,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';

// Hooks & Functions
import { useTheme, useNavigation } from '@react-navigation/native';
import { openPicker } from 'libs/mediapicker';
import { weights, fonts } from 'themes/topography';
import { RNSelectionMenu } from 'libs/Menu';
import Tus from 'react-native-tus-client';
import toast from 'libs/toast';
import helper from 'utils/helper';

// Constants
import {
	WINDOW_WIDTH,
	VIDEO_STATES,
	ERROR_TEXT,
	TUS_URL,
} from 'utils/constants';

const YoutubeImage = require('assets/images/youtube.png');
const VimeoImage = require('assets/images/vimeo.png');
const videoHeight = (WINDOW_WIDTH * 9) / 16;
const buttonWidth = WINDOW_WIDTH * 0.7;
const buttonWidth2 = buttonWidth / 2.1;

const progressWidth = WINDOW_WIDTH * 0.8;
const btnRowWidth = 86;
const barWidth = progressWidth - btnRowWidth;

const uploadInfo =
	'You can upload  upto 10 GB, only visible to festival you submit';
const pauseUploadDesc =
	'Background upload is not supported currently due performance issue, however you can resume upload using same file later';
const yesNoValues = [
	{
		type: 0,
		value: 'Yes',
	},
	{
		type: 0,
		value: 'no',
	},
];
const VideoManager = ({ filmId, isOwner, showMaker, submissionView }) => {
	const { colors, dark } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					height: videoHeight,
					width: WINDOW_WIDTH,
					backgroundColor: colors.card,
					justifyContent: 'center',
					alignItems: 'center',
					borderBottomWidth: 0.7,
					borderColor: colors.border,
				},
				overlay: {
					backgroundColor: colors.bgTrans69,
					justifyContent: 'center',
					alignItems: 'center',
					position: 'absolute',
					height: videoHeight,
					width: WINDOW_WIDTH,
				},
				playIcon: {
					backgroundColor: colors.bgTrans,
					justifyContent: 'center',
					alignItems: 'center',
					height: 50,
					width: 50,
					paddingLeft: 5,
					borderRadius: 100,
					borderWidth: 2,
					borderColor: colors.buttonTxt,
				},
				uploadButton: {
					backgroundColor: colors.primary,
					width: buttonWidth,
					height: 35,
					justifyContent: 'center',
					alignItems: 'center',
					borderRadius: 5,
				},
				buttonText: {
					fontSize: fonts.small,
					fontWeight: weights.bold,
					color: colors.buttonTxt,
				},
				validFont: {
					fontSize: fonts.small,
				},
				buttonLink: {
					width: buttonWidth,
					height: 35,
					borderRadius: 5,
					backgroundColor: colors.primaryLight,
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'row',
				},
				buttonTxtLink: {
					color: colors.primary,
					fontSize: fonts.small,
					fontWeight: weights.bold,
					marginLeft: 10,
				},
				hrRow: {
					width: buttonWidth,
					flexDirection: 'row',
					alignItems: 'center',
					marginVertical: 10,
					justifyContent: 'space-between',
				},
				hr: {
					height: 1,
					flex: 1,
					backgroundColor: colors.border,
				},
				hrTxt: {
					fontSize: fonts.xsmall,
					marginHorizontal: 10,
					color: colors.holderColor,
				},
				uploadNote: {
					marginTop: 15,
					width: buttonWidth,
					fontSize: fonts.xsmall,
					color: colors.holderColor,
					textAlign: 'center',
				},
				progressCover: {
					width: progressWidth,
					borderWidth: 1,
					borderRadius: 5,
					borderColor: colors.primary,
					height: 40,
					flexDirection: 'row',
				},
				progressBar: {
					width: barWidth,
					height: 40,
					position: 'absolute',
					backgroundColor: colors.primaryLight,
				},
				progressContent: {
					width: barWidth,
					height: 40,
					justifyContent: 'center',
					alignItems: 'center',
					overflow: 'hidden',
				},
				barRow: {
					borderLeftWidth: 1,
					flexDirection: 'row',
					borderColor: colors.primary,
					width: btnRowWidth,
					alignItems: 'center',
					justifyContent: 'space-around',
				},
				pauseBtn: {
					borderRadius: 100,
					width: 30,
					height: 30,
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: colors.primaryLight,
				},
				cancelBtn: {
					borderRadius: 100,
					width: 30,
					height: 30,
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: colors.rubyRedLight,
				},
				progressTxt: {
					fontSize: fonts.small,
					fontWeight: weights.semibold,
					color: colors.primary,
				},
				buttonStyle: {
					height: 30,
					width: 150,
				},
				noteCover: {
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
				},
				notUploaded: {
					color: colors.holderColor,
					textAlign: 'center',
					marginBottom: 10,
					fontSize: fonts.small,
				},
			}),
		[colors]
	);
	const navigation = useNavigation();
	const translateX = useSharedValue(-barWidth);
	const [isLoading, setIsLoading] = useState(false);
	const [paused, setPaused] = useState(true);
	const [linkDefaultValues, setLinkDefaultValues] = useState({});
	const [linkUploaderView, setShowLinkUploader] = useState(false);
	const [uploadProgress, setUploadProgress] = useState('0.00 %');
	const [uploadNote, setUploadNote] = useState('');
	const [currentUploadId, setCurrentUploadId] = useState(null);
	const [videoState, setVideoState] = useState(VIDEO_STATES.NOTCREATED);
	const [filmData, setFilmData] = useState({});

	const loadData = async () => {
		try {
			setIsLoading(true);
			const response = await Backend.Film.filmVideoData(filmId);
			if (response?.success) {
				const data = response.data;
				setFilmData(data);
				setVideoState(data.status);
				setCurrentUploadId(createUploadId(data.id));
				if (data.status === VIDEO_STATES.UPLOADING) {
					setPaused(true);
					const uploaded = parseInt(data.uploadedBytes || 0, 10);
					const total = parseInt(data.totalBytes, 10);
					setProgressInterface(uploaded, total);
				}
			}
		} catch (tryErr) {
			console.log(tryErr);
		} finally {
			setIsLoading(false);
		}
	};

	const shouldContinueUpload = () => {
		const values = [
			{
				type: 0,
				value: 'Continue Upload',
			},
			{
				type: 0,
				value: 'Pause Upload',
			},
		];
		RNSelectionMenu.Show({
			values,
			selectedValues: [''],
			selectionType: 0,
			presentationType: 1,
			theme: dark ? 1 : 0,
			title: 'Pause Upload',
			subtitle: pauseUploadDesc,
			onSelection: (value) => {
				const index = values.findIndex((v) => v.value === value);
				if (index === 1) {
					Tus.pauseUpload(currentUploadId);
					setPaused(true);
					setTimeout(() => {
						navigation.goBack();
					}, 100);
					return;
				}
			},
		});
	};

	useEffect(() => {
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(
		() =>
			navigation.addListener('beforeRemove', (e) => {
				if (videoState === VIDEO_STATES.UPLOADING && !paused) {
					e.preventDefault();
					shouldContinueUpload();
					return;
				}
				Tus.clear(currentUploadId);
			}),
		[videoState, paused, currentUploadId]
	);

	const getUploadAction = () => {
		if (videoState === VIDEO_STATES.ERROR) {
			return 'Retry';
		} else if (paused) {
			return 'Resume';
		} else {
			return uploadProgress;
		}
	};

	const createUploadId = (id) => {
		return `upload_${id}`;
	};

	const startNewUpload = async (fileData = null) => {
		try {
			const payload = {
				filmId,
			};
			if (fileData) {
				payload.height = fileData.height;
				payload.width = fileData.width;
				payload.totalBytes = fileData.size;
				payload.sizeInMb = helper.bytesToMB(fileData.size);
				payload.mimetype = fileData.mime;
			}
			const record = await Backend.Film.resetTusFilmRecord(payload);
			if (record?.success) {
				if (record.data.id) {
					// If has created new file
					const uploadId = createUploadId(record.data.id);
					setCurrentUploadId(uploadId);
					startUpload(uploadId, fileData);
				} else {
					setCurrentUploadId(null);
					setVideoState(VIDEO_STATES.NOTCREATED);
				}
			} else {
				throw new Error(record?.message || ERROR_TEXT);
			}
		} catch (err) {
			toast.error(err.message);
		}
	};

	const updateLinkVideo = async ({ videoUrl, password = '' }) => {
		try {
			setShowLinkUploader(false);
			setIsLoading(true);
			const response = await Backend.Film.updateFilmVideoUrl({
				filmId,
				videoUrl,
				password,
			});
			if (response.success) {
				loadData();
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	const invalidResumeFile = (response) => {
		const values = [
			{
				type: 0,
				value: 'I will try again',
			},
			{
				type: 0,
				value: 'Start from beginning',
			},
		];
		RNSelectionMenu.Show({
			values,
			selectedValues: [''],
			selectionType: 0,
			presentationType: 1,
			theme: dark ? 1 : 0,
			title: 'Wrong file selected',
			subtitle:
				'Please select correct file to resume upload or start new upload from beginning',
			onSelection: (value) => {
				const index = values.findIndex((v) => v.value === value);
				if (index === 0) {
					pickVideo();
					return;
				}
				startNewUpload(response);
			},
		});
	};

	const handlePause = async () => {
		if (paused) {
			if (Tus.hasClient(currentUploadId)) {
				Tus.startUpload(currentUploadId);
				setPaused(false);
			} else {
				pickVideo();
			}
			return;
		}
		RNSelectionMenu.Show({
			values: yesNoValues,
			selectedValues: [''],
			selectionType: 0,
			presentationType: 1,
			theme: dark ? 1 : 0,
			title: 'Are you sure',
			subtitle: 'You want to pause upload',
			onSelection: (value) => {
				const index = yesNoValues.findIndex((v) => v.value === value);
				if (index === 0) {
					Tus.pauseUpload(currentUploadId);
					setPaused(true);
					return;
				}
			},
		});
	};

	const handleCancel = () => {
		RNSelectionMenu.Show({
			values: yesNoValues,
			selectedValues: [''],
			selectionType: 0,
			presentationType: 1,
			theme: dark ? 1 : 0,
			title: 'Are you sure',
			subtitle: 'You want to cancel upload',
			onSelection: (value) => {
				const index = yesNoValues.findIndex((v) => v.value === value);
				if (index === 0) {
					Tus.pauseUpload(currentUploadId);
					setPaused(false);
					setTimeout(() => {
						startNewUpload(null); // Reset Record File
					}, 700);
					return;
				}
			},
		});
	};

	const pickVideo = async () => {
		const response = await openPicker({
			singleSelectedMode: true,
			mediaType: 'video',
		});
		if (currentUploadId) {
			const totalBytes = parseInt(filmData.totalBytes, 10);
			if (response.size !== totalBytes) {
				setTimeout(() => {
					invalidResumeFile(response);
				}, 300);
				return;
			}
			startUpload(currentUploadId, response);
			return;
		}
		try {
			const payload = {
				filmId,
				height: response.height,
				width: response.width,
				totalBytes: response.size,
				sizeInMb: helper.bytesToMB(response.size),
				mimetype: response.mime,
			};
			const record = await Backend.Film.createTusFilmRecord(payload);
			if (record?.success) {
				const uploadId = createUploadId(record.data.id);
				setCurrentUploadId(uploadId);
				startUpload(uploadId, response);
				setVideoState(VIDEO_STATES.CREATED);
			} else {
				throw new Error(record?.message || ERROR_TEXT);
			}
		} catch (err) {
			console.log(err);
			toast.error(err.message);
		}
	};

	const setProgressInterface = (uploaded, total) => {
		if (videoState !== VIDEO_STATES.UPLOADING) {
			setVideoState(VIDEO_STATES.UPLOADING);
		}
		const progress = uploaded / total;
		const uploadTxt = helper.formatBytes(uploaded);
		const totalTxt = helper.formatBytes(total);
		const animX = -(barWidth - barWidth * progress);
		setUploadProgress(Number(progress * 100).toFixed(2) + ' %');
		setUploadNote(`Uploaded ${uploadTxt} of ${totalTxt}`);
		translateX.value = withTiming(animX);
	};

	const startUpload = (uploadId, response) => {
		try {
			const client = Tus.addClient(uploadId);
			client.init(response.realPath, {
				endpoint: TUS_URL,
				headers: {
					'x-upload-id': uploadId,
				},
				uploadId,
				onError: (error, params) => {
					setVideoState(VIDEO_STATES.ERROR);
					setPaused(true);
				},
				onSuccess: () => {
					loadData();
				},
				onProgress: (uploaded, total) => {
					setProgressInterface(uploaded, total);
				},
			});
			client.start();
			setVideoState(VIDEO_STATES.UPLOADING);
			setPaused(false);
		} catch (err) {
			console.error(err);
		}
	};

	const handleActionPress = async () => {
		if (videoState === VIDEO_STATES.ERROR || paused) {
			if (Tus.hasClient(currentUploadId)) {
				Tus.startUpload(currentUploadId);
				setPaused(false);
			} else {
				toast.notify('Pick same file to resume upload');
				pickVideo();
			}
		}
	};

	const handleEdit = async (type) => {
		if (type === 'edit') {
			startLinkUploader(false);
			return;
		}
		try {
			setIsLoading(true);
			await startNewUpload(null);
		} catch (err) {
			// Ignore
		} finally {
			setIsLoading(false);
		}
	};

	const startLinkUploader = (isNew = true) => {
		setLinkDefaultValues(
			isNew ? {} : { videoUrl: filmData.videoUrl, password: filmData.password }
		);
		setShowLinkUploader(true);
	};

	const renderVideoState = () => {
		const uploadAction = getUploadAction();
		if (submissionView && videoState !== VIDEO_STATES.READY) {
			return (
				<Animated.View
					style={style.noteCover}
					entering={FadeIn}
					exiting={FadeOut}
				>
					<Text style={style.notUploaded}>
						Video is not uploaded by film maker, you can reach out film maker
					</Text>
					<Button
						onPress={showMaker}
						text="View Film Maker"
						textStyle={style.validFont}
						style={style.buttonStyle}
						type={Button.OUTLINE_PRIMARY}
					/>
				</Animated.View>
			);
		}
		switch (videoState) {
			case VIDEO_STATES.NOTCREATED:
				return (
					<Animated.View entering={FadeIn} exiting={FadeOut}>
						<Pressable onPress={pickVideo} style={style.uploadButton}>
							<Text style={style.buttonText}>Upload Video</Text>
						</Pressable>
						<View style={style.hrRow}>
							<View style={style.hr} />
							<Text style={style.hrTxt}>OR</Text>
							<View style={style.hr} />
						</View>
						<Pressable onPress={startLinkUploader} style={style.buttonLink}>
							<FeatherIcon color={colors.primary} name="link" size={14} />
							<Text style={style.buttonTxtLink}>Submit Video Link</Text>
						</Pressable>

						<Text style={style.uploadNote}>{uploadInfo}</Text>
					</Animated.View>
				);
			case VIDEO_STATES.CREATED:
			case VIDEO_STATES.UPLOADING:
			case VIDEO_STATES.UPLOADED:
			case VIDEO_STATES.TRANSCODING:
			case VIDEO_STATES.ERROR:
				return (
					<Animated.View entering={FadeIn} exiting={FadeOut}>
						<View style={style.progressCover}>
							<Pressable
								onPress={handleActionPress}
								style={style.progressContent}
							>
								<Animated.View
									style={[style.progressBar, { transform: [{ translateX }] }]}
								/>
								<Text style={style.progressTxt}>{uploadAction}</Text>
							</Pressable>
							<View style={style.barRow}>
								<Pressable onPress={handlePause} style={style.pauseBtn}>
									<FeatherIcon
										name={paused ? 'play' : 'pause'}
										size={15}
										color={colors.primary}
										style={{ marginLeft: paused ? 3 : 0 }}
									/>
								</Pressable>
								<Pressable onPress={handleCancel} style={style.cancelBtn}>
									<FeatherIcon name="x" size={18} color={colors.rubyRed} />
								</Pressable>
							</View>
						</View>

						<Text style={style.uploadNote}>{uploadNote}</Text>
					</Animated.View>
				);
			case VIDEO_STATES.READY:
				return (
					<VideoDecoder
						width={WINDOW_WIDTH}
						height={videoHeight}
						data={filmData}
						submissionView={submissionView}
						isOwner={isOwner}
						onEdit={handleEdit}
					/>
				);
			default:
				return <View />;
		}
	};

	return (
		<View style={style.main}>
			{isLoading ? (
				<ActivityIndicator size={30} color={colors.primary} />
			) : (
				renderVideoState()
			)}
			<VideoLinkInput
				onClose={() => setShowLinkUploader(false)}
				onSubmit={updateLinkVideo}
				visible={linkUploaderView}
				defaultValues={linkDefaultValues}
			/>
		</View>
	);
};

export default VideoManager;