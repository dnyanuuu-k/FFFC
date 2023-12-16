import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
	View,
	StyleSheet,
	Text,
	ScrollView,
	Image as RNImage,
	RefreshControl,
	TouchableOpacity,
	Pressable,
} from 'react-native';

// Components
import Shimmer from 'react-native-shimmer';
import PagerView from 'react-native-pager-view';
import Preloader from 'components/preloader/basic';
import HeaderHome from 'components/header/home';
import FilmRowCard from 'components/film/rowCard';
import Button from 'components/button';

// Hooks
import { useTheme } from '@react-navigation/native';

// Constants
import {
	WINDOW_WIDTH,
	MAP_ASPECT_RATIO,
	STATIC_URL,
	JUDGE_SELECTED,
	JUDGE_AWARD_WINNER,
	JUDGE_FINALIST,
	BRAND_COLOR,
} from 'utils/constants';
import { fonts, weights } from 'themes/topography';
import { movie_form } from 'assets/remoteImages';

// Functions
import toast from 'libs/toast';
import Backend from 'backend';
import Tinode from 'libs/tinode';
import { RNSelectionMenu } from 'libs/Menu/';

// Image Assets
const worldMap = require('assets/images/map.png');

const filmIcon = require('assets/icons/film.png');
const selectedIcon = require('assets/icons/prize.png');
const winnerIcon = require('assets/icons/award.png');
const finalistIcon = require('assets/icons/medal.png');

// Declared Constants
const worldMapHeight = WINDOW_WIDTH / MAP_ASPECT_RATIO;
const filmTabs = [
	{
		name: 'All Projects',
		type: null,
		icon: filmIcon,
		color: BRAND_COLOR,
	},
	{
		name: 'Selected',
		icon: selectedIcon,
		type: JUDGE_SELECTED.id,
		color: JUDGE_SELECTED.color,
	},
	{
		name: 'Winner',
		icon: winnerIcon,
		type: JUDGE_AWARD_WINNER.id,
		color: JUDGE_AWARD_WINNER.color,
	},
	{
		name: 'Finalist',
		icon: finalistIcon,
		type: JUDGE_FINALIST.id,
		color: JUDGE_FINALIST.color,
	},
];

