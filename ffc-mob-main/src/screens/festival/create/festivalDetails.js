import React, { useEffect, useState, useMemo, Component, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { NestableScrollContainer } from 'react-native-draggable-flatlist';
//Custom Components
import SheetButtonModal from 'components/modal/sheetButtonModal';

import Loading from 'components/modal/loading';
import Radio from 'components/radio/radio1';
import Button from 'components/button/';
import Input from 'components/input';
import Image from 'components/image';
import Table from './table';
import Title from './title';
import Header from './header';
import SaveButton from './saveButton';

//Third-Party Components
import FeatherIcon from 'react-native-vector-icons/Feather';

//Modals
import OrganizerModal from 'modals/organizer';
import FestivalTypeModal from 'modals/festivalType';

//Helper Functions
import moment from 'moment';
import toast from 'libs/toast';
import Backend from 'backend';
import validation from 'utils/validation';
import { openPicker } from 'libs/mediapicker';
import helper from 'utils/helper';

// Hooks
import { useTheme } from '@react-navigation/native';

//Constants
import infoNote, { infoType } from './info';
import {
	ERROR_TEXT,
	COVER,
	LOGO,
	BORDER_RADIUS,
	BUTTON_HEIGHT,
	WINDOW_WIDTH,
	COVER_IMAGE_HEIGHT,
} from 'utils/constants';
import {
	LOGO_SIZE,
	TOP_GAP,
	TOP_GAP2,
	formWidth,
	formWidthInput,
	coverHeight,
	coverWidth,
	sharedStyle,
} from './constants';
import { fonts } from 'themes/topography';

const FestivalDetails = ({ navigation, route }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				holder: {
					alignItems: 'center',
					alignSelf: 'center',
					width: coverWidth,
					backgroundColor: colors.card,
					paddingBottom: 80,
				},
				main: {
					width: formWidth,
					paddingBottom: TOP_GAP + 60,
				},
				coverHolder: {
					backgroundColor: colors.holderColor,
					borderColor: colors.border,
					borderRadius: BORDER_RADIUS,
					width: formWidth,
					marginTop: TOP_GAP,
					marginBottom: TOP_GAP,
					borderWidth: 1,
					height: coverHeight,
				},
				cover: {
					borderRadius: BORDER_RADIUS,
					width: formWidth,
					height: coverHeight,
				},
				uploadCoverBtn: {
					height: 30,
					position: 'absolute',
					top: 10,
					right: 10,
					flexDirection: 'row',
					borderRadius: BORDER_RADIUS,
					backgroundColor: colors.bgTrans,
					justifyContent: 'center',
					alignItems: 'center',
					paddingHorizontal: 10,
				},
				uploadText: {
					paddingLeft: 10,
					fontSize: fonts.regular,
					color: colors.buttonTxt,
					fontWeight: '500',
				},
				logoHolder: {
					width: LOGO_SIZE,
					height: LOGO_SIZE,
					borderRadius: 100,
					position: 'absolute',
					bottom: -26,
					left: 10,
					backgroundColor: colors.card,
					borderWidth: 2,
					borderColor: colors.border,
					overflow: 'hidden',
					alignItems: 'center',
				},
				logo: {
					width: LOGO_SIZE,
					height: LOGO_SIZE,
				},
				logoBtn: {
					width: 35,
					height: 35,
					borderRadius: 100,
					justifyContent: 'center',
					alignItems: 'center',
					position: 'absolute',
					bottom: 10,
					backgroundColor: colors.bgTrans,
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
				inputRow: {
					flexDirection: 'row',
					flexWrap: 'wrap',
					alignItems: 'center',
				},
				inputArea: {
					fontSize: fonts.regular,
					paddingTop: 10,
					height: 150,
					width: formWidth,
					marginTop: 10,
					textAlignVertical: 'top',
				},
				radio: {
					height: BUTTON_HEIGHT,
					width: formWidthInput,
					marginTop: 20,
					marginRight: 20,
				},
				buttonTxt: { fontSize: fonts.regular, fontWeight: 400 },
				titleButton: {
					marginTop: 20,
					height: 30,
					width: 150,
				},

				inputCover: {
					width: '100%',
					height: 45,
					marginTop: TOP_GAP2,
					borderRadius: BORDER_RADIUS,
					position: 'absolute',
					backgroundColor: colors.bgTrans21,
					justifyContent: 'center',
					alignItems: 'flex-end',
				},
				editButton: { height: 30, width: 100, marginRight: 5 },
			}),
		[colors]
	);
	const addOrganizerModal = useRef();
	const nameChangeModal = useRef();
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState({});
	const [festivalTypes, setFestivalTypes] = useState(
		FestivalTypeModal.defaultFestivalTypes
	);

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
				stageId: 0,
			});
			if (response?.success) {
				const festival = response.data;
				const festivalOrganizers =
					OrganizerModal.createAllOrganizerTableStructure(
						festival.festivalOrganizers
					);
				const yearsRunning = `${festival.yearsRunning || ''}`;
				setData({
					...festival,
					yearsRunning,
					festivalOrganizers,
				});
			} else if (festivalId) {
				navigation.goBack();
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

	const init = async () => {
		try {
			const response = await Backend.Festival.festivalTypes();
			if (response?.success) {
				setFestivalTypes(response.data);
			}
		} catch (err) {
			//Ignore
			//TODO Handle Error
		}
		loadFestivalData();
	};

	useEffect(() => {
		init();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const addNewOrganizer = () => {
		addOrganizerModal.current.show(null, (dta) => {
			createEditOrganizer(dta, true);
		});
	};

	const updateFestivalName = () => {
		const currentName = (data || {}).name;
		nameChangeModal.current.show(currentName, (name) => {
			if (name === currentName) {
				toast.error('Their was no change in name');
			} else {
				handleRequestNameChange(name);
			}
		});
	};

	const handleOrganizerEdit = (cellData) => {
		const organizer = OrganizerModal.getOrganizerTableStructure(cellData);
		addOrganizerModal.current.show(organizer, (dta) => {
			dta.idx = cellData.idx;
			createEditOrganizer(dta, false);
		});
	};

	const handleOrganizerDelete = async (cellData) => {
		const festivalOrganizers = [...(data?.festivalOrganizers || [])];
		const deleteIdx = festivalOrganizers.findIndex(
			(o) => o.idx === cellData.idx
		);
		if (deleteIdx === -1) {
			toast.error(ERROR_TEXT);
		}
		festivalOrganizers.splice(deleteIdx, 1);
		onNewData({ festivalOrganizers });
	};

	const createEditOrganizer = async (orgainzerData, isNew = true) => {
		const idx = moment().unix();
		let festivalOrganizers = [...(data?.festivalOrganizers || [])];
		if (isNew) {
			const newOrganizer = OrganizerModal.createOrganizerTableStructure(
				orgainzerData,
				idx + 1
			);
			festivalOrganizers = [...festivalOrganizers, newOrganizer];
		} else {
			const organizerIndex = festivalOrganizers.findIndex(
				(o) => o.idx === orgainzerData.idx
			);
			if (organizerIndex === -1) {
				toast.error(ERROR_TEXT);
				return;
			}
			const modifiedOrganizer = OrganizerModal.createOrganizerTableStructure(
				orgainzerData,
				orgainzerData.idx
			);
			festivalOrganizers[organizerIndex] = modifiedOrganizer;
		}
		onNewData({
			festivalOrganizers,
		});
	};

	const pickImage = async (type) => {
		try {
			let options = {
				mediaType: 'image',
				singleSelectedMode: true,
				isCrop: true,
			};
			if (type === COVER) {
				options.ratioWidth = WINDOW_WIDTH;
				options.ratioHeight = COVER_IMAGE_HEIGHT;
			} else {
				options.ratioWidth = 100;
				options.ratioHeight = 100;
				options.isCropCircle = true;
			}
			const response = await openPicker(options);
			const file = {
				name: response.fileName,
				uri: 'file://' + response.crop.path,
				type: response.mime,
			};
			if (helper.bytesToMB(response.size) > 10) {
				toast.notify('File too large max 10 MB allowed');
				return;
			}
			sendImageToServer(file, type);
		} catch (err) {
			// Ignore
		}
	};

	const uploadErrorMessage = (type) => {
		return `We are unable to update ${type === COVER ? 'cover' : 'logo'}`;
	};

	const sendImageToServer = async (file, type) => {
		try {
			setIsLoading(true);
			let uploadFunciton = null;
			if (type === LOGO) {
				uploadFunciton = Backend.Festival.uploadFestivalLogo;
			} else {
				uploadFunciton = Backend.Festival.uploadFestivalCover;
			}
			const response = await uploadFunciton(data.id, file);
			if (response?.success) {
				onNewData(response.data);
				toast.success(
					`${LOGO === type ? 'Logo' : 'Cover'} Updated Successfully`
				);
			} else {
				throw new Error(response?.message || uploadErrorMessage(type));
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSave = async () => {
		try {
			setIsLoading(true);
			const payload = {
				id: data.id,
				awards: data.awards,
				terms: data.terms,
				festivalType: data.festivalType,
				description: data.description,
				name: data.name,
				yearsRunning: data.yearsRunning,
				festivalOrganizers: OrganizerModal.getAllOrganizerTableStructure(
					data.festivalOrganizers
				),
			};
			const response = await Backend.Festival.updateFestivalDetails(payload);
			if (response.success) {
				onNewData({
					id: response.data.id,
					festivalOrganizers: OrganizerModal.createAllOrganizerTableStructure(
						response.data.festivalOrganizers
					),
				});
				toast.success('Festival Details Saved Successfully!');
				navigation.goBack();
				return;
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleRequestNameChange = async (festivalName) => {
		try {
			if (!festivalName) {
				return;
			}
			setIsLoading(true);
			const response = await Backend.Festival.requestNameChange({
				festivalName,
				festivalId: data.id,
			});
			if (response?.success) {
				onNewData(response.data);
				toast.success('Request Submitted Successfully');
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	const renderNameChangeRequest = () => {
		return (
			<View style={style.inputCover}>
				<Button
					type={Button.PRIMARY}
					style={style.editButton}
					text={'Edit Request'}
					onPress={updateFestivalName}
					iconSize={16}
					textStyle={sharedStyle.addButton}
				/>
			</View>
		);
	};

	return (
		<>
			<Header
				title="Festival Details"
				subTitle="Basic information about your festival"
			/>
			<View style={style.holder}>
				<NestableScrollContainer showsVerticalScrollIndicator={false}>
					<View style={style.main}>
						<View style={style.coverHolder}>
							<Image
								style={style.cover}
								url={data?.coverUrl}
								hash={data?.coverHash}
							/>
							<TouchableOpacity
								style={style.uploadCoverBtn}
								onPress={() => pickImage(COVER)}
							>
								<FeatherIcon name="camera" color={colors.buttonTxt} size={15} />
								<Text style={style.uploadText}>Update Cover</Text>
							</TouchableOpacity>
							<View style={style.logoHolder}>
								<Image
									style={style.logo}
									hash={data?.logoHash}
									url={data?.logoUrl}
								/>
								<TouchableOpacity
									onPress={() => pickImage(LOGO)}
									style={style.logoBtn}
								>
									<FeatherIcon
										name="camera"
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
							{data?.published ? renderNameChangeRequest() : null}
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
							onChangeText={(yearsRunning) => onNewData({ yearsRunning })}
						/>

						<Title
							text="Festival Description"
							required
							whatIsThis={infoNote[infoType.description]}
						/>
						<Input
							value={data?.description}
							onChangeText={(description) => onNewData({ description })}
							multiline
							style={style.inputArea}
							placeholder={infoNote[infoType.description]}
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
								{ title: 'Name', width: 37, key: 'name' },
								{
									title: 'Designation',
									width: 37,
									key: 'designation',
								},
								{ title: 'Actions', width: 26, align: 'right' },
							]}
							sortable
							pressable
							onSort={(sorted) =>
								onNewData({
									festivalOrganizers: sorted.data,
								})
							}
							onEmptyPress={addNewOrganizer}
							onEdit={handleOrganizerEdit}
							onCellPress={handleOrganizerEdit}
							onDelete={handleOrganizerDelete}
							rows={data.festivalOrganizers}
							emptyText="Click here to add organizer"
						/>
						<Button
							icon={'user-plus'}
							type={Button.OUTLINE_ICON_PRIMARY}
							style={style.titleButton}
							text={'Add Organizer'}
							onPress={addNewOrganizer}
							iconSize={16}
							textStyle={sharedStyle.addButton}
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
					</View>
				</NestableScrollContainer>
			</View>
			<SaveButton colors={colors} onPress={handleSave} />
			<CreateOrganizerModal ref={addOrganizerModal} />
			<NameChangeModal ref={nameChangeModal} />
			<Loading busy={isLoading} />
			{/*<Cropper
				ref={(ref) => (this.imageCropper = ref)}
				onSubmitImage={handleImageUpload}
			/>*/}
		</>
	);
};

class CreateOrganizerModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			...OrganizerModal.defaultOrganizerData,
			v: false,
		};
		this.callback = null;
	}

	show = (previousData = null, cb) => {
		if (previousData) {
			this.setState(previousData);
		} else {
			this.setState(OrganizerModal.defaultOrganizerData);
		}
		this.callback = cb;
		this.setState({ v: true });
	};

	close = () => {
		this.callback = null;
		this.setState({ v: false });
	};

	handleSubmit = () => {
		const { id, name, designation } = this.state;
		if (!validation.validName(name)) {
			toast.error('Please Enter Valid Name');
			return;
		}
		if (!validation.validName(name)) {
			toast.error('Please Enter Valid Designation');
			return;
		}
		if (this.callback) {
			this.callback({ id, name, designation });
		}
		this.setState({ v: false });
	};

	render() {
		const { designation, name, v } = this.state;
		return (
			<SheetButtonModal
				title="Add Organizer"
				onClose={this.close}
				onSubmit={this.handleSubmit}
				visible={v}
			>
				<Input
					style={sharedStyle.modalInput}
					placeholder="Organizer Name"
					value={name}
					onChangeText={(n) => this.setState({ name: n })}
				/>
				<Input
					style={sharedStyle.modalInput}
					placeholder="Designation"
					value={designation}
					onChangeText={(d) => this.setState({ designation: d })}
				/>
			</SheetButtonModal>
		);
	}
}

class NameChangeModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			v: false,
		};
		this.callback = null;
	}

	show = (name, cb) => {
		this.callback = cb;
		this.setState({ name, v: true });
	};

	close = () => {
		this.callback = null;
		this.setState({ v: false });
	};

	handleSubmit = () => {
		const { name } = this.state;
		if (!validation.validName(name)) {
			toast.error('Please Enter Valid Name');
			return;
		}
		if (this.callback) {
			this.callback(name);
		}
		this.setState({ v: false });
	};

	render() {
		const { v, name } = this.state;
		return (
			<SheetButtonModal
				title="Change Festival Name"
				onClose={this.close}
				onSubmit={this.handleSubmit}
				visible={v}
			>
				<Input
					style={sharedStyle.modalInput}
					placeholder="Festival New Name"
					value={name}
					onChangeText={(n) => this.setState({ name: n })}
				/>
			</SheetButtonModal>
		);
	}
}

export default gestureHandlerRootHOC(FestivalDetails);