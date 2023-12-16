import React, { useMemo, useState } from 'react';
import { StyleSheet, Pressable, Text, Image } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import JudgingModal from './judgingModal';
import {
	JUDGE_SELECTED,
	JUDGE_UNDECIDED,
	JUDGE_NOT_SELECTED,
	JUDGE_AWARD_WINNER,
	JUDGE_FINALIST,
	JUDGE_SEMI_FINALIST,
	JUDGE_QUATER_FINALIST,
	JUDGE_NOMINEE,
	JUDGE_HONARABLE_MENTION,
	BORDER_RADIUS,
	ERROR_TEXT,
} from 'utils/constants';
import { useTheme } from '@react-navigation/native';
import { fonts } from 'themes/topography';
import Backend from 'backend';
import toast from 'libs/toast';
const options = [
	JUDGE_UNDECIDED,
	JUDGE_SELECTED,
	JUDGE_NOT_SELECTED,
	JUDGE_AWARD_WINNER,
	JUDGE_FINALIST,
	JUDGE_SEMI_FINALIST,
	JUDGE_QUATER_FINALIST,
	JUDGE_NOMINEE,
	JUDGE_HONARABLE_MENTION,
];
const JudgingInput = ({ coverStyle, submissionId, defaultVal }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				label: {
					flex: 1,
					fontSize: fonts.small,
					color: colors.text,
					marginLeft: 10,
				},
				icon: {
					width: 23,
					height: 23,
				},
				input: {
					height: 45,
					width: '100%',
					paddingHorizontal: 10,
					borderColor: colors.border,
					borderWidth: 1,
					alignItems: 'center',
					flexDirection: 'row',
					borderRadius: BORDER_RADIUS,
				},
			}),
		[colors]
	);

	const getDefaultValue = () => {
		// eslint-disable-next-line eqeqeq
		const d = options.find((x) => x.id == defaultVal);
		return d || JUDGE_UNDECIDED;
	};
	const [judingModal, setJudgingModal] = useState(false);
	const [current, setCurrent] = useState(getDefaultValue());
	const [isBusy, setBusy] = useState(false);

	const handleSelect = async (item) => {
		try {
			setBusy(true);
			const response = await Backend.Submission.updateSubmissionJudgement({
				submissionId,
				judgeStatusId: item.id,
			});
			if (response?.success) {
				setCurrent(item);
				setJudgingModal(false);
				setTimeout(() => {
					toast.success('Updated Successfully!');
				}, 200);
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			setBusy(false);
		}
	};

	return (
		<>
			<Pressable
				onPress={() => setJudgingModal(true)}
				style={[style.input, coverStyle]}
			>
				<Image
					source={current.icon}
					style={[style.icon, { tintColor: current.color }]}
				/>
				<Text style={[style.label, { color: current.color }]}>
					{current.label}
				</Text>
				<FeatherIcon
					style={style.arrow}
					size={15}
					name="chevron-down"
					color={colors.holderColor}
				/>
			</Pressable>
			<JudgingModal
				options={options}
				disabled={isBusy}
				selectedId={current.id}
				onSelect={handleSelect}
				onClose={() => setJudgingModal(false)}
				visible={judingModal}
			/>
		</>
	);
};

export default JudgingInput;