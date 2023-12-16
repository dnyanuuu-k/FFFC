import React, { useEffect, useState, useMemo } from 'react';
import {
	View,
	StatusBar,
	Text,
	Pressable,
	ScrollView,
	StyleSheet,
	Linking,
	RefreshControl,
} from 'react-native';
import Icon8 from 'components/icons/icon8';
import Image from 'components/image';
import Preloader from 'components/preloader/basic';
import Shimmer from 'react-native-shimmer';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AccountSwitch from './accountSwitch';
import JudgeSubmission from './judgeSubmission';
import { useTheme } from '@react-navigation/native';
import {
	WINDOW_WIDTH,
	W90,
	W95,
	COVER_IMAGE_HEIGHT,
	WORK_TYPE_MANAGE_FESTIVAL,
} from 'utils/constants';
import { fonts, weights } from 'themes/topography';
import { CommonActions } from '@react-navigation/native';
import Tinode from 'libs/tinode';
import helper from 'utils/helper';
import DB from 'db';
import Backend from 'backend';

const UserProfile = ({ navigation }) => {
	const { colors, dark } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					backgroundColor: colors.background,
					flex: 1,
				},
				header: {
					height: 50,
					width: WINDOW_WIDTH,
					position: 'absolute',
					paddingLeft: 10,
				},
				coverImage: {
					height: COVER_IMAGE_HEIGHT,
					width: WINDOW_WIDTH,
					backgroundColor: colors.background,
				},
				logoHolder: {
					width: 100,
					height: 100,
					top: 70,
					position: 'absolute',
					alignSelf: 'center',
					overflow: 'hidden',
					borderWidth: 5,
					borderColor: colors.card,
					borderRadius: 100,
					zIndex: 12,
					backgroundColor: colors.background,
				},
				logoImage: {
					width: 100,
					height: 100,
				},
				title: {
					fontSize: fonts.large,
					fontWeight: weights.bold,
					color: colors.text,
					marginTop: 10,
					textAlign: 'center',
					width: W90,
				},
				desig: {
					fontSize: fonts.regular,
					color: colors.holderColor,
					marginTop: 5,
					textAlign: 'center',
					width: W90,
				},
				headerContent: {
					paddingTop: 50,
					backgroundColor: colors.card,
					alignItems: 'center',
					elevation: 2,
				},
				socialRow: {
					flexDirection: 'row',
					width: 250,
					paddingHorizontal: 10,
					alignSelf: 'center',
					marginVertical: 20,
					borderTopWidth: 1,
					borderColor: colors.border,
					paddingTop: 20,
					justifyContent: 'space-between',
				},
				socialIcon: {
					width: 22,
					height: 22,
					tintColor: colors.text,
				},

				optionCover: {
					width: W95,
					alignSelf: 'center',
					borderRadius: 5,
					borderWidth: 1,
					padding: 10,
					backgroundColor: colors.card,
					marginTop: 10,
					borderColor: colors.border,
					paddingHorizontal: 15,
				},
				option: {
					flexDirection: 'row',
					alignItems: 'center',
					height: 50,
				},
				optionIcon: {
					width: 50,
					height: 50,
					justifyContent: 'center',
				},
				optionText: {
					fontSize: fonts.regular,
					fontWeight: weights.semibold,
					color: colors.text,
				},
				redColor: {
					color: colors.rubyRed,
				},
				editProfile: {
					position: 'absolute',
					top: StatusBar.currentHeight,
					right: 8,
					fontSize: fonts.xsmall,
					fontWeight: weights.semibold,
					color: colors.buttonTxt,
					paddingVertical: 5,
					paddingHorizontal: 10,
					borderRadius: 20,
					backgroundColor: colors.bgTrans,
				},
			}),
		[colors]
	);
	const [profile, setProfileData] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(false);

	const logout = () => {
		Tinode.clearCurrent();
		DB.Account.deleteCurrentToken();
		navigation.dispatch(
			CommonActions.reset({
				index: 0,
				routes: [{ name: 'Login' }],
			})
		);
	};

	const handleEdit = () => {
		navigation.navigate('EditProfile');
	};

	const getData = async (force = false) => {
		try {
			if (!profile?.name || force) {
				setIsLoading(true);
			}
			setError(false);
			const response = await Backend.Account.getUserData();
			if (response.success) {
				const data = response.data;
				const name = helper.getFullName(data.firstName, null, data.lastName);
				const workTypeName =
					data.workType === WORK_TYPE_MANAGE_FESTIVAL
						? 'Festival Organizer'
						: 'Film Maker';
				setProfileData({
					...data,
					name,
					workTypeName,
				});
			} else {
				throw new Error(response?.message);
			}
		} catch (err) {
			setError(true);
		} finally {
			setIsLoading(false);
		}
	};

	const openLink = (type) => {
		const key = type + 'Url';
		if (profile[key]) {
			Linking.openURL(profile[key]);
		} else {
			handleEdit();
		}
	};

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			getData();
		});
		return unsubscribe;
	}, []);

	return (
		<View style={style.main}>
			<ScrollView
				refreshControl={
					<RefreshControl onRefresh={() => getData(true)} refreshing={false} />
				}
			>
				<Preloader
					onRetry={getData}
					CustomLoader={ProfileShimmer}
					isEmpty={false}
					isBusy={isLoading}
					hasError={error}
				>
					<Image
						style={style.coverImage}
						url={profile.coverUrl}
						hash={profile.coverHash}
					/>

					<View style={style.headerContent}>
						<Text style={style.title}>{profile.name}</Text>
						<Text style={style.desig}>{profile.workTypeName}</Text>
						<View style={style.socialRow}>
							<Icon8
								onPress={() => openLink('fb')}
								icon={Icon8.fb}
								style={style.socialIcon}
							/>
							<Icon8
								onPress={() => openLink('linkedin')}
								icon={Icon8.linkedin}
								style={style.socialIcon}
							/>
							<Icon8
								onPress={() => openLink('insta')}
								icon={Icon8.insta}
								style={style.socialIcon}
							/>
							<Icon8
								onPress={() => openLink('twitter')}
								icon={Icon8.twitter}
								style={style.socialIcon}
							/>
						</View>
					</View>

					<Text onPress={handleEdit} style={style.editProfile}>
						Edit Profile
					</Text>

					<AccountSwitch workType={profile.workType} colors={colors} />
					{profile?.festivalJudges?.length ? (
						<JudgeSubmission
							dark={dark}
							list={profile.festivalJudges}
							navigation={navigation}
							colors={colors}
							onUpdate={(festivalJudges) =>
								setProfileData((pre) => ({
									...pre,
									festivalJudges,
								}))
							}
						/>
					) : null}

					<View style={style.logoHolder}>
						<Image
							url={profile.avatarUrl}
							style={style.logoImage}
							hash={profile.avatarHash}
						/>
					</View>
				</Preloader>

				<View style={style.optionCover}>
					<View style={style.option}>
						<View style={style.optionIcon}>
							<FeatherIcon color={colors.text} size={18} name="phone" />
						</View>
						<Text style={style.optionText}>Support</Text>
					</View>

					<View style={style.option}>
						<View style={style.optionIcon}>
							<FeatherIcon color={colors.text} size={18} name="file-text" />
						</View>
						<Text style={style.optionText}>Terms & conditions</Text>
					</View>

					<View style={style.option}>
						<View style={style.optionIcon}>
							<FeatherIcon color={colors.text} size={18} name="code" />
						</View>
						<Text style={style.optionText}>Open Source</Text>
					</View>

					<Pressable onPress={logout} style={style.option}>
						<View style={style.optionIcon}>
							<FeatherIcon color={colors.rubyRed} size={18} name="log-out" />
						</View>
						<Text style={[style.optionText, style.redColor]}>Log-out</Text>
					</Pressable>
				</View>
			</ScrollView>
		</View>
	);
};

