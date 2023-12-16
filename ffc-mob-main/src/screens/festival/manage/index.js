import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet, Text, Pressable } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Header from 'components/header/basic';
import { W70 } from 'utils/constants';
import { useTheme, useNavigation } from '@react-navigation/native';
import { fonts } from 'themes/topography';

const sections = [
	{
		title: 'Buttons & Logos',
		subTitle: 'Link FilmFestBook to  your website or social media accounts',
		page: 'FestivalButtonLogo',
	},
	{
		title: 'Notification Manager',
		subTitle: 'Manage notification preference for selections',
		page: 'FestivalNotification',
	},
	{
		title: 'Email and notify on app',
		subTitle: 'Reachout submitters for important details',
	},
	{
		title: 'Discounts',
		subTitle: 'Create discount code for submissions',
	},
	{
		title: 'Manage Judges',
		subTitle: 'Add judges to your festival',
		page: 'FestivalJudge',
	},
	{
		title: 'Custom Flags',
		subTitle: 'Manage flag for your submissions',
		page: 'FestivalFlag',
	},
	{
		title: 'Reviews',
		subTitle: 'Manage reviews of your festival',
	},
	{
		title: 'Transactions',
		subTitle: 'View all transactions of your festival',
	},
	{
		title: 'Submissions',
		subTitle: 'View all submissions of your festival',
	},
	{
		title: 'Reports',
		subTitle: 'Download detailed reports',
		noWidth: true,
	},
];

const ManageFestival = ({ route }) => {
	const { colors } = useTheme();
	const navigation = useNavigation();
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					flex: 1,
					backgroundColor: colors.background,
				},
				content: {
					marginTop: 10,
					padding: 10,
					backgroundColor: colors.card,
				},
				cover: {
					borderRadius: 10,
					borderWidth: 1,
					borderColor: colors.border,
				},
				card: {
					height: 70,
					paddingHorizontal: 10,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					borderColor: colors.border,
					borderBottomWidth: 1,
				},
				desc: {
					fontSize: fonts.xsmall,
					width: W70,
					color: colors.holderColor,
				},
				option: {
					fontSize: fonts.small,
					fontWeight: colors.semibold,
					color: colors.text,
				},
			}),
		[colors]
	);

	const { festivalId } = route.params;

	const showScreen = (screen) => {
		navigation.navigate(screen, {
			festivalId,
		});
	};

	const renderSection = (section, index) => {
		const borderBottomWidth = section.noWidth ? 0 : 1;
		return (
			<Pressable
				onPress={() => showScreen(section.page)}
				key={index}
				style={[style.card, { borderBottomWidth }]}
			>
				<View>
					<Text style={style.option}>{section.title}</Text>
					<Text numberOfLines={2} style={style.desc}>
						{section.subTitle}
					</Text>
				</View>
				<FeatherIcon color={colors.primary} size={15} name="chevron-right" />
			</Pressable>
		);
	};

	return (
		<View style={style.main}>
			<Header title="Manage Festival" />
			<ScrollView>
				<View style={style.content}>
					<View style={style.cover}>{sections.map(renderSection)}</View>
				</View>
			</ScrollView>
		</View>
	);
};

export default ManageFestival;