import React, { Component } from "react";
import { View } from "react-native";

// Custom Components
import SheetButtonModal from "components/modal/sheetButtonModal";
import Button from "components/button/";
import Input from "components/input";
import Loading from "components/modal/loading";
import CountryInput from "components/input/countryInput";
import SectionText from "components/form/sectionText";
import Table from "./table";
import Title from "./title";
import Header from "./header";

// Modals
import VenueModal from "modals/venue";

// Helper functions
import validation from "utils/validation";
import Backend from "backend";

// Constants
import { festivalDetailStyles as style } from "./style";
import { ERROR_TEXT } from "utils/constants";
import infoNote, { infoType } from "./info";

// Third Party Components
import toast from "react-hot-toast";

// Third Party Functions
import moment from "moment";


export default class ContactVenue extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isBusy: false,
		};
	}

	addVenue = () => {
		this.addVenueModal.show(null, (data) => {
			this.createEditVenue(data, true);
		});
	};

	handleVenueEdit = (cellData) => {
		const venue = VenueModal.getVenueTableStructure(cellData);
		this.addVenueModal.show(venue, (data) => {
			data.idx = cellData.idx;
			this.createEditVenue(data, false);
		});
	};

	handleVenueDelete = async (cellData) => {
		const { data, onNewData } = this.props;
		const festivalVenues = data?.festivalVenues || [];
		const deleteIdx = festivalVenues.findIndex(
			(o) => o.idx === cellData.idx
		);
		if (deleteIdx === -1) {
			toast.error(ERROR_TEXT);
		}
		festivalVenues.splice(deleteIdx, 1);
		onNewData({
			festivalVenues
		});
	};

	createEditVenue = async (venueData, isNew = true) => {
		const { data, onNewData } = this.props;
		const idx = moment().unix();
		const festivalVenues = data?.festivalVenues || [];
		if (isNew) {
			const newVenue = VenueModal.createVenueTableStructure(
				venueData,
				idx + 1
			);
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

	handleSave = async () => {
		const { data, onNewData, onBusy } = this.props;
		try {
			onBusy(true);
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
				festivalVenues: VenueModal.getAllVenueTableStructure(
					data.festivalVenues
				),
			};
			const response =
				await Backend.Festival.updateFestivalContactDetails(payload);
			if (response.success) {
				onNewData({
					id: response.data.id,
					festivalVenues: VenueModal.createAllVenueTableStructure(
						response.data.festivalVenues
					),
				});
				toast.success("Contact Details Saved Successfully!");
				this.props?.nextSection();
				return;
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			onBusy(false);
		}
	};

	render() {
		const { data, onNewData } = this.props;
		const { isBusy } = this.state;
		return (
			<>
				<View style={style.main}>
					<Header
						title="Contact & Venue Information"
						subTitle="Will be displayed on festival page"
					/>

					<Title text="Email" required />
					<Input
						value={data?.email}
						onChangeText={(email) => onNewData({ email })}
						style={style.input}
					/>

					<Title text="Phone" />
					<Input
						style={style.input}
						value={data?.phone}
						onChangeText={(phone) => onNewData({ phone })}
					/>

					<Title text="Address" />
					<Input
						style={style.input}
						value={data?.address}
						onChangeText={(address) => onNewData({ address })}
					/>

					<View style={style.inputRow}>
						<View style={{ marginRight: 20 }}>
							<Title text="City" />
							<Input
								style={style.inputHalf}
								value={data?.city}
								onChangeText={(city) => onNewData({ city })}
							/>
						</View>
						<View style={{ marginRight: 20 }}>
							<Title text="State / Province" />
							<Input
								style={style.inputHalf}
								value={data?.state}
								onChangeText={(state) => onNewData({ state })}
							/>
						</View>
					</View>

					<View style={style.inputRow}>
						<View style={{ marginRight: 20 }}>
							<Title text="Postal Code" />
							<Input
								style={style.inputHalf}
								value={data?.postalCode}
								onChangeText={(postalCode) =>
									onNewData({ postalCode })
								}
							/>
						</View>
						<View style={{ marginRight: 20 }}>
							<Title text="Country" required />
							<CountryInput
								style={style.inputHalf}
								value={data?.country}
								onSelect={(country) => onNewData({ country })}
							/>
						</View>
					</View>

					<SectionText
						text="Socail Media"
						subText="Add your social media handles"
					/>
					<View style={style.inputRow}>
						<View style={{ marginRight: 20 }}>
							<Title text="Facebook" />
							<Input
								style={style.inputHalf}
								value={data?.facebook}
								onChangeText={(facebook) =>
									onNewData({ facebook })
								}
							/>
						</View>
						<View style={{ marginRight: 20 }}>
							<Title text="Instagram" />
							<Input
								style={style.inputHalf}
								value={data?.instagram}
								onChangeText={(instagram) =>
									onNewData({ instagram })
								}
							/>
						</View>
					</View>
					<Title text="Twitter" />
					<Input
						style={style.inputHalf}
						value={data?.twitter}
						onChangeText={(twitter) => onNewData({ twitter })}
					/>

					<Title text="Festival Venue" whatIsThis={infoNote[infoType.location]} />
					<Table
						columns={[
							{ title: "Venue Name", width: 70, key: "name" },
							{ title: "Actions", width: 30, align: "right" },
						]}
						sortable
						pressable
						rows={data.festivalVenues}
						onEmptyPress={this.addVenue}
						onSort={(festivalVenues) =>
							onNewData({
								festivalVenues,
							})
						}
						onEdit={this.handleVenueEdit}
						onCellPress={this.handleVenueEdit}
						onDelete={this.handleVenueDelete}
						emptyText="Click here to add venue"
					/>
					<Button
						icon={"map-pin"}
						type={Button.OUTLINE_ICON_PRIMARY}
						style={[style.titleButton, { width: 120 }]}
						text={"Add Venue"}
						onPress={this.addVenue}
						iconSize={14}
						textStyle={{ fontSize: 14, fontWeight: 400 }}
					/>

					<Button
						onPress={this.handleSave}
						textStyle={style.buttonTxt}
						style={style.button}
						text="Save & Continue"
					/>
				</View>
				<CreateVenueModal ref={(ref) => (this.addVenueModal = ref)} />
				<Loading busy={isBusy} />
			</>
		);
	}
}

class CreateVenueModal extends Component {
	constructor(props) {
		super(props);
		this.state = VenueModal.defaultVenueData;
		this.callback = null;
	}

	show = (previousData = null, cb) => {
		if (previousData) {
			this.setState(previousData);
		} else {
			this.setState(VenueModal.defaultVenueData);
		}
		this.callback = cb;
		this.modal.open();
		setTimeout(() => {
			this.venueName?.focus();
		}, 600);
	};

	close = () => {
		this.callback = null;
	};

	handleSubmit = () => {
		const { id, name, state, postalCode, country, address, city } =
			this.state;
		if (!validation.validName(name)) {
			this.venueName.setError("Please Enter Valid Name");
			return;
		}
		if (!country) {
			this.countryPicker.setError("Please select country");
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
		this.modal.close();
	};

	render() {
		const { name, state, postalCode, country, address, city } = this.state;
		return (
			<SheetButtonModal
				title="Festival Venue"
				onClose={this.close}
				onSubmit={this.handleSubmit}
				ref={(ref) => (this.modal = ref)}
			>
				<Input
					style={style.modalInput}
					placeholder="Venue Name"
					value={name}
					ref={(ref) => (this.venueName = ref)}
					onChangeText={(name) => this.setState({ name })}
				/>				
				<Input
					style={style.modalInput}
					placeholder="Address"
					value={address}
					onChangeText={(address) => this.setState({ address })}
				/>
				<Input
					style={style.modalInput}
					placeholder="City"
					value={city}
					onChangeText={(city) => this.setState({ city })}
				/>
				<Input
					style={style.modalInput}
					placeholder="State / Province"
					value={state}
					onChangeText={(state) => this.setState({ state })}
				/>
				<Input
					style={style.modalInput}
					placeholder="Postal Code"
					value={postalCode}
					onChangeText={(postalCode) => this.setState({ postalCode })}
				/>
				<CountryInput
					style={style.modalInput}
					placeholder="Country"
					value={country}
					withinModal
					inputProps={{
						placeholder: "Select Country",
					}}
					textStyle={style.validFont}
					ref={(ref) => (this.countryPicker = ref)}
					onSelect={(country) => this.setState({ country })}
				/>
			</SheetButtonModal>
		);
	}
}