const ProfileShimmer = () => {
	const { colors } = useTheme();
	const style = StyleSheet.create({
		content: {
			paddingBottom: 10,
			width: WINDOW_WIDTH,
			backgroundColor: colors.card,
		},
		coverImage: {
			height: COVER_IMAGE_HEIGHT,
			width: WINDOW_WIDTH,
			backgroundColor: colors.shimmerColor,
		},
		logoHolder: {
			width: 100,
			height: 100,
			top: 70,
			position: 'absolute',
			alignSelf: 'center',
			overflow: 'hidden',
			borderWidth: 5,
			borderColor: colors.card,
			borderRadius: 100,
			zIndex: 12,
			backgroundColor: colors.shimmerColor,
		},
		barOne: {
			backgroundColor: colors.shimmerColor,
			height: 70,
			width: W95,
			alignSelf: 'center',
			borderRadius: 5,
			marginTop: 30,
		},
		barTwo: {
			backgroundColor: colors.shimmerColor,
			marginTop: 10,
			height: 50,
			width: W95,
			alignSelf: 'center',
			borderRadius: 5,
		},
		title: {
			height: 20,
			width: 130,
			backgroundColor: colors.shimmerColor,
			borderRadius: 10,
			marginTop: 60,
			alignSelf: 'center',
		},
		subTitle: {
			height: 15,
			width: 90,
			backgroundColor: colors.shimmerColor,
			borderRadius: 10,
			marginTop: 6,
			alignSelf: 'center',
		},
	});
	return (
		<Shimmer>
			<View style={style.content}>
				<View style={style.coverImage} />
				<View style={style.logoHolder} />
				<Text style={style.title} />
				<Text style={style.subTitle} />

				<View style={style.barOne} />
				<View style={style.barTwo} />
			</View>
		</Shimmer>
	);
};

export default UserProfile;