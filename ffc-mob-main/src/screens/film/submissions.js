import React, { useMemo, useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

// Components
import SearchableHeader from 'components/header/searchable';
import OptionInput from 'components/input/simpleOption';
import SubmissionCard from 'components/submission/filmCard';
import SubmissionOverview from 'components/submission/overview';
import Preloader from 'components/preloader/basic';

// Constants
import { WINDOW_WIDTH, W95 } from 'utils/constants';
import { fonts } from 'themes/topography';

// Functions
import Backend from 'backend';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

// Hooks
import { useTheme, useNavigation } from '@react-navigation/native';

const FilmSubmissions = () => {
	const { colors } = useTheme();
	const { navigation } = useNavigation();
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
				optionCover: {
					backgroundColor: colors.card,
					borderBottomWidth: 1,
					borderColor: colors.border,
					height: 50,
					width: WINDOW_WIDTH,
					flexDirection: 'row',
					paddingHorizontal: 10,
					alignItems: 'center',
				},
				optionInput: {
					height: 34,
					marginRight: 15,
					borderRadius: 20,
				},
				optionFont: {
					fontSize: fonts.small,
				},
			}),
		[colors]
	);

	const [submissions, setSubmissions] = useState([]);
	const [submissionOverviewData, setSubmissionOverviewData] = useState({
		visible: false,
		data: {},
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [statusList] = useState([
		{
			label: 'All Status',
			value: null,
		},
	]);
	const [projectList] = useState([
		{
			label: 'All Projects',
			value: null,
		},
	]);

	const loadSubmissions = async () => {
		try {
			setLoading(true);
			setError(false);
			const response = await Backend.Film.submissions();
			if (response?.success) {
				setSubmissions(response.data);
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

	useEffect(() => {
		loadSubmissions();
	}, []);

	const backPress = () => {};

	const handleChangeText = () => {};

	const createNewProject = () => {
		navigation.navigate('FilmCreate');
	};

	const renderFilmCard = ({ item }) => {
		return (
			<SubmissionCard
				onPress={() =>
					setSubmissionOverviewData({
						data: item,
						visible: true,
					})
				}
				width={W95}
				data={item}
			/>
		);
	};

	return (
		<View style={style.main}>
			<SearchableHeader
				placeholder="Search Films"
				onBackPress={backPress}
				onChangeText={handleChangeText}
			/>
			<View style={style.optionCover}>
				<OptionInput
					style={style.optionInput}
					textStyle={style.optionFont}
					onSelect={(sr) => {
						// onNewData({ filmColorId: sr });
					}}
					selectedValue={null}
					options={statusList}
					title="Submission Statues"
				/>

				<OptionInput
					style={style.optionInput}
					textStyle={style.optionFont}
					onSelect={(sr) => {
						// onNewData({ filmColorId: sr });
					}}
					selectedValue={null}
					options={projectList}
					title="Projects"
				/>
			</View>
			<Preloader
				onRetry={loadSubmissions}
				hasError={error}
				isBusy={loading}
				isEmpty={!submissions?.length}
				emptyText="No projects available"
				emptyIcon="film"
				onEmptyPress={createNewProject}
			>
				<FlatList
					showsVerticalScrollIndicator={false}
					contentContainerStyle={style.content}
					refreshing={false}
					data={submissions}
					onRefresh={loadSubmissions}
					renderItem={renderFilmCard}
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

export default gestureHandlerRootHOC(FilmSubmissions);
