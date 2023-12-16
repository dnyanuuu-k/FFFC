import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Shimmer from 'react-native-shimmer';

import Image from 'components/image';
import PaymentTab from './paymentTab';
import SubmissionTab from './submissionTab';
import ReportTab from './reportTab';
import Preloader from 'components/preloader/basic';

// Functions
import { RNSelectionMenu } from 'libs/Menu';
import Backend from 'backend';
import moment from 'moment';

// Hooks
import { useTheme, useNavigation } from '@react-navigation/native';

// Constants
import {
	HEADER_HEIGHT,
	WINDOW_WIDTH,
	COVER_IMAGE_HEIGHT,
	W90,
	MMMYYYY,
} from 'utils/constants';
import { fonts, weights } from 'themes/topography';
const LOGO_SIZE = 70;
const actualLogoSize = LOGO_SIZE - 6;
const summaryTabs = [
	{
		name: 'This season',
	},
	{
		name: 'All time history',
	},
];
const pagerTabs = [
	{
		name: 'Payments',
	},
	{
		name: 'Submissions',
	},
	{
		name: 'Reports',
	},
];
const Dashboard = () => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					backgroundColor: colors.background,
					flex: 1,
				},
				content: {
					flex: 1,
				},
				imageCover: {
					height: COVER_IMAGE_HEIGHT,
				},
				coverOverlay: {
					backgroundColor: colors.bgTrans69,
					position: 'absolute',
					height: COVER_IMAGE_HEIGHT,
					width: WINDOW_WIDTH,
				},

				logoCover: {
					height: 100,
					alignItems: 'center',
					backgroundColor: colors.card,
				},
				logoHolder: {
					height: LOGO_SIZE,
					width: LOGO_SIZE,
					borderRadius: 10,
					marginTop: -20,
					overflow: 'hidden',
					backgroundColor: colors.card,
					elevation: 5,
					borderWidth: 3,
					borderColor: colors.card,
				},
				logo: {
					height: actualLogoSize,
					width: actualLogoSize,
					borderRadius: 5,
				},
				festivalTitle: {
					textAlign: 'center',
					width: W90,
					fontSize: fonts.title,
					fontWeight: weights.bold,
					color: colors.text,
					marginTop: 10,
				},

				scrollContent: {
					position: 'absolute',
					top: HEADER_HEIGHT,
					height: '100%',
					width: '100%',
				},
				overlayCover: {
					height: 130,
				},

				//Summary Tab Styles
				summaryCover: {
					height: 170,
					borderBottomWidth: 1,
					borderColor: colors.border,
					backgroundColor: colors.card,
				},
				summaryHeader: {
					height: 40,
					marginTop: 10,
					marginBottom: 10,
					flexDirection: 'row',
					paddingHorizontal: 10,
					borderBottomWidth: 1,
					borderColor: colors.border,
				},
				summaryTab: {
					height: 40,
					justifyContent: 'center',
				},
				summaryTabTitle: {
					fontSize: fonts.small,
					paddingHorizontal: 20,
				},
				summaryTabInc: {
					height: 1,
					width: '100%',
					position: 'absolute',
					bottom: 0,
					backgroundColor: colors.text,
				},
				// Summary Content Styles
				summaryRow: {
					flexDirection: 'row',
					paddingHorizontal: 10,
					alignItems: 'center',
					justifyContent: 'space-between',
					height: 35,
				},
				summaryKey: {
					fontSize: fonts.small,
					color: colors.holderColor,
				},
				summaryValue: {
					fontSize: fonts.small,
					color: colors.text,
					fontWeight: weights.bold,
				},
				// Tab Styles
				tabCover: {
					height: 40,
					backgroundColor: colors.card,
					elevation: 2,
					paddingHorizontal: 5,
					flexDirection: 'row',
				},
				tab: {
					height: 40,
					marginRight: 10,
					justifyContent: 'center',
				},
				tabInc: {
					height: 2,
					borderTopLeftRadius: 10,
					borderTopRightRadius: 10,
					width: '100%',
					position: 'absolute',
					bottom: 0,
					backgroundColor: colors.text,
				},
				tabTitle: {
					textAlign: 'center',
					paddingHorizontal: 10,
					fontSize: fonts.small,
				},

				pagerContent: {
					backgroundColor: colors.background,
					paddingBottom: 100,
				},
			}),
		[colors]
	);

	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);
	const [currentSummaryTabIndex, setCurrentSummaryTabIndex] = useState(0);
	const [currentPagerTab, setCurrentPagerTab] = useState(0);
	const [festivalDateId, setFestivalDateId] = useState(null);
	const [summaryData, setSummaryData] = useState({
		festival: {},
		allTime: {},
		currentSeason: {},
	});

	const seasonSummary = currentSummaryTabIndex
		? summaryData?.allTime
		: summaryData?.currentSeason;
	const currency = summaryData.festival.currency;

	const loadSummary = async (seasonId = festivalDateId) => {
		try {
			setLoading(true);
			setError(false);
			const response = await Backend.Dashboard.salesSummary({
				festivalDateId: seasonId,
			});
			if (response?.success) {
				const data = response.data;
				const seasons = data?.festival?.festivalSeasons || [];
				setSummaryData(data);
				if (!festivalDateId && seasons.length) {
					setFestivalDateId(seasons[0].id);
				}
			} else {
				throw new Error(response?.message);
			}
		} catch (err) {
			setError(true);
		} finally {
			setLoading(false);
		}
	};

	const handleChangeSeason = (seasonId) => {
		setFestivalDateId(seasonId);
		loadSummary(seasonId);
	};

	const handleRetry = () => {
		setFestivalDateId(null);
		loadSummary(null);
	};

	useEffect(() => {
		loadSummary();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const renderSummaryTab = (tab, index) => {
		const isSelected = currentSummaryTabIndex === index;
		const color = isSelected ? colors.text : colors.holderColor;
		const fontWeight = isSelected ? weights.semibold : weights.normal;
		return (
			<Pressable
				key={tab.name}
				onPress={() => setCurrentSummaryTabIndex(index)}
				style={style.summaryTab}
			>
				<Text style={[style.summaryTabTitle, { color, fontWeight }]}>
					{tab.name}
				</Text>
				{isSelected ? <View style={style.tabInc} /> : null}
			</Pressable>
		);
	};

	const renderTab = (tab, index) => {
		const isSelected = currentPagerTab === index;
		const color = isSelected ? colors.text : colors.holderColor;
		const fontWeight = isSelected ? weights.semibold : weights.normal;
		return (
			<Pressable
				key={tab.name}
				onPress={() => setCurrentPagerTab(index)}
				style={style.tab}
			>
				<Text style={[style.tabTitle, { color, fontWeight }]}>{tab.name}</Text>
				{isSelected ? <View style={style.tabInc} /> : null}
			</Pressable>
		);
	};

	const renderTabContent = () => {
		if (!festivalDateId) {
			return null;
		}
		switch (currentPagerTab) {
			case 0:
				return (
					<PaymentTab currency={currency} festivalDateId={festivalDateId} />
				);
			case 1:
				return <SubmissionTab festivalDateId={festivalDateId} />;
			case 2:
				return <ReportTab festivalDateId={festivalDateId} />;
		}
	};

	return (
		<View style={style.main}>
			<Preloader
				onRetry={handleRetry}
				hasError={error}
				isBusy={loading}
				isEmpty={false}
				CustomLoader={DashboardShimmer}
			>
				<View style={style.content}>
					<View style={style.imageCover}>
						<Image
							hash={summaryData.coverHash}
							url={summaryData.festival.coverUrl}
							style={style.imageCover}
						/>
						<View style={style.coverOverlay} />
					</View>
					<View style={style.logoCover}>
						<View style={style.logoHolder}>
							<Image
								style={style.logo}
								url={summaryData.festival.logoUrl}
								hash={summaryData.festival.logoHash}
							/>
						</View>
						<Text numberOfLines={1} style={style.festivalTitle}>
							{summaryData.festival.name}
						</Text>
					</View>
					<View style={style.scrollContent}>
						<ScrollView stickyHeaderIndices={[2]}>
							<View style={style.overlayCover} />
							<View style={style.summaryCover}>
								<View style={style.summaryHeader}>
									{summaryTabs.map(renderSummaryTab)}
								</View>
								<View style={style.summaryRow}>
									<Text style={style.summaryKey}>Submissions</Text>
									<Text style={style.summaryValue}>
										{seasonSummary?.submissionCount}
									</Text>
								</View>
								<View style={style.summaryRow}>
									<Text style={style.summaryKey}>Total Gross</Text>
									<Text style={style.summaryValue}>
										{currency}
										{seasonSummary?.totalGross}
									</Text>
								</View>
								<View style={style.summaryRow}>
									<Text style={style.summaryKey}>Total Net</Text>
									<Text style={style.summaryValue}>
										{currency}
										{seasonSummary?.totalNet}
									</Text>
								</View>
							</View>
							<View>
								<View style={style.tabCover}>{pagerTabs.map(renderTab)}</View>
							</View>
							<View style={style.pagerContent}>{renderTabContent()}</View>
						</ScrollView>
					</View>
				</View>
			</Preloader>
			<Header
				onSeasonChange={handleChangeSeason}
				seasons={summaryData?.festival?.festivalSeasons}
			/>
		</View>
	);
};

const Header = ({ seasons = [], onSeasonChange }) => {
	const { colors, dark } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					flexDirection: 'row',
					width: WINDOW_WIDTH,
					height: HEADER_HEIGHT,
					position: 'absolute',
					top: 0,
					bottom: 0,
					alignItems: 'flex-end',
				},
				backButton: {
					height: 50,
					width: 50,
					justifyContent: 'center',
					alignItems: 'center',
				},
				backIcon: {
					height: 30,
					width: 30,
					justifyContent: 'center',
					alignItems: 'center',
					borderRadius: 100,
					backgroundColor: colors.bgTrans69,
				},
				content: {
					flex: 1,
					height: 50,
					justifyContent: 'center',
				},
				seasonText: {
					fontSize: fonts.small,
					color: colors.buttonTxt,
					fontWeight: weights.semibold,
				},
				changeText: {
					fontSize: fonts.small,
					color: colors.shimmerColor,
				},
			}),
		[colors]
	);
	const seasonOptions = useMemo(
		() =>
			seasons.map((season) => {
				const start = moment(season.openingDate).format(MMMYYYY);
				const end = moment(season.festivalEnd).format(MMMYYYY);
				const title = `${start} - ${end}`;
				return {
					id: season.id,
					title,
				};
			}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[seasons.length]
	);
	const navigation = useNavigation();

	const [currentSeason, setCurrentSeason] = useState(null);
	useEffect(() => {
		if (!currentSeason && seasonOptions.length > 0) {
			setCurrentSeason(seasonOptions[0]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [seasonOptions.length]);

	const navBack = () => {
		navigation.goBack();
	};

	const changeSeason = () => {
		if (!seasonOptions.length) {
			return;
		}
		const values = seasonOptions.map((season) => ({
			value: season.title,
			type: 0,
			id: season.id,
		}));
		RNSelectionMenu.Show({
			values,
			selectedValues: [''],
			selectionType: 0,
			presentationType: 1,
			theme: dark ? 1 : 0,
			title: 'Select Option',
			onSelection: (value) => {
				const season = values.find((v) => v.value === value);
				onSeasonChange(season.id);
			},
		});
	};

	return (
		<View style={style.main}>
			<Pressable onPress={navBack} style={style.backButton}>
				<View style={style.backIcon}>
					<FeatherIcon size={22} color={colors.buttonTxt} name="arrow-left" />
				</View>
			</Pressable>
			<Pressable onPress={changeSeason} style={style.content}>
				<Text style={style.seasonText}>{currentSeason?.title}</Text>
				{currentSeason ? (
					<Text style={style.changeText}>
						Change Season <FeatherIcon name="chevron-down" />
					</Text>
				) : null}
			</Pressable>
		</View>
	);
};

const DashboardShimmer = () => {
	const { colors } = useTheme();
	const style = StyleSheet.create({
		content: {
			width: WINDOW_WIDTH,
			height: COVER_IMAGE_HEIGHT + 80,
			borderBottomWidth: 1,
			borderColor: colors.border,
			backgroundColor: colors.card,
		},
		cover: {
			backgroundColor: colors.shimmerColor,
			width: WINDOW_WIDTH,
			height: COVER_IMAGE_HEIGHT,
		},
		logo: {
			width: LOGO_SIZE,
			height: LOGO_SIZE,
			borderWidth: 3,
			borderRadius: 10,
			borderColor: colors.card,
			backgroundColor: colors.shimmerColor,
			marginTop: -30,
			alignSelf: 'center',
		},
	});
	return (
		<Shimmer>
			<View style={style.content}>
				<View style={style.cover} />
				<View style={style.logo} />
			</View>
		</Shimmer>
	);
};

export default Dashboard;
