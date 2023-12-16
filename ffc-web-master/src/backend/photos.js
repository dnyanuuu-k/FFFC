import { perform, multipartUpload } from "./request";
export const PhotoUploadEndpoint = "photos/upload";

export const festivalPhotos = (festivalId) => {
	return perform("photos/festival_photos", {
		festivalId,
	});
};

export const deleteFestivalPhoto = (festivalPhotoId) => {
	return perform("photos/delete_festival_photo", {
		festivalPhotoId,
	});
};

export const deleteAlbumPhoto = (festivalAlbumPhotoId) => {
	return perform("photos/delete_festival_album_photo", {
		festivalAlbumPhotoId,
	});
};

export const deleteAlbum = (festivalAlbumId) => {
	return perform("photos/delete_festival_album", {
		festivalAlbumId,
	});
};


export const createFestivalAlbum = ({ festivalId, festivalPhotoId, id, name }) => {
	return perform("photos/create_festival_album", {
		festivalId, festivalPhotoId, id, name
	});
};

export const festivalAlbums = (festivalId) => {
	return perform("photos/festival_albums", {
		festivalId
	});
};

export const festivalAlbumPhotos = (festivalAlbumId) => {
	return perform("photos/festival_album_photos", {
		festivalAlbumId,
	});
};

export const addFestivalPhotoToAlbum = ({ festivalPhotoId, festivalAlbumId}) => {
	return perform("photos/add_festival_photo_to_album", {
		festivalPhotoId,
		festivalAlbumId
	});
};

export const savePhotosRelativeOrder = (festivalPhotoIds) => {
	return perform("photos/save_festival_photos_order", {
		festivalPhotoIds,
	});
};

export const saveAlbumPhotosRelativeOrder = (festivalAlbumPhotoIds) => {
	return perform("photos/save_festival_album_photos_order", {
		festivalAlbumPhotoIds,
	});
};

export const uploadTempAvatar = async (file) => {
	return multipartUpload(
		"photos/upload_temp_avatar",
		{},
		file
	);
};