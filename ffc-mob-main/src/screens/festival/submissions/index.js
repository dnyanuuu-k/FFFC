import React, { useMemo, useRef, useState, useEffect } from 'react';
import { View, Pressable, Text, StyleSheet, FlatList } from 'react-native';

// Components
import Basic from 'components/header/basic';
import OptionInput from 'components/input/simpleOption';
import SubmissionCard from 'components/submission/card';
import SubmissionOverview from 'components/submission/overview';
import Preloader from 'components/preloader/basic';
import Input from 'components/input';
import FeatherIcon from 'react-native-vector-icons/Feather';

// Constants
import { WINDOW_WIDTH, W95, MMMMYYYY } from 'utils/constants';
import { fonts, weights } from 'themes/topography';
import { SUBMISSION_STATUS_LIST, JUDGE_STATUS_LIST } from 'utils/submission';

// Functions
import Backend from 'backend';
import { RNSelectionMenu } from 'libs/Menu';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import moment from 'moment';
import toast from 'libs/toast';

// Hooks
import { useTheme } from '@react-navigation/native';

const optionWidth = WINDOW_WIDTH / 2.1;
const inputWidth = WINDOW_WIDTH * 0.97;

const FestivalSubmissions = ({ navigation, route }) => {
	const { colors, dark } = useTheme();
	const searchRef = useRef();
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					flex: 1,
					backgroundColor: colors.background,
				},
				content: {
					paddingBottom: 10,
				},
				optionInput: {
					height: 38,
					width: optionWidth,
					borderRadius: 5,
					marginBottom: 10,
				},
				optionFont: {
					fontSize: fonts.small,
					paddingLeft: 0,
				},
				textInput: {
					fontSize: fonts.small,
				},
				searchCover: {
					paddingVertical: 10,
					backgroundColor: colors.card,
					width: WINDOW_WIDTH,
					paddingHorizontal: 5,
					borderBottomWidth: 1,
					borderColor: colors.border,
				},
				optionCover: {
					paddingTop: 10,
					backgroundColor: colors.card,
					width: WINDOW_WIDTH,
					flexDirection: 'row',
					paddingHorizontal: 5,
					justifyContent: 'space-between',
					flexWrap: 'wrap',
				},
				searchInput: {
					width: inputWidth,
					height: 38,
					alignSelf: 'center',
					padding: 0,
					fontSize: fonts.small,
				},
				seasonRow: {
					height: 40,
					borderTopWidth: 1,
					borderBottomWidth: 1,
					borderColor: colors.border,
					flexDirection: 'row',
					paddingHorizontal: 10,
					alignItems: 'center',
					justifyContent: 'space-between',
					backgroundColor: colors.card,
				},
				seasonText: {
					fontSize: fonts.small,
					color: colors.text,
				},
				seasonValue: {
					fontWeight: weights.bold,
				},
				icon: {
					height: 30,
					width: 30,
					justifyContent: 'center',
					alignItems: 'center',
				},
				paginatorRow: {
					backgroundColor: colors.card,
				},
				emptyText: {
					fontSize: fonts.small,
					marginTop: 60,
					color: colors.holderColor,
					textAlign: 'center',
				},
			}),
		[colors]
	);
	const festivalId = route.params.festivalId;
	const [selectedSeason, setSelectedSeason] = useState({
		title: 'Loading...',
	});
	const [seasonOptions, setSeasonOptions] = useState([]);
	const [filterData, setFilterData] = useState({});
	const [submissions, setSubmissions] = useState([]);
	const [tempSubmissions, setTempSubmissions] = useState([]);
	const [submissionOverviewData, setSubmissionOverviewData] = useState({
		visible: false,
		data: {},
	});
	const [searchText, setSearchText] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [flagList, setFlagList] = useState([]);
	const [categoryList] = useState([
		{
			label: 'Categories',
			value: null,
		},
	]);

	const showSeasons = () => {
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
			title: 'Select season',
			onSelection: (value) => {
				const idx = values.findIndex((v) => v.value === value);
				selectSeason(seasonOptions[idx]);
			},
		});
	};

	const selectSeason = (season) => {
		setSelectedSeason(season);
		loadFestivalSubmissions(season.id);
	};

	const filterSubmissions = (
		submissionList = [],
		filter = {},
		filtertext = ''
	) => {
		const { judgeStatusId, submissionStatusId, flagId } = filter;
		const filtered = submissionList.filter((submission) => {
			if (
				submissionStatusId &&
				submissionStatusId !== submission.submissionStatus
			) {
				return false;
			}
			if (flagId && flagId !== submission.flagId) {
				return false;
			}

			if (searchText?.length) {
				const titleLower = submission.title?.toLowerCase() || '';
				const textLower = filterText?.toLowerCase() || '';
				if (!titleLower.includes(textLower)) {
					return false;
				}
			}
			return true;
		});
		setSubmissions(filtered);
	};

	const updateFilter = (newData) => {
		const newFilterData = { ...filterData, ...newData };
		setFilterData(newFilterData);
		filterSubmissions(tempSubmissions, newFilterData);
	};

	const loadSubmissionFilters = async () => {
		try {
			setLoading(true);
			setError(false);
			const response = await Backend.Festival.getSubmissionFilters({
				festivalId,
			});
			if (response?.success) {
				const { seasons = [], flags } = response.data || {};
				if (seasons.length) {
					setFlagList(
						flags.map((flag) => ({
							value: flag.id,
							label: flag.title,
						}))
					);
					const mSeasonOptions = seasons.map((season) => {
						const start = moment(season.openingDate).format(MMMMYYYY);
						const end = moment(season.festivalEnd).format(MMMMYYYY);
						const title = `${start} - ${end}`;
						return {
							id: season.id,
							title,
						};
					});
					setSeasonOptions(mSeasonOptions);
					selectSeason(mSeasonOptions[0]);
				} else {
					toast.notify("Your festival didn't have any active season");
					navigation.goBack();
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

	const loadFestivalSubmissions = async (festivalDateId) => {
		try {
			setLoading(true);
			setError(false);
			const response = await Backend.Festival.getSubmissions({
				festivalDateId,
			});
			if (response?.success) {
				setTempSubmissions(response.data);
				filterSubmissions(response.data, filterData);
			} else {
				throw new Error(response?.message);
			}
		} catch (err) {
			setError(true);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadSubmissionFilters();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleChangeText = (text) => {
		clearTimeout(searchRef.current);
		setSearchText(text);
		searchRef.current = setTimeout(() => {
			filterSubmissions(tempSubmissions, filterData, text);
		}, 400);
	};

	const viewSubmission = (submissionId) => {
		navigation.navigate('FilmView', {
			submissionId,
		});
	};

	const renderSubmissionCard = ({ item }) => {
		return (
			<SubmissionCard
				onPress={() => viewSubmission(item.id)}
				width={W95}
				data={item}
			/>
		);
	};

	const renderHeader = () => {
		return (
			<>
				<View style={style.optionCover}>
					<OptionInput
						style={style.optionInput}
						textStyle={style.optionFont}
						onSelect={(id) => {
							updateFilter({
								judgingStatusId: id,
							});
						}}
						addClear
						selectedValue={filterData?.judgingStatusId}
						options={JUDGE_STATUS_LIST}
						placeholder="Juding Status"
						title="Juding Status"
					/>
					<OptionInput
						addClear
						style={style.optionInput}
						textStyle={style.optionFont}
						onSelect={(id) => {
							updateFilter({
								submissionStatusId: id,
							});
						}}
						selectedValue={filterData?.submissionStatusId}
						options={SUBMISSION_STATUS_LIST}
						placeholder="Submission Status"
						title="Submission Status"
					/>

					<OptionInput
						addClear
						style={style.optionInput}
						textStyle={style.optionFont}
						onSelect={(id) => {
							updateFilter({
								flagId: id,
							});
						}}
						selectedValue={filterData?.flagId}
						options={flagList}
						placeholder="Flags"
						title="Flags"
					/>

					<OptionInput
						style={style.optionInput}
						textStyle={style.optionFont}
						onSelect={(sr) => {
							// onNewData({ filmColorId: sr });
						}}
						selectedValue={null}
						options={categoryList}
						title="Categories"
					/>
				</View>
				<Pressable onPress={showSeasons} style={style.seasonRow}>
					<Text style={style.seasonText}>
						Season <Text style={style.seasonValue}>{selectedSeason.title}</Text>
					</Text>

					<View style={style.icon}>
						<FeatherIcon
							color={colors.holderColor}
							size={17}
							name="chevron-down"
						/>
					</View>
				</Pressable>
			</>
		);
	};

	const renderEmptyComponent = () => {
		return <Text style={style.emptyText}>No submissions available</Text>;
	};

	return (
		<View style={style.main}>
			<Basic title="Submissions" />
			<Preloader
				onRetry={loadSubmissionFilters}
				hasError={error}
				isBusy={loading}
				isEmpty={false}
			>
				<View style={style.searchCover}>
					<Input
						style={style.searchInput}
						value={searchText}
						onChangeText={handleChangeText}
						placeholder="Search project"
					/>
				</View>
				<FlatList
					ListHeaderComponent={renderHeader}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={style.content}
					refreshing={false}
					ListEmptyComponent={renderEmptyComponent}
					data={submissions}
					onRefresh={loadSubmissionFilters}
					renderItem={renderSubmissionCard}
				/>
			</Preloader>
			<SubmissionOverview
				onClose={() =>
					setSubmissionOverviewData({
						data: {},
						visible: false,
					})
				}
				data={submissionOverviewData.data}
				visible={submissionOverviewData.visible}
			/>
		</View>
	);
};

export default gestureHandlerRootHOC(FestivalSubmissions);