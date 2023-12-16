import React, { useMemo, useState, useEffect } from 'react';
import {
	View,
	Text,
	ScrollView,
	Modal,
	Pressable,
	StyleSheet,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FilterSection, {
	DATE_OPTIONS,
	ENTRY_SECTION,
	TAG_SECTION,
	FOCUS_SECTION,
	DATE_SECTION,
	COUNTRY_SECTION,
	FEE_SECTION,
	YEAR_SECTION,
} from './filterSection';
import { fonts, weights } from 'themes/topography';
import { useTheme } from '@react-navigation/native';
import { H70, W65, W35 } from 'utils/constants';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
const sections = [
	{
		id: ENTRY_SECTION,
		title: 'Entries',
	},
	{
		id: TAG_SECTION,
		title: 'Tags',
	},
	{
		id: FOCUS_SECTION,
		title: 'Focus',
	},
	{
		id: DATE_SECTION,
		title: 'Date & Deadlines',
	},
	{
		id: COUNTRY_SECTION,
		title: 'Country',
	},
	{
		id: FEE_SECTION,
		title: 'Fees',
	},
	{
		id: YEAR_SECTION,
		title: "Year's Running",
	},
];

export const defaultFilterData = {
	[sections[0].id]: {
		entryType: 'all',
	},
	[sections[1].id]: {
		festivalTagId: [],
	},
	[sections[2].id]: {
		festivalFocusId: [],
	},
	[sections[3].id]: {
		festivalDateType: DATE_OPTIONS[0],
		festivalDate: undefined,

		deadlineDateType: DATE_OPTIONS[0],
		deadlineDate: undefined,
	},
	[sections[4].id]: {
		countries: undefined,
	},
	[sections[5].id]: {
		feeRange: undefined,
	},
	[sections[6].id]: {
		yearRange: undefined,
	},
};

const FestivalFilterModal = ({ onClose, visible, onNewFilter }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					flex: 1,
					backgroundColor: colors.bgTrans,
					justifyContent: 'flex-end',
				},
				content: {
					borderTopRightRadius: 10,
					borderTopLeftRadius: 10,
					backgroundColor: colors.card,
					height: H70,
					overflow: 'hidden',
				},
				header: {
					height: 50,
					paddingHorizontal: 10,
					width: '100%',
					borderBottomWidth: 1,
					borderColor: colors.border,
					backgroundColor: colors.card,
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
				},
				sectionRow: {
					flexDirection: 'row',
					height: '100%',
				},
				title: {
					fontSize: fonts.title,
					color: colors.text,
					fontWeight: weights.semibold,
				},
				downIcon: {
					height: 50,
					width: 50,
					justifyContent: 'center',
					alignItems: 'flex-end',
				},
			}),
		[colors]
	);
	const [currentOriginal, setOriginalApplied] = useState(defaultFilterData);
	const [filterData, setFilterData] = useState(defaultFilterData);
	const [currentSection, setCurrentSection] = useState(sections[0].id);

	const [visibleSections, totalFilterCount] = useMemo(() => {
		let totalCount = 0;
		const modifyedSections = sections.map((section) => {
			const sectionData = filterData[section.id];
			if (!sectionData) {
				return section;
			}

			section.count = 0;
			if (section.id === ENTRY_SECTION) {
				if (sectionData.entryType !== 'all') {
					section.count += 1;
					totalCount += 1;
				}
			} else if (section.id === TAG_SECTION) {
				if (sectionData?.festivalTagId?.length) {
					section.count += 1;
					totalCount += 1;
				}
			} else if (section.id === FOCUS_SECTION) {
				if (sectionData?.festivalFocusId?.length) {
					section.count += 1;
					totalCount += 1;
				}
			} else if (section.id === DATE_SECTION) {
				if (sectionData?.festivalDate) {
					section.count += 1;
					totalCount += 1;
				}
				if (sectionData?.deadlineDate) {
					section.count += 1;
					totalCount += 1;
				}
			} else if (section.id === COUNTRY_SECTION) {
				if (sectionData?.countries?.length) {
					section.count += 1;
					totalCount += 1;
				}
			} else if (section.id === FEE_SECTION) {
				if (sectionData?.feeRange?.length) {
					const defaultStart = 0;
					const defaultEnd = 100;
					const feeStart = sectionData.feeRange[0];
					const feeEnd = sectionData.feeRange[1];
					if (feeStart !== defaultStart || feeEnd !== defaultEnd) {
						section.count += 1;
						totalCount += 1;
					}
				}
			} else if (section.id === YEAR_SECTION) {
				if (sectionData?.yearRange?.length) {
					const defaultStart = 0;
					const defaultEnd = 20;
					const feeStart = sectionData.yearRange[0];
					const feeEnd = sectionData.yearRange[1];
					if (feeStart !== defaultStart || feeEnd !== defaultEnd) {
						section.count += 1;
						totalCount += 1;
					}
				}
			}

			return section;
		});
		return [modifyedSections, totalCount];
	}, [filterData]);

	const handleUpdateFilter = (newData) => {
		const currentData = filterData[currentSection];
		filterData[currentSection] = {
			...currentData,
			...newData,
		};
		setFilterData({ ...filterData });
	};

	const handleFilterApply = () => {
		if (typeof onNewFilter === 'function') {
			setOriginalApplied({ ...filterData });
			onNewFilter(filterData, totalFilterCount);
		}
	};

	useEffect(() => {
		if (visible) {
			setFilterData({ ...currentOriginal });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [visible]);

	return (
		<Modal
			animationType="fade"
			style={style}
			visible={visible}
			transparent
			onRequestClose={onClose}
		>
			<Animated.View style={style.main} entering={FadeIn}>
				<Animated.View style={style.content} entering={SlideInDown}>
					<View style={style.header}>
						<Text style={style.title}>Filters</Text>
						<Pressable onPress={onClose} style={style.downIcon}>
							<FeatherIcon name="x" size={20} color={colors.text} />
						</Pressable>
					</View>
					<View style={style.sectionRow}>
						<Sections
							visibleSections={visibleSections}
							filterData={filterData}
							colors={colors}
							currentSection={currentSection}
							onSectionChange={setCurrentSection}
						/>
						<FilterSection
							filterCount={totalFilterCount}
							filterData={filterData}
							currentSection={currentSection}
							updateFilter={handleUpdateFilter}
							colors={colors}
							onApply={handleFilterApply}
						/>
					</View>
				</Animated.View>
			</Animated.View>
		</Modal>
	);
};

const Sections = ({
	visibleSections,
	filterData,
	colors,
	currentSection,
	onSectionChange,
}) => {
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					backgroundColor: colors.card,
					width: W35,
					borderRightWidth: 1,
					borderColor: colors.border,
				},
				card: {
					height: 50,
					borderBottomWidth: 1,
					borderColor: colors.border,
					justifyContent: 'center',
				},
				text: {
					fontSize: fonts.small,
					paddingLeft: 10,
				},
				count: {
					fontSize: fonts.xsmall,
					position: 'absolute',
					right: 5,
					bottom: 5,
				},
				indicator: {
					position: 'absolute',
					right: 0,
					height: 2,
					bottom: 0,
					width: W35,
					backgroundColor: colors.primary,
				},
			}),
		[colors]
	);

	const renderSection = (section, index) => {
		const isSelected = currentSection === section.id;
		const color = isSelected ? colors.primary : colors.text;
		return (
			<Pressable
				onPress={() => onSectionChange(section.id)}
				style={style.card}
				key={section.id}
			>
				{isSelected ? <View style={style.indicator} /> : null}
				<Text style={[style.text, { color }]}>{section.title}</Text>
				{section.count ? (
					<Text style={[style.count, { color }]}>{section.count}</Text>
				) : null}
			</Pressable>
		);
	};
	return (
		<ScrollView style={style.main}>
			{visibleSections.map(renderSection)}
		</ScrollView>
	);
};

export default FestivalFilterModal;