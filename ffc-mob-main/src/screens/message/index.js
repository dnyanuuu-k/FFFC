import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TabHeader from 'components/header/tab';
import { FlashList } from '@shopify/flash-list';
import LottieView from 'lottie-react-native';
import ContactCard, { LIST_CONTACT_HEIGHT } from './card';
import { useTheme } from '@react-navigation/native';
import { WINDOW_WIDTH, W90 } from 'utils/constants';
import { fonts, weights } from 'themes/topography';
import Tinode from 'libs/tinode';

const chatAnimation = require('assets/anims/chat.json');

const MessageScreen = ({ navigation }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					backgroundColor: colors.background,
					flex: 1,
				},
				emptyCover: {
					borderBottomWidth: 1,
					borderColor: colors.border,
					height: 350,
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: colors.card,
				},
				emptyTitle: {
					marginTop: 10,
					fontSize: fonts.large,
					fontWeight: weights.bold,
					color: colors.text,
				},
				emptyDesc: {
					marginTop: 10,
					fontSize: fonts.small,
					color: colors.holderColor,
					textAlign: 'center',
					width: W90,
				},
				lottieView: {
					height: 150,
					width: WINDOW_WIDTH,
				},
			}),
		[colors]
	);

	const [contactList, setContactList] = useState([]);

	const refreshContacts = async () => {
		const contacts = await Tinode.getConnversations();
		console.log(contacts);
		setContactList(contacts);
	};

	useEffect(() => {
		const focusSubscribe = navigation.addListener('focus', () => {
			refreshContacts();
			Tinode.addConversationListener('screen', (contacts) => {
				setContactList(contacts);
			});
		});
		const blurSubscribe = navigation.addListener('blur', () => {
			Tinode.removeConversationListener('screen');
		});
		return () => {
			focusSubscribe();
			blurSubscribe();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const startChat = (topic) => {
		navigation.navigate('ChatScreen', { topic });
	};

	const renderContact = ({ item, index }) => {
		return (
			<ContactCard
				onPress={() => startChat(item.topic)}
				data={item}
				colors={colors}
			/>
		);
	};

	const renderEmptyComponent = () => (
		<View style={style.emptyCover}>
			<LottieView
				source={chatAnimation}
				resizeMode="contain"
				autoPlay
				loop
				style={style.lottieView}
			/>
			<Text style={style.emptyTitle}>Message on FilmFestBook</Text>
			<Text style={style.emptyDesc}>
				Connect with film makers easily, chats with users will be shown here.
			</Text>
		</View>
	);

	return (
		<View style={style.main}>
			<TabHeader title="Messages" />
			<FlashList
				refreshing={false}
				onRefresh={refreshContacts}
				extraData={colors}
				data={contactList}
				renderItem={renderContact}
				keyExtractor={(item) => item.topic}
				ListEmptyComponent={renderEmptyComponent}
				estimatedItemSize={LIST_CONTACT_HEIGHT}
			/>
		</View>
	);
};

export default MessageScreen;
