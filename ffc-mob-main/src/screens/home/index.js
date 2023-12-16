import React, { useMemo, useState, useEffect } from 'react';
import {
	View,
	StyleSheet,
	Text,
	ScrollView,
	Image as RNImage,
	RefreshControl,
	Pressable,
} from 'react-native';

// Components
import Shimmer from 'react-native-shimmer';
import Preloader from 'components/preloader/basic';
import SubmissionCard from 'components/submission/card';
import HeaderHome from 'components/header/home';
import Image from 'components/image';
import Button from 'components/button';

// Hooks
import { useTheme } from '@react-navigation/native';

// Functions
import Backend from 'backend';
import Tinode from 'libs/tinode';

// Constants
import { WINDOW_WIDTH, W95 } from 'utils/constants';
import { fonts, weights } from 'themes/topography';
import {
	boy_with_form,
	complete_form,
	document_form,
} from 'assets/remoteImages';

const Home = ({ navigation }) => {
	// Style
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					flex: 1,
				},
				header: {
					width: WINDOW_WIDTH,
					height: 285,
					borderBottomWidth: 1,
					borderColor: colors.border,
					backgroundColor: colors.card,
				},
				headerRow: {
					flexDirection: 'row',
					paddingTop: 20,
					paddingHorizontal: 15,
					width: WINDOW_WIDTH,
				},
				logo: {
					width: 90,
					height: 90,
					marginRight: 10,
					borderRadius: 10,
					overflow: 'hidden',
					backgroundColor: colors.background,
				},
				content: {
					flex: 1,
					paddingTop: 5,
				},
				title: {
					fontSize: fonts.title,
					color: colors.text,
					fontWeight: 'bold',
				},
				seasonText: {
					fontSize: fonts.small,
					marginTop: 2,
					color: colors.holderColor,
					fontWeight: weights.medium,
				},
				statRow: {
					flexDirection: 'row',
					paddingHorizontal: 20,
					marginTop: 14,
					marginBottom: 5,
				},
				statBox: {
					width: '45%',
				},
				statField: {
					marginBottom: 10,
				},
				statValue: {
					fontWeight: 'bold',
					fontSize: 16,
					color: colors.text,
					marginTop: 5,
				},
				statTitle: {
					fontSize: fonts.small,
					color: colors.holderColor,
					fontWeight: weights.medium,
				},
				tabCover: {
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					flex: 1,
					paddingHorizontal: 20,
					borderTopWidth: 1,
					borderColor: colors.border,
				},
				tabRight: {
					flexDirection: 'row',
				},
				tabText: {
					marginRight: 40,
					fontSize: 15,
					color: colors.holderColor,
					fontWeight: '500',
				},
				viewText: {
					fontSize: 15,
					color: colors.primary,
					fontWeight: '500',
				},
				gap: {
					height: 20,
				},
				placeholder: {
					fontSize: fonts.small,
					color: colors.holderColor,
					marginTop: 20,
					textAlign: 'center',
				},
				button: {
					marginTop: 20,
					width: 140,
					height: 30,
				},
				buttonTxt: {
					fontSize: fonts.small,
				},
				illustration: {
					height: 150,
					width: 150,
				},
				createNewCover: {
					paddingVertical: 50,
					backgroundColor: colors.card,
					alignItems: 'center',
				},
				viewButton: {
					height: 40,
					width: W95,
					alignSelf: 'center',
					marginTop: 15,
				},
				viewButtonText: {
					fontSize: fonts.small,
				},
			}),
		[colors]
	);

	// State Data
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [data, setData] = useState(null);

	const invalidateTinode = async (td) => {
		if (td) {
			Tinode.initClient(td.u, td.p);
		} else if (data?.tinodeData) {
			Tinode.initClient(data.tinodeData.u, data.tinodeData.p);
		}
	};

	const loadFestival = async (isRefresh = null) => {
		try {
			if (isRefresh !== 'yes' || data === null) {
				setLoading(true);
				setError(false);
			}
			const response = await Backend.Festival.home();
			if (response?.success) {
				setData(response.data);
				if (response.data?.tinodeData) {
					invalidateTinode(response.data.tinodeData);
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

	const showFestival = () => {
		navigation.navigate('FestivalView');
	};

	const showDashboard = () => {
		navigation.navigate('Dashboard');
	};

	const showFestivalSubmissions = () => {
		navigation.navigate('FestivalSubmissions', {
			festivalId: data.id,
		});
	};

	const navToCreateFestival = () => {
		navigation.navigate('FestivalCreate');
	};


	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			loadFestival('yes');
		});
		return unsubscribe;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const renderSubmission = (item, index) => (
		<SubmissionCard width={W95} data={item} key={index} />
	);

	const renderFestival = () => {
		return (
			<>
				<View style={style.header}>
					<View style={style.header}>
						<View style={style.headerRow}>
							<Image
								url={data.logoUrl}
								hash={data.logoHash}
								style={style.logo}
							/>

							<View style={style.content}>
								<Text style={style.title}>{data.title}</Text>
								<Text style={style.seasonText}>{data.seasonText}</Text>
							</View>
						</View>

						<Pressable onPress={showDashboard} style={style.statRow}>
							<View style={style.statBox}>
								<StatRow
									title="Total Gross"
									value={data.totalGross}
									color={colors.text}
									currency={data.currency}
									style={style}
								/>
								<StatRow
									title="Total Net"
									value={data.totalNet}
									color={colors.primary}
									currency={data.currency}
									style={style}
								/>
							</View>
							<View style={style.statBox}>
								<StatRow
									title="Settled"
									value={data.amountSettled}
									color={colors.greenDark}
									currency={data.currency}
									style={style}
								/>
								<StatRow
									title="Remaining"
									value={data.amountRemaining}
									color={colors.darkOrange}
									currency={data.currency}
									style={style}
								/>
							</View>
						</Pressable>

						<View style={style.tabCover}>
							<View style={style.tabRight}>
								<Text style={style.tabText}>Payouts</Text>
								<Text onPress={showFestivalSubmissions} style={style.tabText}>
									Submissions
								</Text>
							</View>

							<Text onPress={showFestival} style={style.viewText}>
								View
							</Text>
						</View>
					</View>
				</View>
				{data.submissions.map(renderSubmission)}
				<Button
					type={Button.SECONDARY}
					text="View All Submissions"
					style={style.viewButton}
					textStyle={style.viewButtonText}
				/>
			</>
		);
	};

	const renderNewFestival = () => {
		return (
			<View style={style.createNewCover}>
				<RNImage
					style={style.illustration}
					source={{ uri: boy_with_form }}
					resizeMode="contain"
				/>
				<Text style={style.placeholder}>
					Get Started by creating your festival
				</Text>
				<Button
					style={style.button}
					text="Create New Festival"
					type={Button.OUTLINE_PRIMARY}
					textStyle={style.buttonTxt}
					onPress={navToCreateFestival}
				/>
			</View>
		);
	};

	const renderFestivalPending = () => {
		return (
			<View style={style.createNewCover}>
				<RNImage
					style={style.illustration}
					source={{ uri: complete_form }}
					resizeMode="contain"
				/>
				<Text style={style.placeholder}>
					Fill all festival details to receive submissions
				</Text>
				<Button
					style={style.button}
					text="Countine Editing"
					type={Button.OUTLINE_PRIMARY}
					textStyle={style.buttonTxt}
					onPress={navToCreateFestival}
				/>
			</View>
		);
	};

	const renderFestivalVerification = () => {
		return (
			<View style={style.createNewCover}>
				<RNImage
					style={style.illustration}
					source={{ uri: document_form }}
					resizeMode="contain"
				/>
				<Text style={style.placeholder}>
					We are currently in the process of verifying your festival. Rest
					assured, we will keep you informed through both email and mobile app
					notifications. Stay tuned for updates!
				</Text>
				<Button
					style={style.button}
					text="View Festival"
					type={Button.OUTLINE_PRIMARY}
					textStyle={style.buttonTxt}
					onPress={showFestival}
				/>
			</View>
		);
	};

	const renderContent = () => {
		if (!data) {
			return renderNewFestival();
		} else if (!data.isPublished) {
			return renderFestivalPending();
		} else if (!data.isVerified) {
			return renderFestivalVerification();
		} else {
			return renderFestival();
		}
	};

	return (
		<View style={style.main}>
			<HeaderHome />
			<ScrollView
				refreshControl={
					<RefreshControl refreshing={false} onRefresh={loadFestival} />
				}
				showsVerticalScrollIndicator={false}
			>
				<Preloader
					onRetry={loadFestival}
					hasError={error}
					isBusy={loading}
					isEmpty={false}
					CustomLoader={FestivalShimmer}
				>
					{renderContent()}
				</Preloader>
				<View style={style.gap} />
			</ScrollView>
		</View>
	);
};

const StatRow = ({ title, value, color, currency, style }) => (
	<View style={style.statField}>
		<Text style={style.statTitle}>{title}</Text>
		<Text style={[style.statValue, { color }]}>
			{currency}
			{value}
		</Text>
	</View>
);

const FestivalShimmer = () => {
	const { colors } = useTheme();
	const style = StyleSheet.create({
		header: {
			width: WINDOW_WIDTH,
			height: 285,
			borderBottomWidth: 1,
			borderColor: colors.border,
			backgroundColor: colors.card,
		},
		headerRow: {
			flexDirection: 'row',
			paddingTop: 20,
			paddingHorizontal: 15,
			width: WINDOW_WIDTH,
		},
		logo: {
			width: 90,
			height: 90,
			marginRight: 10,
			borderRadius: 10,
			backgroundColor: colors.shimmerColor,
		},
		content: {
			flex: 1,
			paddingTop: 5,
		},
		title: {
			width: '60%',
			height: 30,
			backgroundColor: colors.shimmerColor,
		},
		seasonText: {
			marginTop: 2,
			width: '40%',
			height: 20,
			backgroundColor: colors.shimmerColor,
		},
		statRow: {
			flexDirection: 'row',
			paddingHorizontal: 20,
			marginTop: 14,
			marginBottom: 5,
		},
		statBox: {
			width: '45%',
		},
		statField: {
			marginBottom: 10,
		},
		statValue: {
			height: 25,
			width: 100,
			marginTop: 4,
			backgroundColor: colors.shimmerColor,
		},
		statTitle: {
			height: 15,
			width: 70,
			backgroundColor: colors.shimmerColor,
		},
		tabCover: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			flex: 1,
			paddingHorizontal: 20,
			borderTopWidth: 1,
			borderColor: colors.border,
		},
		tabRight: {
			flexDirection: 'row',
		},
		tabText: {
			height: 15,
			width: 50,
			backgroundColor: colors.shimmerColor,
		},
	});
	return (
		<Shimmer>
			<View style={style.header}>
				<View style={style.headerRow}>
					<View style={style.logo} />

					<View style={style.content}>
						<View style={style.title} />
						<View style={style.seasonText} />
					</View>
				</View>

				<View style={style.statRow}>
					<View style={style.statBox}>
						<ShimmerStat style={style} />
						<ShimmerStat style={style} />
					</View>
					<View style={style.statBox}>
						<ShimmerStat style={style} />
						<ShimmerStat style={style} />
					</View>
				</View>

				<View style={style.tabCover}>
					<View style={style.tabRight}>
						<View style={style.tabText} />
						<View style={style.tabText} />
						<View style={style.tabText} />
					</View>

					<View style={style.tabText} />
				</View>
			</View>
		</Shimmer>
	);
};

const ShimmerStat = ({ title, value, color, currency, style }) => (
	<View style={style.statField}>
		<View style={style.statTitle} />
		<View style={style.statValue} />
	</View>
);

export default Home;