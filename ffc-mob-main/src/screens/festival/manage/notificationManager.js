import React, { useMemo, useState, useEffect } from 'react';
import {
	View,
	ScrollView,
	RefreshControl,
	StyleSheet,
	Text,
	Pressable,
} from 'react-native';
import AnimatedBar from 'components/animated/bar';
import Header from 'components/header/basic';
import Radio from 'components/radio/radio2';
import Loading from 'components/modal/loading';
import Button from 'components/button';
import Backend from 'backend';
import toast from 'libs/toast';

import { useTheme, useNavigation } from '@react-navigation/native';
import { fonts, weights } from 'themes/topography';
import { WINDOW_WIDTH, ERROR_TEXT } from 'utils/constants';

const FestivalNotificationManager = ({ route }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					flex: 1,
					backgroundColor: colors.background,
				},
				gapBottom: {
					height: 20,
				},
				cover: {
					backgroundColor: colors.card,
					marginTop: 10,
					padding: 10,
				},
				title: {
					fontSize: fonts.regular,
					color: colors.text,
					fontWeight: weights.semibold,
				},
				margin: {
					marginTop: 5,
				},
				note: {
					color: colors.holderColor,
					fontSize: fonts.xsmall,
				},

				checkboxInput: {
					marginTop: 20,
					paddingLeft: 5,
				},
				checkboxText: {
					width: 300,
					minHeight: 40,
					fontSize: fonts.small,
					color: colors.holderColor,
				},

				noteRed: {
					fontSize: fonts.xsmall,
					color: colors.rubyRed,
					fontWeight: weights.semibold,
				},

				statRow: {
					marginTop: 20,
					height: 80,
					width: '100%',
					borderTopWidth: 1,
					borderColor: colors.border,
					flexDirection: 'row',
				},
				statBox: {
					height: 90,
					width: '33%',
					alignItems: 'center',
				},
				statBorder: {
					borderLeftWidth: 1,
					borderRightWidth: 1,
					borderColor: colors.border,
				},
				statVal: {
					fontSize: fonts.small,
					color: colors.text,
					marginTop: 20,
				},
				statKey: {
					fontSize: fonts.xsmall,
					color: colors.holderColor,
					textAlign: 'center',
				},

				button: {
					marginTop: 20,
					height: 35,
				},
				buttonTxt: {
					fontSize: fonts.small,
				},
			}),
		[colors]
	);

	const [festival, setFestivalData] = useState({});
	const navigation = useNavigation();
	const [loading, setLoading] = useState(true);
	const [busy, setBusy] = useState(false);
	const { festivalId } = route.params;

	const loadData = async () => {
		try {
			setLoading(true);
			const response = await Backend.Festival.getNotificationPerf({
				festivalId,
			});
			if (response?.success) {
				setFestivalData(response.data);
			} else {
				throw new Error(response?.message);
			}
		} catch (err) {
			toast.error('Unable to load data');
			navigation.goBack();
		} finally {
			setLoading(false);
		}
	};

	const saveNotificationPerf = async () => {
		try {
			if (loading) {
				return;
			}
			setBusy(true);
			const response = await Backend.Festival.updateNotificationPerf({
				festivalId,
				notifyPerf: festival.notifyPerf,
			});
			if (response?.success) {
				toast.success('Updated!');
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			setBusy(false);
		}
	};

	useEffect(() => {
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<View style={style.main}>
			<Header title="Notification Manager" />
			<ScrollView
				refreshControl={
					<RefreshControl refreshing={false} onRefresh={loadData} />
				}
			>
				<AnimatedBar height={3} width={WINDOW_WIDTH} busy={loading} />
				<View style={style.cover}>
					<Text style={style.note}>
						We sent notification on email and our mobile app, from below you can
						decided your notification preference
					</Text>
				</View>
				<View style={style.cover}>
					<Text style={style.title}>Notification Preference</Text>
					<Text style={[style.note, style.margin]}>
						Set notification preference for submissions, FilmFestBook will
						notify submitter on mobile app and email as well.
					</Text>

					<Radio
						options={[
							{
								label:
									'Notify submitters immediately when their Judging Status is changed.',
								value: 'immediate',
							},
							{
								label:
									'Notify entrants of their Judging Status only on my festival Notification Date: September 30, 2023',
								value: 'default',
							},
						]}
						value={festival.notifyPerf}
						textStyle={style.checkboxText}
						cardStyle={style.checkboxInput}
						onChange={(v) => {
							setFestivalData({
								notifyPerf: v,
							});
						}}
						width={WINDOW_WIDTH}
					/>

					<Button
						style={style.button}
						textStyle={style.buttonTxt}
						text="Save Preference"
						type={Button.PRIMARY}
						onPress={saveNotificationPerf}
					/>

					<View style={style.statRow}>
						<View style={style.statBox}>
							<Text style={style.statVal}>354</Text>
							<Text style={style.statKey}>Submissions Undecided</Text>
						</View>
						<View style={[style.statBox, style.statBorder]}>
							<Text style={style.statVal}>250</Text>
							<Text style={style.statKey}>
								Submissions Awaiting Notification
							</Text>
						</View>
						<View style={style.statBox}>
							<Text style={style.statVal}>4</Text>
							<Text style={style.statKey}>Submissions Notified</Text>
						</View>
					</View>
				</View>
				<Pressable style={style.cover}>
					<Text style={style.noteRed}>
						Automatically change all 354 Undecided submissions to Not Selected
					</Text>
				</Pressable>

				<View style={style.cover}>
					<Text style={style.title}>Custom notifications</Text>
					<Text style={style.note}>
						Currently we offer standarized notification but will soon offer
						custom notification support stay tuned
					</Text>
				</View>

				<View style={style.gapBottom} />
			</ScrollView>
			<Loading busy={busy} />
		</View>
	);
};

export default FestivalNotificationManager;