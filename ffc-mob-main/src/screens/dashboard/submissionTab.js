import React, { useMemo, useState, useEffect } from 'react';
import { View, Image as RNImage, StyleSheet, Pressable } from 'react-native';
import Preloader from 'components/preloader/basic';
import { DataList } from './shared';

// Hooks
import { useTheme } from '@react-navigation/native';

// Constants
import { WINDOW_WIDTH, STATIC_URL, MAP_ASPECT_RATIO } from 'utils/constants';

// Functions
import Backend from 'backend';
import moment from 'moment';

const worldMap = require('assets/images/map.png');
const worldMapHeight = WINDOW_WIDTH / MAP_ASPECT_RATIO;

const SubmissionTab = ({ currency, festivalDateId }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				worldMap: {
					backgroundColor: colors.card,
					marginTop: 10,
					width: WINDOW_WIDTH,
					height: worldMapHeight,
					tintColor: colors.shimmerColor,
				},
				worldMapOverlay: {
					marginTop: 10,
					width: WINDOW_WIDTH,
					height: worldMapHeight,
					position: 'absolute',
				},
			}),
		[colors]
	);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);
	const [submissionData, setSubmissionData] = useState({
		submissionByCountries: [],
		submissionByCategories: [],
		countryCount: 0,
		categoryCount: 0,
	});

	const loadSummary = async () => {
		try {
			setLoading(true);
			setError(false);
			const response = await Backend.Dashboard.submissionSummary({
				festivalDateId,
			});
			if (response?.success) {
				formatResponse(response?.data || {});
			} else {
				throw new Error(response?.message);
			}
		} catch (err) {
			setError(true);
		} finally {
			setLoading(false);
		}
	};

	const formatResponse = (data) => {
		const {
			submissionMapUrl,
			submissionByCountries = [],
			submissionByCategories = [],
		} = data;
		let countryCount = 0;
		let categoryCount = 0;

		if (submissionByCountries.length) {
			countryCount = submissionByCountries[0].totalCount;
		}

		if (submissionByCategories.length) {
			categoryCount = submissionByCategories[0].totalCount;
		}

		const countries = submissionByCountries.map((cty) => ({
			value: cty.submissionCount,
			title: cty.countryName,
		}));

		const categories = submissionByCategories.map((category) => ({
			title: category.categoryName,
			value: category.submissionCount,
		}));

		setSubmissionData({
			countryCount,
			categoryCount,
			submissionMapUrl,
			submissionByCountries: countries,
			submissionByCategories: categories,
		});
	};

	useEffect(() => {
		loadSummary();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<View>
			<Preloader
				onRetry={loadSummary}
				hasError={error}
				isBusy={loading}
				isEmpty={false}
			>
				<Pressable>
					<RNImage
						resizeMode="contain"
						source={worldMap}
						style={style.worldMap}
					/>
					<RNImage
						resizeMode="contain"
						source={{ uri: STATIC_URL + submissionData.submissionMapUrl }}
						style={style.worldMapOverlay}
					/>
				</Pressable>

				<DataList
					type="country submissions"
					title="Submissions by country"
					data={submissionData.submissionByCountries}
					totalCount={submissionData.countryCount}
				/>
				<DataList
					type="category submissions"
					title="Submissions by category"
					data={submissionData.submissionByCategories}
					totalCount={submissionData.categoryCount}
				/>
			</Preloader>
		</View>
	);
};

export default SubmissionTab;