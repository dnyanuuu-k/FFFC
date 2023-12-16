import React, { useMemo } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Markdown from 'react-native-markdown-display';
import { fonts } from 'themes/topography';

export const NOTIFICATION_CARD_HEIGHT = 70;
export const TYPE_BOX_SIZE = 55;

const NotificationCard = ({ colors, data, onPress }) => {
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					flexDirection: 'row',
					minHeight: NOTIFICATION_CARD_HEIGHT,
					paddingVertical: 10,
					backgroundColor: colors.card,
					paddingHorizontal: 10,
					alignItems: 'center',
				},
				textContent: {
					flex: 1,
				},
				typeCover: {
					width: TYPE_BOX_SIZE,
					height: TYPE_BOX_SIZE,
					borderRadius: 5,
					marginRight: 10,
					justifyContent: 'center',
					alignItems: 'center',
				},
				timeAgo: {
					color: colors.holderColor,
					fontSize: fonts.xsmall,
				},
				markdown: {
					color: colors.text,
					fontSize: fonts.small,
					marginTop: -10,
					marginBottom: -10,
				},
			}),
		[colors]
	);

	return (
		<Pressable onPress={onPress} style={style.main}>
			<LinearGradient colors={data.typeColors} style={style.typeCover}>
				<FeatherIcon name={data.typeIcon} size={25} color={colors.buttonTxt} />
			</LinearGradient>
			<View style={style.textContent}>
				<Markdown style={{ body: style.markdown }}>{data.body}</Markdown>
				<Text style={style.timeAgo}>{data.timeAgo}</Text>
			</View>
		</Pressable>
	);
};

export default NotificationCard;
