import React, { useEffect, useRef, useState, useMemo, Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { NestableScrollContainer } from 'react-native-draggable-flatlist';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

//Custom Components
import SheetButtonModal from 'components/modal/sheetButtonModal';

import Loading from 'components/modal/loading';
import Table from './table';
import Button from 'components/button/';
import Input from 'components/input';
import CountryInput from 'components/input/countryInput';
import Title from './title';
import Header from './header';
import SaveButton from './saveButton';
import DateInput from 'components/input/dateInput';

//Helper Functions
import toast from 'libs/toast';
import Backend from 'backend';
import validation from 'utils/validation';
import moment from 'moment';

//Modals
import ScreeningModal from 'modals/screening';

// Hooks
import { useTheme } from '@react-navigation/native';

//Constants
import infoNote, { infoType } from './info';
import { ERROR_TEXT, BORDER_RADIUS, BUTTON_HEIGHT } from 'utils/constants';
import {
	TOP_GAP,
	formWidth,
	formWidthInput,
	coverWidth,
	sharedStyle,
} from './constants';
import { fonts } from 'themes/topography';

const FilmScreenings = ({ navigation, route }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
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
				checkboxCover: {
					marginTop: TOP_GAP,
					padding: TOP_GAP,
					borderColor: colors.border,
					borderWidth: 1,
					borderRadius: BORDER_RADIUS,
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
				checkboxInput: {
					paddingLeft: 0,
				},
				checkboxText: {
					fontSize: fonts.small,
					color: colors.holderColor,
				},
				titleButton: {
					marginTop: 20,
					height: 30,
					width: 150,
				},
			}),
		[colors]
	);
	const addScreenModal = useRef();
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState({});

	const onNewData = (newData) => {
		setData({
			...data,
			...newData,
		});
	};

	const loadFilmData = async () => {
		try {
			setIsLoading(true);
			const filmId = route.params.id;
			const response = await Backend.Film.getStageWiseData({
				filmId,
				stageId: 4,
			});
			if (response?.success) {
				const screens = ScreeningModal.createAllScreeningTableStructure(
					response.data.filmScreenings
				);
				setData({
					id: filmId,
					filmScreenings: screens,
				});
			} else if (filmId) {
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

	useEffect(() => {
		loadFilmData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const addNewScreening = () => {
		addScreenModal.current.show(null, (dta) => {
			createEditScreening(dta, true);
		});
	};

	const handleOrganizerEdit = (cellData) => {
		const organizer = ScreeningModal.getScreeningTableStructure(cellData);
		addScreenModal.current.show(organizer, (dta) => {
			dta.idx = cellData.idx;
			createEditScreening(dta, false);
		});
	};

	const handleOrganizerDelete = async (cellData) => {
		const filmScreenings = [...(data?.filmScreenings || [])];
		const deleteIdx = filmScreenings.findIndex((o) => o.idx === cellData.idx);
		if (deleteIdx === -1) {
			toast.error(ERROR_TEXT);
		}
		filmScreenings.splice(deleteIdx, 1);
		onNewData({ filmScreenings });
	};

	const createEditScreening = async (orgainzerData, isNew = true) => {
		const idx = moment().unix();
		let filmScreenings = [...(data?.filmScreenings || [])];
		if (isNew) {
			const newScreening = ScreeningModal.createScreeningTableStructure(
				orgainzerData,
				idx + 1
			);
			filmScreenings = [...filmScreenings, newScreening];
		} else {
			const screeningIndex = filmScreenings.findIndex(
				(o) => o.idx === orgainzerData.idx
			);
			if (screeningIndex === -1) {
				toast.error(ERROR_TEXT);
				return;
			}
			const modifiedScreen = ScreeningModal.createScreeningTableStructure(
				orgainzerData,
				orgainzerData.idx
			);
			filmScreenings[screeningIndex] = modifiedScreen;
		}
		onNewData({
			filmScreenings,
		});
	};

	const handleSave = async () => {
		try {
			setIsLoading(true);
			const response = await Backend.Film.updateFilmScreenings(data);
			if (response.success) {
				setTimeout(() => {
					toast.success('Film Screening Details Saved Successfully!');
				}, 200);
				navigation.goBack();
				return;
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (err) {
			setTimeout(() => {
				toast.error(err.message);
			}, 300);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<Header title="Film Screenings" subTitle="Add your film screenings" />
			<View style={style.holder}>
				<NestableScrollContainer showsVerticalScrollIndicator={false}>
					<View style={style.main}>
						<Title
							text="Screenings & Awards"
							whatIsThis={infoNote[infoType.screening]}
						/>
						<Table
							columns={[
								{ title: 'Festival Name', width: 60, key: 'name' },
								{ title: 'Actions', width: 26, align: 'right' },
							]}
							sortable
							pressable
							onSort={(sorted) =>
								onNewData({
									filmScreenings: sorted.data,
								})
							}
							onEmptyPress={addNewScreening}
							onEdit={handleOrganizerEdit}
							onCellPress={handleOrganizerEdit}
							onDelete={handleOrganizerDelete}
							rows={data.filmScreenings}
							emptyText="Click here to add screening"
						/>
						<Button
							icon={'plus'}
							type={Button.OUTLINE_ICON_PRIMARY}
							style={style.titleButton}
							text={'Add Screening'}
							onPress={addNewScreening}
							iconSize={16}
							textStyle={sharedStyle.addButton}
						/>
					</View>
				</NestableScrollContainer>
			</View>
			<SaveButton colors={colors} onPress={handleSave} />
			<Loading busy={isLoading} />
			<CreateScreeningModal ref={addScreenModal} />
		</>
	);
};

class CreateScreeningModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			v: false,
		};
		this.callback = null;
	}

	show = (previousData = null, cb) => {
		if (previousData) {
			this.setState(previousData);
		} else {
			this.setState(ScreeningModal.defaultScreeningData);
		}
		this.callback = cb;
		this.setState({ v: true });
	};

	close = () => {
		this.callback = null;
		this.setState({ v: false });
	};

	handleSubmit = () => {
		const {
			country,
			city,
			festivalName,
			screeningDate,
			premiere,
			awardSelection,
			id,
		} = this.state;
		if (!validation.validName(festivalName)) {
			toast.error('Please Enter Valid Festival Name');
			return;
		}
		if (!country) {
			toast.error('Please Select Country');
			return;
		}
		if (this.callback) {
			this.callback({
				country,
				city,
				festivalName,
				screeningDate,
				premiere,
				awardSelection,
				id,
			});
		}
		this.setState({ v: false });
	};

	render() {
		const {
			country,
			city,
			festivalName,
			screeningDate,
			premiere,
			awardSelection,
			v,
		} = this.state;
		return (
			<SheetButtonModal
				title="Add Organizer"
				onClose={this.close}
				onSubmit={this.handleSubmit}
				visible={v}
			>
				<Input
					style={sharedStyle.modalInput}
					placeholder="Festival Name"
					value={festivalName}
					onChangeText={(n) => this.setState({ festivalName: n })}
				/>
				<Input
					style={sharedStyle.modalInput}
					placeholder="City Name"
					value={city}
					onChangeText={(n) => this.setState({ city: n })}
				/>
				<CountryInput
					style={sharedStyle.modalInput}
					value={country}
					textStyle={sharedStyle.validFont}
					placeholder="Select Country"
					onSelect={(c) => this.setState({ country: c })}
				/>
				<DateInput
					style={sharedStyle.modalInput}
					value={screeningDate}
					placeholder="Screening date"
					textStyle={sharedStyle.validFont}
					onSelect={(c) => this.setState({ screeningDate: c })}
				/>
				<Input
					style={sharedStyle.modalInput}
					placeholder="Premiere E.g. Western Premiere"
					value={premiere}
					onChangeText={(n) => this.setState({ premiere: n })}
				/>
				<Input
					style={sharedStyle.modalInput}
					placeholder="Selection E.g. Official Selection"
					value={awardSelection}
					onChangeText={(n) => this.setState({ awardSelection: n })}
				/>
			</SheetButtonModal>
		);
	}
}

export default gestureHandlerRootHOC(FilmScreenings);