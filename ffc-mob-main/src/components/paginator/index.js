import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { BORDER_RADIUS } from 'utils/constants';
import { useTheme } from '@react-navigation/native';

export const defaultElementCount = 10;
export const defaultTotalCount = 20;
export const defaultVisiblePageCount = 5;

const Paginator = (props) => {
	const { colors } = useTheme();
	const {
		elementOnEachPage = defaultElementCount,
		visiblePageCount = defaultVisiblePageCount,
		totalElementCount = 0,
		currentPage,
		onPageChange,
		size = 40,
		iconSize = 25
	} = props;

	const [pages, setPages] = useState([]);
	const [nextDisable, setNextDisable] = useState(true);
	const [previousDisable, setPreviousDisable] = useState(true);
	const isVisible = totalElementCount > elementOnEachPage;

	useEffect(() => {
		if (isVisible) {
			const numberOfPages = totalElementCount / elementOnEachPage;
			const pagesBefore = [];
			const pagesAfter = [];
			const midValue = Math.floor(visiblePageCount / 2);
			for (let i = currentPage - midValue; i < currentPage; i++) {
				if (i > 0) {
					pagesBefore.push(i);
				}
			}
			const adjustedAfterAdd = Math.max(midValue - pagesBefore.length, 0);
			pagesBefore.push(currentPage);
			const afterPageLength = Math.min(
				currentPage + midValue + adjustedAfterAdd,
				numberOfPages
			);
			for (let i = currentPage + 1; i <= afterPageLength; i++) {
				pagesAfter.push(i);
			}
			const visiblePages = [...pagesBefore, ...pagesAfter];
			setPages(visiblePages);

			setNextDisable(currentPage === visiblePages.length);
			setPreviousDisable(currentPage === 1);
		}
	}, [
		isVisible,
		totalElementCount,
		elementOnEachPage,
		visiblePageCount,
		currentPage,
	]);

	const sizeStyle = { width: size, height: size };

	if (!isVisible) {
		return null;
	}

	const renderPage = (page) => {
		const selected = page === currentPage;
		const backgroundColor = selected ? colors.primaryLight : colors.card;
		const borderColor = selected ? colors.primary : colors.border;
		const color = selected ? colors.primary : colors.holderColor;
		return (
			<TouchableOpacity
				onPress={() => onPageChange(page)}
				style={[style.pageButton, { borderColor, backgroundColor }, sizeStyle]}
				key={page}
			>
				<Text style={[style.pageText, { color }]}>{page}</Text>
			</TouchableOpacity>
		);
	};

	return (
		<View style={[style.main, { height: size }]}>
			<TouchableOpacity
				disabled={previousDisable}
				onPress={() => onPageChange(currentPage - 1)}
				style={[style.navButton, sizeStyle]}
			>
				<FeatherIcon name="chevron-left" size={iconSize} color={colors.primaryBlue} />
			</TouchableOpacity>
			{pages.map(renderPage)}
			<TouchableOpacity
				disabled={nextDisable}
				onPress={() => onPageChange(currentPage + 1)}
				style={[style.navButton, sizeStyle]}
			>
				<FeatherIcon
					name="chevron-right"
					size={iconSize}
					color={colors.primaryBlue}
				/>
			</TouchableOpacity>
		</View>
	);
};

const style = StyleSheet.create({
	main: {
		width: '100%',
		marginVertical: 10,
		flexDirection: 'row',
		justifyContent: 'center',
	},
	pageButton: {
		borderRadius: BORDER_RADIUS,
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center',
		outline: 'none',
		marginHorizontal: 10,
	},
	pageText: {
		fontSize: 14,
		fontWeight: '400',
	},
	navButton: {
		justifyContent: 'center',
		alignItems: 'center',
		outline: 'none',
	},
});

export default Paginator;
