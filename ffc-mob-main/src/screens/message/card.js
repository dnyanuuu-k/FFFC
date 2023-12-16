import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
// import Image from 'components/image';
import helper from 'utils/helper';
import { WINDOW_WIDTH, CHAT_COLORS } from 'utils/constants';
import { fonts, weights } from 'themes/topography';

export const LIST_CONTACT_HEIGHT = 80;
export const AVATAR_BOX_SIZE = 50;

const textWidth = WINDOW_WIDTH - 140;

const ContactCard = ({ colors, data, onPress }) => {
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					flexDirection: 'row',
					minHeight: LIST_CONTACT_HEIGHT,
					paddingVertical: 10,
					backgroundColor: colors.card,
					paddingHorizontal: 10,
					alignItems: 'center',
				},
				textContent: {
					flex: 1,
				},
				avatarCover: {
					width: AVATAR_BOX_SIZE,
					height: AVATAR_BOX_SIZE,
					borderRadius: 100,
					marginRight: 10,
					justifyContent: 'center',
					alignItems: 'center',
				},
				avatarImage: {
					width: AVATAR_BOX_SIZE,
					height: AVATAR_BOX_SIZE,
					borderRadius: 100,
					marginRight: 10,
					overflow: 'hidden',
				},
				row: {
					flexDirection: 'row',
					justifyContent: 'space-between',
				},
				timeAgo: {
					fontSize: fonts.xsmall,
				},
				content: {
					fontSize: fonts.small,
					color: colors.holderColor,
					marginTop: 2,
				},
				name: {
					color: colors.text,
					fontSize: fonts.regular,
					fontWeight: weights.semibold,
					width: textWidth,
				},
				avatarTxt: {
					fontSize: fonts.regular,
					fontWeight: weights.semibold,
					color: colors.buttonTxt,
				},
				countCover: {
					width: 22,
					height: 22,
					textAlignVertical: 'center',
					textAlign: 'center',
					borderRadius: 60,
					fontSize: fonts.xsmall,
					fontWeight: weights.semibold,
					color: colors.buttonTxt,
					backgroundColor: colors.rubyRed,
					position: 'absolute',
					right: 0,
					bottom: 0,
				},
			}),
		[colors]
	);

	const name = useMemo(() => {
		return helper.getAvatarName(data.name);
	}, [data.name]);

	return (
		<Pressable onPress={onPress} style={style.main}>
			<LinearGradient colors={CHAT_COLORS} style={style.avatarCover}>
				<Text style={style.avatarTxt}>{name}</Text>
			</LinearGradient>

			<View style={style.textContent}>
				<View style={style.row}>
					<Text numberOfLines={1} style={style.name}>
						{data.name}
					</Text>
					<Text
						style={[
							style.timeAgo,
							{ color: data.online ? colors.greenDark : colors.holderColor },
						]}
					>
						{data.online ? 'Online' : data.lastseen}
					</Text>
				</View>
				<Text numberOfLines={1} style={style.content}>
					{data.previewText}
				</Text>

				{data?.unreadCount ? (
					<Text style={style.countCover}>{data.unreadCount}</Text>
				) : null}
			</View>
		</Pressable>
	);
};

// {data?.avatarUrl ? (
// 				<Image style={style.avatarImage} url={data.avatarUrl} />
// 			) : (

// 			)}

export default ContactCard;