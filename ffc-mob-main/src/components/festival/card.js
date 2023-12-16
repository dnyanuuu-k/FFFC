import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Image from '../image';
import { FESTIVAL_CARD_HEIGHT, W95, COVER_ASPECT_RATIO } from 'utils/constants';
import { fonts, weights } from 'themes/topography';

const coverImageHeight = W95 * COVER_ASPECT_RATIO;
const buttonRowWidth = W95 - 20;
const buttonWidth = buttonRowWidth / 2.05;
const textWidth = W95 - 102;

const FestivalCard = ({ colors, dark, data, onView }) => {
	const style = StyleSheet.create({
		main: {
			height: FESTIVAL_CARD_HEIGHT,
			width: W95,
			alignSelf: 'center',
			overflow: 'hidden',
			borderRadius: 5,
			backgroundColor: colors.card,
			marginTop: 20,
			borderWidth: 1,
			borderColor: colors.border,
		},
		coverImage: {
			height: coverImageHeight,
			width: W95,
		},
		contentRow: {
			flexDirection: 'row',
		},
		logoHolder: {
			top: -20,
			marginLeft: 10,
			borderWidth: 3,
			borderRadius: 5,
			elevation: 2,
			backgroundColor: colors.card,
			overflow: 'hidden',
			position: 'absolute',
			borderColor: colors.card,
		},
		textContent: {
			left: 102,
			minHeight: 60,
			justifyContent: 'flex-end',
		},
		logoImage: {
			height: 80,
			width: 80,
		},
		title: {
			fontSize: fonts.small,
			color: colors.text,
			width: textWidth,
			fontWeight: weights.bold,
		},
		address: {
			width: textWidth,
			fontSize: fonts.small,
			color: colors.holderColor,
		},
		duration: {
			fontSize: fonts.xsmall,
			color: colors.holderColor,
		},
		buttonRow: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			width: buttonRowWidth,
			alignSelf: 'center',
			marginTop: 15,
		},
		viewButton: {
			width: buttonWidth,
			height: 35,
			borderRadius: 5,
			borderWidth: 1,
			borderColor: colors.primary,
			justifyContent: 'center',
			alignItems: 'center',
		},
		submitButton: {
			width: buttonWidth,
			height: 35,
			borderRadius: 5,
			backgroundColor: colors.greenDark,
			justifyContent: 'center',
			alignItems: 'center',
		},
		viewButtonText: {
			color: colors.primary,
			fontSize: fonts.small,
			fontWeight: weights.semibold,
		},
		submitButtonText: {
			color: colors.buttonTxt,
			fontSize: fonts.small,
			fontWeight: weights.semibold,
		},
	});
	return (
		<View style={style.main}>
			<Image
				style={style.coverImage}
				hash={data.coverHash}
				url={data.coverUrl}
			/>
			<View style={style.contentRow}>
				<View style={style.logoHolder}>
					<Image
						style={style.logoImage}
						hash={data.logoHash}
						url={data.logoUrl}
					/>
				</View>
				<View style={style.textContent}>
					<Text style={style.title}>{data.name}</Text>
					<Text style={style.address}>{data.address}</Text>
					<Text style={style.duration}>{data.yearsRunning} years</Text>
				</View>
			</View>

			<View style={style.buttonRow}>
				<Pressable onPress={() => onView(data.id)} style={style.viewButton}>
					<Text style={style.viewButtonText}>View Festival</Text>
				</Pressable>
				<Pressable style={style.submitButton}>
					<Text style={style.submitButtonText}>Submit Film</Text>
				</Pressable>
			</View>
		</View>
	);
};

export default React.memo(FestivalCard);
