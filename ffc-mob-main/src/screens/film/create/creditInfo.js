import React, { useEffect, useState, useMemo, useRef, Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Pressable,
	TouchableOpacity,
} from 'react-native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {
	NestableScrollContainer,
	NestableDraggableFlatList,
} from 'react-native-draggable-flatlist';
import { RNSelectionMenu } from 'libs/Menu/';

//Custom Components
import SheetButtonModal from 'components/modal/sheetButtonModal';
import SureModal from 'components/modal/sureModal';
import Loading from 'components/modal/loading';
import Input from 'components/input';
import PersonAdder from './personAdder';
import Header from './header';
import SaveButton from './saveButton';

//Helper Functions
import toast from 'libs/toast';
import Backend from 'backend';
import validation from 'utils/validation';

// Hooks
import { useTheme } from '@react-navigation/native';

//Constants
import { ERROR_TEXT, BORDER_RADIUS, BUTTON_HEIGHT } from 'utils/constants';
import {
	TOP_GAP,
	formWidth,
	formWidthInput,
	coverWidth,
	sharedStyle,
} from './constants';
import { fonts } from 'themes/topography';

const filmCreditCardHeight = 80;
const defaultState = {
	filmCreditSections: [
		{
			id: null,
			idx: 11,
			name: 'Directors',
			filmCreditSectionCredits: [],
		},
		{
			id: null,
			idx: 22,
			name: 'Writers',
			filmCreditSectionCredits: [],
		},
	],
};
const CreditsInfo = ({ navigation, route }) => {
	const { colors, dark } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				holder: {
					alignItems: 'center',
					alignSelf: 'center',
					width: coverWidth,
					backgroundColor: colors.card,
					paddingBottom: 120,
					paddingTop: 20,
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
			}),
		[colors]
	);
	const personAdder = useRef();
	const createSectionModal = useRef();
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState({
		filmCreditSections: [],
	});

	const onNewData = (newData) => {
		setData((pd) => ({
			...pd,
			...newData,
		}));
	};

	const loadFilmData = async () => {
		try {
			setIsLoading(true);
			const filmId = route.params.id;
			const response = await Backend.Film.getStageWiseData({
				filmId,
				stageId: 2,
			});
			if (response?.success) {
				const sections = response.data?.filmCreditSections;
				setIdx(sections);
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

	/*
		As Id are generated in db
		after saving records we need to relay
		on custom idx key to maintain unique
		value around structure
	*/
	const setIdx = (creditSections) => {
		if (!creditSections) {
			setData(defaultState);
			return;
		}
		const currentTime = new Date().getTime();

		let sections = [];
		let time = currentTime;
		for (let creditSection of creditSections) {
			creditSection.idx = time;
			const persons = [];
			for (let person of creditSection.filmCreditSectionCredits) {
				time += 1;
				person.idx = time;
				persons.push(person);
			}
			creditSection.filmCreditSectionCredits = persons;
			sections.push(creditSection);
			time += 1;
		}
		if (sections.length > 0) {
			onNewData({
				filmCreditSections: sections,
			});
		}
	};

	useEffect(() => {
		loadFilmData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSave = async () => {
		try {
			const filmId = route.params.id;
			setIsLoading(true);
			const response = await Backend.Film.updateFilmCredits({
				...data,
				id: filmId,
			});
			if (response.success) {
				setTimeout(() => {
					toast.success('Film Details Saved Successfully!');
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

	const handleAddNewPerson = (personData, creditSectionIdx) => {
		personAdder.current.show(personData, creditSectionIdx);
	};

	const handlePersonSubmit = (mPersonData) => {
		if (!mPersonData) {
			return;
		}
		const creditSections = [...(data?.filmCreditSections || [])];
		const creditSectionIndex = creditSections.findIndex(
			(cs) => cs.idx === mPersonData.filmCreditSectionId
		);
		if (creditSectionIndex === -1) {
			setTimeout(() => {
				toast.error(ERROR_TEXT);
			}, 300);
			return;
		}
		const currentSection = creditSections[creditSectionIndex];
		const previousCredits = currentSection?.filmCreditSectionCredits;
		const credits = [...(previousCredits || [])];
		if (mPersonData?.userId) {
			const hasUserId = credits.find((p) => p.userId === mPersonData?.userId);
			if (hasUserId) {
				setTimeout(() => {
					toast.error('Profile already linked');
				}, 300);
				return;
			}
		}
		const personDataIndex = credits.findIndex(
			(pd) => pd.idx === mPersonData.idx
		);
		if (personDataIndex === -1) {
			credits.push(mPersonData);
		} else {
			credits[personDataIndex] = mPersonData;
		}
		creditSections[creditSectionIndex].filmCreditSectionCredits = credits;
		onNewData({
			filmCreditSections: creditSections,
		});
	};

	const handleDeletePerson = (personIdx, sectionIdx) => {
		const creditSections = [...(data?.filmCreditSections || [])];
		const creditSectionIndex = creditSections.findIndex(
			(cs) => cs.idx === sectionIdx
		);
		if (creditSectionIndex === -1) {
			toast.error(ERROR_TEXT);
			return;
		}
		const sections = creditSections[creditSectionIndex];
		const credits = sections?.filmCreditSectionCredits;
		const persons = [...(credits || [])];
		const personIndex = persons.findIndex((p) => p.idx === personIdx);
		if (personIndex === -1) {
			toast.error(ERROR_TEXT);
			return;
		}
		persons.splice(personIndex, 1);
		creditSections[creditSectionIndex].filmCreditSectionCredits = persons;

		onNewData({
			filmCreditSections: creditSections,
		});
	};

	const handleAddSection = (sectionData = null) => {
		const creditSections = [...(data?.filmCreditSections || [])];
		createSectionModal.current.show(sectionData, (sectonData) => {
			const sectionIndex = creditSections.findIndex(
				(s) => s.idx === sectonData.idx
			);
			if (sectionIndex === -1) {
				creditSections.push(sectonData);
			} else {
				creditSections[sectionIndex] = sectonData;
			}
			onNewData({
				filmCreditSections: creditSections,
			});
		});
	};

	const handleDeleteSection = (sectionIdx) => {
		const creditSections = [...(data?.filmCreditSections || [])];
		const deleteIdx = creditSections.findIndex((o) => o.idx === sectionIdx);
		if (deleteIdx === -1) {
			toast.error(ERROR_TEXT);
			return;
		}
		creditSections.splice(deleteIdx, 1);
		onNewData({ filmCreditSections: creditSections });
	};

	const handlePersonSort = (sorted, index) => {
		const creditSections = [...(data?.filmCreditSections || [])];
		creditSections[index].filmCreditSectionCredits = sorted;
		onNewData({
			filmCreditSections: creditSections,
		});
	};

	const handleSectionSort = (sorted) => {
		onNewData({
			filmCreditSections: sorted,
		});
	};

	return (
		<>
			<Header
				title="Credits"
				subTitle="Add directors, writers etc. Add custom section"
			/>
			<View style={style.holder}>
				<NestableScrollContainer style={style.main}>
					<CreditManager
						addNewSection={handleAddSection}
						onSectionDelete={handleDeleteSection}
						addNewPerson={handleAddNewPerson}
						onDeletePerson={handleDeletePerson}
						colors={colors}
						dark={dark}
						data={data?.filmCreditSections}
						onSortPerson={handlePersonSort}
						onSectionSort={handleSectionSort}
					/>
				</NestableScrollContainer>
			</View>
			<SaveButton colors={colors} onPress={handleSave} />
			<Loading busy={isLoading} />
			<PersonAdder onSubmit={handlePersonSubmit} ref={personAdder} />
			<CreateSectionModal ref={createSectionModal} />
		</>
	);
};

const CreditManager = ({
	addNewSection,
	onSectionDelete,
	addNewPerson,
	onDeletePerson,
	onSortPerson,
	onSectionSort,
	data,
	colors,
	dark,
}) => {
	const creditManagerStyles = useMemo(
		() =>
			StyleSheet.create({
				main: {
					width: formWidth,
					borderWidth: 1,
					borderColor: colors.border,
					borderRadius: BORDER_RADIUS,
					overflow: 'hidden',
				},
				creditSection: {
					width: formWidth,
					borderBottomWidth: 1,
					backgroundColor: colors.background,
					borderColor: colors.border,
				},
				creditCardCover: {
					paddingBottom: TOP_GAP,
					paddingHorizontal: TOP_GAP,
				},
				creditSectionHeader: {
					width: formWidth,
					height: BUTTON_HEIGHT,
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					paddingHorizontal: 10,
					backgroundColor: colors.primaryLight,
				},
				creditSectionTitle: {
					fontSize: fonts.small,
					fontWeight: '500',
					color: colors.text,
				},
				buttonRow: {
					flexDirection: 'row',
				},
				iconButton: {
					width: BUTTON_HEIGHT,
					height: BUTTON_HEIGHT,
					justifyContent: 'center',
					alignItems: 'center',
				},
				centerBox: {
					justifyContent: 'center',
					alignItems: 'center',
					height: BUTTON_HEIGHT,
					width: formWidth,
				},
				buttonText: {
					fontSize: fonts.small,
					fontWeight: '500',
					color: colors.primary,
				},
				creditCard: {
					width: '100%',
					height: filmCreditCardHeight,
					borderRadius: BORDER_RADIUS,
					borderColor: colors.border,
					justifyContent: 'center',
					alignItems: 'center',
					borderWidth: 1,
					marginTop: TOP_GAP,
					marginRight: TOP_GAP,
					flexDirection: 'row',
					overflow: 'hidden',
					backgroundColor: colors.card,
				},
				addPersonButton: {
					width: '100%',
					height: 40,
					borderRadius: BORDER_RADIUS,
					justifyContent: 'center',
					alignItems: 'center',
					borderColor: colors.border,
					marginTop: TOP_GAP,
					marginRight: TOP_GAP,
					flexDirection: 'row',
					overflow: 'hidden',
					backgroundColor: colors.card,
					borderWidth: 1,
				},
				cardAvatarCover: {
					width: 70,
					height: filmCreditCardHeight,
					justifyContent: 'center',
					alignItems: 'center',
				},
				cardAvatar: {
					width: 60,
					height: 60,
					borderRadius: 100,
					backgroundColor: colors.holderColor,
				},
				cardContentCover: {
					flex: 1,
					justifyContent: 'center',
				},
				cardName: {
					fontWeight: '500',
					fontSize: fonts.small,
					color: colors.text,
				},
				cardDesc: {
					fontWeight: '300',
					fontSize: 12,
					marginTop: 3,
					color: colors.holderColor,
				},
				cardLinked: {
					color: colors.greenDark,
				},
				selected: {
					borderColor: colors.primary,
				},
				cardButtons: {
					flexDirection: 'row',
					backgroundColor: colors.bgTrans,
					alignItems: 'center',
					justifyContent: 'space-around',
					position: 'absolute',
					top: 0,
					right: 0,
					width: 70,
					borderBottomLeftRadius: BORDER_RADIUS,
				},
				cardButton: {
					width: 26,
					height: 26,
					alignItems: 'center',
					justifyContent: 'center',
				},
			}),
		[colors]
	);
	const sureModal = useRef();
	const handleDelete = (creditSection) => {
		sureModal.current.show(
			`${creditSection.name} will be deleted permanently as you save`,
			(action) => {
				if (action) {
					onSectionDelete(creditSection.idx);
				}
			}
		);
	};

	const showOptions = (personData, sectionData, event) => {
		const options = [
			{
				value: 'Edit',
				type: 0,
			},
			{
				value: 'Delete',
				type: 0,
			},
		];
		RNSelectionMenu.Show({
			values: options,
			selectedValues: [''],
			selectionType: 0,
			presentationType: 1,
			theme: dark ? 1 : 0,
			title: 'Select option',
			onSelection: (value) => {
				const index = options.findIndex((v) => v.value === value);
				if (index === 0) {
					addNewPerson(personData, sectionData.idx);
				} else if (index) {
					sureModal.current.show(
						`${personData.firstName} will be deleted permanently as you save`,
						(action) => {
							if (action) {
								onDeletePerson(personData?.idx, sectionData?.idx);
							}
						}
					);
				}
			},
		});
	};

	const renderSections = ({ item: creditSection, getIndex, drag }) => {
		const index = getIndex();
		return (
			<View style={creditManagerStyles.creditSection}>
				<View style={creditManagerStyles.creditSectionHeader}>
					<Text style={creditManagerStyles.creditSectionTitle}>
						{creditSection.name}
					</Text>

					<View style={creditManagerStyles.buttonRow}>
						<TouchableOpacity
							onPress={() => handleDelete(creditSection)}
							style={creditManagerStyles.iconButton}
						>
							<FeatherIcon size={17} color={colors.text} name={'trash'} />
						</TouchableOpacity>
						<Pressable onPressIn={drag} style={creditManagerStyles.iconButton}>
							<FeatherIcon size={17} color={colors.text} name={'move'} />
						</Pressable>
						<TouchableOpacity
							onPress={() => addNewSection(creditSection)}
							style={creditManagerStyles.iconButton}
						>
							<FeatherIcon size={17} color={colors.text} name={'edit-2'} />
						</TouchableOpacity>
					</View>
				</View>
				<View style={creditManagerStyles.creditCardCover}>
					<PersonList
						style={creditManagerStyles}
						colors={colors}
						credits={creditSection?.filmCreditSectionCredits}
						onSort={(sorted) => onSortPerson(sorted.data, index)}
						handleOptions={(person) => showOptions(person, creditSection)}
						renderExtra={() => (
							<AddPersonButton
								style={creditManagerStyles}
								colors={colors}
								onPress={() => addNewPerson(null, creditSection.idx)}
							/>
						)}
					/>
				</View>
			</View>
		);
	};

	return (
		<>
			<NestableDraggableFlatList
				onDragEnd={(s) => onSectionSort(s.data)}
				data={data}
				contentContainerStyle={creditManagerStyles.main}
				renderItem={renderSections}
				keyExtractor={(d) => d.idx}
				ListFooterComponent={
					<TouchableOpacity
						onPress={() => addNewSection(null)}
						style={creditManagerStyles.centerBox}
					>
						<Text style={creditManagerStyles.buttonText}>Add New Section</Text>
					</TouchableOpacity>
				}
			/>

			<SureModal ref={sureModal} />
		</>
	);
};

const AddPersonButton = ({ onPress, style, colors }) => {
	const marginRight = { marginLeft: 10 };
	return (
		<TouchableOpacity onPress={onPress} style={style.addPersonButton}>
			<FeatherIcon name="user-plus" size={20} color={colors.primary} />
			<Text style={[style.buttonText, marginRight]}>Add New Person</Text>
		</TouchableOpacity>
	);
};
const PersonList = ({
	credits = [],
	renderExtra,
	handleOptions,
	onSort,
	style,
	colors,
}) => (
	<NestableDraggableFlatList
		onDragEnd={onSort}
		data={credits}
		renderItem={({ item: credit, drag }) => (
			<View key={credit.idx} style={style.creditCard}>
				<View style={style.cardAvatarCover}></View>
				<View style={style.cardContentCover}>
					<Text numberOfLines={2} style={style.cardName}>
						{credit.firstName} {credit.middleName || ''} {credit.lastName || ''}
					</Text>
					{credit?.charecterName ? (
						<Text numberOfLines={1} style={style.cardDesc}>
							as {credit.charecterName}
						</Text>
					) : null}

					<Text
						style={[
							style.cardDesc,
							{
								color: credit?.userId ? colors.greenDark : colors.rubyRed,
							},
						]}
					>
						Account {credit?.userId ? '' : 'Not '}Linked
					</Text>
				</View>
				<View style={style.cardButtons}>
					<Pressable onPressIn={drag} style={style.cardButton}>
						<FeatherIcon size={15} color={colors.buttonTxt} name="move" />
					</Pressable>
					<TouchableOpacity
						onPress={() => handleOptions(credit)}
						style={style.cardButton}
					>
						<FeatherIcon
							size={19}
							color={colors.buttonTxt}
							name="more-vertical"
						/>
					</TouchableOpacity>
				</View>
			</View>
		)}
		keyExtractor={(d) => d.idx}
		ListFooterComponent={renderExtra}
	/>
);

class CreateSectionModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			visible: false,
		};
		this.callback = null;
	}

	show = (previousData = null, cb) => {
		if (previousData) {
			this.setState({
				...previousData,
				isNew: false,
			});
		} else {
			const idx = new Date().getTime();
			this.setState({ id: null, isNew: true, name: '', idx });
		}
		this.callback = cb;
		this.setState({ visible: true });
		setTimeout(() => {
			this.organizerName?.focus();
		}, 600);
	};

	close = () => {
		this.callback = null;
		this.setState({ visible: false });
	};

	handleSubmit = () => {
		const { id, name, idx } = this.state;
		if (!validation.validName(name)) {
			this.sectionName.setError('Please Enter Valid Name');
			return;
		}
		if (this.callback) {
			this.callback({ id, name, idx });
		}
		this.setState({ visible: false });
	};

	render() {
		const { name, isNew, visible } = this.state;
		return (
			<SheetButtonModal
				title={`${isNew ? 'Add' : 'Edit'} Section`}
				onClose={this.close}
				onSubmit={this.handleSubmit}
				visible={visible}
			>
				<Input
					style={sharedStyle.modalInput}
					placeholder="Section Name"
					value={name}
					ref={(ref) => (this.sectionName = ref)}
					onChangeText={(x) => this.setState({ name: x })}
				/>
			</SheetButtonModal>
		);
	}
}

export default gestureHandlerRootHOC(CreditsInfo);