import React, { useMemo, useState, useEffect } from 'react';
import {
	View,
	Pressable,
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	Text,
	Image as NativeImage,
	NativeModules,
} from 'react-native';
import SpecificationSheet from 'components/film/specificationSheet';
import FeatherIcon from 'react-native-vector-icons/Feather';
import UserModal from 'components/modal/user';
import Preloader from 'components/preloader/basic';
import Header from './header';
import VideoManager from './videoManager';
import SubmissionManager from './submissionManager';
import SubmissionNavigator from './submissionNavigator';
import PhotoRow from './photoRow';
import CastCrew from './castCrew';
// Functions
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { openPicker } from 'libs/mediapicker';
import toast from 'libs/toast';
import helper from 'utils/helper';
import Backend from 'backend';

// Hooks
import { useTheme } from '@react-navigation/native';

// Constants
import { fonts, weights } from 'themes/topography';
import {
	WINDOW_WIDTH,
	W60,
	ERROR_TEXT,
	STATIC_URL,
	POSTER_IMAGE_RATIO,
} from 'utils/constants';

const thumbWidth = WINDOW_WIDTH * 0.3;
const thumbHeight = thumbWidth / POSTER_IMAGE_RATIO;
const { RNGallery } = NativeModules;

const FilmView = ({ route, navigation }) => {
	const { colors } = useTheme();
	const { filmId, submissionId = null } = route.params;
	const isSubmissionView = submissionId !== null;
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					flex: 1,
				},
				metaCover: {
					flexDirection: 'row',
					paddingHorizontal: 10,
					justifyContent: 'space-between',
					backgroundColor: colors.card,
					paddingBottom: 20,
				},
				title: {
					fontSize: fonts.title,
					fontWeight: weights.semibold,
					color: colors.text,
					marginTop: 10,
				},
				shortSummary: {
					fontSize: fonts.small,
					color: colors.holderColor,
					marginTop: 10,
				},
				hr: {
					width: '100%',
					backgroundColor: colors.border,
					height: 1,
					marginTop: 10,
				},
				filmCover: {
					width: thumbWidth,
					height: thumbHeight,
					marginTop: 10,
					backgroundColor: colors.border,
				},
				metaTitle: {
					width: W60,
				},
				specHolder: {
					height: 45,
					alignItems: 'center',
					justifyContent: 'space-between',
					width: WINDOW_WIDTH,
					borderBottomWidth: 1,
					borderTopWidth: 1,
					borderColor: colors.border,
					paddingHorizontal: 10,
					flexDirection: 'row',
					backgroundColor: colors.card,
				},
				row: {
					flexDirection: 'row',
					alignItems: 'center',
				},
				specText: {
					fontSize: fonts.small,
					fontWeight: weights.semibold,
					color: colors.text,
					marginLeft: 14,
				},
				section: {
					marginTop: 20,
					backgroundColor: colors.card,
					borderBottomWidth: 1,
					borderTopWidth: 1,
					borderColor: colors.border,
					paddingTop: 10,
					paddingHorizontal: 10,
				},
				sectionTitle: {
					fontSize: fonts.regular,
					color: colors.text,
					fontWeight: weights.semibold,
					marginBottom: 10,
				},
				endgap: { height: isSubmissionView ? 120 : 20 },
				storyline: {
					fontSize: fonts.small,
					color: colors.holderColor,
					marginBottom: 10,
				},
				addNew: {
					fontSize: fonts.small,
					color: colors.primary,
				},
				marginUp: {
					marginTop: 10,
				},
				marginDown: {
					marginBottom: 10,
				},
				borderUpFix: {
					borderTopWidth: 0,
				},
			}),
		[colors]
	);
	const [data, setData] = useState({});
	const [specificationVisible, setSpecificationVisible] = useState(false);
	const [submitterVisible, setSubmitterVisible] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const loadFilmData = async (currentSubmissionId = null) => {
		try {
			setLoading(true);
			setError(false);

			const sid = currentSubmissionId || submissionId;

			const response = await Backend.Film.filmViewData({
				filmId,
				submissionId: sid,
			});

			if (response?.success) {
				setData(response.data);
			} else {
				throw new Error(response?.message);
			}
		} catch (tryErr) {
			setError(true);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadFilmData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const setNewPoster = (posterData) => {
		setData({
			...data,
			...posterData,
		});
	};

	const navBack = () => {
		navigation.goBack();
	};

	const navBasicDetails = () => {
		navigation.navigate('FilmDetails', {
			filmId,
		});
	};

	const navEditCrew = () => {
		navigation.navigate('FilmCredits', {
			filmId,
		});
	};

	const showFilmPhotos = () => {
		navigation.navigate('FilmPhotos', {
			filmId,
		});
	};

	const handleNext = () => {
		if (data.nextSubmissionId) {
			loadFilmData(data.nextSubmissionId);
		} else {
			toast.notify('Reached to end');
		}
	};

	const handlePrevious = () => {
		if (data.previousSubmissionId) {
			loadFilmData(data.previousSubmissionId);
		} else {
			toast.notify('Reached to starting');
		}
	};

	return (
		<View style={style.main}>
			<Header onBackPress={navBack} />
			<ScrollView showsVerticalScrollIndicator={false}>
				<Preloader
					isBusy={loading}
					onRetry={loadFilmData}
					hasError={error}
					isEmpty={false}
				>
					<VideoManager
						submissionView={isSubmissionView}
						filmId={data.filmId}
						isOwner={data.isOwner}
						showMaker={() => setSubmitterVisible(true)}
					/>
					{isSubmissionView ? (
						<SubmissionManager
							data={data}
							showMaker={() => setSubmitterVisible(true)}
						/>
					) : null}
					<View style={style.metaCover}>
						<View style={style.filmCover}>
							<PosterAdder
								data={data}
								colors={colors}
								onUpdatePoster={setNewPoster}
							/>
						</View>
						<View style={style.metaTitle}>
							<Text style={style.title}>{data.title}</Text>
							<View style={style.hr} />
							{data?.shortSummary?.length ? (
								<Text style={style.shortSummary}>{data.shortSummary}</Text>
							) : data?.isOwner ? (
								<Text
									onPress={navBasicDetails}
									style={[style.addNew, style.marginUp]}
								>
									Add short summary
								</Text>
							) : null}
						</View>
					</View>

					<Pressable
						onPress={() => setSpecificationVisible(true)}
						style={style.specHolder}
					>
						<View style={style.row}>
							<FeatherIcon name="info" size={20} color={colors.text} />
							<Text style={style.specText}>Specifications</Text>
						</View>
						<FeatherIcon
							name="chevron-right"
							size={20}
							color={colors.primary}
						/>
					</Pressable>

					<View style={[style.specHolder, style.borderUpFix]}>
						<View style={style.row}>
							<FeatherIcon name="film" size={20} color={colors.text} />
							<Text style={style.specText}>Watch Trailer</Text>
						</View>
						<FeatherIcon
							name="chevron-right"
							size={20}
							color={colors.primary}
						/>
					</View>

					{data?.photos?.length || data?.isOwner ? (
						<Section style={style} title={'Photos'}>
							<PhotoRow
								showPhotos={showFilmPhotos}
								photos={data.photos}
								isOwner={data.isOwner}
							/>
						</Section>
					) : null}

					{data?.filmCredits?.length || data?.isOwner ? (
						<Section style={style} title={'Cast & Crew'}>
							<CastCrew
								onAddNew={navEditCrew}
								isOwner={data.isOwner}
								credits={data.filmCredits}
							/>
						</Section>
					) : null}

					{data?.storyline?.length || data?.isOwner ? (
						<Section style={style} title={'Storyline'}>
							{data.storyline?.length ? (
								<Text style={style.storyline}>{data?.storyline}</Text>
							) : (
								<Text
									onPress={navBasicDetails}
									style={[style.addNew, style.marginDown]}
								>
									Press here to add storyline
								</Text>
							)}
						</Section>
					) : null}
				</Preloader>
				<View style={style.endgap} />
			</ScrollView>
			{isSubmissionView ? (
				<SubmissionNavigator onNext={handleNext} onPrevious={handlePrevious} />
			) : null}
			<SpecificationSheet
				visible={specificationVisible}
				data={data}
				onClose={() => setSpecificationVisible(false)}
			/>
			<UserModal
				onClose={() => setSubmitterVisible(false)}
				data={data}
				visible={submitterVisible}
			/>
		</View>
	);
};

const Section = ({ style, children, title }) => {
	return (
		<View style={style.section}>
			<Text style={style.sectionTitle}>{title}</Text>
			{children}
		</View>
	);
};

const PosterAdder = ({ data, colors, onUpdatePoster }) => {
	const style = useMemo(
		() =>
			StyleSheet.create({
				coverImage: {
					width: thumbWidth,
					height: thumbHeight,
				},
				posterBorder: {
					borderRadius: 5,
					width: thumbWidth,
					height: thumbHeight,
					justifyContent: 'center',
					alignItems: 'center',
					borderColor: colors.primary,
					borderStyle: 'dashed',
					borderWidth: 1,
					backgroundColor: colors.card,
				},
				note: {
					fontSize: fonts.xsmall,
					color: colors.primary,
					marginTop: 10,
					textAlign: 'center',
				},
				hashBg: {
					width: thumbWidth,
					height: thumbHeight,
					position: 'absolute',
				},
				editCover: {
					position: 'absolute',
					bottom: 5,
					right: 5,
					justifyContent: 'center',
					alignItems: 'center',
					width: 30,
					height: 30,
					borderRadius: 100,
					backgroundColor: colors.bgTrans,
				},
				loader: {
					backgroundColor: colors.bgTrans,
					justifyContent: 'center',
					alignItems: 'center',
					position: 'absolute',
					top: 0,
					left: 0,
					width: thumbWidth,
					height: thumbHeight,
				},
			}),
		[colors]
	);
	const [isUploading, setIsUploading] = useState(false);

	const choosePoster = async () => {
		try {
			const response = await openPicker({
				mediaType: 'image',
				singleSelectedMode: true,
			});
			const file = {
				name: response.fileName,
				uri: response.path,
				type: response.mime,
			};
			if (helper.bytesToMB(response.size) > 10) {
				toast.notify('File too large max 10 MB allowed');
				return;
			}
			sendImageToServer(file);
		} catch (err) {
			// Ignore
		}
	};

	const sendImageToServer = async (file) => {
		try {
			setIsUploading(true);
			const response = await Backend.Film.uploadFilmPoster(data.id, file);
			if (response?.success) {
				onUpdatePoster(response.data);
				updateViewer(response.data);
				toast.success('Poster Updated Successfully');
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			setIsUploading(false);
		}
	};

	const updateViewer = async (posterData = {}) => {
		if (!posterData?.posterUrl) {
			return;
		}
		const c = posterData.posterConfig;
		const ratio = c.width / c.height;
		await RNGallery.setPhotos([
			{
				url: STATIC_URL + posterData.posterUrl,
				hash: posterData.posterHash,
				ratio,
			},
		]);
	};

	const showPhoto = async () => {
		try {
			await updateViewer(data);
			RNGallery.showPhotos(0);
		} catch (err) {
			// Ignore
		}
	};

	useEffect(() => {
		updateViewer(data);
		return () => {
			RNGallery.clearPhotos();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<View>
			{data?.isOwner && !data.posterUrl ? (
				<Pressable nativeI onPress={choosePoster} style={style.posterBorder}>
					<FeatherIcon size={20} color={colors.primary} name="plus" />
					<Text style={style.note}>Add Poster</Text>
				</Pressable>
			) : (
				<Pressable onPress={showPhoto}>
					<NativeImage
						nativeID="stf0"
						resizeMode="contain"
						source={{ uri: STATIC_URL + data.posterUrl }}
						style={style.coverImage}
					/>
					{data.isOwner ? (
						<Pressable onPress={choosePoster} style={style.editCover}>
							<FeatherIcon size={14} name="edit-2" color={colors.buttonTxt} />
						</Pressable>
					) : null}
				</Pressable>
			)}
			{isUploading ? (
				<View style={style.loader}>
					<ActivityIndicator size={24} color={colors.buttonTxt} />
				</View>
			) : null}
		</View>
	);
};

export default gestureHandlerRootHOC(FilmView);