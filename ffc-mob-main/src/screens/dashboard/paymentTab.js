import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import Graph from './graph';
import { DataList, StatBox } from './shared';
import Preloader from 'components/preloader/basic';

// Hooks
import { useTheme } from '@react-navigation/native';

// Functions
import helper from 'utils/helper';
import Backend from 'backend';
import moment from 'moment';

const PaymentTab = ({ festivalDateId, currency }) => {
	const { colors } = useTheme();
	const [paymentData, setPaymentData] = useState({});
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);
	const loadSummary = async () => {
		try {
			setLoading(true);
			setError(false);
			const response = await Backend.Dashboard.paymentSummary({
				festivalDateId,
			});
			if (response?.success) {
				formatResponse(response?.data || {});
			} else {
				throw new Error(response?.message);
			}
		} catch (err) {
			setError(true);
		} finally {
			setLoading(false);
		}
	};

	const formatResponse = (data) => {
		const paymentStats = [
			{
				label: 'Total Gross',
				value: helper.prettyNumber(data.totalGross, currency, 0),
				color: colors.text,
			},
			{
				label: 'Total Net',
				value: helper.prettyNumber(data.totalNet, currency, 0),
				color: colors.primary,
			},
			{
				label: 'Amount Settled',
				value: helper.prettyNumber(data.amountSettled, currency, 0),
				color: colors.greenDark,
			},
			{
				label: 'Amount Remaining',
				value: helper.prettyNumber(data.amountRemaining, currency, 0),
				color: colors.rubyRed,
			},
		];
		const payoutList = (data.payoutList || []).map((payout) => {
			const amount = helper.prettyNumber(payout.amount);
			const desc = moment(payout.createdAt).fromNow();
			return {
				title: '#PYT' + payout.id,
				value: currency + amount,
				desc,
			};
		});
		const paymentList = (data.paymentList || []).map((payment) => {
			const amount = helper.prettyNumber(payment.festivalAmount);
			const desc = moment(payment.createdAt).fromNow();
			return {
				title: payment.filmTitle,
				value: currency + amount,
				desc,
			};
		});
		let payoutCount = 0;
		let paymentCount = 0;

		if (data.paymentList?.length) {
			paymentCount = data.paymentList[0].totalCount;
		}

		if (data.payoutList?.length) {
			payoutCount = data.payoutList[0].totalCount;
		}

		setPaymentData({
			paymentGraph: data.paymentGraph,
			payoutCount,
			paymentCount,
			payoutList,
			paymentList,
			paymentStats,
		});
	};

	useEffect(() => {
		loadSummary();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<View>
			<Preloader
				onRetry={loadSummary}
				hasError={error}
				isBusy={loading}
				isEmpty={false}
			>
				<Graph data={paymentData.paymentGraph} />
				<StatBox data={paymentData.paymentStats} />
				<DataList
					type="payouts"
					title="Recent Payouts"
					data={paymentData.payoutList}
					totalCount={paymentData.payoutCount}
				/>
				<DataList
					totalCount={paymentData.paymentCount}
					type="payments"
					title="Recent Payments"
					data={paymentData.paymentList}
				/>
			</Preloader>
		</View>
	);
};

export default PaymentTab;
