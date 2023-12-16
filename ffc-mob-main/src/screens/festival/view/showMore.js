import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

// Components
import LinearGradinet from 'react-native-linear-gradient';
import MoreModal from 'components/modal/more';
// Hooks
import { useTheme } from '@react-navigation/native';

// Constants
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'utils/constants';
import { fonts, weights } from 'themes/topography';

// variables
const maxHeight = 220;
const contentHeight = WINDOW_HEIGHT * 0.6;
const ShowMore = ({ text, title, isOwner = false, onEditRequest }) => {
	const { colors } = useTheme();
	const style = StyleSheet.create({
		main: {
			maxHeight,
			width: WINDOW_WIDTH,
		},
		text: {
			paddingHorizontal: 10,
			fontSize: fonts.small,
			color: colors.holderColor,
			marginTop: 20,
		},
		bottom: {
			height: '100%',
			width: WINDOW_WIDTH,
			position: 'absolute',
			justifyContent: 'flex-end',
		},
		moreWindow: {
			height: 70,
			width: WINDOW_WIDTH,
			justifyContent: 'flex-end',
			alignItems: 'center',
		},
		link: {
			height: 24,
			fontSize: fonts.small,
			fontWeight: weights.bold,
			color: colors.primary,
		},
		content: {
			height: contentHeight,
			width: WINDOW_WIDTH,
			backgroundColor: colors.card,
		},
		addNew: {
			color: colors.primary,
			fontSize: fonts.small,
			paddingHorizontal: 10,
			marginTop: 20,
		},
	});
	const marginBottom = canShowMore ? 0 : 20;
	const [canShowMore, setCanShowMore] = useState(false);
	const [isMoreVisible, setMoreVisible] = useState(false);

	const showMore = () => {
		// RNSelectionMenu.Show({
		// 	values: [{ value: 'OK', type: 0 }],
		// 	selectedValues: [''],
		// 	selectionType: 0,
		// 	presentationType: 2,
		// 	theme: dark ? 1 : 0,
		// 	title: 'Content',
		// 	subtitle: text,
		// });
		setMoreVisible(true);
	};

	const handleLayoutChange = ({ nativeEvent }) => {
		if (nativeEvent.layout.height >= maxHeight) {
			setCanShowMore(true);
		}
	};

	return (
		<>
			<View style={style.main} onLayout={handleLayoutChange}>
				{text?.length ? (
					<Text style={[style.text, { marginBottom }]}>{text}</Text>
				) : isOwner ? (
					<Text
						onPress={onEditRequest}
						style={[style.addNew, { marginBottom }]}
					>
						Press here to add {title}
					</Text>
				) : null}
				{canShowMore ? (
					<Pressable style={style.bottom} onPress={showMore}>
						<LinearGradinet
							style={style.moreWindow}
							colors={['transparent', colors.cardLight, colors.card]}
						>
							<Text style={style.link}>Show More</Text>
						</LinearGradinet>
					</Pressable>
				) : null}
			</View>
			{isMoreVisible ? (
				<MoreModal
					onClose={() => setMoreVisible(false)}
					content={text}
					title={title}
				/>
			) : null}
		</>
	);
};

export default ShowMore;