import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import CategoryModal from './categoryModal';
import DeadlineModal from './deadlineModal';
import { WINDOW_WIDTH } from 'utils/constants';
import { fonts, weights } from 'themes/topography';
import { useTheme } from '@react-navigation/native';
const DeadlineCategory = ({ deadlines = [], categories = [] }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					marginTop: 10,
					backgroundColor: colors.card,
					paddingHorizontal: 15,
					width: WINDOW_WIDTH,
				},
				card: {
					flexDirection: 'row',
					width: '100%',
					justifyContent: 'space-between',
				},
				cardContent: {
					height: 70,
					justifyContent: 'center',
				},
				hr: {
					width: '100%',
					backgroundColor: colors.border,
					height: 1,
				},
				title: {
					fontSize: fonts.xsmall,
					color: colors.holderColor,
				},
				value: {
					fontSize: fonts.small,
					fontWeight: weights.bold,
					color: colors.primary,
				},
				arrow: {
					height: 70,
					justifyContent: 'center',
				},
			}),
		[colors]
	);
	const currentDeadline = useMemo(() => {
		const deadline = deadlines.find((d) => d.isCurrent);
		const defaultDeadline = {
			name: 'All Deadlines Passed',
			formattedDate: 'Dates & Deadlines',
		};
		return deadline || defaultDeadline;
	}, [deadlines]);
	const [showCategoryModal, setShowCategoryModal] = useState(false);
	const [showDeadlineModal, setShowDeadlineModal] = useState(false);

	return (
		<>
			<View style={style.main}>
				<Pressable
					style={style.card}
					onPress={() => setShowDeadlineModal(true)}
				>
					<View style={style.cardContent}>
						<Text style={style.title}>{currentDeadline.formattedDate}</Text>
						<Text style={[style.value, { color: colors.greenDark }]}>
							{currentDeadline.name}
						</Text>
					</View>
					<View style={style.arrow}>
						<FeatherIcon
							name="chevron-right"
							color={colors.holderColor}
							size={15}
						/>
					</View>
				</Pressable>
				<View style={style.hr} />
				<Pressable
					style={style.card}
					onPress={() => setShowCategoryModal(true)}
				>
					<View style={style.cardContent}>
						<Text style={style.title}>Categories & Fees</Text>
						<Text style={style.value}>{categories.length} Categories</Text>
					</View>
					<View style={style.arrow}>
						<FeatherIcon
							name="chevron-right"
							color={colors.holderColor}
							size={15}
						/>
					</View>
				</Pressable>
			</View>
			<CategoryModal
				onClose={() => setShowCategoryModal(false)}
				visible={showCategoryModal}
				festivalFees={categories}
			/>
			<DeadlineModal
				onClose={() => setShowDeadlineModal(false)}
				visible={showDeadlineModal}
				deadlines={deadlines}
			/>
		</>
	);
};

export default DeadlineCategory;