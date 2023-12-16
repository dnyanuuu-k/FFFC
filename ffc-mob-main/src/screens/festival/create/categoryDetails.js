import React, { useState, useMemo, useRef, useEffect, Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NestableScrollContainer } from 'react-native-draggable-flatlist';
//Custom Components
import SheetButtonModal from 'components/modal/sheetButtonModal';
import SureModal from 'components/modal/sureModal';
import Button from 'components/button/';
import Input from 'components/input';
import MultiOptionInput from 'components/input/multiOptionInput';
import OveralayLoading from 'components/overlay/loading';
import Loading from 'components/modal/loading';
import CategoryModal from 'modals/category';
import Table from './table';
import Title from './title';
import OptionInput from 'components/input/optionInput';
import Header from './header';
import SaveButton from './saveButton';

// Functions
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import toast from 'libs/toast';
import validation from 'utils/validation';
import Backend from 'backend';

//Libs
import countryList from 'libs/country/list';
import Country from 'libs/country';

//Constants
import {
	ERROR_TEXT,
	BORDER_RADIUS,
	BUTTON_HEIGHT,
	RUNTIME_OPTIONS,
} from 'utils/constants';
import {
	TOP_GAP,
	TOP_GAP2,
	formWidth,
	coverWidth,
	sharedStyle,
} from './constants';
import { fonts, weights } from 'themes/topography';
import { useTheme } from '@react-navigation/native';

