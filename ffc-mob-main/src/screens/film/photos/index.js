import React, { useState, useEffect, useRef } from 'react';
import {
	View,
	Pressable,
	NativeModules,
	StatusBar,
	Text,
	StyleSheet,
	Image as NativeImage,
	BackHandler,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { FlashList } from '@shopify/flash-list';
import Preloader from 'components/preloader/basic';
import Loading from 'components/modal/loading';
import StickyUploader from 'components/uploader/sticky';
import SureModal from 'components/modal/sureModal';
// Hooks
import { useTheme } from '@react-navigation/native';
import { openPicker } from 'libs/mediapicker';
import {
	WINDOW_HEIGHT,
	WINDOW_WIDTH,
	HEADER_HEIGHT,
	ERROR_TEXT,
	STATIC_URL,
} from 'utils/constants';
import helper from 'utils/helper';
import { RNSelectionMenu } from 'libs/Menu';
import { UploaderInstance } from 'utils/simpleUploader';
import { fonts, weights } from 'themes/topography';
import toast from 'libs/toast';
import Backend from 'backend';

const { RNGallery } = NativeModules;
const COLUMNS = 3;
const itemSize = WINDOW_WIDTH / COLUMNS;
const imgSize = itemSize - 10;

const FilmPhotos = ({ route }) => {
	const stickyUploader = useRef();
	const sureModal = useRef();
	const { filmId } = route.params || {};
	const { colors, dark } = useTheme();
	const style = StyleSheet.create({
		main: {
			height: WINDOW_HEIGHT,
			width: WINDOW_WIDTH,
		},
		header: {
			height: HEADER_HEIGHT,
			width: WINDOW_WIDTH,
			alignItems: 'center',
			paddingTop: StatusBar.currentHeight,
			backgroundColor: colors.card,
			borderBottomWidth: 1,
			borderColor: colors.border,
			flexDirection: 'row',
		},
		icon: {
			width: 50,
			height: 50,
			justifyContent: 'center',
			alignItems: 'center',
		},
		titleCover: {
			flex: 1,
		},
		title: {
			fontSize: fonts.title,
			color: colors.text,
			fontWeight: weights.semibold,
			flex: 1,
		},
		photo: {
			width: itemSize,
			height: itemSize,
			justifyContent: 'center',
			alignItems: 'center',
		},
		photoImage: {
			width: imgSize,
			height: imgSize,
			backgroundColor: colors.card,
		},
		moveIcon: {
			width: 30,
			borderRadius: 60,
			height: 30,
			backgroundColor: colors.bgTransd1,
			justifyContent: 'center',
			alignItems: 'center',
			position: 'absolute',
			right: 10,
			top: 10,
		},
	});
	const [busy, setBusy] = useState(false);
	const [loading, setLoading] = useState(false);
	const [selectedTab, setSelectedTab] = useState(0);
	const [photos, setPhotos] = useState([]);
	const [currentAlbum, setCurrentAlbum] = useState(null);
	const [hasError, setHasError] = useState(false);
	const isEmpty = !photos?.length;
	const emptyText = 'Add your first photo';

	const loadPhotos = async () => {
		try {
			setLoading(true);
			setHasError(false);
			const response = await Backend.Photos.filmPhotos(filmId);
			if (response?.success) {
				updateGalleryModal(response.data);
				setPhotos(response.data);
			} else {
				throw new Error(response.message || ERROR_TEXT);
			}
		} catch (tryErr) {
			setHasError(true);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadPhotos();
		return () => {
			RNGallery.clearPhotos();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			() => {
				return navBack();
			}
		);
		UploaderInstance.addPhotoListener((photo) => {
			const updatedPhotos = helper.insertAtIndex(photos, 0, photo);
			updateGalleryModal(updatedPhotos);
			setPhotos(updatedPhotos);
		});
		return () => {
			UploaderInstance.removePhotoListener();
			backHandler.remove();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentAlbum, photos, selectedTab]);

	const retryFetch = () => {
		loadPhotos();
	};

	const updateGalleryModal = (list) => {
		const data = list.map((p) => ({
			url: STATIC_URL + p.url,
			hash: p.hash,
			ratio: p.width / p.height,
		}));
		RNGallery.setPhotos(data);
	};

	const submitAction = () => {
		const values = [
			{
				type: 0,
				value: 'Add Photo',
			},
		];
		RNSelectionMenu.Show({
			values,
			selectedValues: [''],
			selectionType: 0,
			presentationType: 1,
			theme: dark ? 1 : 0,
			title: 'Select Option',
			onSelection: (value) => {
				addPhoto();
			},
		});

		// submitSortedPhotos
	};

	const showPhotoOptions = (photoId, photoIndex) => {
		const values = [
			{
				type: 0,
				value: 'Delete',
			},
			// {
			// 	type: 0,
			// 	value: 'Change Order',
			// },
		];
		RNSelectionMenu.Show({
			values,
			selectedValues: [''],
			selectionType: 0,
			presentationType: 1,
			theme: dark ? 1 : 0,
			title: 'Select Option',
			onSelection: (value) => {
				const index = values.findIndex((v) => v.value === value);
				if (index === 0) {
					deletePhoto(photoId, photoIndex);
				} else {
					// Handle Drag
				}
			},
		});
	};

	const deletePhoto = async (photoId, index) => {
		try {
			setBusy(true);
			const filmPhotos = [...photos];
			const response = await Backend.Photos.deleteFilmPhoto(photoId);
			if (response?.success) {
				filmPhotos.splice(index, 1);
				setPhotos(filmPhotos);
				toast.success('Photo deleted successfully!');
			} else {
				throw new Error(response.message || ERROR_TEXT);
			}
		} catch (tryErr) {
			toast.error(tryErr.message);
		} finally {
			setBusy(false);
		}
	};

	const addPhoto = async () => {
		const uploadInstance = stickyUploader.current;
		const response = await openPicker({
			mediaType: 'image',
			maxSelectedAssets: 25,
		});
		if (response?.length) {
			const params = {
				filmId,
			};
			response.forEach((data) => {
				const file = {
					name: data.fileName,
					uri: data.path,
					type: data.mime,
				};
				uploadInstance.uploadFile(
					file,
					'file://' + data.realPath,
					params,
					Backend.Photos.PhotoFilmUploadEndpoint
				);
			});
		}
	};

	const navBack = () => {
		if (currentAlbum != null) {
			setCurrentAlbum(null);
			return true;
		} else if (selectedTab) {
			setSelectedTab(0);
			loadPhotos();
			return true;
		} else {
			return false;
		}
	};

	const renderPhoto = ({ item: data, index }) => {
		const imgId = 'stf' + index;
		const id = data.id + '';
		return (
			<Pressable
				onPress={() => {
					RNGallery.showPhotos(index);
				}}
				style={style.photo}
				id={id}
				key={id}
			>
				<NativeImage
					style={style.photoImage}
					source={{ uri: STATIC_URL + data.thumbUrl }}
					nativeID={imgId}
					resizeMode="contain"
				/>

				<Pressable
					style={style.moveIcon}
					onPress={() => showPhotoOptions(data.id, index)}
				>
					<FeatherIcon color={colors.buttonTxt} name={'edit-2'} size={15} />
				</Pressable>
			</Pressable>
		);
	};

	return (
		<>
			<View style={style.main}>
				<View style={style.header}>
					<Pressable onPress={navBack} style={style.icon}>
						<FeatherIcon size={22} name="arrow-left" color={colors.text} />
					</Pressable>
					<Text style={style.title}>Film Photos</Text>
					<Pressable onPress={submitAction} style={style.icon}>
						<FeatherIcon size={22} name={'plus'} color={colors.primary} />
					</Pressable>
				</View>
				<Preloader
					isBusy={loading}
					onRetry={retryFetch}
					hasError={hasError}
					isEmpty={isEmpty}
					emptyText={emptyText}
					onEmptyPress={addPhoto}
					emptyIcon={'image'}
					emptyButtonText={'Add Photo'}
				>
					<FlashList
						data={photos}
						numColumns={COLUMNS}
						keyExtractor={(item) => item.id}
						estimatedItemSize={itemSize}
						renderItem={renderPhoto}
					/>
				</Preloader>
			</View>
			<StickyUploader ref={stickyUploader} />
			<Loading busy={busy} />
			<SureModal ref={sureModal} />
		</>
	);
};

export default FilmPhotos;
