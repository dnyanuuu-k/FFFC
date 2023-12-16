import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";

//Custom Components
import SheetButtonModal from "components/modal/sheetButtonModal";
import ContextMenu from "components/menu/contextMenu";
import SureModal from "components/modal/sureModal";
import Loading from "components/modal/loading";
import Button from "components/button";
import Image from "components/image/";
import Input from "components/input/";
import PersonAdder from "./personAdder";
import Header from "./header";

//Third-Party Components
import FeatherIcon from "feather-icons-react";
import { ReactSortable } from "react-sortablejs";

//Third Party Functions
import toast from "react-hot-toast";

//Helper Fuctions
import Backend from "backend";
import validation from "utils/validation";
//Constants
import { ERROR_TEXT } from "utils/constants";
import { festivalDetailStyles as style, creditManagerStyles } from "./style";
import colors from "themes/colors";

export default class CreditInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isBusy: false,
			currentSectionIdx: null,
		};
	}

	componentDidMount(){
		const { data } = this.props;
		const creditSections = data?.filmCreditSections || [];
		setTimeout(() => {
			this.setIdx(creditSections);
		}, 500);
	}

	/*
		As Id are generated in db
		after saving records we need to relay
		on custom idx key to maintain unique 
		value around structure
	*/
	setIdx = (creditSections) => {
		const { onNewData } = this.props;
		const currentTime = new Date().getTime();

		let sections = [];		
		let time = currentTime;
		for(let creditSection of creditSections){
			creditSection.idx = time;
			const persons = [];
			time += 1;
			for(let person of creditSection.filmCreditSectionCredits){
				person.idx = time;
				persons.push(person);
			}
			creditSection.filmCreditSectionCredits = persons;
			sections.push(creditSection);
			time += 1;
		}
		if(sections.length > 0){
			onNewData({
				filmCreditSections: sections
			});
			this.setState({
				currentSectionIdx: currentTime
			})
		}		
	}

	handleAddNewPerson = (personData, creditSectionIdx) => {
		const { data, onNewData } = this.props;
		const creditSections = data?.filmCreditSections || [];
		this.personAdder.show(personData, creditSectionIdx, (personData) => {
			if (personData) {
				const creditSectionIndex = creditSections.findIndex(
					(cs) => cs.idx === creditSectionIdx
				);
				if (creditSectionIndex === -1) {
					toast.error(ERROR_TEXT);
					return;
				}

				const credits =
					creditSections[creditSectionIndex]
						?.filmCreditSectionCredits || [];

				if (personData?.userId) {
					// eslint-disable-next-line eqeqeq
					const hasUserId = credits.find(
						(p) => p.userId === personData?.userId
					);
					if (hasUserId) {
						toast.error("Profile already linked");
						return;
					}
				}
				const personDataIndex = credits.findIndex(
					(pd) => pd.idx === personData.idx
				);
				console.log(personData, credits);
				if (personDataIndex === -1) {
					credits.push(personData);
				} else {
					credits[personDataIndex] = personData;
				}

				creditSections[creditSectionIndex].filmCreditSectionCredits =
					credits;

				onNewData({
					filmCreditSections: creditSections,
				});
			}
		});
	};

	handleDeletePerson = (personIdx, sectionIdx) => {
		const { data, onNewData } = this.props;
		const creditSections = data?.filmCreditSections || [];
		const creditSectionIndex = creditSections.findIndex(
			(cs) => cs.idx === sectionIdx
		);
		if (creditSectionIndex === -1) {
			toast.error(ERROR_TEXT);
			return;
		}
		const persons =
			creditSections[creditSectionIndex]?.filmCreditSectionCredits || [];
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

	handleAddSection = (sectionData = null) => {
		const { data, onNewData } = this.props;
		const creditSections = data?.filmCreditSections || [];
		this.createSectionModal.show(sectionData, (sectonData) => {
			const sectionIndex = creditSections.findIndex(
				(s) => s.idx === sectonData.idx
			);
			if (sectionIndex === -1) {
				creditSections.push(sectonData);
				this.setState({
					currentSectionIdx: sectonData.idx,
				});
			} else {
				creditSections[sectionIndex] = sectonData;
			}
			onNewData({
				filmCreditSections: creditSections,
			});
		});
	};

	handleDeleteSection = (sectionIdx) => {
		const { data, onNewData } = this.props;
		const creditSections = data?.filmCreditSections || [];
		const deleteIdx = creditSections.findIndex((o) => o.idx === sectionIdx);
		if (deleteIdx === -1) {
			toast.error(ERROR_TEXT);
			return;
		}
		creditSections.splice(deleteIdx, 1);
		onNewData({ filmCreditSections: creditSections });
	};

	setSectionSelection = (newSectionIdx) => {
		const sectionIdx = this.state.sectionIdx;
		this.setState({
			currentSectionIdx:
				sectionIdx === newSectionIdx ? null : newSectionIdx,
		});
	};

	handlePersonSort = (sorted, index) => {
		const { data, onNewData } = this.props;
		const creditSections = data?.filmCreditSections || [];
		creditSections[index].filmCreditSectionCredits = sorted;
		onNewData({
			filmCreditSections: creditSections,
		});
	};

	handleSectionSort = (filmCreditSections) => {
		const { onNewData } = this.props;
		onNewData({
			filmCreditSections,
		});
	};

	handleSave = async () => {
		const { data, onNewData, onBusy } = this.props;
		try {
			onBusy(true);
			const payload = {
				id: data.id,
				filmCreditSections: data?.filmCreditSections
			};
			const response =
				await Backend.Film.updateFilmCredits(payload);
			if (response.success) {
				onNewData(response.data);
				toast.success("Credits Saved Successfully!");
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
		const { data } = this.props;
		const { isBusy, currentSectionIdx } = this.state;
		return (
			<>
				<View style={style.main}>
					<Header
						title="Credits"
						subTitle="Add directors, writers etc. also you can add custom section"
					/>
					<CreditManager
						addNewSection={this.handleAddSection}
						onSectionDelete={this.handleDeleteSection}
						addNewPerson={this.handleAddNewPerson}
						onDeletePerson={this.handleDeletePerson}
						toggleSelection={this.setSectionSelection}
						currentSection={currentSectionIdx}
						data={data?.filmCreditSections}
						onSortPerson={this.handlePersonSort}
						onSectionSort={this.handleSectionSort}
					/>
					<Button
						onPress={this.handleSave}
						textStyle={style.buttonTxt}
						style={style.button}
						text="Save & Continue"
					/>
				</View>
				<Loading busy={isBusy} />
				<PersonAdder ref={(ref) => (this.personAdder = ref)} />
				<CreateSectionModal
					ref={(ref) => (this.createSectionModal = ref)}
				/>
			</>
		);
	}
}

class CreditManager extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	handleDelete = (creditSection) => {
		const { onSectionDelete } = this.props;
		this.sureModal.show(
			`${creditSection.name} will be deleted permanently as you save`,
			(action) => {
				if (action) {
					onSectionDelete(creditSection.idx)
				}
			}
		);		
	}

	showOptions = (personData, sectionData, event) => {
		const { addNewPerson, onDeletePerson } = this.props;
		const options = [
			{
				icon: "edit",
				label: "Edit",
			},
			{
				icon: "trash",
				label: "Delete",
			},
		];
		const element = ContextMenu.transfromView(event);
		this.contextMenu.show(options, element, (option, index) => {
			if (index === 0) {
				addNewPerson(personData, sectionData.idx);
			} else if (index) {
				this.sureModal.show(
					`${personData.firstName} will be deleted permanently as you save`,
					(action) => {
						if (action) {
							onDeletePerson(personData?.idx, sectionData?.idx);
						}
					}
				);
			}
		});
	};

	renderSections = (creditSection, index) => {
		const {
			currentSection,
			addNewPerson,
			toggleSelection,
			addNewSection,
			onSortPerson,
		} = this.props;
		const selected = currentSection === creditSection.idx;
		const color = selected ? colors.buttonTxt : colors.textBlack;
		const backgroundColor = selected ? colors.primaryBlue : colors.popupBg;
		const icon = selected ? "chevron-up" : "chevron-down";
		return (
			<View
				style={creditManagerStyles.creditSection}
				key={creditSection.idx}
			>
				<View
					style={[
						creditManagerStyles.creditSectionHeader,
						{
							backgroundColor,
						},
					]}
				>
					<Text
						style={[
							creditManagerStyles.creditSectionTitle,
							{ color },
						]}
					>
						{creditSection.name}
					</Text>

					<View style={creditManagerStyles.buttonRow}>
						<TouchableOpacity
							onPress={() => this.handleDelete(creditSection)}
							style={creditManagerStyles.iconButton}
						>
							<FeatherIcon
								size={17}
								color={color}
								icon={"trash"}
							/>
						</TouchableOpacity>
						<div
							className="smove drag"
							style={creditManagerStyles.iconButton}
						>
							<FeatherIcon
								size={17}
								color={color}
								icon={"move"}
							/>
						</div>
						<TouchableOpacity
							onPress={() => addNewSection(creditSection)}
							style={creditManagerStyles.iconButton}
						>
							<FeatherIcon
								size={17}
								color={color}
								icon={"edit-2"}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => toggleSelection(creditSection.idx)}
							style={creditManagerStyles.iconButton}
						>
							<FeatherIcon size={22} color={color} icon={icon} />
						</TouchableOpacity>
					</View>
				</View>

				{selected ? (
					<View style={creditManagerStyles.creditCardCover}>
						<PersonList
							credits={creditSection?.filmCreditSectionCredits}
							onSort={(sorted) => onSortPerson(sorted, index)}
							filter=".avoid"
							handleOptions={(person, e) =>
								this.showOptions(person, creditSection, e)
							}
							renderExtra={() => (
								<AddPersonButton
									onPress={() =>
										addNewPerson(null, creditSection.idx)
									}
								/>
							)}
						/>						
					</View>
				) : null}
			</View>
		);
	};
	render() {
		const { data = [], addNewSection, onSectionSort } = this.props;
		return (
			<>
				<View style={creditManagerStyles.main}>
					<ReactSortable setList={onSectionSort} list={data} handle=".smove">
					{data.map(this.renderSections)}					
					</ReactSortable>
					<TouchableOpacity
						onPress={() => addNewSection(null)}
						style={creditManagerStyles.centerBox}
					>
						<Text style={creditManagerStyles.buttonText}>
							Add New Section
						</Text>
					</TouchableOpacity>
				</View>
				<ContextMenu ref={(ref) => (this.contextMenu = ref)} />
				<SureModal ref={(ref) => (this.sureModal = ref)} />
			</>
		);
	}
}

