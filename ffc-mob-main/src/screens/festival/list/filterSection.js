import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import RangeSlider from 'components/rangeSlider';
import Radio from 'components/radio/radio2';
import OptionInput from 'components/input/optionInput';
import DateInput from 'components/input/dateInput';
import MultiOptionInput from 'components/input/multiOptionInput';
import Button from 'components/button';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { fonts, weights } from 'themes/topography';
import { H70, W65, W35 } from 'utils/constants';
//Helper Functions
import Backend from 'backend';
import countryList from 'libs/country/list';
import Country from 'libs/country';

export const ENTRY_SECTION = '1';
export const TAG_SECTION = '2';
export const FOCUS_SECTION = '3';
export const DATE_SECTION = '4';
export const COUNTRY_SECTION = '5';
export const FEE_SECTION = '6';
export const YEAR_SECTION = '7';

export const DATE_OPTIONS = [
	{
		label: 'After',
		value: 'AFTER',
	},
	{
		label: 'Before',
		value: 'BEFORE',
	},
];

const festivalEntries = [
	{
		value: 'all',
		label: 'All',
	},
	{
		value: 'open',
		label: 'Open Only',
	},
	{
		value: 'closed',
		label: 'Closed Only',
	},
];
const SectionData = ({
	filterData = {},
	updateFilter,
	colors,
	currentSection,
	filterCount,
	onApply,
}) => {
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					backgroundColor: colors.background,
					width: W65,
					padding: 10,
					height: '100%',
				},
				content: {
					flex: 1,
				},
				radioBody: {
					marginTop: 0,
					backgroundColor: colors.card,
				},
				gapBottom: {
					height: 100,
				},
				radio: {
					height: 35,
					width: 100,
					marginTop: 15,
					marginRight: 20,
				},
				optionInput: {
					marginBottom: 10,
					backgroundColor: colors.card,
				},
				validFont: {
					fontSize: fonts.small,
				},
				subTitle: {
					fontSize: fonts.small,
					marginBottom: 5,
					fontWeight: weights.semibold,
					color: colors.text,
				},
				marginFix: {
					marginTop: 10,
				},
				applyButton: {
					height: 40,
					bottom: 50,
				},
			}),
		[colors]
	);
	const [currency, setCurrency] = useState({
		symbol: '₹',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [festivalTags, setFestivalTags] = useState([]);
	const [festivalFocus, setFestivalFocus] = useState([]);
	const sectionData = useMemo(() => {
		return filterData[currentSection] || {};
	}, [filterData, currentSection]);

	const initData = async () => {
		try {
			setIsLoading(true);
			const response = await Backend.Metadata.getList();
			if (response.success) {
				const { festivalTagList, festivalFocusList } = response.data;
				setFestivalTags(festivalTagList);
				setFestivalFocus(festivalFocusList);
				setCurrency({
					symbol: '₹',
				});
			} else {
				throw new Error(response?.message);
			}
		} catch (tryErr) {
			// toast.error(tryErr.message);
			// navigation.goBack();
		}
	};

	useEffect(() => {
		initData();
	}, []);

	const renderSection = () => {
		switch (currentSection) {
			case ENTRY_SECTION:
				return (
					<Radio
						options={festivalEntries}
						value={sectionData?.entryType}
						onChange={(v) => {
							updateFilter({ entryType: v });
						}}
						cardStyle={style.radio}
						bodyStyle={style.radioBody}
					/>
				);
			case TAG_SECTION:
				return (
					<Radio
						options={festivalTags}
						multiple
						value={sectionData?.festivalTagId}
						onChange={(v) => {
							updateFilter({ festivalTagId: [...v] });
						}}
						cardStyle={style.radio}
						bodyStyle={style.radioBody}
					/>
				);
			case FOCUS_SECTION:
				return (
					<Radio
						options={festivalFocus}
						multiple
						value={sectionData?.festivalFocusId}
						onChange={(v) => {
							updateFilter({ festivalFocusId: [...v] });
						}}
						cardStyle={style.radio}
						bodyStyle={style.radioBody}
					/>
				);
			case DATE_SECTION:
				return (
					<>
						<Text style={style.subTitle}>Festival Date</Text>
						<OptionInput
							style={style.optionInput}
							textStyle={style.validFont}
							onSelect={(sr) => {
								updateFilter({
									festivalDateType: sr,
								});
							}}
							selectedOption={sectionData?.festivalDateType}
							options={DATE_OPTIONS}
							title="Select Runtime"
						/>
						<DateInput
							style={style.optionInput}
							value={sectionData?.festivalDate}
							placeholder="Select date"
							textStyle={style.validFont}
							onSelect={(festivalDate) =>
								updateFilter({
									festivalDate,
								})
							}
						/>

						<Text style={style.subTitle}>Deadline Date</Text>
						<OptionInput
							style={style.optionInput}
							textStyle={style.validFont}
							onSelect={(sr) => {
								updateFilter({
									deadlineDateType: sr,
								});
							}}
							selectedOption={sectionData?.deadlineDateType}
							options={DATE_OPTIONS}
							title="Select Runtime"
						/>
						<DateInput
							style={style.optionInput}
							value={sectionData?.deadlineDate}
							placeholder="Select date"
							textStyle={style.validFont}
							onSelect={(deadlineDate) =>
								updateFilter({
									deadlineDate,
								})
							}
						/>
					</>
				);
			case COUNTRY_SECTION:
				return (
					<>
						<Text style={style.subTitle}>Select Country</Text>
						<MultiOptionInput
							style={style.optionInput}
							onSelect={(x) => {
								updateFilter({
									countries: x,
								});
							}}
							label="Country"
							emptyText="All Countries"
							values={sectionData?.countries}
							textStyle={style.validFont}
							dataList={countryList}
							searchPlaceholder="Search Countries"
							getCodeItem={Country.getCountry}
						/>
					</>
				);
			case FEE_SECTION:
				return (
					<>
						<Text style={style.subTitle}>Entry Fees</Text>
						<RangeSlider
							key="feeSlider"
							inactiveBarColor={colors.card}
							activeBarColor={colors.primary}
							scrubberColor={colors.card}
							badgeColor={colors.primary}
							value={sectionData?.feeRange}
							minValue={0}
							maxValue={100}
							prefix={currency.symbol}
							suffix={'+'}
							barBorderColor={colors.border}
							scrubberBorderColor={colors.primary}
							onChange={(feeRange) => {
								updateFilter({
									feeRange,
								});
							}}
						/>
					</>
				);
			case YEAR_SECTION:
				return (
					<>
						<Text style={style.subTitle}>Year's Running</Text>
						<RangeSlider
							key="yearSlider"
							inactiveBarColor={colors.card}
							activeBarColor={colors.primary}
							scrubberColor={colors.card}
							badgeColor={colors.primary}
							minValue={0}
							maxValue={20}
							suffix={' yr'}
							value={sectionData?.yearRange}
							barBorderColor={colors.border}
							scrubberBorderColor={colors.primary}
							onChange={(yearRange) => {
								updateFilter({
									yearRange,
								});
							}}
						/>
					</>
				);
			default:
				return null;
		}
	};

	const applyFilterText =
		'Apply Filter' + (filterCount ? ' (' + filterCount + ')' : '');

	return (
		<View style={style.main}>
			<ScrollView style={style.content}>
				{renderSection()}
				<View style={style.gapBottom} />
			</ScrollView>
			<Button
				onPress={onApply}
				style={style.applyButton}
				text={applyFilterText}
				textStyle={style.validFont}
			/>
		</View>
	);
};

export default SectionData;