const CategoryDetails = ({ navigation, route }) => {
	const festivalId = route.params.id;
	const createCategoryModal = useRef();
	const sureModal = useRef();
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
					paddingBottom: TOP_GAP,
				},
				input: {
					height: BUTTON_HEIGHT,
					width: formWidth,
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
				required: {
					color: colors.rubyRed,
				},
				titleButton: {
					marginTop: 20,
					height: 30,
					width: 140,
				},
				note: {
					fontSize: fonts.regular,
					color: colors.rubyRed,
					fontWeight: weights.light,
					marginVertical: 10,
				},
				bold: {
					fontWeight: weights.semibold,
				},
				card: {
					borderRadius: BORDER_RADIUS,
					borderColor: colors.border,
					borderWidth: 1,
					padding: 10,
					marginTop: TOP_GAP2,
					width: '100%',
				},
				title: {
					fontSize: 16,
					color: colors.text,
					fontWeight: '300',
				},
				subText: {
					fontSize: fonts.small,
					color: colors.primary,
					marginTop: 3,
				},
				optionRow: {
					flexDirection: 'row',
				},
				inputRow2: {
					flexDirection: 'row',
					alignItems: 'center',
					marginTop: TOP_GAP2,
					marginRight: TOP_GAP2,
				},
				feeInput: {
					width: 70,
					height: 35,
					marginLeft: 5,
					padding: 0,
				},
				timeInput: {
					width: 70,
					height: BUTTON_HEIGHT,
					marginRight: 5,
				},
				optionInput: {
					height: BUTTON_HEIGHT,
					marginRight: 5,
					marginTop: TOP_GAP,
				},
				label: {
					fontSize: fonts.small,
					color: colors.text,
					marginRight: 5,
				},
				label2: {
					fontSize: fonts.small,
					color: colors.text,
					marginRight: 5,
					width: 100,
				},
				gap: { marginTop: TOP_GAP2 },
			}),
		[colors]
	);
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
			const response = await Backend.Festival.getStageWiseData({
				festivalId,
				stageId: 3,
			});
			if (response?.success) {
				const festival = response.data;
				const festivalCategories =
					CategoryModal.createAllCategoryTableStructure(
						festival?.festivalCategories
					);
				setData({
					...festival,
					festivalCategories,
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

	const addCategory = () => {
		createCategoryModal.current.show({ festivalId }, (d) => {
			handleSave(d);
		});
	};

	const handleCategoryEdit = (cellData) => {
		createCategoryModal.current.show(
			{ festivalId, festivalCategoryId: cellData.id },
			(d) => {
				handleSave(d);
			}
		);
	};

	const handleSave = async (categoryData) => {
		//We save deadline but don't load in row
		const festivalCategories = [...(data.festivalCategories || [])];
		const index = festivalCategories.findIndex(
			// eslint-disable-next-line eqeqeq
			(category) => category.id == categoryData.id
		);
		try {
			setIsLoading(true);
			const response = await Backend.Festival.updateFestivalCategoryDetails(
				categoryData
			);
			if (response.success) {
				const festivalCategory = CategoryModal.createCategoryTableStructure(
					response.data
				);
				if (index === -1) {
					festivalCategories.push(festivalCategory);
				} else {
					festivalCategories[index] = festivalCategory;
				}
				onNewData({
					festivalCategories,
				});
				toast.success('Festival Category Added Successfully');
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

	const handleCategoryDelete = (cellData, idx) => {
		sureModal.current.show('Category will be deleted permanently', (action) => {
			if (action) {
				deleteCategory(cellData, idx);
			}
		});
	};

	const deleteCategory = async (cellData, idx) => {
		try {
			setIsLoading(true);
			const response = await Backend.Festival.deleteCategory({
				festivalCategoryId: cellData.id,
			});
			if (response.success) {
				const festivalCategories = data.festivalCategories;
				festivalCategories.splice(idx, 1);
				onNewData({
					festivalCategories,
				});
				toast.success('Festival Category Deleted Successfully!');
			} else {
				throw new Error(response.message || ERROR_TEXT);
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleContinue = async () => {
		try {
			setIsLoading(true);
			const payload = (data.festivalCategories || []).map((c) => ({
				id: c.id,
			}));
			const response = await Backend.Festival.updateCategoryOrder(payload);
			if (response.success) {
				toast.success('Festival Category Saved Successfully!');
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
						{/*<Title text="Currency" whatIsThis required extraTopMargin />
						<Input style={style.input} />*/}
						<Title text="Categories" required extraTopMargin />
						<Table
							columns={[
								{ title: 'Category', width: 60, key: 'name' },
								{ title: 'Actions', width: 38, align: 'right' },
							]}
							onSort={(sorted) =>
								onNewData({
									festivalCategories: sorted.data,
								})
							}
							sortable
							pressable
							onEdit={handleCategoryEdit}
							onCellPress={handleCategoryEdit}
							onDelete={handleCategoryDelete}
							rows={data?.festivalCategories}
							onEmptyPress={addCategory}
							emptyText="Click here to add festival category"
						/>
						<Button
							icon={'plus'}
							type={Button.OUTLINE_ICON_PRIMARY}
							style={style.titleButton}
							text={'Add Category'}
							onPress={addCategory}
							iconSize={16}
							textStyle={sharedStyle.addButton}
						/>
					</View>
				</NestableScrollContainer>
			</View>
			<SaveButton colors={colors} onPress={handleContinue} />
			<SureModal ref={sureModal} />
			<CreateCategoryModal ref={createCategoryModal} style={style} />
			<Loading busy={isLoading} />
		</>
	);
};

class CreateCategoryModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			festivalCategoryFees: [],
			countries: [],
			projectOrigins: [],
			selectedRuntime: RUNTIME_OPTIONS[0],
			visible: false,
		};
		this.callback = null;
	}

	show = (categoryData, cb) => {
		this.loadCategoryData(categoryData);
		this.callback = cb;
		this.setState({ visible: true });
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
					toast.error(
						'Please add & save at least one deadline for adding category'
					);
					return;
				}
				this.initCategoryData(response.data);
			} else {
				throw new Error(response.message || ERROR_TEXT);
			}
		} catch (err) {
			toast.error(err.message);
			// this.setState({ visible: false });
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
		if (data?.runtimeStart) {
			data.runtimeStart = data.runtimeStart.toString();
		}
		if (data?.runtimeEnd) {
			data.runtimeEnd = data.runtimeEnd.toString();
		}
		this.setState(data, () => {
			// this.multiInput.invalidate();
		});
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
				style={this.props.style}
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
			toast.error(pleaseEnter('name'));
			return;
		}
		if (description?.length > 0 && !validation.validName(description)) {
			toast.error(pleaseEnter('description'));
			return;
		}
		if (selectedRuntime.value === RUNTIME_OPTIONS[1].value) {
			//Between
			if (!runtimeStart && !runtimeEnd) {
				toast.error(pleaseEnter('runtime start & end minutes'));
				return;
			}
			if (runtimeStart > runtimeEnd) {
				toast.error('Runtime Start minutes should be less than end minutes');
				return;
			}
		} else if (selectedRuntime.value === RUNTIME_OPTIONS[2].value) {
			//Over
			if (!runtimeEnd) {
				toast.error('Over Should be greater than 0');
				return;
			}
		}
		let errorText = null;
		(festivalCategoryFees || []).forEach((fee) => {
			if (!fee.enabled) {
				return true;
			}
			const standardFee = parseFloat(fee.standardFee, 10);
			const goldFee = parseFloat(fee.goldFee, 10);
			if (!validation.validNumber(standardFee)) {
				errorText = `${fee.festivalDeadlineName} don't have valid standard fee`;
				return false;
			}
			if (goldFee > 0) {
				const lessThanMax = standardFee - standardFee * 0.1;
				if (goldFee >= lessThanMax) {
					const deadlineName = fee.festivalDeadlineName;
					errorText = `Gold Fee for ${deadlineName} should be less than 10% of standard fee i.e ${Number(
						lessThanMax
					).toFixed(2)}`;
					return false;
				}
			}
			return true;
		});
		if (errorText) {
			toast.error(errorText);
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
		this.setState({ visible: false });
	};

	close = () => {
		this.callback = null;
		this.setState({ visible: false });
	};

	renderTime = () => {
		const { selectedRuntime, runtimeStart, runtimeEnd } = this.state;
		const { style } = this.props;
		switch (selectedRuntime?.value) {
			case RUNTIME_OPTIONS[1].value: //Between
				return (
					<>
						<Input
							style={style.timeInput}
							value={runtimeStart}
							keyboardType="numeric"
							onChangeText={(x) =>
								this.setState({
									runtimeStart: x,
								})
							}
							placeholder="Mins"
						/>
						<Text style={style.label}>and</Text>
						<Input
							placeholder="Mins"
							style={style.timeInput}
							value={runtimeEnd}
							keyboardType="numeric"
							onChangeText={(x) =>
								this.setState({
									runtimeEnd: x,
								})
							}
						/>
						<Text style={style.label}>Minutes</Text>
					</>
				);
			case RUNTIME_OPTIONS[2].value: //Over
				return (
					<>
						<Input
							style={style.timeInput}
							value={runtimeEnd}
							placeholder="Mins"
							keyboardType="numeric"
							onChangeText={(x) =>
								this.setState({
									runtimeEnd: x,
								})
							}
						/>
						<Text style={style.label}>Minutes</Text>
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
			selectedRuntime,
			projectOrigins,
			isBusy,
			visible,
		} = this.state;
		const style = this.props.style;
		return (
			<SheetButtonModal
				title="Manage Category"
				onClose={this.close}
				onSubmit={this.handleSubmit}
				visible={visible}
			>
				<Title text="Category Name" marginTop={0} />
				<Input
					style={sharedStyle.modalInput}
					value={name}
					onChangeText={(x) => this.setState({ name: x })}
				/>
				<Title text="Category Description" />
				<Input
					style={sharedStyle.modalInput}
					value={description}
					onChangeText={(x) => this.setState({ description: x })}
				/>
				<Title text="Deadline Fees" />
				{festivalCategoryFees.map(this.renderDeadline)}
				{festivalCategoryFees?.length > 0 ? null : (
					<Text style={style.note}>
						If you <Text style={style.bold}>don't see deadlines</Text> even
						after adding them, than please make sure you have{' '}
						<Text style={style.bold}>saved</Text> deadline
					</Text>
				)}
				<Title text="Runtime" />
				<View style={style.inputRow}>
					<OptionInput
						style={style.optionInput}
						textStyle={style.validFont}
						onSelect={(sr) => {
							this.setState({ selectedRuntime: sr });
						}}
						selectedOption={selectedRuntime}
						options={RUNTIME_OPTIONS}
						title="Select Runtime"
					/>
					{this.renderTime()}
				</View>
				<Title text="Project Origin" />
				<MultiOptionInput
					style={sharedStyle.modalInput}
					onSelect={(x) =>
						this.setState({
							projectOrigins: x,
						})
					}
					label="Origin"
					emptyText="All Origins"
					values={projectOrigins}
					textStyle={sharedStyle.validFont}
					dataList={countryList}
					searchPlaceholder="Search Countries"
					getCodeItem={Country.getCountry}
				/>
				<OveralayLoading busy={isBusy} />
			</SheetButtonModal>
		);
	}
}

const DeadlineFeeCard = ({ data, onFeeChange, toggleEnable, index, style }) => {
	const getStatusText = (enabled) => {
		if (enabled === true) {
			return 'Disable deadline for this category';
		}
		return 'Enable';
	};
	const statusText = getStatusText(data.enabled);
	return (
		<View style={style.card}>
			<Text style={style.title}>{data.festivalDeadlineName}</Text>
			<Text
				onPress={() => toggleEnable(!data.enabled, index)}
				style={style.subText}
			>
				{statusText}
			</Text>
			{data.enabled ? (
				<>
					<View style={style.inputRow2}>
						<Text style={style.label2}>
							<Text style={style.required}>*</Text>Standard Fee:
						</Text>
						<Input
							style={style.feeInput}
							value={data.standardFee}
							onChangeText={(fee) => onFeeChange(fee, 'standardFee', index)}
						/>
					</View>
					{/*<View style={style.inputRow}>
					<Text style={style.label}>Student Fee:</Text>
					<Input style={style.feeInput} />
				</View>*/}
					<View style={[style.inputRow, style.gap]}>
						<Text style={style.label2}>Gold Fee:</Text>
						<Input
							style={style.feeInput}
							value={data.goldFee}
							onChangeText={(fee) => onFeeChange(fee, 'goldFee', index)}
						/>
					</View>
				</>
			) : null}
		</View>
	);
};

export default gestureHandlerRootHOC(CategoryDetails);
