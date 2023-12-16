import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

// Components
import Image from 'components/image';
import ShowMore from './showMore';
import FeatherIcon from 'react-native-vector-icons/Feather';
// Hooks
import { useTheme } from '@react-navigation/native';

// Constants
import { WINDOW_WIDTH } from 'utils/constants';
import { fonts, weights } from 'themes/topography';

const photoSize = WINDOW_WIDTH / 4.6;

const AboutSection = ({
	about,
	onPhotoPress,
	onEditRequest,
	morePhoto,
	photos = [],
	isOwner = false,
} = {}) => {
	const { colors } = useTheme();
	const style = StyleSheet.create({
		main: { backgroundColor: colors.card, marginTop: 10 },
		photoRow: {
			flexDirection: 'row',
			height: photoSize,
			marginTop: 20,
		},
		photo: {
			borderRadius: 5,
			height: photoSize,
			width: photoSize,
			marginLeft: 10,
		},
		photoAdd: {
			borderColor: colors.primary,
			borderStyle: 'dashed',
			borderWidth: 1,
			marginLeft: 10,
			height: photoSize,
			width: photoSize,
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: 5,
		},
		photoMore: {
			height: photoSize,
			width: photoSize,
			position: 'absolute',
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: colors.bgTrans,
			marginLeft: 10,
			borderRadius: 5,
		},
		moreTxt: {
			color: colors.card,
			fontSize: fonts.small,
			fontWeight: weights.bold,
		},
	});

	return (
		<View style={style.main}>
			<Pressable onPress={onPhotoPress} style={style.photoRow}>
				{photos.map((photo) => (
					<Image
						key={photo.id}
						hash={photo.hash}
						url={photo.thumb_url}
						style={style.photo}
					/>
				))}
				{isOwner ? (
					<View style={style.photoAdd}>
						<FeatherIcon size={20} color={colors.primary} name="plus" />
					</View>
				) : null}
				{morePhoto ? (
					<View>
						<Image
							hash={morePhoto.hash}
							url={morePhoto.url}
							style={style.photo}
						/>
						<View style={style.photoMore}>
							<Text style={style.moreTxt}>+20</Text>
						</View>
					</View>
				) : null}
			</Pressable>
			<ShowMore
				onEditRequest={onEditRequest}
				isOwner={isOwner}
				title="About"
				text={about}
			/>
		</View>
	);
};

export default AboutSection;
