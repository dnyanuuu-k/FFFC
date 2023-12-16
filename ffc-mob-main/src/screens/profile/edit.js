import React, { useState, useMemo, useEffect } from 'react';
import {
	Text,
	View,
	Pressable,
	StyleSheet,
	ImageBackground,
	ScrollView,
	ActivityIndicator,
} from 'react-native';
import Preloader from 'components/preloader/basic';
import Input from 'components/input';
import Header from 'components/header/basic';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Button from 'components/button/';
import { openPicker } from 'libs/mediapicker';
import { useTheme } from '@react-navigation/native';
import {
	COVER_ASPECT_RATIO,
	COVER_IMAGE_HEIGHT,
	WINDOW_WIDTH,
	WINDOW_HEIGHT,
	ERROR_TEXT,
	W90,
	STATIC_URL,
} from 'utils/constants';
import { fonts, weights } from 'themes/topography';
import helper from 'utils/helper';
import toast from 'libs/toast';
import Backend from 'backend';

const coverHeight = W90 * COVER_ASPECT_RATIO;
const avatarSize = coverHeight;
const EditProfile = ({ navigation }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					height: WINDOW_HEIGHT,
					width: WINDOW_WIDTH,
					backgroundColor: colors.background,
				},
				content: {
					marginTop: 10,
					paddingVertical: 20,
					backgroundColor: colors.card,
					alignItems: 'center',
				},
				mainContent: {
					width: W90,
					paddingBottom: 30,
				},
				coverNone: {
					overflow: 'hidden',
					borderColor: colors.primary,
					borderStyle: 'dashed',
					borderWidth: 1,
					borderRadius: 5,
					justifyContent: 'center',
					alignItems: 'center',
					height: coverHeight,
					width: W90,
					marginBottom: 20,
				},
				coverImage: {
					overflow: 'hidden',
					height: coverHeight,
					width: W90,
					marginBottom: 20,
					borderRadius: 5,
					backgroundColor: colors.background,
				},
				coverNote: {
					color: colors.primary,
					fontSize: fonts.small,
					marginTop: 5,
					textAlign: 'center',
				},
				editIcon: {
					padding: 8,
					backgroundColor: colors.bgTrans,
					borderRadius: 30,
					position: 'absolute',
					right: 8,
					top: 8,
				},
				avatarNone: {
					overflow: 'hidden',
					width: avatarSize,
					height: avatarSize,
					borderColor: colors.primary,
					borderStyle: 'dashed',
					borderWidth: 1,
					borderRadius: 5,
					justifyContent: 'center',
					alignItems: 'center',
					marginBottom: 20,
				},
				avatarNote: {
					fontSize: fonts.xsmall,
					color: colors.primary,
					marginTop: 5,
					textAlign: 'center',
				},
				avatarImage: {
					overflow: 'hidden',
					width: avatarSize,
					height: avatarSize,
					backgroundColor: colors.background,
					borderRadius: 5,
					justifyContent: 'center',
					marginBottom: 20,
					alignItems: 'center',
				},
				input: {
					width: W90,
					fontSize: fonts.regular,
					height: 40,
					marginTop: 5,
					padding: 0,
					marginBottom: 20,
				},
				label: {
					width: W90,
					fontSize: fonts.small,
					fontWeight: weights.semibold,
					color: colors.text,
				},
				req: {
					color: colors.rubyRed,
				},
				button: {
					borderRadius: 0,
					height: 50,
					position: 'absolute',
					bottom: 2,
					width: WINDOW_WIDTH,
				},
				uploading: {
					width: '100%',
					height: '100%',
					position: 'absolute',
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: colors.bgTrans69,
				},
				validFont: {
					fontSize: fonts.small,
				},
			}),
		[colors]
	);
	const [isBusy, setBusy] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [formDetails, setFormDetails] = useState({});
	const [coverUploading, setCoverUploading] = useState(false);
	const [avatarUploading, setAvatarUploading] = useState(false);

	const setDetails = (params) => {
		setFormDetails((pre) => ({ ...pre, ...params }));
	};

	const chooseCover = async () => {
		try {
			const response = await openPicker({
				mediaType: 'image',
				singleSelectedMode: true,
				ratioWidth: WINDOW_WIDTH,
				ratioHeight: COVER_IMAGE_HEIGHT,
				isCrop: true,
			});
			const file = {
				name: response.fileName,
				uri: 'file://' + response.crop.path,
				type: response.mime,
			};
			if (helper.bytesToMB(response.size) > 10) {
				toast.notify('File too large max 10 MB allowed');
				return;
			}
			sendCoverToServer(file);
		} catch (err) {
			// Ignore
		}
	};

	const chooseAvatar = async () => {
		try {
			const response = await openPicker({
				mediaType: 'image',
				singleSelectedMode: true,
				ratioWidth: 120,
				ratioHeight: 120,
				isCrop: true,
				isCropCircle: true,
			});
			const file = {
				name: response.fileName,
				uri: 'file://' + response.crop.path,
				type: response.mime,
			};
			if (helper.bytesToMB(response.size) > 10) {
				toast.notify('File too large max 10 MB allowed');
				return;
			}
			sendAvatarToServer(file);
		} catch (err) {
			// Ignore
		}
	};

	const sendCoverToServer = async (file) => {
		try {
			setCoverUploading(true);
			const response = await Backend.Account.uploadUserCover(file);
			if (response?.success) {
				setDetails(response.data);
				toast.success('Cover Updated Successfully');
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			setCoverUploading(false);
		}
	};

	const sendAvatarToServer = async (file) => {
		try {
			setAvatarUploading(true);
			const response = await Backend.Account.uploadUserAvatar(file);
			if (response?.success) {
				setDetails(response.data);
				toast.success('Avatar Updated Successfully');
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			setAvatarUploading(false);
		}
	};

	const updateUser = async () => {
		try {
			setBusy(true);
			const response = await Backend.Account.updateUserData(formDetails);
			if (response.success) {
				toast.success('Updated Successfully!');
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			setBusy(false);
		}
	};

	const getData = async () => {
		try {
			setIsLoading(true);
			const response = await Backend.Account.getUserData();
			if (response.success) {
				setFormDetails(response.data);
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (err) {
			navigation.goBack();
			toast.error(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	return (
		<View style={style.main}>
			<Header title="Edit Profile" desc="Reach better with complete profile" />
			<ScrollView>
				<View style={style.content}>
					<View style={style.mainContent}>
						<Preloader isBusy={isLoading} hasError={false} isEmpty={false}>
							{formDetails?.coverUrl ? (
								<ImageBackground
									source={{ uri: STATIC_URL + formDetails.coverUrl }}
									style={style.coverImage}
								>
									<Pressable onPress={chooseCover} style={style.editIcon}>
										<FeatherIcon
											color={colors.buttonTxt}
											size={15}
											name="edit-2"
										/>
									</Pressable>
									{coverUploading ? (
										<View style={style.uploading}>
											<ActivityIndicator color={colors.buttonTxt} size={30} />
										</View>
									) : null}
								</ImageBackground>
							) : (
								<Pressable onPress={chooseCover} style={style.coverNone}>
									<FeatherIcon color={colors.primary} size={28} name="image" />
									<Text style={style.coverNote}>Update Cover</Text>
									{coverUploading ? (
										<View style={style.uploading}>
											<ActivityIndicator color={colors.buttonTxt} size={30} />
										</View>
									) : null}
								</Pressable>
							)}

							{formDetails?.avatarUrl ? (
								<ImageBackground
									source={{ uri: STATIC_URL + formDetails.avatarUrl }}
									style={style.avatarImage}
								>
									<Pressable onPress={chooseAvatar} style={style.editIcon}>
										<FeatherIcon
											color={colors.buttonTxt}
											size={15}
											name="edit-2"
										/>
									</Pressable>
									{avatarUploading ? (
										<View style={style.uploading}>
											<ActivityIndicator color={colors.buttonTxt} size={30} />
										</View>
									) : null}
								</ImageBackground>
							) : (
								<Pressable onPress={chooseAvatar} style={style.avatarNone}>
									<FeatherIcon color={colors.primary} size={20} name="image" />
									<Text style={style.avatarNote}>Update Avatar</Text>
									{avatarUploading ? (
										<View style={style.uploading}>
											<ActivityIndicator color={colors.buttonTxt} size={30} />
										</View>
									) : null}
								</Pressable>
							)}

							<Text style={style.label}>
								First Name <Text style={style.req}>*</Text>
							</Text>
							<Input
								style={style.input}
								value={formDetails.firstName}
								onChangeText={(x) =>
									setDetails({
										firstName: x,
									})
								}
							/>

							<Text style={style.label}>Last Name</Text>
							<Input
								style={style.input}
								value={formDetails.lastName}
								onChangeText={(x) =>
									setDetails({
										lastName: x,
									})
								}
							/>

							<View style={style.hr} />

							<Text style={style.label}>Facebook</Text>
							<Input
								style={style.input}
								value={formDetails.fbUrl}
								onChangeText={(x) =>
									setDetails({
										fbUrl: x,
									})
								}
							/>

							<Text style={style.label}>Instagram</Text>
							<Input
								style={style.input}
								value={formDetails.instaUrl}
								onChangeText={(x) =>
									setDetails({
										instaUrl: x,
									})
								}
							/>

							<Text style={style.label}>Linkedin</Text>
							<Input
								style={style.input}
								value={formDetails.instaUrl}
								onChangeText={(x) =>
									setDetails({
										instaUrl: x,
									})
								}
							/>

							<Text style={style.label}>X (Twitter)</Text>
							<Input
								style={style.input}
								value={formDetails.twitterUrl}
								onChangeText={(x) =>
									setDetails({
										twitterUrl: x,
									})
								}
							/>
						</Preloader>
					</View>
				</View>
			</ScrollView>
			<Button
				busy={isBusy}
				onPress={updateUser}
				type={Button.PRIMARY}
				style={style.button}
				text={'Submit'}
				iconSize={16}
				textStyle={style.validFont}
			/>
		</View>
	);
};

export default EditProfile;
