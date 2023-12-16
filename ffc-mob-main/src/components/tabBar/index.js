import React, { useMemo } from 'react';
import { View, Image, Pressable, StyleSheet } from 'react-native';

// Icons
import HomeOutline from 'assets/icons/homeOutline.png';
import FestivalOutline from 'assets/icons/festivalOutline.png';
import MessageOutline from 'assets/icons/messageOutline.png';
import NotificationOutline from 'assets/icons/notificationOutline.png';
import ProfileOutline from 'assets/icons/userOutline.png';

import HomeFilled from 'assets/icons/homeFilled.png';
import FestivalFilled from 'assets/icons/festivalFilled.png';
import MessageFilled from 'assets/icons/messageFilled.png';
import NotificationFilled from 'assets/icons/notificationFilled.png';
import ProfileFilled from 'assets/icons/userFilled.png';

// Hooks
import { useTheme } from '@react-navigation/native';

// Constants
import { BOTTOM_TAB_HEIGHT, WINDOW_WIDTH } from 'utils/constants';

const TAB_WIDTH = WINDOW_WIDTH / 5;

const getTabIcon = (name, focused) => {
	switch (name) {
		case 'Home':
			return focused ? HomeFilled : HomeOutline;
		case 'Festivals':
			return focused ? FestivalFilled : FestivalOutline;
		case 'Messages':
			return focused ? MessageFilled : MessageOutline;
		case 'Notifications':
			return focused ? NotificationFilled : NotificationOutline;
		case 'Profile':
			return focused ? ProfileFilled : ProfileOutline;
		default:
			return HomeOutline;
	}
};

const TabBar = ({ state, descriptors, navigation }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					height: BOTTOM_TAB_HEIGHT,
					width: WINDOW_WIDTH,
					backgroundColor: colors.card,
					flexDirection: 'row',
					borderTopWidth: 1,
					borderColor: colors.border,
				},
				tab: {
					width: TAB_WIDTH,
					height: BOTTOM_TAB_HEIGHT,
					justifyContent: 'center',
					alignItems: 'center',
				},
				icon: {
					width: 26,
					height: 26,
					tintColor: colors.selected,
				},
			}),
		[colors]
	);
	return (
		<View style={style.main}>
			{state.routes.map((route, index) => {
				const isFocused = state.index === index;
				const icon = getTabIcon(route.name, isFocused);
				const onPress = () => {
					const event = navigation.emit({
						type: 'tabPress',
						target: route.key,
						canPreventDefault: true,
					});

					if (!isFocused && !event.defaultPrevented) {
						// The `merge: true` option makes sure that the params inside the tab screen are preserved
						// navigation.navigate({ name: route.name, merge: true });
						navigation.navigate({ name: route.name, merge: false });
					}
				};
				return (
					<Pressable key={route.name} onPress={onPress} style={style.tab}>
						<Image fadeDuration={0} source={icon} style={style.icon} />
					</Pressable>
				);
			})}
		</View>
	);
};

export default TabBar;