// const cardWidth = WINDOW_WIDTH * 0.95;
const FilmMakerHome = ({ navigation }) => {
	// Style
	const { colors, dark } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					flex: 1,
				},
				gap: {
					height: 20,
				},
				placeholder: {
					fontSize: fonts.small,
					color: colors.holderColor,
					marginTop: 20,
				},
				topContent: {
					width: WINDOW_WIDTH,
					borderBottomWidth: 1,
					borderColor: colors.border,
					backgroundColor: colors.card,
				},
				worldMap: {
					width: WINDOW_WIDTH,
					height: worldMapHeight,
					tintColor: colors.border,
				},
				worldMapOverlay: {
					width: WINDOW_WIDTH,
					height: worldMapHeight,
					position: 'absolute',
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
					height: 180,
					width: 180,
				},
				createNewCover: {
					paddingVertical: 50,
					backgroundColor: colors.card,
					alignItems: 'center',
				},
				statContent: {
					flexDirection: 'row',
					height: 60,
					justifyContent: 'space-between',
					paddingHorizontal: 15,
					borderBottomWidth: 1,
					borderColor: colors.border,
					alignItems: 'center',
				},
				row: {
					flexDirection: 'row',
					height: 60,
					alignItems: 'center',
				},
				statKey: {
					fontSize: fonts.small,
					color: colors.holderColor,
				},
				statVal: {
					fontSize: fonts.title,
					color: colors.text,
					fontWeight: weights.bold,
				},
				statBox: {
					marginRight: 20,
				},
				pagerHeader: {
					flexDirection: 'row',
					height: 45,
					backgroundColor: colors.card,
					width: WINDOW_WIDTH,
					borderBottomWidth: 1,
					borderColor: colors.border,
					paddingRight: 20,
				},
				pagerTab: {
					height: 45,
					marginLeft: 20,
					flexDirection: 'row',
					alignItems: 'center',
				},
				pagerIcon: {
					width: 22,
					height: 22,
					marginRight: 8,
				},
				pagerText: {
					fontSize: fonts.small,
				},
				pagerInc: {
					height: 3,
					width: '50%',
					left: '30%',
					position: 'absolute',
					bottom: 0.5,
					borderTopLeftRadius: 10,
					borderTopRightRadius: 10,
				},
				emptyText: {
					fontSize: fonts.regular,
					color: colors.holderColor,
					textAlign: 'center',
					marginTop: 100,
				},
				link: {
					fontSize: fonts.xsmall,
					color: colors.primary,
					fontWeight: weights.bold,
				},
			}),
		[colors]
	);

	// State Data
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [data, setData] = useState(null);
	const [currentTab, setCurrentTab] = useState(0);
	const scrollViewRef = useRef();
	const pagerViewRef = useRef();
	const pagerHeight = (data?.films?.length || 0) * 150;

	const invalidateTinode = async (td) => {
		if (td) {
			Tinode.initClient(td.u, td.p);
		} else if (data) {
			Tinode.initClient(data.tinodeData.u, data.tinodeData.p);
		}
	};

	const loadHome = async () => {
		try {
			setLoading(true);
			setError(false);
			const response = await Backend.Film.home();
			if (response?.success) {
				setData(response.data);
				if (response.data?.tinodeData) {
					invalidateTinode(response.data.tinodeData);
				}
			} else {
				throw new Error(response?.message);
			}
		} catch (err) {
			console.log(err);
			setError(true);
		} finally {
			setLoading(false);
		}
	};

	const updateTab = (position, changePage = false) => {
		setCurrentTab(position);
		scrollViewRef.current.scrollTo({ x: position * 100 });
		if (changePage) {
			pagerViewRef.current.setPage(position);
		}
	};

	const createFilmProject = (filmId = null) => {
		navigation.navigate('FilmCreate', {
			filmId,
		});
	};

	const viewSubmissions = () => {
		navigation.navigate('FilmSubmissions');
	};

	const viewFilm = (filmId) => {
		navigation.navigate('FilmView', {
			filmId,
		});
	};

	const viewCountries = () => {
		if (!data.countries?.length) {
			toast.notify(
				'Submission appears here, list of countries is shown once you submit your film to festival'
			);
			return;
		}
		const values = data.countries.map((c) => ({
			value: c.name + ' (' + c.count + ')',
			type: 0,
		}));
		RNSelectionMenu.Show({
			values,
			selectedValues: [''],
			selectionType: 0,
			presentationType: 1,
			theme: dark ? 1 : 0,
			title: 'Countries you have made submissions to',
			subtitle: 'based on countries origin',
			onSelection: () => {},
		});
	};

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			invalidateTinode(false);
		});
		return unsubscribe;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	useEffect(() => {
		loadHome();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const renderHome = () => (
		<ScrollView
			refreshControl={
				<RefreshControl refreshing={false} onRefresh={loadHome} />
			}
			stickyHeaderIndices={[1]}
			showsVerticalScrollIndicator={false}
		>
			<View style={style.topContent}>
				<TouchableOpacity onPress={viewSubmissions} style={style.statContent}>
					<View style={style.row}>
						<View style={style.statBox}>
							<Text style={style.statVal}>{data.submissionCount}</Text>
							<Text style={style.statKey}>Submission</Text>
						</View>
						<View style={style.statBox}>
							<Text style={style.statVal}>{data.selectionCount}</Text>
							<Text style={style.statKey}>Selection</Text>
						</View>
					</View>
					<Text style={style.link}>View Submissions</Text>
				</TouchableOpacity>
				<Pressable onPress={viewCountries}>
					<RNImage
						resizeMode="contain"
						source={worldMap}
						style={style.worldMap}
					/>
					<RNImage
						resizeMode="contain"
						source={{ uri: STATIC_URL + data.submissionMap }}
						style={style.worldMapOverlay}
					/>
				</Pressable>
			</View>
			<View style={style.pagerHeader}>
				<ScrollView horizontal ref={scrollViewRef}>
					{filmTabs.map((tab, index) => (
						<PagerTab
							selectedColor={tab.color}
							unselectedColor={colors.shimmerColor}
							tab={tab}
							style={style}
							key={index}
							onPress={() => updateTab(index, true)}
							selected={index === currentTab}
						/>
					))}
				</ScrollView>
			</View>
			<PagerView
				ref={pagerViewRef}
				onPageSelected={({ nativeEvent: { position } }) => {
					updateTab(position);
				}}
				style={{ height: pagerHeight }}
				initialPage={0}
			>
				{filmTabs.map((tab) => (
					<FilmPager
						emptyText={style.emptyText}
						films={data.films}
						key={tab.name}
						filmType={tab.type}
						onView={viewFilm}
						onEdit={createFilmProject}
					/>
				))}
			</PagerView>
			<View style={style.gap} />
		</ScrollView>
	);

	const renderNewFilm = () => (
		<View style={style.createNewCover}>
			<RNImage
				style={style.illustration}
				source={{ uri: movie_form }}
				resizeMode="contain"
			/>
			<Text style={style.placeholder}>
				Get Started by add your project for free
			</Text>
			<Button
				style={style.button}
				text="Add New Film"
				type={Button.OUTLINE_PRIMARY}
				textStyle={style.buttonTxt}
				onPress={createFilmProject}
			/>
		</View>
	);

	return (
		<View style={style.main}>
			<HeaderHome cartVisible cartCount={data?.cartCount} />
			<Preloader
				onRetry={loadHome}
				hasError={error}
				isBusy={loading}
				isEmpty={false}
				CustomLoader={FilmShimmer}
			>
				{data?.filmCount ? renderHome() : renderNewFilm()}
			</Preloader>
		</View>
	);
};

const FilmShimmer = () => {
	const { colors } = useTheme();
	const style = StyleSheet.create({
		header: {
			width: WINDOW_WIDTH,
			backgroundColor: colors.card,
		},
		worldMap: {
			width: WINDOW_WIDTH,
			height: worldMapHeight,
			tintColor: colors.shimmerColor,
		},
		row: {
			flexDirection: 'row',
			paddingLeft: 10,
			marginTop: 5,
			marginBottom: 5,
		},
		box: {
			marginRight: 20,
		},
		title: {
			height: 25,
			width: 30,
			backgroundColor: colors.shimmerColor,
		},
		desc: {
			height: 15,
			width: 100,
			marginTop: 10,
			backgroundColor: colors.shimmerColor,
		},
		footer: {
			height: 50,
			width: WINDOW_WIDTH,
			borderBottomWidth: 1,
			borderTopWidth: 1,
			borderColor: colors.shimmerColor,
			paddingLeft: 10,
			alignItems: 'center',
			flexDirection: 'row',
		},
		dash: {
			width: 60,
			height: 24,
			marginRight: 20,
			backgroundColor: colors.shimmerColor,
		},
	});
	return (
		<Shimmer>
			<View style={style.header}>
				<View style={style.row}>
					<View style={style.box}>
						<View style={style.title} />
						<View style={style.desc} />
					</View>
					<View style={style.box}>
						<View style={style.title} />
						<View style={style.desc} />
					</View>
				</View>
				<RNImage
					resizeMode="contain"
					source={worldMap}
					style={style.worldMap}
				/>
				<View style={style.footer}>
					<View style={style.dash} />
					<View style={style.dash} />
					<View style={style.dash} />
					<View style={style.dash} />
				</View>
			</View>
		</Shimmer>
	);
};

const PagerTab = ({
	tab,
	selected,
	style,
	selectedColor,
	unselectedColor,
	onPress,
}) => {
	const color = selected ? selectedColor : unselectedColor;
	return (
		<TouchableOpacity onPress={onPress} style={style.pagerTab}>
			<RNImage
				style={[style.pagerIcon, { tintColor: color }]}
				source={tab.icon}
			/>
			<Text style={[style.pagerText, { color }]}>{tab.name}</Text>
			{selected ? (
				<View style={[style.pagerInc, { backgroundColor: color }]} />
			) : null}
		</TouchableOpacity>
	);
};

const FilmPager = ({ films = [], filmType, emptyText, onEdit, onView }) => {
	const visibleFilms = useMemo(() => {
		if (filmType === null) {
			return films;
		}
		return films.filter((f) => f.judgingStatus.indexOf(filmType) !== -1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [films]);
	return visibleFilms.length ? (
		visibleFilms.map((data) => (
			<FilmRowCard
				onEdit={() => {
					onEdit(data.id);
				}}
				onView={() => {
					onView(data.id);
				}}
				film={data}
				key={data.id}
			/>
		))
	) : (
		<Text style={emptyText}>No Projects Found</Text>
	);
};

export default FilmMakerHome;