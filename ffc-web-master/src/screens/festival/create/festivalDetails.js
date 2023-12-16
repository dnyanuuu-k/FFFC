import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

//Custom Components
import SheetButtonModal from "components/modal/sheetButtonModal";
import Cropper, { COVER, LOGO } from "components/cropper";
import Radio from "components/radio/radio1";
import Button from "components/button/";
import Input from "components/input";
import Image from "components/image";
import Table from "./table";
import Title from "./title";
import Header from "./header";

//Third-Party Components
import FeatherIcon from "feather-icons-react";

//Modals
import OrganizerModal from "modals/organizer";
import FestivalTypeModal from "modals/festivalType";

//Third Party Functions
import moment from "moment";
import toast from "react-hot-toast";

//Helper Functions
import Backend from "backend";
import validation from "utils/validation";
import filePicker from "utils/filePicker";

//Constants
import { festivalDetailStyles as style } from "./style";
import { ERROR_TEXT, BORDER_RADIUS } from "utils/constants";
import infoNote, { infoType } from "./info";
import colors from "themes/colors";

export default class FestivalDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			festivalTypes: FestivalTypeModal.defaultFestivalTypes,
		};
	}

	componentDidMount() {
		this.init();
	}

	init = async () => {
		try {
			const festivalTypes = await Backend.Festival.festivalTypes();
			if (festivalTypes?.success) {
				this.setState({
					festivalTypes: festivalTypes.data,
				});
			}
		} catch (err) {
			//Ignore
			//TODO Handle Error
		}
	};

	updateFestivalName = () => {
		const currentName = (this.props.data || {}).name;
		this.nameChangeModal.show(currentName, (name) => {
			if(name === currentName){
				toast.error("Their was no change in name");
			}else{
				this.handleRequestNameChange(name);
			}		
		});
	};

	addNewOrganizer = () => {
		this.addOrganizerModal.show(null, (data) => {
			this.createEditOrganizer(data, true);
		});
	};

	handleOrganizerEdit = (cellData) => {
		const organizer = OrganizerModal.getOrganizerTableStructure(cellData);
		this.addOrganizerModal.show(organizer, (data) => {
			data.idx = cellData.idx;
			this.createEditOrganizer(data, false);
		});
	};

	handleOrganizerDelete = async (cellData) => {
		const { data, onNewData } = this.props;
		const festivalOrganizers = data?.festivalOrganizers || [];
		const deleteIdx = festivalOrganizers.findIndex(
			(o) => o.idx === cellData.idx
		);
		if (deleteIdx === -1) {
			toast.error(ERROR_TEXT);
		}
		festivalOrganizers.splice(deleteIdx, 1);
		onNewData({ festivalOrganizers });
	};

	createEditOrganizer = async (orgainzerData, isNew = true) => {
		const { data, onNewData } = this.props;
		const idx = moment().unix();
		const festivalOrganizers = data?.festivalOrganizers || [];
		if (isNew) {
			const newOrganizer = OrganizerModal.createOrganizerTableStructure(
				orgainzerData,
				idx + 1
			);
			festivalOrganizers.push(newOrganizer);
		} else {
			const organizerIndex = festivalOrganizers.findIndex(
				(o) => o.idx === orgainzerData.idx
			);
			if (organizerIndex === -1) {
				toast.error(ERROR_TEXT);
				return;
			}
			const modifiedOrganizer =
				OrganizerModal.createOrganizerTableStructure(
					orgainzerData,
					orgainzerData.idx
				);
			festivalOrganizers[organizerIndex] = modifiedOrganizer;
		}
		onNewData({
			festivalOrganizers,
		});
	};

	pickImage = (type) => {
		filePicker.pickSingleImage((image) => {
			if (image) {
				const imageURL = URL.createObjectURL(image);
				this.imageCropper.startEditor(type, imageURL);
			}
		});
	};

	uploadErrorMessage = (type) => {
		return `We are unable to update ${type === COVER ? "cover" : "logo"}`;
	};

	handleImageUpload = (imageCanvas, type) => {
		if (imageCanvas) {
			imageCanvas?.toBlob((blob) => {
				this.sendImageToServer(blob, type);
			});
			return;
		}
		toast.error(this.uploadErrorMessage(type));
	};

	sendImageToServer = async (fileBlob, type) => {
		try {
			this.props.onBusy(true);
			const { data, onNewData } = this.props;
			let uploadFunciton = null;
			if (type === LOGO) {
				uploadFunciton = Backend.Festival.uploadFestivalLogo;
			} else {
				uploadFunciton = Backend.Festival.uploadFestivalCover;
			}
			const response = await uploadFunciton(data.id, fileBlob);
			if (response?.success) {
				onNewData(response.data);
				toast.success(
					`${LOGO === type ? "Logo" : "Cover"} Updated Successfully`
				);
			} else {
				throw new Error(
					response?.message || this.uploadErrorMessage(type)
				);
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			this.props.onBusy(false);
		}
	};

	handleRequestNameChange = async (festivalName) => {
		try {
			if (!festivalName) {
				return;
			}
			this.props.onBusy(true);
			const { data, onNewData } = this.props;
			const response = await Backend.Festival.requestNameChange({
				festivalName,
				festivalId: data.id,
			});
			if (response?.success) {
				onNewData(response.data);
				toast.success(`Request Submitted Successfully`);
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			this.props.onBusy(false);
		}
	};

	handleSave = async () => {
		try {
			const { data, onNewData } = this.props;
			this.props.onBusy(true);
			const payload = {
				id: data.id,
				awards: data.awards,
				terms: data.terms,
				festivalType: data.festivalType,
				description: data.description,
				name: data.name,
				yearsRunning: data.yearsRunning,
				festivalOrganizers:
					OrganizerModal.getAllOrganizerTableStructure(
						data.festivalOrganizers
					),
			};
			const response = await Backend.Festival.updateFestivalDetails(
				payload
			);
			if (response.success) {
				onNewData({
					id: response.data.id,
					festivalOrganizers:
						OrganizerModal.createAllOrganizerTableStructure(
							response.data.festivalOrganizers
						),
				});
				toast.success("Festival Details Saved Successfully!");
				this.props?.nextSection();
				return;
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			this.props.onBusy(false);
		}
	};

	renderNameChangeRequest = () => {
		return (
			<View
				style={pageStyle.inputCover}
			>
				<Button
					type={Button.PRIMARY}
					style={style.editButton}
					text={"Edit Request"}
					onPress={this.updateFestivalName}
					iconSize={16}
					textStyle={pageStyle.buttonFont}
				/>
			</View>
		);
	};

	render() {
		const { data, onNewData } = this.props;
		const { festivalTypes } = this.state;
		return (
			<>
				<View style={style.main}>
					<Header
						title="Festival Details"
						subTitle="Basic information about your festival"
					/>
					<View style={style.coverHolder}>
						<Image
							style={style.cover}
							url={data?.coverUrl}
							hash={data?.coverHash}
						/>
						<TouchableOpacity
							style={style.uploadCoverBtn}
							onPress={() => this.pickImage(COVER)}
						>
							<FeatherIcon
								icon="camera"
								color={colors.buttonTxt}
								size={15}
							/>
							<Text style={style.uploadText}>Update Cover</Text>
						</TouchableOpacity>
						<View style={style.logoHolder}>
							<Image
								style={style.logo}
								hash={data?.logoHash}
								url={data?.logoUrl}
							/>
							<TouchableOpacity
								onPress={() => this.pickImage(LOGO)}
								style={style.logoBtn}
							>
								<FeatherIcon
									icon="camera"
									color={colors.buttonTxt}
									size={20}
								/>
							</TouchableOpacity>
						</View>
					</View>
					<Title text="Festival Name" required />
					<View>
						<Input
							style={style.input}
							value={data?.name}
							onChangeText={(name) => onNewData({ name })}
						/>
						{data?.published
							? this.renderNameChangeRequest()
							: null}
					</View>
					<Title text="Festival Type" required />
					<Radio
						options={festivalTypes}
						value={data?.festivalType}
						multiple={true}
						onChange={(v) => onNewData({ festivalType: v })}
						cardStyle={style.radio}
					/>
					<Title
						text="Years Running"
						required
						whatIsThis={infoNote[infoType.year_running]}
					/>
					<Input
						style={style.inputHalf}
						value={data?.yearsRunning}
						onChangeText={(yearsRunning) =>
							onNewData({ yearsRunning })
						}
					/>

					<Title text="Festival Description" required />
					<Input
						value={data?.description}
						onChangeText={(description) =>
							onNewData({ description })
						}
						multiline
						style={style.inputArea}
						placeholder={infoNote[infoType.description]}
						whatIsThis={infoNote[infoType.description]}
					/>

					<Title
						text="Awards & Prizes"
						whatIsThis={infoNote[infoType.awards]}
					/>
					<Input
						multiline
						value={data?.awards}
						style={style.inputArea}
						onChangeText={(awards) => onNewData({ awards })}
					/>

					<Title
						text="Rules & Terms"
						required
						whatIsThis={infoNote[infoType.terms]}
					/>
					<Input
						multiline
						value={data?.terms}
						style={style.inputArea}
						onChangeText={(terms) => onNewData({ terms })}
					/>

					<Title text="Festival Organizers" />
					<Table
						columns={[
							{ title: "Name", width: 37, key: "name" },
							{
								title: "Designation",
								width: 37,
								key: "designation",
							},
							{ title: "Actions", width: 26, align: "right" },
						]}
						sortable
						pressable
						onSort={(festivalOrganizers) =>
							onNewData({
								festivalOrganizers,
							})
						}
						onEmptyPress={this.addNewOrganizer}
						onEdit={this.handleOrganizerEdit}
						onCellPress={this.handleOrganizerEdit}
						onDelete={this.handleOrganizerDelete}
						rows={data.festivalOrganizers}
						emptyText="Click here to add organizer"
					/>
					<Button
						icon={"user-plus"}
						type={Button.OUTLINE_ICON_PRIMARY}
						style={style.titleButton}
						text={"Add Organizer"}
						onPress={this.addNewOrganizer}
						iconSize={16}
						textStyle={pageStyle.buttonFont}
					/>
					{/* TODO: Think that this section should be kept or not*/}
					{/*<Title text="Key Stats" whatIsThis />
					<View style={style.inputRow}>
						<Input
							placeholder="Audience Attendance"
							disabled={true}
							style={style.inputHalf}
						/>
						<Input
							placeholder="Estimated Submissions"
							disabled={true}
							style={{ ...style.inputHalf, marginLeft: 10 }}
						/>
						<Input
							placeholder="Projects Selected"
							style={style.inputHalf}
						/>
						<Input
							placeholder="Awards Presented"
							style={{ ...style.inputHalf, marginLeft: 10 }}
						/>
					</View>*/}
					<Button
						onPress={this.handleSave}
						textStyle={style.buttonTxt}
						style={style.button}
						text="Save & Continue"
					/>
				</View>
				<CreateOrganizerModal
					ref={(ref) => (this.addOrganizerModal = ref)}
				/>
				<NameChangeModal ref={(ref) => (this.nameChangeModal = ref)} />
				<Cropper
					ref={(ref) => (this.imageCropper = ref)}
					onSubmitImage={this.handleImageUpload}
				/>
			</>
		);
	}
}

class CreateOrganizerModal extends Component {
	constructor(props) {
		super(props);
		this.state = OrganizerModal.defaultOrganizerData;
		this.callback = null;
	}

	show = (previousData = null, cb) => {
		if (previousData) {
			this.setState(previousData);
		} else {
			this.setState(OrganizerModal.defaultOrganizerData);
		}
		this.callback = cb;
		this.modal.open();
		setTimeout(() => {
			this.organizerName?.focus();
		}, 600);
	};

	close = () => {
		this.callback = null;
	};

	handleSubmit = () => {
		const { id, name, designation } = this.state;
		if (!validation.validName(name)) {
			this.organizerName.setError("Please Enter Valid Name");
			return;
		}
		if (!validation.validName(name)) {
			this.organizerDesignation.setError(
				"Please Enter Valid Designation"
			);
			return;
		}
		if (this.callback) {
			this.callback({ id, name, designation });
		}
		this.modal.close();
	};

	render() {
		const { designation, name } = this.state;
		return (
			<SheetButtonModal
				title="Add Organizer"
				onClose={this.close}
				onSubmit={this.handleSubmit}
				ref={(ref) => (this.modal = ref)}
			>
				<Input
					style={style.modalInput}
					placeholder="Organizer Name"
					value={name}
					ref={(ref) => (this.organizerName = ref)}
					onChangeText={(name) => this.setState({ name })}
				/>
				<Input
					style={style.modalInput}
					placeholder="Designation"
					value={designation}
					ref={(ref) => (this.organizerDesignation = ref)}
					onChangeText={(designation) =>
						this.setState({ designation })
					}
				/>
			</SheetButtonModal>
		);
	}
}

class NameChangeModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
		};
		this.callback = null;
	}

	show = (name, cb) => {
		this.setState({ name });
		this.callback = cb;
		this.modal.open();
		setTimeout(() => {
			this.festivalName?.focus();
		}, 600);
	};

	close = () => {
		this.callback = null;
	};

	handleSubmit = () => {
		const { name } = this.state;
		if (!validation.validName(name)) {
			this.festivalName.setError("Please Enter Valid Name");
			return;
		}
		if (this.callback) {
			this.callback(name);
		}
		this.modal.close();
	};

	render() {
		const { name } = this.state;
		return (
			<SheetButtonModal
				title="Change Festival Name"
				onClose={this.close}
				onSubmit={this.handleSubmit}
				ref={(ref) => (this.modal = ref)}
			>
				<Input
					style={style.modalInput}
					placeholder="Festival New Name"
					value={name}
					ref={(ref) => (this.festivalName = ref)}
					onChangeText={(name) => this.setState({ name })}
				/>
			</SheetButtonModal>
		);
	}
}


const pageStyle = StyleSheet.create({
	inputCover: {
		width: "100%",
		height: 42,
		marginTop: 10,
		borderRadius: BORDER_RADIUS,
		position: "absolute",
		backgroundColor: colors.bgTrans21,
		justifyContent: "center",
		alignItems: "flex-end",
	},
	editButton: { height: 30, width: 100, marginRight: 5 },
	buttonFont: { fontSize: 14, fontWeight: 400 }
});
