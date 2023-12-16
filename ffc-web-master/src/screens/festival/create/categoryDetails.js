import React, { Component } from "react";
import { View, Text } from "react-native";

//Custom Components
import SheetButtonModal from "components/modal/sheetButtonModal";
import SureModal from "components/modal/sureModal";
import Button from "components/button/";
import Input from "components/input";
import MultiOptionInput from "components/input/multiOptionInput";
import LoadingOverlay from "components/overlay/loading";
import CategoryModal from "modals/category";
import Table from "./table";
import Title from "./title";
import OptionInput from "components/input/optionInput";
import Header from "./header";
import { festivalDetailStyles as style, manageCategoryStyles } from "./style";
import { W40, RUNTIME_OPTIONS } from "utils/constants";
import toast from "react-hot-toast";
import validation from "utils/validation";
import Backend from "backend";
import { ERROR_TEXT } from "utils/constants";

export default class CategoryDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isBusy: false,
		};
	}

	addCategory = () => {
		const festivalId = this.props.data.id;
		this.createCategoryModal.show({ festivalId }, (data) => {
			this.handleSave(data);
		});
	};

	handleCategoryEdit = (cellData) => {
		const festivalId = this.props.data.id;
		this.createCategoryModal.show(
			{ festivalId, festivalCategoryId: cellData.id },
			(data) => {
				this.handleSave(data);
			}
		);
	};

	handleSave = async (categoryData) => {
		//We save deadline but don't load in row
		const { data, onNewData, onBusy } = this.props;
		const festivalCategories = data.festivalCategories || [];
		const index = festivalCategories.findIndex(
			// eslint-disable-next-line eqeqeq
			(category) => category.id == categoryData.id
		);
		try {
			onBusy(true);
			const response =
				await Backend.Festival.updateFestivalCategoryDetails(
					categoryData
				);
			if (response.success) {
				const festivalCategory =
					CategoryModal.createCategoryTableStructure(response.data);
				if (index === -1) {
					festivalCategories.push(festivalCategory);
				} else {
					festivalCategories[index] = festivalCategory;
				}
				onNewData({
					festivalCategories,
				});
				toast.success("Festival Category Added Successfully");
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			onBusy(false);
		}
	};

	handleCategoryDelete = (cellData, idx) => {
		this.sureModal.show(
			"Category will be deleted permanently",
			(action) => {
				if (action) {
					this.deleteCategory(cellData, idx);
				}
			}
		);
	};

	deleteCategory = async (cellData, idx) => {
		const { data, onNewData, onBusy } = this.props;
		try {
			onBusy(true);
			const response = await Backend.Festival.deleteCategory({
				festivalCategoryId: cellData.id,
			});
			if (response.success) {
				const festivalCategories = data.festivalCategories;
				festivalCategories.splice(idx, 1);
				onNewData({
					festivalCategories,
				});
				toast.success("Festival Category Deleted Successfully!");
			} else {
				throw new Error(response.message || ERROR_TEXT);
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			onBusy(false);
		}
	};

	handleContinue = async () => {
		const { data, onBusy } = this.props;
		try {
			onBusy(true);
			const payload = (data.festivalCategories || []).map((c) => ({
				id: c.id,
			}));
			const response = await Backend.Festival.updateCategoryOrder(
				payload
			);
			if (response.success) {
				toast.success("Festival Category Saved Successfully!");
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
		return (
			<>
				<View style={style.main}>
					<Header
						title="Categories & Entry Fees"
						subTitle="Important dates for your festival"
					/>
					{/*<Title text="Currency" whatIsThis required extraTopMargin />
					<Input style={style.input} />*/}
					<Title text="Categories" required extraTopMargin />
					<Table
						columns={[
							{ title: "Category", width: 60, key: "name" },
							{ title: "Actions", width: 38, align: "right" },
						]}
						onSort={(festivalCategories) =>
							onNewData({
								festivalCategories,
							})
						}
						sortable
						pressable
						onEdit={this.handleCategoryEdit}
						onCellPress={this.handleCategoryEdit}
						onDelete={this.handleCategoryDelete}
						rows={data?.festivalCategories}
						onEmptyPress={this.addCategory}
						emptyText="Click here to add festival category"
					/>
					<Button
						icon={"plus"}
						type={Button.OUTLINE_ICON_PRIMARY}
						style={style.titleButton}
						text={"Add Category"}
						onPress={this.addCategory}
						iconSize={16}
						textStyle={{ fontSize: 14, fontWeight: 400 }}
					/>
					<Button
						textStyle={style.buttonTxt}
						style={style.button}
						text="Save & Continue"
						onPress={this.handleContinue}
					/>
				</View>
				<SureModal ref={(ref) => (this.sureModal = ref)} />
				<CreateCategoryModal
					ref={(ref) => (this.createCategoryModal = ref)}
				/>
			</>
		);
	}
}

class CreateCategoryModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			festivalCategoryFees: [],
			countries: [],
			projectOrigins: [],
			selectedRuntime: RUNTIME_OPTIONS[0],
		};
		this.callback = null;
	}

	show = (categoryData, cb) => {
		this.loadCategoryData(categoryData);
		this.setCountries();
		this.callback = cb;
		this.modal.open();
		setTimeout(() => {
			this.categoryName?.focus();
		}, 600);
	};

	loadCategoryData = async (categoryData = {}) => {
		if (!categoryData.festivalId && categoryData.festivalCategoryId) {
			return;
		}
		try {
			this.setState({ isBusy: true });
			const response = await Backend.Festival.categoryData(categoryData);
			if (response?.success) {
				if (response.data.festivalCategoryFees?.length === 0) {
					this.modal.error(
						"Please add & save at least one deadline for adding category"
					);
					return;
				}
				this.initCategoryData(response.data);
			} else {
				throw new Error(response.message || ERROR_TEXT);
			}
		} catch (err) {
			this.modal.error(err.message);
			this.modal.close();
			this.callback = null;
		} finally {
			this.setState({ isBusy: false });
		}
	};

	initCategoryData = (data) => {
		const selectedRuntime = RUNTIME_OPTIONS.find(
			(c) => data.runtimeType === c.value
		);
		data.selectedRuntime = selectedRuntime;
		this.setState(data, () => {
			this.multiInput.invalidate();
		});
	};

	setCountries = async () => {
		try {
			const response = await Backend.Country.getAll();
			if (response?.success) {
				const countries = [];
				response.data.forEach(({ code, name }) => {
					countries.push({ value: code, label: name });
					return true;
				});
				this.setState({ countries });
			}
		} catch (err) {
			//TODO
		} finally {
			//TODO
		}
	};

	handleFeeChange = (fee, feeKey, index) => {
		const { festivalCategoryFees } = this.state;
		festivalCategoryFees[index][feeKey] = fee;
		this.setState({
			festivalCategoryFees,
		});
	};

	handleFeeToggle = (enabled, index) => {
		const { festivalCategoryFees } = this.state;
		festivalCategoryFees[index].enabled = enabled;
		this.setState({ festivalCategoryFees });
	};

	renderDeadline = (item, index) => {
		return (
			<DeadlineFeeCard
				data={item}
				index={index}
				toggleEnable={this.handleFeeToggle}
				onFeeChange={this.handleFeeChange}
			/>
		);
	};

	handleSubmit = () => {
		const pleaseEnter = (text) => {
			return `Please enter valid ${text}`;
		};
		let {
			id,
			name,
			festivalId,
			festivalCategoryFees,
			description,
			selectedRuntime,
			projectOrigins,
			runtimeStart = 0,
			runtimeEnd,
		} = this.state;
		runtimeStart = validation.parseNum(runtimeStart);
		runtimeEnd = validation.parseNum(runtimeEnd);
		if (!validation.validName(name)) {
			this.modal.error(pleaseEnter("name"));
			return;
		}
		if (description?.length > 0 && !validation.validName(description)) {
			this.modal.error(pleaseEnter("description"));
			return;
		}
		if (selectedRuntime.value === RUNTIME_OPTIONS[1].value) {
			//Between
			if (!runtimeStart && !runtimeEnd) {
				this.modal.error(pleaseEnter("runtime start & end minutes"));
				return;
			}
			if (runtimeStart > runtimeEnd) {
				this.modal.error(
					"Runtime Start minutes should be less than end minutes"
				);
				return;
			}
		} else if (selectedRuntime.value === RUNTIME_OPTIONS[2].value) {
			//Over
			if (!runtimeEnd) {
				this.modal.error("Over Should be greater than 0");
				return;
			}
		}
		let errorText = null;
		(festivalCategoryFees || []).forEach((fee) => {
			if (!fee.enabled) {
				return true;
			}
			const standardFee = parseFloat(fee.standardFee, 10);
			// const goldFee =	parseFloat(fee.goldFee, 10);
			if (!validation.validNumber(standardFee)) {
				errorText = `${fee.festivalDeadlineName} don't have valid standard fee`;
				return false;
			}
			//TODO: Gold Fee Percentage
			// if (!validation.validNumber(goldFee)) {
			// 	errorText = `${fee.festivalDeadlineName} don't have valid gold fee`;
			// 	return false;
			// }
			return true;
		});
		if (errorText) {
			this.modal.error(errorText);
			return;
		}
		if (this.callback) {
			this.callback({
				id,
				festivalId,
				name,
				description,
				runtimeType: selectedRuntime.value,
				projectOrigins,
				runtimeStart,
				runtimeEnd,
				festivalCategoryFees,
			});
		}
		this.modal.close();
	};

	close = () => {
		this.callback = null;
	};

	renderTime = () => {
		const { selectedRuntime, runtimeStart, runtimeEnd } = this.state;
		switch (selectedRuntime?.value) {
			case RUNTIME_OPTIONS[1].value: //Between
				return (
					<>
						<Input
							style={manageCategoryStyles.timeInput}
							value={runtimeStart}
							onChangeText={(runtimeStart) =>
								this.setState({
									runtimeStart,
								})
							}
						/>
						<Text style={manageCategoryStyles.label}>and</Text>
						<Input
							style={manageCategoryStyles.timeInput}
							value={runtimeEnd}
							onChangeText={(runtimeEnd) =>
								this.setState({
									runtimeEnd,
								})
							}
						/>
						<Text style={manageCategoryStyles.label}>Minutes</Text>
					</>
				);
			case RUNTIME_OPTIONS[2].value: //Over
				return (
					<>
						<Input
							style={manageCategoryStyles.timeInput}
							value={runtimeEnd}
							onChangeText={(runtimeEnd) =>
								this.setState({
									runtimeEnd,
								})
							}
						/>
						<Text style={manageCategoryStyles.label}>Minutes</Text>
					</>
				);
			default:
				return null;
		}
	};

	render() {
		const {
			name,
			description,
			festivalCategoryFees,
			countries,
			selectedRuntime,
			projectOrigins,
			isBusy,
		} = this.state;
		return (
			<SheetButtonModal
				title="Manage Category"
				onClose={this.close}
				width={W40}
				onSubmit={this.handleSubmit}
				ref={(ref) => (this.modal = ref)}
			>
				<Title text="Category Name" marginTop={0} />
				<Input
					style={style.modalInput}
					value={name}
					onChangeText={(name) => this.setState({ name })}
					ref={(ref) => (this.categoryName = ref)}
				/>
				<Title text="Category Description" />
				<Input
					style={style.modalInput}
					value={description}
					onChangeText={(description) =>
						this.setState({ description })
					}
				/>
				<Title text="Deadline Fees" />
				{festivalCategoryFees.map(this.renderDeadline)}
				{festivalCategoryFees?.length > 0 ? null : (
					<Text style={manageCategoryStyles.note}>
						If you{" "}
						<Text style={manageCategoryStyles.bold}>
							don't see deadlines
						</Text>{" "}
						even after adding them, than please make sure you have{" "}
						<Text style={manageCategoryStyles.bold}>saved</Text>{" "}
						deadline
					</Text>
				)}
				<Title text="Runtime" />
				<View style={manageCategoryStyles.inputRow}>
					<OptionInput
						style={manageCategoryStyles.optionInput}
						textStyle={style.validFont}
						onSelect={(sr) => {
							this.setState({ selectedRuntime: sr });
						}}
						selectedOption={selectedRuntime}
						options={RUNTIME_OPTIONS}
					/>
					{this.renderTime()}
				</View>
				<Title text="Project Origin" />
				<MultiOptionInput
					options={countries}
					style={style.inputHalf}
					onSelect={(projectOrigins) =>
						this.setState({
							projectOrigins,
						})
					}
					ref={(ref) => (this.multiInput = ref)}
					label="Origin"
					emptyText="All Origins"
					value={projectOrigins}
					textStyle={style.validFont}
				/>
				<LoadingOverlay
					busy={isBusy}
					style={{
						width: "97%",
						height: "97%",
						borderRadius: 10,
					}}
				/>
			</SheetButtonModal>
		);
	}
}

