import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TabHeader from 'components/header/tab';
import NotificationCard, { NOTIFICATION_CARD_HEIGHT } from './card';

import { FlashList } from '@shopify/flash-list';
import { useTheme } from '@react-navigation/native';
import { WINDOW_WIDTH } from 'utils/constants';
import { fonts, weights } from 'themes/topography';

const LIST_HEADER_HEIGHT = 40;
const ESTIMATED_ITEM_SIZWE =
	NOTIFICATION_CARD_HEIGHT + 10 + LIST_HEADER_HEIGHT / 2;

const NotificationScreen = () => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					backgroundColor: colors.background,
					flex: 1,
				},
				listHeaderCover: {
					height: LIST_HEADER_HEIGHT,
					width: WINDOW_WIDTH,
					marginTop: 10,
					paddingLeft: 10,
					justifyContent: 'center',
					backgroundColor: colors.card,
				},
				listHeaderText: {
					fontSize: fonts.regular,
					fontWeight: weights.semibold,
					color: colors.text,
				},
			}),
		[colors]
	);

	const [notifications, setNotifications] = useState(notificationTempData);
	const [isLoading, setIsLoading] = useState(false);

	const handleNotificationPress = (data) => {
		console.log('Pressed', data.id);
	};

	const renderNotification = ({ item, index }) => {
		switch (item.cardType) {
			case 'header':
				return (
					<View style={style.listHeaderCover}>
						<Text style={style.listHeaderText}>{item.title}</Text>
					</View>
				);
			default:
				return (
					<NotificationCard
						data={item}
						colors={colors}
						onPress={() => handleNotificationPress(item)}
					/>
				);
		}
	};

	return (
		<View style={style.main}>
			<TabHeader title="Notifications" />
			<FlashList
				extraData={colors}
				data={notifications}
				renderItem={renderNotification}
				keyExtractor={(item) => item.id}
				estimatedItemSize={ESTIMATED_ITEM_SIZWE}
				getItemType={(item) => {
					return item.cardType;
				}}
			/>
		</View>
	);
};

const notificationTempData = [
	{
		id: 'header1',
		cardType: 'header',
		title: 'Today',
	},
	{
		id: 3,
		cardType: 'card',
		body: '**A Lonely Way** film was submitted in short films to **Mumba Festival**',
		typeColors: ['#3AB078', '#268200'],
		typeIcon: 'film',
		timeAgo: '3 min ago',
	},
	{
		id: 4,
		cardType: 'card',
		body: 'Payout of **$220 USD** created to your account **SBIXXXXXA**',
		typeColors: ['#0B71BF', '#003AB9'],
		typeIcon: 'credit-card',
		timeAgo: '2 hours',
	},
	{
		id: 'header2',
		cardType: 'header',
		title: 'Yesterday',
	},
	{
		id: 9,
		cardType: 'card',
		body: '**A School Bag** film was submitted in short films to **Mumba Festival**',
		typeColors: ['#3AB078', '#268200'],
		typeIcon: 'film',
		timeAgo: '29 Oct at 09:00',
	},
];
export default NotificationScreen;
