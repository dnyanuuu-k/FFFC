import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import SubmissionModal from './submissionModal';
import { BORDER_RADIUS, ERROR_TEXT } from 'utils/constants';
import { SUBMISSION_STATUS_LIST } from 'utils/submission';
import { useTheme } from '@react-navigation/native';
import { fonts } from 'themes/topography';
import Backend from 'backend';
import toast from 'libs/toast';

const SubmissionInput = ({ coverStyle, submissionId, defaultVal }) => {
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
					width: 20,
					height: 20,
					borderRadius: 50,
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
		const d = SUBMISSION_STATUS_LIST.find((x) => x.value == defaultVal);
		return d || SUBMISSION_STATUS_LIST[0];
	};
	const [submissionModal, setSubmissionModal] = useState(false);
	const [current, setCurrent] = useState(getDefaultValue());
	const [isBusy, setBusy] = useState(false);

	const handleSelect = async (item) => {
		try {
			setBusy(true);
			const response = await Backend.Submission.updateSubmissionStatus({
				submissionId,
				submissionStatusId: item.value,
			});
			if (response?.success) {
				setCurrent(item);
				setSubmissionModal(false);
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
				onPress={() => setSubmissionModal(true)}
				style={[style.input, coverStyle]}
			>
				<View style={[style.icon, { backgroundColor: current.color }]} />
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
			<SubmissionModal
				disabled={isBusy}
				selectedId={current.value}
				onSelect={handleSelect}
				onClose={() => setSubmissionModal(false)}
				visible={submissionModal}
			/>
		</>
	);
};

export default SubmissionInput;