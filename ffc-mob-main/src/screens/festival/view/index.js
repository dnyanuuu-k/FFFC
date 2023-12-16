import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
	View,
	StatusBar,
	RefreshControl,
	Text,
	Image,
	StyleSheet,
	Pressable,
} from 'react-native';
// Components
import Reviews from './reviews';
import FilmSubmission from 'components/modal/filmSubmission';
import AboutSection from './aboutSection';
import DeadlineCategory from './deadlineCategory';
import SectionCover from './sectionCover';
import ShowMore from './showMore';
import Button from 'components/button';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	useAnimatedScrollHandler,
	interpolate,
	Extrapolate,
} from 'react-native-reanimated';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Preloader from 'components/preloader/basic';
import ScreenLoader from 'components/preloader/screen';
import InstantSwitcher from 'components/modal//instantSwitcher';
import LikeButton from './likeButton';

// Hooks
import { useTheme, CommonActions } from '@react-navigation/native';

// Constants
import {
	WINDOW_WIDTH,
	WINDOW_HEIGHT,
	COVER_IMAGE_HEIGHT,
	HEADER_HEIGHT,
	STATIC_URL,
	WORK_TYPE_MANAGE_FESTIVAL,
} from 'utils/constants';
import { fonts, weights } from 'themes/topography';

// Libs
import AppMode from 'libs/appMode';
import toast from 'libs/toast';
import Backend from 'backend';

const HEADER_HEIGHT_EXTRA = 35;
const HEADER_HEIGHT_NARROWED =
	COVER_IMAGE_HEIGHT - (HEADER_HEIGHT_EXTRA + StatusBar.currentHeight);
const RATING_BOX_WIDTH = 70;
const buttonWidth = WINDOW_WIDTH / 1.9 - RATING_BOX_WIDTH;

