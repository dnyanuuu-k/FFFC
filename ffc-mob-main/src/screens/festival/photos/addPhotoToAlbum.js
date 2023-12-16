// React compnents & hooks
import React, {
	useState,
	useMemo,
	useImperativeHandle,
	forwardRef,
} from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

// Custom Components
import Image from 'components/image';
import Preloader from 'components/preloader/basic';
import SheetButtonModal from 'components/modal/sheetButtonModal';
import LoadingOverlay from 'components/overlay/loading';
import Checkbox from 'components/checkbox';

// Custom hooks
import { useTheme } from '@react-navigation/native';

// Functions
import Backend from 'backend';
import toast from 'libs/toast';

// Constants
import { W80, ERROR_TEXT } from 'utils/constants';
import { weights } from 'themes/topography';

const COLUMNS = 3;
const itemSize = W80 / COLUMNS;
const imgSize = itemSize - 10;
const albumSize = imgSize + 40;

const AddPhotoToAlbum = (props, ref) => {
	useImperativeHandle(
		ref,
		() => ({
			addPhoto: handleVisible,
		}),
		[]
	);
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					flex: 1,
					flexDirection: 'row',
					flexWrap: 'wrap',
				},
				itemCover: {
					width: '33%',
					alignItems: 'center',
				},
				albumCover: {
					width: imgSize,
					height: albumSize,
					borderRadius: 5,
					overflow: 'hidden',
					marginTop: 10,
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
				checkBox: {
					position: 'absolute',
					right: -6,
					top: -2,
				},
				albumText: {
					fontSize: 11,
					fontWeight: weights.light,
					color: colors.holderColor,
				},
			}),
		[colors]
	);
	const [albums, setAlbums] = useState([]);
	const [visible, setVisible] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const [currentParams, setCurrentParams] = useState({});
	const [isUpdating, setUpdating] = useState(false);
	const [selectedAlbumId, setSelectedAlbumId] = useState(null);

	const loadAlbums = async (festivalId, photoId) => {
		try {
			setLoading(true);
			let response = await Backend.Photos.festivalAlbums({
				festivalPhotoId: photoId,
				festivalId,
			});
			if (response?.success) {
				setAlbums(response.data);
				const selectedAlbum = response.data.find((a) => a?.isAdded);
				if (selectedAlbum) {
					setSelectedAlbumId(selectedAlbum.id);
				}
			} else {
				throw new Error(response.message || ERROR_TEXT);
			}
		} catch (tryErr) {
			toast.error(tryErr.message);
			handleClose();
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async () => {
		try {
			if (!selectedAlbumId) {
				toast.error('Please select album');
				return;
			}
			if (isUpdating) {
				toast.notify('Please wait...!');
				return;
			}
			setUpdating(true);
			const { pid } = currentParams;
			let response = await Backend.Photos.addFestivalPhotoToAlbum({
				festivalAlbumId: selectedAlbumId,
				festivalPhotoId: pid,
			});
			if (response?.success) {
				handleClose();
				toast.success('Addeded Successfully!');
			} else {
				throw new Error(response.message || ERROR_TEXT);
			}
		} catch (tryErr) {
			toast.error(tryErr.message);
		} finally {
			setUpdating(false);
		}
	};

	const handleVisible = (fid, pid) => {
		setSelectedAlbumId(null);
		setVisible(true);
		loadAlbums(fid, pid);
		setCurrentParams({
			fid,
			pid,
		});
	};

	const handleClose = () => {
		if (isUpdating) {
			toast.error('Please wait...!');
			return;
		}
		setVisible(false);
	};

	const renderAlbum = (album) => {
		const photoCount = parseInt(album.photoCount, 10);
		const albumText =
			photoCount > 0
				? `${photoCount} Photo${photoCount === 1 ? '' : 's'}`
				: 'No Photos';
		const isSelected = album.id === selectedAlbumId;
		return (
			<View style={style.itemCover} key={album.id}>
				<Pressable
					onPress={() => setSelectedAlbumId(album.id)}
					style={style.albumCover}
				>
					<Image style={style.album} url={album.thumbUrl} />
					<Text style={style.albumName}>{album.name}</Text>
					<Text style={style.albumText}>{albumText}</Text>

					<Checkbox
						checked={isSelected}
						borderRadius={30}
						width={30}
						height={30}
						cardStyle={style.checkBox}
						onChange={() => setSelectedAlbumId(album.id)}
					/>
				</Pressable>
			</View>
		);
	};

	return (
		<SheetButtonModal
			title="Add photo to album"
			onClose={handleClose}
			onSubmit={handleSubmit}
			visible={visible}
		>
			<Preloader
				isBusy={isLoading}
				onRetry={loadAlbums}
				hasError={false}
				isEmpty={false}
			>
				<View style={style.main}>{albums.map(renderAlbum)}</View>
				<LoadingOverlay busy={isUpdating} />
			</Preloader>
		</SheetButtonModal>
	);
};

export default forwardRef(AddPhotoToAlbum);