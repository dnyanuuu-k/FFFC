import React, { useMemo } from 'react';
import { View, Pressable, StyleSheet, ScrollView } from 'react-native';
import Image from 'components/image';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useTheme } from '@react-navigation/native';
import { WINDOW_WIDTH } from 'utils/constants';

const photoSize = WINDOW_WIDTH / 4;

const PhotoRow = ({ photos = [], showPhotos, isOwner = false }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					flexDirection: 'row',
					marginBottom: 16,
				},
				photo: {
					height: photoSize,
					width: photoSize,
					marginRight: 10,
				},
				addPhoto: {
					borderColor: colors.primary,
					borderStyle: 'dashed',
					borderWidth: 1,
					marginRight: 10,
					height: photoSize,
					width: photoSize,
					justifyContent: 'center',
					alignItems: 'center',
					borderRadius: 1,
				},
			}),
		[colors]
	);
	const renderPhoto = ({ id, thumbUrl, hash }) => {
		return (
			<Pressable key={id} onPress={showPhotos} style={style.photo}>
				<Image
					resizeMode="cover"
					style={style.photo}
					url={thumbUrl}
					hash={hash}
				/>
			</Pressable>
		);
	};
	return (
		<View style={style.main}>
			<ScrollView horizontal>
				{isOwner ? (
					<Pressable onPress={showPhotos} style={style.addPhoto}>
						<FeatherIcon size={20} color={colors.primary} name="plus" />
					</Pressable>
				) : null}
				{photos.map(renderPhoto)}
			</ScrollView>
		</View>
	);
};

export default PhotoRow;