const FestivalView = ({ navigation, route }) => {
	const scrollViewRef = useRef();
	const { colors } = useTheme();
	const style = StyleSheet.create({
		main: {
			width: WINDOW_WIDTH,
			height: WINDOW_HEIGHT,
			backgroundColor: colors.blk,
		},
		scrollView: {
			paddingTop: 10,
			marginTop: HEADER_HEIGHT_NARROWED + StatusBar.currentHeight,
			zIndex: 3,
		},
		temp: {
			height: 200,
			width: WINDOW_WIDTH,
			backgroundColor: colors.card,
			marginTop: 20,
		},
		content: {
			width: WINDOW_WIDTH,
			backgroundColor: colors.background,
		},
		coverImage: {
			position: 'absolute',
			top: StatusBar.currentHeight,
			left: 0,
			height: COVER_IMAGE_HEIGHT,
			width: WINDOW_WIDTH,
		},
		blurView: {
			top: StatusBar.currentHeight,
			height: COVER_IMAGE_HEIGHT,
			width: WINDOW_WIDTH,
			position: 'absolute',
			backgroundColor: colors.blk,
		},
		header: {
			height: 90,
			width: WINDOW_WIDTH,
			borderBottomWidth: 1,
			borderColor: colors.border,
			backgroundColor: colors.card,
		},
		titleCover: {
			backgroundColor: colors.card,
			height: 60,
			width: WINDOW_WIDTH,
		},
		title: {
			fontSize: fonts.regular,
			color: colors.text,
			fontWeight: weights.bold,
			marginTop: 5,
			paddingRight: 10,
			paddingLeft: 110,
		},
		titleHeader: {
			height: 116,
			width: WINDOW_WIDTH,
			zIndex: 4,
			alignItems: 'flex-end',
			flexDirection: 'row',
		},
		avatarBg: {
			width: WINDOW_WIDTH,
			height: 82,
			backgroundColor: colors.card,
		},
		avatarBody: {
			height: 90,
			width: 90,
			left: 10,
			borderRadius: 100,
			position: 'absolute',
			borderWidth: 4,
			elevation: 2,
			borderColor: colors.card,
		},
		avatar: {
			height: 82,
			width: 82,
			borderRadius: 100,
			backgroundColor: colors.card,
		},
		headerButtonRow: {
			flexDirection: 'row',
			paddingHorizontal: 10,
			width: WINDOW_WIDTH,
			marginTop: 14,
			marginBottom: 10,
		},
		button: {
			width: buttonWidth,
			height: 35,
			marginRight: 10,
		},
		ratingBox: {
			width: RATING_BOX_WIDTH,
			height: 35,
		},
		buttonTxt: {
			fontSize: fonts.small,
		},
		tabRow: {
			flexDirection: 'row',
			height: 30,
			alignItems: 'center',
		},
		tab: {
			fontSize: fonts.small,
			fontWeight: weights.semibold,
			color: colors.holderColor,
			marginHorizontal: 16,
			textAlign: 'center',
		},
		tabSelected: {
			height: 2,
			backgroundColor: colors.primary,
			position: 'absolute',
			width: 40,
			bottom: 0,
		},
		tabMain: {
			height: 30,
			justifyContent: 'center',
			alignItems: 'center',
		},
		footer: { height: 40 },
		organizerCover: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			justifyContent: 'space-between',
			paddingHorizontal: 10,
			paddingBottom: 25,
		},
		headerOptionsRow: {
			width: WINDOW_WIDTH,
			height: HEADER_HEIGHT,
			paddingTop: StatusBar.currentHeight,
			flexDirection: 'row',
			position: 'absolute',
			top: 0,
			alignItems: 'center',
			paddingHorizontal: 10,
		},
		headerOption: {
			backgroundColor: colors.bgTransd1,
			justifyContent: 'center',
			alignItems: 'center',
			width: 34,
			height: 34,
			borderRadius: 100,
		},
		headerTitleCover: {
			flex: 1,
			justifyContent: 'center',
			paddingHorizontal: 10,
		},
		headerTitle: {
			fontWeight: weights.bold,
			color: colors.buttonTxt,
			fontSize: colors.small,
		},
		optionRow: {
			flexDirection: 'row',
			width: 80,
			justifyContent: 'flex-end',
		},
	});
	const [state, setState] = useState({});
	const [instantUserSwitcher, setInstantUserSwitcher] = useState(false);
	const [submissionVisible, setSubmissionVisible] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const scrollOffset = useSharedValue(0);
	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollOffset.value = event.contentOffset.y;
		},
	});

	const coverStyle = useAnimatedStyle(() => ({
		transform: [
			{
				scale: interpolate(scrollOffset.value, [-200, 0], [5, 1], {
					extrapolateLeft: Extrapolate.EXTEND,
					extrapolateRight: Extrapolate.CLAMP,
				}),
			},
		],
	}));
	const opacityStyle = useAnimatedStyle(() => ({
		opacity: interpolate(
			scrollOffset.value,
			[-0, 100],
			[0, 0.7],
			Extrapolate.CLAMP
		),
	}));
	const scaleStyle = useAnimatedStyle(() => ({
		transform: [
			{
				scale: interpolate(
					scrollOffset.value,
					[0, 70],
					[1, 0.45],
					Extrapolate.CLAMP
				),
			},
			{
				translateY: interpolate(
					scrollOffset.value,
					[0, 70],
					[0, 30],
					Extrapolate.CLAMP
				),
			},
		],
	}));
	const titleStyle = useAnimatedStyle(() => ({
		transform: [
			{
				translateY: interpolate(
					scrollOffset.value,
					[64, 110],
					[54, 0],
					Extrapolate.CLAMP
				),
			},
		],
		opacity: interpolate(
			scrollOffset.value,
			[64, 110],
			[0, 1],
			Extrapolate.CLAMP
		),
	}));

	const loadFestivalView = async () => {
		try {
			setLoading(true);
			setError(false);
			// When Festival Id is null then  we load festival of
			// user based on userId
			const { festivalId } = route?.params || { festivalId: null };
			const response = await Backend.Festival.view({
				festivalId,
			});
			if (response?.success) {
				setState(response.data);
			} else {
				throw new Error(response?.message);
			}
		} catch (err) {
			setError(true);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		StatusBar.setBarStyle('light-content');
		loadFestivalView();
		return () => {
			const currentMode = AppMode.getCurrentMode();
			if (currentMode === AppMode.LIGHT_MODE) {
				StatusBar.setBarStyle('dark-content');
			}
		};
	}, []);

	const handleLikeChange = async (isLiked) => {
		try {
			await Backend.Festival.updateLikeState({
				festivalId: state.id,
				isLiked,
			});
		} catch (err) {
			// Ignore
		}
	};

	const startFilmSubmission = () => {
		if (!state?.entriesActive) {
			return;
		}
		const currentWorkType = parseInt(state.workType, 10);
		if (currentWorkType === WORK_TYPE_MANAGE_FESTIVAL) {
			setInstantUserSwitcher(true);
			return;
		}
		setSubmissionVisible(true);
	};

	const showPhotos = () => {
		navigation.navigate('FestivalPhotos', {
			festivalId: state.id,
		});
	};

	const showReviews = () => {
		scrollViewRef.current.scrollToEnd();
	};

	const showContactVenue = () => {
		navigation.navigate('FestivalVenue', {
			festivalId: state.id,
		});
	};

	const handleCheckout = () => {
		navigation.navigate('CartScreen');
	};

	const handleCreate = () => {
		navigation.navigate('FestivalCreate');
	};

	const handleEdit = () => {
		navigation.navigate('FestivalDetails', {
			id: state.id,
		});
	};

	const shareFestival = () => {
		//TODO: React Native Share
	};

	const startChat = () => {
		const tinode = state?.tinodeData;
		if (!tinode) {
			toast.notify('This festival has disabled messages');
			return;
		}
		navigation.navigate('ChatScreen', {
			topic: tinode.i,
		});
	};
	/**
	 * This will switch festival organizer view to film maker
	 */
	const resetFestivalView = () => {
		navigation.dispatch(
			CommonActions.reset({
				index: 1,
				routes: [
					{ name: 'HomeFilmMaker' },
					{ name: 'FestivalView', params: { festivalId: state.id } },
				],
			})
		);
	};

	const submitText = state?.entriesActive ? 'Submit Film' : 'Entries Closed';
	const submitType = state?.entriesActive ? Button.SUCCESS : Button.DISABLED;

	return (
		<View style={style.main}>
			<Preloader
				onRetry={loadFestivalView}
				hasError={error}
				isBusy={loading}
				isEmpty={false}
				CustomLoader={ScreenLoader}
			>
				<Animated.Image
					source={{ uri: STATIC_URL + state.coverUrl }}
					style={[coverStyle, style.coverImage]}
				/>
				<Animated.View style={[opacityStyle, style.blurView]} />
				<Animated.ScrollView
					ref={scrollViewRef}
					style={style.scrollView}
					showsVerticalScrollIndicator={false}
					onScroll={scrollHandler}
					refreshControl={
						<RefreshControl onRefresh={loadFestivalView} refreshing={false} />
					}
				>
					<View style={style.titleHeader}>
						<View style={style.titleCover}>
							<Text numberOfLines={2} style={style.title}>
								{state.name}
							</Text>
						</View>
						<Animated.View style={[scaleStyle, style.avatarBody]}>
							<Image
								source={{ uri: STATIC_URL + state.logoUrl }}
								style={style.avatar}
							/>
						</Animated.View>
					</View>

					<View style={style.content}>
						<View style={style.header}>
							<View style={style.headerButtonRow}>
								<Button
									text={submitText}
									type={submitType}
									style={style.button}
									textStyle={style.buttonTxt}
									onPress={startFilmSubmission}
								/>
								{state.isOwner ? (
									<Button
										text={'Edit'}
										type={Button.SECONDARY}
										style={style.button}
										textStyle={style.buttonTxt}
										onPress={handleCreate}
									/>
								) : (
									<Button
										text="Message"
										icon="message-circle"
										iconSize={16}
										type={Button.ICON_SECONDARY}
										style={style.button}
										textStyle={style.buttonTxt}
										onPress={startChat}
									/>
								)}
								<Button
									text={state.rating || '-'}
									type={Button.ICON_SECONDARY}
									icon="star"
									iconSize={15}
									style={style.ratingBox}
									textStyle={style.buttonTxt}
									onPress={showReviews}
								/>
							</View>

							<View style={style.tabRow}>
								<View style={style.tabMain}>
									<Text style={[style.tab, { color: colors.primary }]}>
										Festival
									</Text>
									<View style={style.tabSelected} />
								</View>
								<Text onPress={showPhotos} style={style.tab}>
									Photos
								</Text>
								<Text onPress={showContactVenue} style={style.tab}>
									Contact & Venue
								</Text>
							</View>
						</View>
						{state.isOwner ? (
							<OwnerSection
								festivalId={state.id}
								colors={colors}
								navigation={navigation}
							/>
						) : null}
						<AboutSection
							isOwner={state.isOwner}
							about={state.description}
							photos={state.photos}
							onEditRequest={handleEdit}
							onPhotoPress={showPhotos}
							morePhoto={false}
						/>
						<DeadlineCategory
							categories={state.festivalFeeCategories}
							deadlines={state.festivalDateDeadlines}
						/>
						<Section
							isOwner={state.isOwner}
							content={state.awards}
							title={'Awards & Prizes'}
							onEdit={handleEdit}
						/>
						<Section
							isOwner={state.isOwner}
							content={state.terms}
							title={'Rules & Terms'}
							onEdit={handleEdit}
						/>
						<SectionCover title={'Organizers'}>
							<View style={style.organizerCover}>
								{(state.organizers || []).map((d, i) => (
									<Orgaziner key={i} colors={colors} data={d} />
								))}
							</View>
						</SectionCover>
						<SectionCover title={'Reviews'}>
							<Reviews
								isOwner={state.isOwner}
								festivalName={state.name}
								festivalId={state.id}
							/>
						</SectionCover>
						<View style={style.footer} />
					</View>
				</Animated.ScrollView>

				<View style={style.headerOptionsRow}>
					<View style={style.headerOption}>
						<FeatherIcon name="arrow-left" size={20} color={colors.buttonTxt} />
					</View>
					<View style={style.headerTitleCover}>
						<Animated.Text
							numberOfLines={1}
							style={[titleStyle, style.headerTitle]}
						>
							{state.name}
						</Animated.Text>
					</View>
					<View style={style.optionRow}>
						<Pressable onPress={shareFestival} style={style.headerOption}>
							<FeatherIcon name="share-2" size={18} color={colors.buttonTxt} />
						</Pressable>
						{state?.isOwner ? null : (
							<LikeButton
								onLikeChange={handleLikeChange}
								festivalId={state.id}
								isLiked={state?.isLiked}
							/>
						)}
					</View>
				</View>
			</Preloader>
			<FilmSubmission
				active={submissionVisible}
				festivalId={state.id}
				festivalName={state.name}
				onCheckout={handleCheckout}
				onClose={() => setSubmissionVisible(false)}
			/>
			<InstantSwitcher
				currentWorkType={state.workType}
				onSuccess={resetFestivalView}
				onClose={() => setInstantUserSwitcher(false)}
				visible={instantUserSwitcher}
			/>
		</View>
	);
};

