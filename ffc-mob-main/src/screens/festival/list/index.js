import React, { useMemo, useState, useEffect } from 'react';
import {
	View,
	StatusBar,
	Pressable,
	StyleSheet,
	TextInput,
	Text,
	RefreshControl,
} from 'react-native';
import Preloader from 'components/preloader/basic';
import FestivalCard from 'components/festival/card';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { FlashList } from '@shopify/flash-list';
import FestivalFilterModal from './festivalFilterModal';
import { useTheme } from '@react-navigation/native';

import {
	WINDOW_WIDTH,
	WINDOW_HEIGHT,
	HEADER_HEIGHT,
	FESTIVAL_CARD_HEIGHT,
} from 'utils/constants';
import { fonts, weights } from 'themes/topography';
import Backend from 'backend';
const LIMIT = 10;
const List = ({ navigation }) => {
	const { colors, dark } = useTheme();
	const [showFilterModal, setShowFilterModal] = useState(false);
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					height: WINDOW_HEIGHT,
					width: WINDOW_WIDTH,
					backgroundColor: colors.background,
				},
				header: {
					height: HEADER_HEIGHT,
					width: WINDOW_WIDTH,
					backgroundColor: colors.card,
					paddingTop: StatusBar.currentHeight,
					flexDirection: 'row',
					alignItems: 'center',
					borderWidth: 1,
					borderColor: colors.border,
				},
				icon: {
					width: 40,
					height: 30,
					justifyContent: 'center',
					alignItems: 'center',
				},
				searchCover: {
					height: 30,
					backgroundColor: colors.background,
					marginHorizontal: 10,
					borderRadius: 20,
					paddingLeft: 16,
					flex: 1,
				},
				searchBar: {
					flex: 1,
					padding: 0,
					color: colors.text,
					fontSize: fonts.small,
				},
				bottomGap: {
					height: 80,
				},
				badgeCover: {
					backgroundColor: colors.rubyRed,
					justifyContent: 'center',
					alignItems: 'center',
					position: 'absolute',
					right: 3,
					top: 0,
					borderRadius: 44,
					width: 17,
					height: 17,
				},
				badgeCount: {
					fontSize: fonts.xsmall,
					fontWeight: weights.semibold,
					color: colors.buttonTxt,
				},
				endReached: {
					fontSize: fonts.small,
					color: colors.holderColor,
					textAlign: 'center',
					marginVertical: 10,
				},
			}),
		[colors]
	);
	const [currentAppliedFilter, setCurrentFilter] = useState({});
	const [filterCount, setFilterCount] = useState(0);
	const [festivals, setFestivals] = useState([]);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);
	const [isEnd, setIsEnd] = useState(false);

	const getFilters = (offset = null) => {
		let filters = {
			limit: LIMIT,
			offset: offset === null ? festivals.length : offset,
		};
		Object.keys(filters).forEach((key) => {
			filters = { ...filters, ...currentAppliedFilter[key] };
		});
		return filters;
	};

	const loadFestivals = async (offset) => {
		try {
			if (isEnd && offset !== 0) {
				return;
			}
			setLoading(true);
			setError(false);
			const filters = getFilters(offset);
			const response = await Backend.Festival.filterFestivals(filters);
			if (response?.success) {
				if (filters.offset) {
					const list = [...festivals, ...response.data];
					setFestivals(list);
				} else {
					setFestivals(response.data);
				}
				if (response.data.length < LIMIT) {
					setIsEnd(true);
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

	useEffect(() => {
		loadFestivals();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const applyFilter = (filterData, count) => {
		setFestivals([]);
		setIsEnd(false);
		setCurrentFilter(filterData);
		setFilterCount(count);
		setShowFilterModal(false);
	};

	const refresh = () => {
		setFestivals([]);
		setIsEnd(false);
		loadFestivals(0);
	};

	const showFilter = () => {
		setShowFilterModal(true);
	};

	const showFestival = (festivalId) => {
		navigation.navigate('FestivalView', {
			festivalId,
		});
	};

	const renderFestival = ({ item }) => {
		return (
			<FestivalCard
				onView={showFestival}
				dark={dark}
				colors={colors}
				data={item}
			/>
		);
	};

	const renderFooter = () => {
		return (
			<>
				{isEnd ? (
					<Text style={style.endReached}>You have reached to end!</Text>
				) : null}
				<View style={style.bottomGap} />
			</>
		);
	};

	return (
		<View style={style.main}>
			<View style={style.header}>
				<View style={style.icon}>
					<FeatherIcon name="arrow-left" color={colors.text} size={22} />
				</View>
				<View style={style.searchCover}>
					<TextInput
						placeholderTextColor={colors.holderColor}
						placeholder="Search Festivals"
						style={style.searchBar}
						selectionColor={colors.bgTrans69}
					/>
				</View>
				<Pressable onPress={showFilter} style={style.icon}>
					<FeatherIcon name="filter" color={colors.text} size={22} />
					{filterCount ? (
						<View style={style.badgeCover}>
							<Text style={style.badgeCount}>{filterCount}</Text>
						</View>
					) : null}
				</Pressable>
			</View>

			<Preloader
				onRetry={loadFestivals}
				hasError={error}
				isBusy={loading}
				isEmpty={false}
			>
				<FlashList
					refreshControl={
						<RefreshControl refreshing={false} onRefresh={refresh} />
					}
					data={festivals}
					showsVerticalScrollIndicator={false}
					extraData={colors}
					estimatedItemSize={FESTIVAL_CARD_HEIGHT}
					renderItem={renderFestival}
					keyExtractor={(item) => item.id}
					ListFooterComponent={renderFooter}
					onEndReachedThreshold={0.5}
					onEndReached={loadFestivals}
				/>
			</Preloader>
			<FestivalFilterModal
				onClose={() => setShowFilterModal(false)}
				visible={showFilterModal}
				onNewFilter={applyFilter}
			/>
		</View>
	);
};

export default List;