const DeadlineFeeCard = ({ data, onFeeChange, toggleEnable, index }) => {
	const getStatusText = (enabled) => {
		if (enabled === true) {
			return "Disable deadline for this category";
		}
		return "Enable";
	};
	const statusText = getStatusText(data.enabled);
	return (
		<View style={manageCategoryStyles.card}>
			<Text style={manageCategoryStyles.title}>
				{data.festivalDeadlineName}
			</Text>
			<Text
				onPress={() => toggleEnable(!data.enabled, index)}
				style={manageCategoryStyles.subText}
			>
				{statusText}
			</Text>
			{data.enabled ? (
				<View style={manageCategoryStyles.optionRow}>
					<View style={manageCategoryStyles.inputRow}>
						<Text style={manageCategoryStyles.label}>
							<Text style={style.required}>*</Text>Standard Fee:
						</Text>
						<Input
							style={manageCategoryStyles.feeInput}
							value={data.standardFee}
							onChangeText={(fee) =>
								onFeeChange(fee, "standardFee", index)
							}
						/>
					</View>
					{/*<View style={manageCategoryStyles.inputRow}>
					<Text style={manageCategoryStyles.label}>Student Fee:</Text>
					<Input style={manageCategoryStyles.feeInput} />
				</View>*/}
					<View style={manageCategoryStyles.inputRow}>
						<Text style={manageCategoryStyles.label}>
							Gold Fee:
						</Text>
						<Input
							style={manageCategoryStyles.feeInput}
							value={data.goldFee}
							onChangeText={(fee) =>
								onFeeChange(fee, "goldFee", index)
							}
						/>
					</View>
				</View>
			) : null}
		</View>
	);
};