const Section = (props) => {
	return (
		<SectionCover title={props.title}>
			<ShowMore
				isOwner={props.isOwner}
				title={props.title}
				text={props.content}
				onEditRequest={props.onEdit}
			/>
		</SectionCover>
	);
};

const Orgaziner = ({ colors, data }) => {
	const style = StyleSheet.create({
		name: {
			fontSize: fonts.small,
			fontWeight: weights.light,
			color: colors.text,
		},
		designation: {
			fontSize: fonts.xsmall,
			color: colors.holderColor,
		},
		card: {
			marginTop: 20,
			width: '50%',
		},
	});
	return (
		<View style={style.card}>
			<Text numberOfLines={1} style={style.designation}>
				{data.designation}
			</Text>
			<Text numberOfLines={1} style={style.name}>
				{data.name}
			</Text>
		</View>
	);
};

const OwnerSection = ({ colors, navigation, festivalId }) => {
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					backgroundColor: colors.card,
					paddingHorizontal: 16,
					marginTop: 10,
				},
				button: {
					height: 45,
					flexDirection: 'row',
					alignItems: 'center',
					borderBottomWidth: 1,
					borderColor: colors.border,
				},
				buttonText: {
					marginLeft: 10,
					color: colors.holderColor,
					fontSize: fonts.small,
					flex: 1,
				},
				borderFix: { borderBottomWidth: 0 },
			}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	const handleNavigate = (screenName) => {
		navigation.navigate(screenName, {
			festivalId,
		});
	};

	const handleSoon = () => {};

	return (
		<View style={style.main}>
			<Pressable
				style={style.button}
				onPress={() => handleNavigate('ManageFestival')}
			>
				<FeatherIcon size={14} color={colors.holderColor} name="settings" />
				<Text style={style.buttonText}>Manage Festival</Text>
				<FeatherIcon
					size={14}
					color={colors.holderColor}
					name="chevron-right"
				/>
			</Pressable>
			<Pressable
				style={style.button}
				onPress={() => handleNavigate('FestivalCreate')}
			>
				<FeatherIcon size={14} color={colors.holderColor} name="edit-2" />
				<Text style={style.buttonText}>Edit Festival</Text>
				<FeatherIcon
					size={14}
					color={colors.holderColor}
					name="chevron-right"
				/>
			</Pressable>
			<Pressable style={[style.button, style.borderFix]} onPress={handleSoon}>
				<FeatherIcon size={14} color={colors.holderColor} name="trending-up" />
				<Text style={style.buttonText}>Marketing</Text>
				<FeatherIcon
					size={14}
					color={colors.holderColor}
					name="chevron-right"
				/>
			</Pressable>
		</View>
	);
};

export default FestivalView;