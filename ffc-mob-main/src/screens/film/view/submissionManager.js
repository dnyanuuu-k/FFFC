import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import JudgingInput from 'components/film/judgingInput';
import SubmissionInput from 'components/film/submissionInput';
import FlagInput from 'components/film/flagInput';

import helper from 'utils/helper';
import { useTheme } from '@react-navigation/native';
import { WINDOW_WIDTH } from 'utils/constants';
import { fonts, weights } from 'themes/topography';
import Country from 'libs/country';

const SubmissionManager = ({ data, showMaker }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				cover: {
					backgroundColor: colors.card,
					marginTop: 20,
					paddingBottom: 15,
					borderTopWidth: 1,
					borderBottomWidth: 1,
					borderColor: colors.border,
				},
				submitterCover: {
					height: 50,
					width: WINDOW_WIDTH,
					borderBottomWidth: 1,
					borderColor: colors.border,
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					paddingHorizontal: 10,
				},
				submitterName: {
					fontSize: fonts.small,
					fontWeight: weights.semibold,
					color: colors.text,
				},
				sectionNote: {
					fontSize: fonts.xsmall,
					color: colors.holderColor,
					marginTop: 2,
				},
				hr: {
					width: '95%',
					height: 1,
					marginTop: 15,
					backgroundColor: colors.border,
					alignSelf: 'center',
				},
				marginDown: {
					marginBottom: 20,
				},
				subTitle: {
					fontSize: fonts.small,
					paddingHorizontal: 10,
					marginTop: 10,
					fontWeight: weights.semibold,
					color: colors.text,
				},
				input: {
					marginTop: 10,
					width: '95%',
					alignSelf: 'center',
				},
			}),
		[colors]
	);

	const [feeAmount, runtime, country] = useMemo(() => {
		const fa = helper.prettyNumber(data.feeAmount, data.currency, 0);
		const sc = data.runtimeSeconds
			? helper.formatSeconds(data.runtimeSeconds)
			: '-';
		const ct = data.countryOfOrigin
			? Country.getCountry(data.countryOfOrigin)
			: null;
		return [fa, sc, ct || '-'];
	}, [data]);

	return (
		<>
			<View style={style.cover}>
				<Text style={style.subTitle}>Judging Status</Text>
				<JudgingInput
					defaultVal={data.judgingStatusId}
					submissionId={data.submissionId}
					coverStyle={style.input}
				/>
				<Text style={style.subTitle}>Submission Status</Text>
				<SubmissionInput
					defaultVal={data.submissionStatusId}
					submissionId={data.submissionId}
					coverStyle={style.input}
				/>

				<Text style={style.subTitle}>Flag Status</Text>
				<FlagInput
					defaultVal={data.festivalFlagId}
					submissionId={data.submissionId}
					coverStyle={style.input}
					flagList={data.festivalFlags}
				/>
			</View>
			<View style={[style.cover, style.marginDown]}>
				<Pressable onPress={showMaker} style={style.submitterCover}>
					<View>
						<Text style={style.submitterName}>
							{data.firstName || ''} {data.lastName || ''}
						</Text>
						<Text style={style.sectionNote}>Submitter Details</Text>
					</View>
					<FeatherIcon name="chevron-right" size={15} color={colors.text} />
				</Pressable>
				<RowData
					label={'Tracking ID'}
					value={data.trackingId}
					colors={colors}
				/>
				<RowData label={'Runtime'} value={runtime} colors={colors} />
				<RowData
					label={'Submission Date'}
					value={data.submissionDate}
					colors={colors}
				/>
				<RowData label={'Country of Origin'} value={country} colors={colors} />
				<View style={style.hr} />

				<RowData label={'Category'} value={data.categoryName} colors={colors} />
				<RowData label={'Deadline'} value={data.deadlineName} colors={colors} />
				<RowData
					label={data.feeType ? 'Gold Fee' : 'Standard Fee'}
					value={feeAmount}
					colors={colors}
				/>
			</View>
		</>
	);
};

const RowData = ({ colors, label, value }) => {
	const style = useMemo(
		() =>
			StyleSheet.create({
				row: {
					flexDirection: 'row',
					justifyContent: 'space-between',
					marginTop: 15,
					paddingHorizontal: 10,
					alignItems: 'center',
				},
				label: {
					color: colors.holderColor,
					fontSize: fonts.small,
				},
				value: {
					color: colors.text,
					fontSize: fonts.small,
					fontWeight: weights.semibold,
				},
			}),
		[colors]
	);
	return (
		<View style={style.row}>
			<Text style={style.label}>{label}</Text>
			<Text style={style.value}>{value}</Text>
		</View>
	);
};

export default SubmissionManager;