const AddPersonButton = ({ onPress }) => {
	return (
		<div
			className="avoid"
			onClick={onPress}
			style={creditManagerStyles.addPersonButton}
		>
			<FeatherIcon
				icon="user-plus"
				size={20}
				color={colors.primaryBlue}
			/>
			<Text style={[creditManagerStyles.buttonText, { marginLeft: 10 }]}>
				Add New Person
			</Text>
		</div>
	);
};

const PersonList = ({ credits = [], renderExtra, handleOptions, onSort }) => {
	return (
		<ReactSortable style={creditManagerStyles.personRow} setList={onSort} list={credits} handle=".pmove">
			{credits.map((credit) => {
				return (
					<View key={credit.idx} style={creditManagerStyles.creditCard}>
						<View style={creditManagerStyles.cardAvatarCover}>
							<Image
								url={credit.avatarUrl}
								style={creditManagerStyles.cardAvatar}
							/>
						</View>
						<View style={creditManagerStyles.cardContentCover}>
							<Text
								numberOfLines={2}
								style={creditManagerStyles.cardName}
							>
								{credit.firstName} {credit.middleName || ""}{" "}
								{credit.lastName || ""}
							</Text>
							{credit?.charecterName ? (
								<Text
									numberOfLines={1}
									style={creditManagerStyles.cardDesc}
								>
									as {credit.charecterName}
								</Text>
							) : null}

							<Text
								style={[
									creditManagerStyles.cardDesc,
									{
										color: credit?.userId
											? colors.greenDark
											: colors.rubyRed,
									},
								]}
							>
								Account {credit?.userId ? "" : "Not "}Linked
							</Text>
						</View>
						<View style={creditManagerStyles.cardButtons}>
							<div className="pmove drag" style={creditManagerStyles.cardButton}>
								<FeatherIcon
									size={15}
									color={colors.buttonTxt}
									icon="move"
								/>
							</div>
							<TouchableOpacity
								onPress={(e) => handleOptions(credit, e)}
								style={creditManagerStyles.cardButton}
							>
								<FeatherIcon
									size={19}
									color={colors.buttonTxt}
									icon="more-vertical"
								/>
							</TouchableOpacity>
						</View>
					</View>
				);
			})}
			{renderExtra()}
		</ReactSortable>
	);
};

class CreateSectionModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
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
			this.setState({ id: null, isNew: true, name: "", idx });
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
		const { id, name, idx } = this.state;
		if (!validation.validName(name)) {
			this.sectionName.setError("Please Enter Valid Name");
			return;
		}
		if (this.callback) {
			this.callback({ id, name, idx });
		}
		this.modal.close();
	};

	render() {
		const { name, isNew } = this.state;
		return (
			<SheetButtonModal
				title={`${isNew ? "Add" : "Edit"} Section`}
				onClose={this.close}
				onSubmit={this.handleSubmit}
				ref={(ref) => (this.modal = ref)}
			>
				<Input
					style={style.modalInput}
					placeholder="Section Name"
					value={name}
					ref={(ref) => (this.sectionName = ref)}
					onChangeText={(name) => this.setState({ name })}
				/>
			</SheetButtonModal>
		);
	}
}