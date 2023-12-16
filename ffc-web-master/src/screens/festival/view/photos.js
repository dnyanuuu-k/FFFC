import React, { Component } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import ContextMenu from "components/menu/contextMenu";
import Image from "components/image";
import Button from "components/button";
import TabbedSection from "./tabbedSection";
import FeatherIcon from "feather-icons-react";
import SureModal from "components/modal/sureModal";
import { ReactSortable } from "react-sortablejs";
import Preloader from "components/preloader/basic";
import { photoRowSize, albumRowSize } from "./style";
import { BORDER_RADIUS, RELOAD_TEXT, ERROR_TEXT } from "utils/constants";
import colors from "themes/colors";
import toast from "react-hot-toast";
import filePicker from "utils/filePicker";
import helper from "utils/helper";
import { UploaderInstance } from "utils/simpleUploader";
import Backend from "backend";
import textGenerator from "utils/textGenerator";
import AddAlbumModal from "./addAlbumModal";

const photosEmptyText = textGenerator.yourFirst("Add", "photo");
const albumEmptyText = textGenerator.yourFirst("Create", "album");

const ALL_PHOTO_TAB = 0;
const ALBUM_TAB = 1;

const ALBUM_KEY = "albums";
const PHOTO_KEY = "photos";

export default class Photos extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentTab: ALL_PHOTO_TAB,
			isDragging: false,
			photoTabs: [
				{
					title: "All Photos",
					count: 0,
				},
				{
					title: "Albums",
					count: 0,
				},
			],
			currentAlbum: false,
		};
		this.currentTabs = [];
	}

	secondaryAction = () => {
		const { currentTab, currentAlbum } = this.state;
		if ((currentTab === ALL_PHOTO_TAB || currentAlbum) && this.currentTabs[PHOTO_KEY]) {
			this.currentTabs[PHOTO_KEY].secondaryAction();
		} else if (this.currentTabs[ALBUM_KEY]) {
			if (currentAlbum) {
				this.currentTabs[PHOTO_KEY].addNewPhotos();
			} else {
				this.createNewAlbum();
			}
		}
	};

	primaryAction = () => {
		if (this.state.isDragging) {
			this.currentTabs[PHOTO_KEY].saveDraggingOrder();
		} else {
			this.currentTabs[PHOTO_KEY].addNewPhotos();
		}
	};

	handleAddAlbum = async ({ name, id, festivalPhotoId } = {}) => {
		const { onBusy, festivalId } = this.props;
		try {
			onBusy(true);
			const response = await Backend.Photos.createFestivalAlbum({
				id,
				name,
				festivalId,
				festivalPhotoId,
			});
			if (response?.success) {
				this.setState({
					currentTab: ALBUM_TAB,
					currentAlbum: response.data,
				});
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (tryErr) {
			toast.error(tryErr.message);
		} finally {
			onBusy(false);
		}
	};

	createNewAlbum = (festivalAlbum = null) => {
		this.addAlbumModal.show(festivalAlbum, (albumData) => {
			if (albumData) {
				this.handleAddAlbum(albumData);
			}
		});
	};

	handleTabChange = (currentTab) => {
		this.setState({ currentTab });
	};

	updateDragState = (isDragging) => {
		this.setState({
			isDragging,
		});
	};

	handleBackPress = () => {
		this.setState({ currentAlbum: null, isDragging: false });
	}

	renderButtons = () => {
		const { isDragging, currentTab, currentAlbum } = this.state;
		return (
			<>
				{currentAlbum && !isDragging ? null : <Button
					icon={isDragging ? "x" : "plus"}
					type={
						isDragging
							? Button.OUTLINE_ICON_DANGER
							: Button.OUTLINE_ICON_PRIMARY
					}
					style={style.sectionTabButton}
					text={isDragging ? "Cancel" : "Create Ablum"}
					onPress={this.secondaryAction}
					iconSize={16}
					textStyle={{ fontSize: 14, fontWeight: 400 }}
				/>}
				{currentTab === ALBUM_TAB && !currentAlbum ? null : (
					<Button
						icon={isDragging ? "save" : "plus"}
						type={Button.ICON_PRIMARY}
						style={style.sectionTabButton}
						text={isDragging ? "Save Order" : "Add Photos"}
						onPress={this.primaryAction}
						iconSize={16}
						textStyle={{ fontSize: 14, fontWeight: 400 }}
					/>
				)}
			</>
		);
	};

	render() {
		const { isDragging, currentAlbum, currentTab, photoTabs } = this.state;
		const { festivalId, onBusy, onPhotoViewerRequest } = this.props;
		return (
			<>
				<TabbedSection
					showTitle={currentAlbum?.name}
					tabs={photoTabs}
					currentTab={currentTab}
					onBackPress={this.handleBackPress}
					onTabChange={this.handleTabChange}
					disabled={isDragging}
					renderButtons={this.renderButtons}
				>
					{currentTab === ALL_PHOTO_TAB || currentAlbum ? (
						<AllPhotos
							ref={(ref) => (this.currentTabs[PHOTO_KEY] = ref)}
							onRequestNewAlbum={this.createNewAlbum}
							onDragChange={this.updateDragState}
							festivalAlbumId={currentAlbum?.id}
							festivalAlbumName={currentAlbum?.name}
							festivalId={festivalId}
							startViewerAt={onPhotoViewerRequest}
							onBusy={onBusy}
						/>
					) : (
						<Albums
							ref={(ref) => (this.currentTabs[ALBUM_KEY] = ref)}
							onRequestNewAlbum={this.createNewAlbum}
							festivalId={festivalId}
							onSelect={album => this.setState({ currentAlbum: album })}
							onBusy={onBusy}
						/>
					)}
				</TabbedSection>
				<AddAlbumModal ref={(ref) => (this.addAlbumModal = ref)} />
			</>
		);
	}
}

class AllPhotos extends Component {
	constructor(props) {
		super(props);
		this.state = {
			photos: [],
			isBusy: false,
			hasError: false,
			festivalPhotos: [],
			isDragging: false,
		};
	}

	componentDidMount() {
		const { festivalAlbumId } = this.props;
		UploaderInstance.addPhotoListener((photo) => {
			const festivalPhotos = this.state.festivalPhotos;
			const relativeIndex = festivalAlbumId
				? 0
				: Math.min(Math.max(festivalPhotos.length, 0), 4);
			if (festivalAlbumId && photo?.festivalAlbumId !== festivalAlbumId) {
				return;
			}
			const updatedPhotos = helper.insertAtIndex(
				festivalPhotos,
				relativeIndex,
				photo
			);
			this.setState({
				festivalPhotos: updatedPhotos,
			});
		});
		this.loadPhotos();
	}

	loadPhotos = async () => {
		const { festivalId, festivalAlbumId } = this.props;
		try {
			this.setState({ isBusy: true, hasError: false });
			let response = null;
			if (festivalAlbumId) {
				response = await Backend.Photos.festivalAlbumPhotos(
					festivalAlbumId
				);
			} else {
				response = await Backend.Photos.festivalPhotos(festivalId);
			}
			if (response?.success) {
				this.setState({
					festivalPhotos: response.data,
				});
			} else {
				throw new Error(response.message || ERROR_TEXT);
			}
		} catch (tryErr) {
			this.setState({
				hasError: true,
			});
		} finally {
			this.setState({ isBusy: false });
		}
	};

	saveDraggingOrder = async () => {
		const { onBusy, festivalAlbumId } = this.props;
		try {
			onBusy(true);
			const { festivalPhotos } = this.state;
			const photoIds = festivalPhotos.map(
				(festivalPhoto) => festivalPhoto.id
			);
			let response = null;
			if (festivalAlbumId) {
				response = await Backend.Photos.saveAlbumPhotosRelativeOrder(
					photoIds
				);
			} else {
				response = await Backend.Photos.savePhotosRelativeOrder(
					photoIds
				);
			}
			if (response?.success) {
				this.setState(
					{
						isDragging: false,
					},
					() => {
						toast.success("Photos order saved!");
						this.props.onDragChange(false);
					}
				);
			} else {
				throw new Error(response.message || ERROR_TEXT);
			}
		} catch (tryErr) {
			toast.error(tryErr.message);
		} finally {
			onBusy(false);
		}
	};

	deletePhoto = async (photoId, index) => {
		const { onBusy, festivalAlbumId } = this.props;
		try {
			onBusy(true);
			const { festivalPhotos } = this.state;
			let response = null;
			if (festivalAlbumId) {
				response = await Backend.Photos.deleteAlbumPhoto(
					photoId
				);
			} else {
				response = await Backend.Photos.deleteFestivalPhoto(
					photoId
				);
			}
			if (response?.success) {
				festivalPhotos.splice(index, 1);
				this.setState(
					{
						festivalPhotos
					},
					() => {
						toast.success("Photo deleted successfully!");
					}
				);
			} else {
				throw new Error(response.message || ERROR_TEXT);
			}
		} catch (tryErr) {
			toast.error(tryErr.message);
		} finally {
			onBusy(false);
		}
	};

	addNewPhotos = () => {
		const uploadInstance = UploaderInstance.getCurrentUploader();
		if (!uploadInstance) {
			toast.error(RELOAD_TEXT);
			return;
		}
		const { festivalId, festivalAlbumId } = this.props;
		const params = {
			festivalId,
			festivalAlbumId,
		};
		filePicker.pickMultipleImages((files) => {
			if (files?.length > UploaderInstance.UPLOAD_LIMIT) {
				toast.error(
					`${UploaderInstance.UPLOAD_LIMIT} Images can be uploaded at a time`
				);
				return;
			} else if (files.length === 0) {
				return;
			}
			files.forEach((file) => {
				uploadInstance.uploadFile(file, params);
			});
		});
	};

	secondaryAction = () => {
		if (this.state.isDragging) {
			const tempPhotos = this.state.tempPhotos;
			this.setState({
				isDragging: false,
				festivalPhotos: tempPhotos,
				tempPhotos: [],
			}, () => {
				this.props.onDragChange(false);
			});
		} else {
			this.props.onRequestNewAlbum();
		}
	};

	handlePhotoAction = (event, photoId, photoIndex) => {
		if (this.state.isDragging) {
			return;
		}
		const options = [
			{
				icon: "list",
				label: "Change Order",
			},
			{
				icon: "trash",
				label: "Delete",
			},
		];
		const element = ContextMenu.transfromView(event);		
		this.contextMenu.show(options, element, (option, index) => {
			if (index === 0) {
				this.setState(
					{
						isDragging: true,
						tempPhotos: this.state.festivalPhotos,
					},
					() => {
						this.props.onDragChange(true);
					}
				);
			}else if(index){
				this.deletePhoto(photoId, photoIndex);
			}
		});
	};

	onSort = (festivalPhotos) => {
		this.setState({
			festivalPhotos,
		});
	};

	handlePhotoPress = (index) => {
		const { festivalPhotos } = this.state;
		const { festivalAlbumName } = this.props;
		const photoTypeTitle = festivalAlbumName || 'All Photos';
		this.props.startViewerAt(festivalPhotos, index, photoTypeTitle)
	}

	renderPhotos = (photo, index) => {
		const { isDragging } = this.state;
		const draggerStyle = {
			cursor: isDragging ? "move" : "pointer",
			...style.editIconCover,
		};
		return (
			<TouchableOpacity onPress={() => this.handlePhotoPress(index)} style={style.photoCover} key={photo.id}>
				<Image
					style={style.photo}
					hash={photo.hash}
					url={photo.thumbUrl}
				/>
				<div
					style={draggerStyle}
					className="movable"
					onClick={(e) => this.handlePhotoAction(e, photo.id, index)}
				>
					<FeatherIcon
						icon={isDragging ? "move" : "edit-2"}
						size={15}
						color={colors.buttonTxt}
					/>
				</div>
			</TouchableOpacity>
		);
	};

	render() {
		const { festivalPhotos, isDragging, hasError, isBusy } = this.state;
		return (
			<>
				<Preloader
					isBusy={isBusy}
					emptyIcon={"image"}
					emptyText={photosEmptyText}
					emptyButtonText={"Add New Photo"}
					hasError={hasError}
					onEmptyPress={this.addNewPhotos}
					isEmpty={festivalPhotos.length === 0}
				/>
				<ReactSortable
					setList={this.onSort}
					list={festivalPhotos}
					style={style.photoGrid}
					disabled={!isDragging}
					handle=".movable"
				>
					{festivalPhotos.map(this.renderPhotos)}
				</ReactSortable>
				<ContextMenu ref={(ref) => (this.contextMenu = ref)} />
			</>
		);
	}
}

class Albums extends Component {
	constructor(props) {
		super(props);
		this.state = {
			photos: [],
			isBusy: false,
			hasError: false,
			festivalAlbums: [],
			isDragging: false,
		};
	}

	componentDidMount() {
		this.loadAlbums();
	}

	loadAlbums = async () => {
		const { festivalId } = this.props;
		try {
			this.setState({ isBusy: true, hasError: false });
			let response = await Backend.Photos.festivalAlbums(festivalId);
			if (response?.success) {
				this.setState({
					festivalAlbums: response.data,
				});
			} else {
				throw new Error(response.message || ERROR_TEXT);
			}
		} catch (tryErr) {
			this.setState({
				hasError: true,
			});
		} finally {
			this.setState({ isBusy: false });
		}
	};

	deleteAlbum = async (festivalAlbumId, index) => {
		const { onBusy } = this.props;
		try {
			onBusy(true);
			const { festivalAlbums } = this.state;
			let response = await Backend.Photos.deleteAlbum(
				festivalAlbumId
			);
			if (response?.success) {
				festivalAlbums.splice(index, 1);
				this.setState(
					{
						festivalAlbums
					},
					() => {
						toast.success("Album deleted successfully!");
					}
				);
			} else {
				throw new Error(response.message || ERROR_TEXT);
			}
		} catch (tryErr) {
			toast.error(tryErr.message);
		} finally {
			onBusy(false);
		}
	}

	handleAlbumAction = (event, album, albumIndex) => {
		const { onRequestNewAlbum } = this.props;
		const options = [
			{
				icon: "edit",
				label: "Edit Name",
			},
			{
				icon: "trash",
				label: "Delete",
			},
		];
		const element = ContextMenu.transfromView(event);
		this.contextMenu.show(options, element, (option, index) => {
			if (index === 0) {
				onRequestNewAlbum(album);
			}else if(index){
				this.sureModal.show(
					`${album.name} will be deleted permanently`,
					(action) => {
						if (action) {
							this.deleteAlbum(album.id, albumIndex);
						}
					}
				);				
			}
		});
	};

	renderAlbum = (album, index) => {
		const albumText =
			album.photoCount > 0
				? `${album.photoCount} Photo${
						album.photoCount === 1 ? "" : "s"
				  }`
				: "No Photos";
		return (
			<TouchableOpacity onPress={() => this.props.onSelect(album)} style={style.albumCover} key={album.id}>
				<Image style={style.album} url={album.thumbUrl} />
				<Text style={style.albumName}>{album.name}</Text>
				<Text style={style.albumText}>{albumText}</Text>

				<TouchableOpacity
					style={style.editIconCover}
					onPress={(e) => this.handleAlbumAction(e, album, index)}
				>
					<FeatherIcon
						icon={"edit-2"}
						size={15}
						color={colors.buttonTxt}
					/>
				</TouchableOpacity>
			</TouchableOpacity>
		);
	};

	render() {
		const { festivalAlbums, hasError, isBusy } = this.state;
		const { onRequestNewAlbum } = this.props;
		return (
			<>
				<Preloader
					isBusy={isBusy}
					emptyIcon={"folder"}
					emptyText={albumEmptyText}
					onEmptyPress={() => {
						onRequestNewAlbum()
					}}
					emptyButtonText={"Add New Album"}
					hasError={hasError}
					isEmpty={festivalAlbums.length === 0}
				/>
				<div style={style.albumGrid}>
					{festivalAlbums.map(this.renderAlbum)}
				</div>
				<ContextMenu ref={(ref) => (this.contextMenu = ref)} />
				<SureModal ref={(ref) => (this.sureModal = ref)} />
			</>
		);
	}
}

const style = StyleSheet.create({
	sectionTabButton: {
		width: 130,
		height: 30,
		marginLeft: 10,
	},
	photo: {
		width: photoRowSize,
		height: photoRowSize,
	},
	photoGrid: {
		display: "grid",
		justifyContent: "space-between",
		gridTemplateColumns: `repeat(5, ${photoRowSize}px)`,
		width: "100%",
	},
	photoCover: {
		width: photoRowSize,
		height: photoRowSize,
		borderRadius: BORDER_RADIUS,
		overflow: "hidden",
		marginVertical: 10,
	},

	album: {
		width: albumRowSize,
		height: albumRowSize,
		borderRadius: BORDER_RADIUS,
		backgroundColor: colors.vectorBaseDip,
	},
	albumGrid: {
		display: "grid",
		justifyContent: "space-between",
		gridTemplateColumns: `repeat(4, ${albumRowSize}px)`,
		width: "100%",
	},
	albumCover: {
		width: albumRowSize,
		height: albumRowSize + 40,
		borderRadius: BORDER_RADIUS,
		overflow: "hidden",
		marginVertical: 10,
	},
	albumName: {
		color: colors.textBlack,
		fontSize: 13,
		fontWeight: "500",
		marginTop: 5,
	},
	albumText: {
		fontSize: 12,
		marginTop: 5,
		fontWeight: "400",
		color: colors.holderColor,
	},
	editIconCover: {
		borderRadius: 100,
		width: 30,
		height: 30,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		top: 5,
		right: 5,
		border: `solid ${colors.borderColor} 1px`,
		backgroundColor: colors.bgTrans,
	},
});