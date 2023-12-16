import React, { useState, useMemo, Component, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { NestableScrollContainer } from 'react-native-draggable-flatlist';

//Custom Components
import SheetButtonModal from 'components/modal/sheetButtonModal';
import CountryInput from 'components/input/countryInput';
import Loading from 'components/modal/loading';
import Button from 'components/button/';
import Input from 'components/input';
import SectionText from './sectionText';
import Table from './table';
import Title from './title';
import Header from './header';
import SaveButton from './saveButton';

//Modals
import VenueModal from 'modals/venue';

//Helper Functions
import moment from 'moment';
import toast from 'libs/toast';
import Backend from 'backend';
import validation from 'utils/validation';

// Hooks
import { useTheme } from '@react-navigation/native';

//Constants
import infoNote, { infoType } from './info';
import { ERROR_TEXT, BUTTON_HEIGHT } from 'utils/constants';
import {
	TOP_GAP,
	formWidth,
	formWidthInput,
	coverWidth,
	sharedStyle,
} from './constants';
import { fonts } from 'themes/topography';

const ContactVenue = ({ navigation, route }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				addButton: { fontSize: 14, fontWeight: 400 },
				holder: {
					alignItems: 'center',
					alignSelf: 'center',
					width: coverWidth,
					backgroundColor: colors.card,
					paddingBottom: 120,
				},
				main: {
					width: formWidth,
					paddingBottom: TOP_GAP,
				},
				input: {
					height: BUTTON_HEIGHT,
					width: formWidth,
					marginTop: 10,
					fontSize: fonts.regular,
				},
				inputHalf: {
					height: BUTTON_HEIGHT,
					width: formWidthInput,
					marginTop: 10,
					fontSize: fonts.regular,
				},
				validFont: {
					fontSize: fonts.regular,
				},
				inputRow: {
					flexDirection: 'row',
					flexWrap: 'wrap',
					alignItems: 'center',
				},
				titleButton: {
					marginTop: 20,
					height: 30,
					width: 120,
				},
			}),
		[colors]
	);

	const addVenueModal = useRef();
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState({});
	const onNewData = (newData) => {
		setData({
			...data,
			...newData,
		});
	};

	const loadFestivalData = async () => {
		try {
			setIsLoading(true);
			const festivalId = route.params.id;
			const response = await Backend.Festival.getStageWiseData({
				festivalId,
				stageId: 1,
			});
			if (response?.success) {
				const festival = response.data;
				const festivalVenues = VenueModal.createAllVenueTableStructure(
					festival.festivalVenues
				);
				setData({
					...festival,
					festivalVenues,
				});
			} else if (festivalId) {
				navigation.goBack();
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (err) {
			toast.error(err.message || ERROR_TEXT);
		} finally {
			setIsLoading(false);
		}
	};

	const addVenue = () => {
		addVenueModal.current.show(null, (dta) => {
			createEditVenue(dta, true);
		});
	};

	const handleVenueEdit = (cellData) => {
		const venue = VenueModal.getVenueTableStructure(cellData);
		addVenueModal.current.show(venue, (dta) => {
			dta.idx = cellData.idx;
			createEditVenue(dta, false);
		});
	};

	const handleVenueDelete = async (cellData) => {
		const festivalVenues = [...(data?.festivalVenues || [])];
		const deleteIdx = festivalVenues.findIndex((o) => o.idx === cellData.idx);
		if (deleteIdx === -1) {
			toast.error(ERROR_TEXT);
		}
		festivalVenues.splice(deleteIdx, 1);
		onNewData({
			festivalVenues,
		});
	};

	const createEditVenue = async (venueData, isNew = true) => {
		const idx = moment().unix();
		const festivalVenues = [...(data?.festivalVenues || [])];
		if (isNew) {
			const newVenue = VenueModal.createVenueTableStructure(venueData, idx + 1);
			festivalVenues.push(newVenue);
		} else {
			const venueIndex = festivalVenues.findIndex(
				(o) => o.idx === venueData.idx
			);
			if (venueIndex === -1) {
				toast.error(ERROR_TEXT);
				return;
			}
			const modifiedVenue = VenueModal.createVenueTableStructure(
				venueData,
				venueData.idx
			);
			festivalVenues[venueIndex] = modifiedVenue;
		}
		onNewData({
			festivalVenues,
		});
	};

	const handleSave = async () => {
		try {
			setIsLoading(true);
			const payload = {
				id: data.id,
				email: data.email,
				phone: data.phone,
				city: data.city,
				address: data.address,
				country: data.country,
				postalCode: data.postalCode,
				state: data.state,
				facebook: data.facebook,
				instagram: data.instagram,
				twitter: data.twitter,
				website: data.website,
				festivalVenues: VenueModal.getAllVenueTableStructure(
					data.festivalVenues
				),
			};
			const response = await Backend.Festival.updateFestivalContactDetails(
				payload
			);
			if (response.success) {
				onNewData({
					id: response.data.id,
					festivalVenues: VenueModal.createAllVenueTableStructure(
						response.data.festivalVenues
					),
				});
				toast.success('Contact Details Saved Successfully!');
				navigation.goBack();
				return;
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (err) {
			setTimeout(() => {
				toast.error(err.message);
			}, 200);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadFestivalData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<Header
				title="Contact & Venue Information"
				subTitle="Will be displayed on festival page"
			/>
			<View style={style.holder}>
				<NestableScrollContainer showsVerticalScrollIndicator={false}>
					<View style={style.main}>
						<Title text="Email" required />
						<Input
							value={data?.email}
							autoCapitalize="none"
							onChangeText={(email) => onNewData({ email })}
							style={style.input}
						/>

						<Title text="Phone" />
						<Input
							style={style.input}
							value={data?.phone}
							keyboardType="numeric"
							onChangeText={(phone) => onNewData({ phone })}
						/>

						<Title text="Address" />
						<Input
							style={style.input}
							value={data?.address}
							onChangeText={(address) => onNewData({ address })}
						/>

						<View style={style.inputRow}>
							<View style={sharedStyle.marginFix}>
								<Title text="City" />
								<Input
									style={style.inputHalf}
									value={data?.city}
									onChangeText={(city) => onNewData({ city })}
								/>
							</View>
							<View style={sharedStyle.marginFix}>
								<Title text="State / Province" />
								<Input
									style={style.inputHalf}
									value={data?.state}
									onChangeText={(state) => onNewData({ state })}
								/>
							</View>
						</View>

						<View style={style.inputRow}>
							<View style={sharedStyle.marginFix}>
								<Title text="Postal Code" />
								<Input
									style={style.inputHalf}
									value={data?.postalCode}
									onChangeText={(postalCode) => onNewData({ postalCode })}
								/>
							</View>
							<View style={sharedStyle.marginFix}>
								<Title text="Country" required />
								<CountryInput
									disabled
									style={style.inputHalf}
									value={data?.country}
									textStyle={sharedStyle.validFont}
									onSelect={(country) => onNewData({ country })}
								/>
							</View>
						</View>

						<SectionText
							text="Socail Media"
							subText="Add your social media handles"
						/>
						<View style={style.inputRow}>
							<View style={sharedStyle.marginFix}>
								<Title text="Facebook" />
								<Input
									placeholder="https://facebook.com/iffi"
									style={style.inputHalf}
									value={data?.facebook}
									onChangeText={(facebook) => onNewData({ facebook })}
								/>
							</View>
							<View style={sharedStyle.marginFix}>
								<Title text="Instagram" />
								<Input
									placeholder="https://instagram.com/iffi"
									style={style.inputHalf}
									value={data?.instagram}
									onChangeText={(instagram) => onNewData({ instagram })}
								/>
							</View>
						</View>
						<Title text="Twitter" />
						<Input
							placeholder="https://twitter.com/iffi"
							style={style.inputHalf}
							value={data?.twitter}
							onChangeText={(twitter) => onNewData({ twitter })}
						/>

						<Title text="Website" />
						<Input
							style={style.inputHalf}
							value={data?.website}
							onChangeText={(website) => onNewData({ website })}
						/>

						<Title
							text="Festival Venue"
							whatIsThis={infoNote[infoType.venue]}
						/>
						<Table
							columns={[
								{ title: 'Venue Name', width: 70, key: 'name' },
								{ title: 'Actions', width: 30, align: 'right' },
							]}
							sortable
							pressable
							rows={data.festivalVenues}
							onEmptyPress={addVenue}
							onSort={(s) =>
								onNewData({
									festivalVenues: s.data,
								})
							}
							onEdit={handleVenueEdit}
							onCellPress={handleVenueEdit}
							onDelete={handleVenueDelete}
							emptyText="Click here to add venue"
						/>
						<Button
							icon={'map-pin'}
							type={Button.OUTLINE_ICON_PRIMARY}
							style={style.titleButton}
							text={'Add Venue'}
							onPress={addVenue}
							iconSize={14}
							textStyle={sharedStyle.addButton}
						/>
					</View>
				</NestableScrollContainer>
			</View>
			<SaveButton colors={colors} onPress={handleSave} />
			<CreateVenueModal ref={addVenueModal} />
			<Loading busy={isLoading} />
		</>
	);
};

class CreateVenueModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			...VenueModal.defaultVenueData,
			visible: false,
		};
		this.callback = null;
	}

	show = (previousData = null, cb) => {
		if (previousData) {
			this.setState(previousData);
		} else {
			this.setState(VenueModal.defaultVenueData);
		}
		this.callback = cb;
		this.setState({ visible: true });
	};

	close = () => {
		this.callback = null;
		this.setState({ visible: false });
	};

	handleSubmit = () => {
		const { id, name, state, postalCode, country, address, city } = this.state;
		if (!validation.validName(name)) {
			this.venueName.setError('Please Enter Valid Name');
			return;
		}
		if (!country) {
			this.countryPicker.setError('Please select country');
			return;
		}
		if (this.callback) {
			this.callback({
				id,
				name,
				state,
				postalCode,
				country,
				address,
				city,
			});
		}
		this.setState({ visible: false });
	};

	render() {
		const { name, state, postalCode, country, address, city, visible } =
			this.state;
		return (
			<SheetButtonModal
				title="Festival Venue"
				visible={visible}
				onClose={this.close}
				onSubmit={this.handleSubmit}
				keyboardAware
			>
				<Input
					style={sharedStyle.modalInput}
					placeholder="Venue Name"
					value={name}
					onChangeText={(n) => this.setState({ name: n })}
				/>
				<Input
					style={sharedStyle.modalInput}
					placeholder="Address"
					value={address}
					onChangeText={(a) => this.setState({ address: a })}
				/>
				<Input
					style={sharedStyle.modalInput}
					placeholder="City"
					value={city}
					onChangeText={(c) => this.setState({ city: c })}
				/>
				<Input
					style={sharedStyle.modalInput}
					placeholder="State / Province"
					value={state}
					onChangeText={(s) => this.setState({ state: s })}
				/>
				<Input
					style={sharedStyle.modalInput}
					placeholder="Postal Code"
					value={postalCode}
					onChangeText={(p) => this.setState({ postalCode: p })}
				/>
				<CountryInput
					style={sharedStyle.modalInput}
					placeholder="Country"
					value={country}
					withinModal
					inputProps={{
						placeholder: 'Select Country',
					}}
					textStyle={sharedStyle.validFont}
					onSelect={(c) => this.setState({ country: c })}
				/>
			</SheetButtonModal>
		);
	}
}

export default gestureHandlerRootHOC(ContactVenue);
