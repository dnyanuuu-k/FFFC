import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FlagModal from './flagModal';
import { BORDER_RADIUS, ERROR_TEXT } from 'utils/constants';
import { useTheme } from '@react-navigation/native';
import { fonts } from 'themes/topography';
import Backend from 'backend';
import toast from 'libs/toast';

const FlagInput = ({ coverStyle, flagList = [], defaultVal, submissionId }) => {
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
		const d = flagList.find((x) => x.id == defaultVal);
		return d || {};
	};
	const [submissionModal, setFlagModal] = useState(false);
	const [current, setCurrent] = useState(getDefaultValue());
	const [isBusy, setBusy] = useState(false);

	const handleSelect = async (item) => {
		try {
			setBusy(true);
			const response = await Backend.Submission.updateSubmissionFlag({
				submissionId,
				festivalFlagId: item.id,
			});
			if (response?.success) {
				setCurrent(item);
				setFlagModal(false);
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

	const color = current.color || colors.holderColor;

	return (
		<>
			<Pressable
				onPress={() => setFlagModal(true)}
				style={[style.input, coverStyle]}
			>
				<FeatherIcon name="flag" size={15} color={color} />
				<Text style={[style.label, { color }]}>
					{current.title || 'Select Flag'}
				</Text>
				<FeatherIcon
					style={style.arrow}
					size={15}
					name="chevron-down"
					color={colors.holderColor}
				/>
			</Pressable>
			<FlagModal
				disabled={isBusy}
				list={flagList}
				selectedId={current.id}
				onSelect={handleSelect}
				onClose={() => setFlagModal(false)}
				visible={submissionModal}
			/>
		</>
	);
};

export default FlagInput;