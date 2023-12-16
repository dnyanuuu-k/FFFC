import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Image from '../image';
import Button from '../button';
import { useTheme } from '@react-navigation/native';
import { THUMB_IMAGE_AR, W95 } from 'utils/constants';
import { fonts, weights } from 'themes/topography';

const thumbWidth = 100;
const cardHeight = thumbWidth / THUMB_IMAGE_AR;
const buttonWidth = (W95 - thumbWidth) / 2.2;

const FilmRowCard = ({ film, onView, onEdit }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				thumb: {
					height: cardHeight,
					width: thumbWidth,
				},
				card: {
					width: W95,
					alignSelf: 'center',
					backgroundColor: colors.card,
					marginTop: 10,
					height: cardHeight,
					borderRadius: 5,
					overflow: 'hidden',
					borderWidth: 1,
					flexDirection: 'row',
					borderColor: colors.border,
				},
				content: {
					padding: 5,
				},
				title: {
					fontSize: fonts.regular,
					color: colors.text,
					fontWeight: weights.bold,
					marginBottom: 5,
				},
				row: {
					flexDirection: 'row',
				},
				desc: {
					marginBottom: 3,
					color: colors.holderColor,
					fontSize: fonts.small,
				},
				button: {
					width: buttonWidth,
					height: 35,
					marginRight: 5,
				},
				buttonTxt: {
					fontSize: fonts.small,
				},
			}),
		[colors]
	);
	return (
		<View style={style.card}>
			<Image url={film.thumbUrl} hash={film.thumbHash} style={style.thumb} />
			<View style={style.content}>
				<Text style={style.title}>{film.title}</Text>
				<Text style={style.desc}>{film.submissionCount} Total Submisssion</Text>
				<Text style={style.desc}>{film.selectionCount} Selections</Text>
				<Text style={style.desc}>{film.pendingCount} Pending</Text>
				<View style={style.row}>
					<Button
						text="View Project"
						style={style.button}
						textStyle={style.buttonTxt}
						type={Button.PRIMARY}
						onPress={() => onView(film.id)}
					/>
					<Button
						text="Manage Project"
						style={style.button}
						textStyle={style.buttonTxt}
						type={Button.OUTLINE_PRIMARY}
						onPress={onEdit}
					/>
				</View>
			</View>
		</View>
	);
};

export default FilmRowCard;
