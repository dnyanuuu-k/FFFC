import React, { useMemo, useState } from 'react';
import {
	View,
	ImageBackground,
	Text,
	Pressable,
	StyleSheet,
	Linking,
	ActivityIndicator,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FullscreenPlayer from './fullscreenPlayer';

import toast from 'libs/toast';
import { RNSelectionMenu } from 'libs/Menu/';
import { useTheme } from '@react-navigation/native';
import { fonts, weights } from 'themes/topography';

import Backend from 'backend';

const tryLaterMessage =
	'Video is still being processed, this can take upto several minutes based on video size. Please try again later';
const YT_SOURCE = 'yt'; // YouTube
const VM_SOURCE = 'vm'; // Vimeo
const DM_SOURCE = 'dm'; // Daily Motion
const GD_SOURCE = 'gd'; // Google Drive
const LK_SOURCE = 'lk'; // Link Source
const FFB_SOURCE = 'ffb'; // FFB Source

function getVideoInfo(url) {
	// YouTube URL pattern
	const youtubePattern =
		/(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|ytscreeningroom\?v=|shorts\/)([a-zA-Z0-9_-]+)/;

	// Vimeo URL pattern
	const vimeoPattern = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/;

	// Google Drive URL pattern
	const drivePattern =
		/(?:https?:\/\/)?drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;

	// DailyMotion URL pattern
	const dailymotionPattern =
		/(?:https?:\/\/)?(?:www\.)?dailymotion\.com\/video\/([a-zA-Z0-9_-]+)/;

	if (youtubePattern.test(url)) {
		const videoId = url.match(youtubePattern)[1];
		const thumb = `https://img.youtube.com/vi/${videoId}/0.jpg`;
		return {
			playable: true,
			service: YT_SOURCE,
			videoId: videoId,
			url: 'https://www.youtube.com/embed/' + videoId,
			thumb,
		};
	} else if (vimeoPattern.test(url)) {
		const videoId = url.match(vimeoPattern)[1];
		const thumb = `https://vumbnail.com/${videoId}.jpg`;
		return {
			playable: true,
			service: VM_SOURCE,
			videoId: videoId,
			url: 'https://player.vimeo.com/video/' + videoId,
			thumb,
		};
	} else if (drivePattern.test(url)) {
		const fileId = url.match(drivePattern)[1];
		return {
			playable: true,
			service: GD_SOURCE,
			videoId: fileId,
			url,
		};
	} else if (dailymotionPattern.test(url)) {
		const videoId = url.match(dailymotionPattern)[1];
		const link =
			'https://www.dailymotion.com/services/oembed/?url=https://dai.ly/' +
			videoId;
		const thumb = 'https://www.dailymotion.com/thumbnail/video/' + videoId;
		return {
			playable: true,
			service: DM_SOURCE,
			videoId: videoId,
			url: link,
			thumb,
		};
	} else {
		return {
			playable: false,
			service: LK_SOURCE,
			videoId: null,
			url,
		};
	}
}

const VideoDecoder = ({
	data,
	width,
	height,
	submissionView = false,
	onEdit,
	isOwner = true,
}) => {
	const { colors, dark } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					width,
					height,
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: colors.border,
				},
				playCover: {
					width: 50,
					height: 50,
					backgroundColor: colors.bgTrans,
					borderRadius: 100,
					justifyContent: 'center',
					alignItems: 'center',
					borderWidth: 1,
					borderColor: colors.card,
				},
				playIcon: {
					marginLeft: 5,
				},
				link: {
					marginTop: 10,
					borderRadius: 100,
					width: 200,
					color: colors.border,
					fontSize: fonts.xsmall,
					backgroundColor: colors.bgTrans,
					paddingVertical: 5,
					paddingHorizontal: 10,
				},
				passCover: {
					marginTop: 10,
					borderRadius: 100,
					backgroundColor: colors.bgTrans,
					paddingVertical: 5,
					paddingHorizontal: 20,
					flexDirection: 'row',
					alignItems: 'center',
				},
				copyIcon: {
					marginLeft: 20,
				},
				passText: {
					fontSize: fonts.xsmall,
					fontWeight: weights.semibold,
					color: colors.buttonTxt,
				},
				passNote: {
					fontSize: fonts.xsmall,
					color: colors.buttonTxt,
				},
				editCover: {
					position: 'absolute',
					top: 5,
					right: 5,
					backgroundColor: colors.bgTrans,
					borderRadius: 20,
					paddingHorizontal: 10,
					paddingVertical: 5,
					flexDirection: 'row',
					alignItems: 'center',
					borderWidth: 1,
					borderColor: colors.card,
				},
				editTxt: {
					fontSize: fonts.regular,
					color: colors.buttonTxt,
					marginLeft: 5,
				},
			}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[colors]
	);
	const [latestVideoStatus, setVideoStatus] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [modalPlayerVisible, setModalPlayerVisible] = useState(false);
	const [currentVideo, isNativePlayer] = useMemo(() => {
		if (data?.s3FileId?.length) {
			return [
				{
					service: FFB_SOURCE,
					url: data.streamUrl,
					thumb: data.thumbnailUrl,
					playable: data.playable,
				},
				true,
			];
		}
		const source = getVideoInfo(data.videoUrl);
		return [source, false];
	}, [data]);

	const sureEdit = () => {
		if (!isNativePlayer) {
			const values = [
				{ value: 'Edit url', type: 0 },
				{ value: 'Remove', type: 2 },
			];
			RNSelectionMenu.Show({
				values,
				selectedValues: [''],
				selectionType: 0,
				presentationType: 1,
				theme: dark ? 1 : 0,
				title: 'Manage Video URL',
				onSelection: (value) => {
					const index = values.findIndex((v) => v.value === value);
					if (index) {
						onEdit('reset');
					} else {
						onEdit('edit');
					}
				},
			});
			return;
		}
		const values = [
			{ value: 'No', type: 1 },
			{ value: 'Yes', type: 2 },
		];
		RNSelectionMenu.Show({
			values,
			selectedValues: [''],
			selectionType: 0,
			presentationType: 2,
			theme: dark ? 1 : 0,
			title: 'Are you sure! Action cannot be reverted?',
			subtitle:
				'This action cannot be reverted and you video will be deleted, you will have to re-upload it',
			onSelection: (value) => {
				const index = values.findIndex((v) => v.value === value);
				if (index) {
					onEdit('reset');
				}
			},
		});
	};

	const openLink = () => {
		const values = [
			{ value: 'Open Link', type: 0 },
			{ value: 'Copy Link', type: 0 },
		];
		RNSelectionMenu.Show({
			values,
			selectedValues: [''],
			selectionType: 0,
			presentationType: 2,
			theme: dark ? 1 : 0,
			title: 'Link Options',
			onSelection: (value) => {
				const index = values.findIndex((v) => v.value === value);
				if (index) {
					toast.success('Video Link Copied');
				} else {
					Linking.openURL(currentVideo.url);
				}
			},
		});
	};

	const handleVideoPress = async () => {
		if (isLoading) {
			toast.notify('Please wait!');
			return;
		}
		if (data?.playable || latestVideoStatus) {
			setModalPlayerVisible(true);
			return;
		}

		setIsLoading(true);
		try {
			const response = await Backend.Film.getVideoStatus(data.s3FileId);
			if (response?.success) {
				const playable = response.data.playable;
				if (playable) {
					setVideoStatus(true);
					setModalPlayerVisible(true);
				} else {
					toast.notify(tryLaterMessage);
				}
			} else {
				toast.notify(tryLaterMessage);
			}
		} catch (err) {
			toast.error('Unable to get video status');
		} finally {
			setIsLoading(false);
		}
	};

	const copyPassword = () => {
		toast.success('Password copied');
	};

	const renderPassword = () => {
		return submissionView && data?.password ? (
			<Pressable onPress={copyPassword} style={style.passCover}>
				<View>
					<Text style={style.passText}>asd</Text>
					<Text style={style.passNote}>Password</Text>
				</View>
				<FeatherIcon
					size={15}
					style={style.copyIcon}
					color={colors.buttonTxt}
					name="copy"
				/>
			</Pressable>
		) : null;
	};

	const renderOwner = () => {
		return isOwner ? (
			<Pressable style={style.editCover} onPress={sureEdit}>
				<FeatherIcon
					name="edit-2"
					style={style.editIcon}
					color={colors.card}
					size={15}
				/>
				<Text style={style.editTxt}>Edit</Text>
			</Pressable>
		) : null;
	};

	const renderSource = () => {
		switch (currentVideo.service) {
			case YT_SOURCE:
			case DM_SOURCE:
			case VM_SOURCE:
				return (
					<ImageBackground
						source={{ uri: currentVideo.thumb }}
						style={style.main}
					>
						<Pressable
							onPress={() => setModalPlayerVisible(true)}
							style={style.playCover}
						>
							<FeatherIcon
								style={style.playIcon}
								size={25}
								color={colors.buttonTxt}
								name="play"
							/>
						</Pressable>
						{renderPassword()}
						{renderOwner()}
					</ImageBackground>
				);
			case FFB_SOURCE:
				return (
					<ImageBackground
						source={{ uri: currentVideo.thumb }}
						style={style.main}
					>
						<Pressable onPress={handleVideoPress} style={style.playCover}>
							{isLoading ? (
								<ActivityIndicator size={25} color={colors.buttonTxt} />
							) : (
								<FeatherIcon
									style={style.playIcon}
									size={25}
									color={colors.buttonTxt}
									name="play"
								/>
							)}
						</Pressable>
						{data?.playable || latestVideoStatus ? (
							renderOwner()
						) : (
							<Text numberOfLines={1} style={style.link}>
								Your video being processed
							</Text>
						)}
					</ImageBackground>
				);
			default:
				return (
					<View source={{ uri: currentVideo.thumb }} style={style.main}>
						<Pressable onPress={openLink} style={style.playCover}>
							<FeatherIcon size={25} color={colors.buttonTxt} name="link" />
						</Pressable>
						<Text onPress={openLink} numberOfLines={1} style={style.link}>
							{currentVideo.url}
						</Text>
						{renderPassword()}
						{renderOwner()}
					</View>
				);
		}
	};
	return (
		<Animated.View entering={FadeIn} exiting={FadeOut}>
			{renderSource()}
			<FullscreenPlayer
				title={data.title}
				isNativePlayer={isNativePlayer}
				visible={modalPlayerVisible}
				onClose={() => setModalPlayerVisible(false)}
				url={currentVideo.url}
				canPlay={currentVideo.playable}
			/>
		</Animated.View>
	);
};

export default VideoDecoder;