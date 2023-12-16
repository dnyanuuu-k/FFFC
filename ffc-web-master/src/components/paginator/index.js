import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import FeatherIcon from "feather-icons-react";
import { BORDER_RADIUS } from "utils/constants";
import colors from "themes/colors";

export const defaultElementCount = 10;
export const defaultTotalCount = 20;
export const defaultVisiblePageCount = 5;

const Paginator = (props) => {
	const {
		elementOnEachPage = defaultElementCount,
		visiblePageCount = defaultVisiblePageCount,
		totalElementCount = 0,
		currentPage,
		onPageChange,
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

	if (!isVisible) return null;

	const renderPage = (page) => {
		const selected = page === currentPage;
		const backgroundColor = selected ? colors.primaryLight : colors.popupBg;
		const borderColor = selected ? colors.primaryBlue : colors.borderColor;
		const color = selected ? colors.primaryBlue : colors.holderColor;
		return (
			<TouchableOpacity
				onPress={() => onPageChange(page)}
				style={[style.pageButton, { borderColor, backgroundColor }]}
				key={page}
			>
				<Text style={[style.pageText, { color }]}>{page}</Text>
			</TouchableOpacity>
		);
	};

	return (
		<View style={style.main}>
			<TouchableOpacity
				disabled={previousDisable}
				onPress={() => onPageChange(currentPage - 1)}
				style={style.navButton}
			>
				<FeatherIcon
					icon="chevron-left"
					size={25}
					color={colors.primaryBlue}
				/>
			</TouchableOpacity>
			{pages.map(renderPage)}
			<TouchableOpacity
				disabled={nextDisable}
				onPress={() => onPageChange(currentPage + 1)}
				style={style.navButton}
			>
				<FeatherIcon
					icon="chevron-right"
					size={25}
					color={colors.primaryBlue}
				/>
			</TouchableOpacity>
		</View>
	);
};

const style = StyleSheet.create({
	main: {
		width: "100%",
		height: 40,
		marginVertical: 10,
		flexDirection: "row",
		justifyContent: 'center'
	},
	pageButton: {
		width: 40,
		height: 40,
		borderRadius: BORDER_RADIUS,
		borderWidth: 1,
		justifyContent: "center",
		alignItems: "center",
		outline: "none",
		marginHorizontal: 10
	},
	pageText: {
		fontSize: 14,
		fontWeight: "400",
	},
	navButton: {
		width: 40,
		height: 40,
		justifyContent: "center",
		alignItems: "center",
		outline: "none",
	},
});

export default Paginator;