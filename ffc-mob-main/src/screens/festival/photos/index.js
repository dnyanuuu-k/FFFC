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
	ScrollView,
	RefreshControl,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { FlashList } from '@shopify/flash-list';
import Image from 'components/image';
import Preloader from 'components/preloader/basic';
import Loading from 'components/modal/loading';
import StickyUploader from 'components/uploader/sticky';
import AddAlbumModal from './addAlbumModal';
import SureModal from 'components/modal/sureModal';
import AddPhotoToAlbum from './addPhotoToAlbum';

// Hooks
import { useTheme } from '@react-navigation/native';
import { openPicker } from 'libs/mediapicker';

// Functions
import helper from 'utils/helper';
import { RNSelectionMenu } from 'libs/Menu';
import { UploaderInstance } from 'utils/simpleUploader';
import toast from 'libs/toast';
import Backend from 'backend';

// Constants
import {
	WINDOW_HEIGHT,
	WINDOW_WIDTH,
	HEADER_HEIGHT,
	ERROR_TEXT,
	STATIC_URL,
} from 'utils/constants';
import { fonts, weights } from 'themes/topography';

const { RNGallery } = NativeModules;

const tabs = ['All Photos', 'Albums'];
const COLUMNS = 3;
const itemSize = WINDOW_WIDTH / COLUMNS;
const imgSize = itemSize - 10;
const albumSize = imgSize + 40;
const Photos = ({ route }) => {
	const addPhotoToAlbum = useRef();
	const stickyUploader = useRef();
	const addModalRef = useRef();
	const sureModal = useRef();
	const { festivalId } = route.params || {};
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
		albumTitle: {
			fontSize: fonts.title,
			color: colors.text,
			fontWeight: weights.semibold,
		},
		albumGrid: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			width: '100%',
			flex: 1,
		},
		albumCover: {
			width: imgSize,
			height: albumSize,
			borderRadius: 5,
			overflow: 'hidden',
			marginTop: 10,
			marginLeft: 8,
		},
		album: {
			width: imgSize,
			height: imgSize,
			borderRadius: 5,
			backgroundColor: colors.vectorBaseDip,
		},
		albumName: {
			color: colors.text,
			fontSize: 12,
			fontWeight: weights.semibold,
			marginTop: 5,
			width: 100,
		},
		albumText: {
			fontSize: 11,
			fontWeight: weights.light,
			color: colors.holderColor,
		},
		tabBar: {
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			flex: 1,
		},
		tabBox: {
			width: 100,
			height: 50,
			justifyContent: 'center',
			alignItems: 'center',
		},
		tab: {
			fontSize: fonts.title,
		},
		selected: {
			height: 3,
			width: 30,
			backgroundColor: colors.text,
			position: 'absolute',
			bottom: 0,
			borderTopLeftRadius: 10,
			borderTopRightRadius: 10,
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
	const [albums, setAlbums] = useState([]);
	const [hasError, setHasError] = useState(false);
	const isAlbum = selectedTab && currentAlbum === null;
	const isEmpty = isAlbum ? !albums?.length : !photos?.length;
	const emptyText = isAlbum
		? 'Create your first album'
		: 'Add your first photo';

	const loadPhotos = async (album = false) => {
		try {
			setLoading(true);
			setHasError(false);
			let response = null;
			if (album) {
				response = await Backend.Photos.festivalAlbumPhotos(album.id);
			} else {
				response = await Backend.Photos.festivalPhotos(festivalId);
			}
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

	const loadAlbums = async () => {
		try {
			setLoading(true);
			setHasError(false);
			let response = await Backend.Photos.festivalAlbums({ festivalId });
			if (response?.success) {
				setAlbums(response.data);
			} else {
				throw new Error(response.message || ERROR_TEXT);
			}
		} catch (tryErr) {
			setHasError(true);
		} finally {
			setLoading(false);
		}
	};

	const changeTab = (idx) => {
		setSelectedTab(idx);
		if (idx === 0) {
			setAlbums([]);
			loadPhotos();
		} else if (idx === 1) {
			setPhotos([]);
			loadAlbums();
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
			const relativeIndex = currentAlbum?.id
				? 0
				: Math.min(Math.max(photos.length, 0), 4);
			if (currentAlbum?.id && photo?.festivalAlbumId !== currentAlbum?.id) {
				return;
			}
			const updatedPhotos = helper.insertAtIndex(photos, relativeIndex, photo);
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
		if (isAlbum) {
			loadAlbums();
		} else {
			loadPhotos();
		}
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
		if (currentAlbum === null) {
			values.push({
				type: 0,
				value: 'Add Album',
			});
		}
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
					addPhoto();
				} else {
					createAlbum();
				}
			},
		});

		// submitSortedPhotos
	};

	const showPhotoOptions = (photoId, photoIndex) => {
		const values = [
			{
				type: 0,
				value: 'Add to album',
			},
			{
				type: 0,
				value: 'Delete',
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
				const index = values.findIndex((v) => v.value === value);
				if (index === 0) {
					addPhotoToAlbum.current.addPhoto(festivalId, photoId);
				} else {
					deletePhoto(photoId, photoIndex);
				}
			},
		});
	};

	const deletePhoto = async (photoId, index) => {
		try {
			setBusy(true);
			const festivalPhotos = [...photos];
			let response = null;
			if (currentAlbum) {
				response = await Backend.Photos.deleteAlbumPhoto(photoId);
			} else {
				response = await Backend.Photos.deleteFestivalPhoto(photoId);
			}
			if (response?.success) {
				festivalPhotos.splice(index, 1);
				setPhotos(festivalPhotos);
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

	const showAlbumOptions = (album, albumIndex) => {
		const values = [
			{
				type: 0,
				value: 'Edit Name',
			},
			{
				type: 0,
				value: 'Delete',
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
				const index = values.findIndex((v) => v.value === value);
				if (index === 0) {
					createAlbum(album);
				} else {
					sureModal.current.show(
						`${album.name} will be deleted permanently`,
						(action) => {
							if (action) {
								deleteAlbum(album.id, albumIndex);
							}
						}
					);
				}
			},
		});
	};

	const deleteAlbum = async (festivalAlbumId, index) => {
		try {
			setBusy(true);
			const festivalAlbums = [...albums];
			let response = await Backend.Photos.deleteAlbum(festivalAlbumId);
			if (response?.success) {
				festivalAlbums.splice(index, 1);
				setAlbums(festivalAlbums);
				toast.success('Album deleted successfully!');
			} else {
				throw new Error(response.message || ERROR_TEXT);
			}
		} catch (tryErr) {
			toast.error(tryErr.message);
		} finally {
			setBusy(false);
		}
	};

	const createAlbum = (data = null) => {
		addModalRef.current.show(data, (albumData) => {
			if (albumData) {
				handleAddAlbum(albumData);
			}
		});
	};

	const handleAddAlbum = async ({ name, id, festivalPhotoId } = {}) => {
		try {
			setBusy(true);
			const response = await Backend.Photos.createFestivalAlbum({
				id,
				name,
				festivalId,
				festivalPhotoId,
			});
			if (response?.success) {
				if (id) {
					const idx = albums.findIndex((a) => a.id === id);
					albums[idx].name = name;
					setAlbums(albums);
				} else {
					setSelectedTab(1);
					setCurrentAlbum(response.data);
				}
			} else {
				throw new Error(response?.message || ERROR_TEXT);
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
				festivalId,
				festivalAlbumId: currentAlbum?.id,
			};
			response.forEach((data) => {
				const file = {
					name: data.fileName,
					uri: data.path,
					type: data.mime,
				};
				uploadInstance.uploadFile(file, 'file://' + data.realPath, params);
			});
		}
	};

	const selectAlbum = (album) => {
		setCurrentAlbum(album);
		loadPhotos(album);
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

	const renderTabs = (tab, idx) => {
		const selected = idx === selectedTab;
		const fontWeight = selected ? weights.semibold : weights.normal;
		const color = selected ? colors.text : colors.holderColor;
		return (
			<Pressable onPress={() => changeTab(idx)} style={style.tabBox} key={idx}>
				<Text style={[style.tab, { fontWeight, color }]}>{tab}</Text>
				{selected ? <View style={style.selected} /> : null}
			</Pressable>
		);
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

	const renderAlbumLayout = () => {
		return (
			<ScrollView
				refreshControl={
					<RefreshControl refreshing={false} onRefresh={() => loadAlbums()} />
				}
			>
				<View style={style.albumGrid}>
					{albums.map((album, index) => {
						const albumText =
							album.photoCount > 0
								? `${album.photoCount} Photo${
										album.photoCount === 1 ? '' : 's'
								  }`
								: 'No Photos';
						return (
							<Pressable
								onPress={() => selectAlbum(album)}
								style={style.albumCover}
								key={album.id}
							>
								<Image style={style.album} url={album.thumbUrl} />
								<Text style={style.albumName}>{album.name}</Text>
								<Text style={style.albumText}>{albumText}</Text>

								<Pressable
									style={style.moveIcon}
									onPress={() => showAlbumOptions(album, index)}
								>
									<FeatherIcon
										name={'edit-2'}
										size={15}
										color={colors.buttonTxt}
									/>
								</Pressable>
							</Pressable>
						);
					})}
				</View>
			</ScrollView>
		);
	};

	const renderPhotos = () => {
		if (photos.length === 0) {
			return null;
		}
		return (
			<FlashList
				data={photos}
				refreshing={false}
				onRefresh={() => loadPhotos(currentAlbum)}
				numColumns={COLUMNS}
				keyExtractor={(item) => item.id}
				estimatedItemSize={itemSize}
				renderItem={renderPhoto}
			/>
		);
	};

	return (
		<>
			<View style={style.main}>
				<View style={style.header}>
					<Pressable onPress={navBack} style={style.icon}>
						<FeatherIcon size={22} name="arrow-left" color={colors.text} />
					</Pressable>
					{currentAlbum != null ? (
						<View style={style.titleCover}>
							<Text style={style.albumTitle}>{currentAlbum.name}</Text>
						</View>
					) : (
						<View style={style.tabBar}>{tabs.map(renderTabs)}</View>
					)}
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
					onEmptyPress={() => {
						if (isAlbum) {
							createAlbum();
						} else {
							addPhoto();
						}
					}}
					emptyIcon={isAlbum ? 'layers' : 'image'}
					emptyButtonText={isAlbum ? 'Create Album' : 'Add Photo'}
				>
					{isAlbum ? renderAlbumLayout() : renderPhotos()}
				</Preloader>
			</View>
			<StickyUploader ref={stickyUploader} />
			<AddAlbumModal ref={addModalRef} />
			<Loading busy={busy} />
			<SureModal ref={sureModal} />
			<AddPhotoToAlbum ref={addPhotoToAlbum} />
		</>
	);
};

export default Photos;