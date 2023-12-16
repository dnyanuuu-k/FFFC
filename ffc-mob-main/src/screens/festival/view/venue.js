import React, { useMemo, useState, useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Linking,
	RefreshControl,
} from 'react-native';
import Header from 'components/header/basic';
import Image from 'components/image';
import SectionCover from './sectionCover';
import Button from 'components/button';
import Preloader from 'components/preloader/basic';
import Link from './link';
import { useTheme } from '@react-navigation/native';
import { fonts, weights } from 'themes/topography';
import { ERROR_TEXT } from 'utils/constants';
import toast from 'libs/toast';
import Backend from 'backend';

const hash = 'L6PQZ+1C][w~^i,2NpNLxbnq-E,{';
const ratio = 230 / 120;
const mapViewSize = {
	width: 150,
	height: 150 / ratio,
};

const generateAddress = (venue = {}) => {
	let address = venue?.city ? venue.city + ' ' : '';
	address += venue?.state ? venue.state + ' ' : '';
	address += venue?.country ? venue.country + ' ' : '';
	address += venue?.postalCode;
	return address;
};

const Contact = ({ route }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				main: {
					flex: 1,
				},
				linkRow: {
					flexDirection: 'row',
					alignItems: 'center',
					marginBottom: 10,
				},
				linkIcon: {
					width: 30,
					height: 30,
					justifyContent: 'center',
					alignItems: 'center',
				},
				link: {
					color: colors.primary,
					fontWeight: '500',
					justifyContent: 'center',
					fontSize: fonts.small,
					marginLeft: 10,
				},
				contactRow: {
					flexDirection: 'row',
					marginTop: 10,
					paddingTop: 10,
					paddingHorizontal: 10,
				},
				contactContent: {
					width: '50%',
				},
				contactMapView: {
					width: mapViewSize.width,
					height: mapViewSize.height,
				},
				contactAddress: {
					fontSize: fonts.small,
					color: colors.primary,
					fontWeight: weights.semibold,
					marginTop: 10,
				},
				contactSubAddress: {
					fontSize: fonts.small,
					color: colors.holderColor,
					fontWeight: weights.light,
					marginTop: 5,
				},
				flex: { flex: 1 },

				//Venue Styles
				venueRow: {
					flexDirection: 'row',
					marginTop: 10,
					marginBottom: 10,
				},
				venueButton: {
					width: 90,
					height: 30,
					marginRight: 10,
				},
				venueButtonText: {
					fontSize: fonts.small,
				},
				venueContent: {
					flex: 1,
					marginLeft: 10,
				},
				venueTop: {
					height: 10,
				},
				venueTitle: {
					fontSize: fonts.small,
					color: colors.primary,
					fontWeight: weights.semibold,
				},
				venueSubTitle: {
					fontSize: fonts.small,
					color: colors.holderColor,
					fontWeight: weights.light,
					marginTop: 5,
				},
				venueMap: {
					width: 100,
					height: 100,
					marginLeft: 10,
				},
			}),
		[colors]
	);
	const { festivalId } = route.params;
	const [isLoading, setIsLoading] = useState(false);
	const [hasError, setHasError] = useState(false);
	const [data, setData] = useState({
		venues: [],
	});
	const mainAddress = generateAddress(data);

	const loadData = async () => {
		try {
			setHasError(false);
			setIsLoading(true);
			const response = await Backend.Festival.contactAndVenue({
				festivalId,
			});
			if (response?.success) {
				setData(response.data);
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (tryErr) {
			console.log(tryErr);
			toast.error('Unable to load contact and venue');
			setHasError(true);
		} finally {
			setIsLoading(false);
		}
	};

	const locateAddress = async (v) => {
		const fullAdress = generateAddress(v);
		Linking.openURL(`http://maps.google.com/?daddr=${fullAdress}`);
	};

	const shareAddress = async (v) => {
		// React native share
	};

	useEffect(() => {
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<View style={style.main}>
			<Header title="Festival Contact" />
			<ScrollView
				refreshControl={
					<RefreshControl refreshing={false} onRefresh={loadData} />
				}
			>
				<Preloader
					isBusy={isLoading}
					onRetry={loadData}
					hasError={hasError}
					isEmpty={false}
				>
					<SectionCover title="Contact">
						<View style={style.contactRow}>
							<View style={style.contactContent}>
								{data?.email ? (
									<Link
										style={style}
										color={colors.holderColor}
										icon="mail"
										label="Mail"
										url={`mailto:${data?.email}`}
									/>
								) : null}
								<Link
									style={style}
									color={colors.holderColor}
									icon="phone"
									label={data?.phone ? data.phone : 'Not added'}
									url={data?.phone ? `tel:${data?.phone}` : null}
								/>
								<Link
									style={style}
									color={colors.holderColor}
									icon="globe"
									label="Website"
									url={data.website}
								/>
								<Link
									style={style}
									color={colors.holderColor}
									icon="facebook"
									label="Facebook"
									url={data?.facebook}
								/>
								<Link
									style={style}
									color={colors.holderColor}
									icon="instagram"
									label="Instagram"
									url={data?.instagram}
								/>
								<Link
									style={style}
									color={colors.holderColor}
									icon="twitter"
									label="Twitter"
									url={data?.twitter}
								/>
							</View>
							<View style={style.flex}>
								<Image
									style={style.contactMapView}
									hash={hash}
									// url={mapURL}
								/>
								<Text style={style.contactAddress}>{data.address}</Text>
								<Text style={style.contactSubAddress}>{mainAddress}</Text>
							</View>
						</View>
					</SectionCover>

					<SectionCover title="Venues">
						<View style={style.venueTop} />
						<Preloader
							isBusy={false}
							hasError={false}
							emptyText="No Venues added"
							isEmpty={!data?.festivalVenues?.length}
						>
							{(data?.festivalVenues || []).map((venue) => {
								const subText = generateAddress(venue);
								return (
									<View style={style.venueRow} key={venue.id}>
										<Image style={style.venueMap} hash={hash} />
										<View style={style.venueContent} key={venue.id}>
											<Text style={style.venueTitle}>{venue.address}</Text>
											<Text style={style.venueSubTitle}>{subText}</Text>
											<View style={style.venueRow}>
												<Button
													icon={'map-pin'}
													type={Button.OUTLINE_ICON_PRIMARY}
													style={style.venueButton}
													text={'Locate'}
													iconSize={12}
													onPress={() => locateAddress(venue)}
													textStyle={style.venueButtonText}
												/>
												<Button
													icon={'share-2'}
													type={Button.OUTLINE_ICON_SUCCESS}
													style={style.venueButton}
													text={'Share'}
													iconSize={12}
													onPress={() => shareAddress(venue)}
													textStyle={style.venueButtonText}
												/>
											</View>
										</View>
									</View>
								);
							})}
						</Preloader>
					</SectionCover>
				</Preloader>
			</ScrollView>
		</View>
	);
};

export default Contact;