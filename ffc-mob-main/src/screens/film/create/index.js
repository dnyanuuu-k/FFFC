import React, {
	useEffect,
	useMemo,
	useState,
	useRef,
	useCallback,
} from 'react';
import {
	Text,
	ScrollView,
	RefreshControl,
	StyleSheet,
	View,
	TouchableOpacity,
} from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import FeatherIcon from 'react-native-vector-icons/Feather';
import BasicHeader from 'components/header/basic';
import AnimatedBar from 'components/animated/bar';
import SectionText from './sectionText';
// Hooks
import { useTheme } from '@react-navigation/native';

// Constants
import {
	WINDOW_WIDTH,
	BUTTON_HEIGHT,
	BORDER_RADIUS,
	ERROR_TEXT,
} from 'utils/constants';
import { fonts, weights } from 'themes/topography';
import Backend from 'backend';

// Functions
import toast from 'libs/toast';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

const sectionContentWidth = WINDOW_WIDTH * 0.9;
const tabButtonWidth = WINDOW_WIDTH - (30 + 65);
const snapPoints = ['50%', '70%'];
const CreateFilm = ({ route, navigation }) => {
	const { colors } = useTheme();
	const [loading, setLoading] = useState(false);
	const opacity = loading ? 0.5 : 1;
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					width: WINDOW_WIDTH,
					borderColor: colors.border,
					height: '100%',
					alignItems: 'center',
				},
				content: {
					backgroundColor: colors.card,
					width: WINDOW_WIDTH,
					alignItems: 'center',
					paddingTop: 20,
					paddingBottom: 30,
				},
				subTitle: {
					width: sectionContentWidth,
					fontSize: fonts.small,
					fontWeight: 400,
					color: colors.holderColor,
				},
				tabCard: {
					height: BUTTON_HEIGHT,
					width: sectionContentWidth,
					justifyContent: 'space-between',
					flexDirection: 'row',
					alignItems: 'center',
					marginTop: 20,
				},
				tabSr: {
					height: 40,
					width: 40,
					borderRadius: 100,
					justifyContent: 'center',
					alignItems: 'center',
				},
				tabButton: {
					borderWidth: 1,
					borderRadius: BORDER_RADIUS,
					width: tabButtonWidth,
					height: BUTTON_HEIGHT,
					justifyContent: 'center',
					paddingLeft: 10,
				},
				tabSRText: {
					fontSize: 16,
					fontWeight: 600,
				},
				tabText: {
					fontSize: 18,
					fontWeight: 500,
				},
				footerButton: {
					position: 'absolute',
					bottom: 0,
					width: WINDOW_WIDTH,
					height: 50,
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: colors.primary,
				},
				footerButtonText: {
					fontSize: fonts.regular,
					color: colors.buttonTxt,
					fontWeight: weights.semibold,
				},
				issueView: {
					position: 'absolute',
					top: -5,
					right: -5,
					paddingHorizontal: 10,
					paddingVertical: 3,
					backgroundColor: colors.rubyRed,
					borderRadius: 5,
				},
				issueCount: {
					fontSize: fonts.small,
					fontWeight: weights.semibold,
					color: colors.buttonTxt,
				},
				issueBox: {
					width: '90%',
					alignSelf: 'center',
				},
				issueTitle: {
					fontSize: fonts.small,
					fontWeight: weights.bold,
					color: colors.text,
					marginTop: 10,
				},
				issueText: {
					fontSize: fonts.small,
					color: colors.rubyRed,
					marginTop: 10,
				},
				row: {
					flexDirection: 'row',
					alignItems: 'center',
				},
			}),
		[colors]
	);
	const { filmId } = route?.params || {};
	const bottomSheetRef = useRef(null);
	const [tabs, setTabs] = useState([]);
	const tabIssues = useMemo(() => {
		const list = [];
		tabs.forEach((tab, index) => {
			if (tab.issues.length) {
				list.push({ ...tab, stage: index + 1 });
			}
		});
		return list;
	}, [tabs]);
	const headerTitle = `${filmId ? 'Edit' : 'Create New'} Project`;

	const navigateToScreen = (screenIndex) => {
		switch (screenIndex) {
			case 1:
				nav('FilmDetails');
				break;
			case 2:
				nav('FilmSubmitter');
				break;
			case 3:
				nav('FilmCredits');
				break;
			case 4:
				nav('FilmSpecifications');
				break;
			case 5:
				nav('FilmScreenings');
				break;
			default:
				// Ignore
				break;
		}
	};

	const nav = (screen) => {
		if (loading) {
			return;
		}
		navigation.navigate(screen, {
			id: filmId,
		});
	};

	const loadFilmSteps = async () => {
		try {
			setLoading(true);
			const response = await Backend.Film.generateFilmStages({
				filmId,
			});
			if (response?.success) {
				setTabs(response.data.tabs);
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (tryErr) {
			toast.error(tryErr.message);
			navigation.goBack();
		} finally {
			setLoading(false);
		}
	};

	const viewIssue = (id) => {
		bottomSheetRef.current.snapToIndex(0);
	};

	const viewProject = () => {
		navigation.navigate('FilmView', {
			filmId,
		});
	};

	useEffect(() => {
		loadFilmSteps();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const renderTab = ({ completed, stared, title, id, issues }) => {
		const backgroundColor = completed ? colors.greenLight : colors.card;
		const borderColor = completed ? colors.green : colors.border;
		const color = completed ? colors.greenDark : colors.holderColor;
		const hasIssue = issues?.length || false;
		const issueText = `${hasIssue} Issue${hasIssue > 1 ? 's' : ''}`;
		return (
			<TouchableOpacity
				onPress={() => navigateToScreen(id)}
				key={id}
				style={[style.tabCard, { opacity }]}
			>
				<View style={[style.tabSr, { backgroundColor: borderColor }]}>
					{completed ? (
						<FeatherIcon
							name={stared ? 'star' : 'check'}
							color={colors.card}
							size={22}
						/>
					) : stared ? (
						<FeatherIcon
							name={'star'}
							color={completed ? colors.card : colors.holderColor}
							size={22}
						/>
					) : (
						<Text style={[style.tabSRText, { color: colors.holderColor }]}>
							{id}
						</Text>
					)}
				</View>
				<View style={[style.tabButton, { backgroundColor, borderColor }]}>
					<Text numberOfLines={1} style={[style.tabText, { color }]}>
						{title}
					</Text>
				</View>

				{hasIssue ? (
					<TouchableOpacity
						onPress={() => viewIssue(id)}
						style={style.issueView}
					>
						<Text style={style.issueCount}>{issueText}</Text>
					</TouchableOpacity>
				) : null}
			</TouchableOpacity>
		);
	};

	const renderBackdrop = useCallback(
		(props) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
			/>
		),
		[]
	);

	return (
		<View style={style.main}>
			<BasicHeader title={headerTitle} />
			<AnimatedBar height={3} width={WINDOW_WIDTH} busy={loading} />
			<ScrollView
				refreshControl={
					<RefreshControl refreshing={false} onRefresh={loadFilmSteps} />
				}
			>
				<View style={style.content}>
					<Text style={style.subTitle}>
						Complete below steps & submit project!
					</Text>
					{tabs.map(renderTab)}
				</View>
			</ScrollView>
			{filmId ? (
				<TouchableOpacity
					activeOpacity={1}
					onPress={viewProject}
					style={[style.footerButton, { opacity }]}
				>
					<Text style={style.footerButtonText}>View Project</Text>
				</TouchableOpacity>
			) : null}

			<BottomSheet
				ref={bottomSheetRef}
				enablePanDownToClose
				index={-1}
				backdropComponent={renderBackdrop}
				snapPoints={snapPoints}
			>
				<View style={style.issueBox}>
					{tabIssues.map((tab, i1) => (
						<View key={i1}>
							<SectionText text={tab.title} subText={`Section ${tab.stage}`} />
							{tab.issues.map((issueText, i2) => (
								<View style={style.row} key={i2}>
									<Text style={style.issueText}>• </Text>
									<Text style={style.issueText}>{issueText}</Text>
								</View>
							))}
						</View>
					))}
				</View>
			</BottomSheet>
		</View>
	);
};

export default gestureHandlerRootHOC(CreateFilm);