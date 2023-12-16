import React, { useEffect, useState, useRef } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Image as RNImage,
} from 'react-native';

// Custom Components
import Loading from '../overlay/loading';
import Preloader from '../preloader/basic';
import OptionInput from '../input/simpleOption';
import Checkbox from '../checkbox';
import ModalBase from './base';
import ModalHeader from '../header/modal';
import Button from '../button';

// Constants
import { useTheme, useNavigation } from '@react-navigation/native';
import {
	WINDOW_HEIGHT,
	WINDOW_WIDTH,
	MODAL_HEADER_HEIGHT,
	ERROR_TEXT,
} from 'utils/constants';
import { weights, fonts } from 'themes/topography';
import { movie_form } from 'assets/remoteImages';

// Helper functions
import Backend from 'backend';

const contentHeight = WINDOW_HEIGHT * 0.75;
const contentWidth = WINDOW_WIDTH * 0.9;
const mainContentHeight = contentHeight - MODAL_HEADER_HEIGHT;
const feeContentWidth = contentWidth - 20;
const feeScrollHeight = mainContentHeight - MODAL_HEADER_HEIGHT * 2 - 55;
const buttonWidth = contentWidth / 2.29;

const STANDARD_FEE = 1;
const GOLD_FEE = 2;

const FilmSubmission = ({
	festivalId,
	festivalName,
	onCheckout,
	onClose,
	active,
}) => {
	const { colors } = useTheme();
	const style = StyleSheet.create({
		row: {
			flexDirection: 'row',
		},
		optionInput: {
			width: feeContentWidth,
			alignSelf: 'center',
			marginTop: 10,
		},
		feeContent: {
			width: feeContentWidth,
			height: mainContentHeight,
			alignSelf: 'center',
		},
		feeHeader: {
			paddingLeft: 2,
			paddingRight: 5,
			flexDirection: 'row',
			justifyContent: 'space-between',
			borderBottomWidth: 1,
			borderColor: colors.border,
			height: MODAL_HEADER_HEIGHT,
			alignItems: 'center',
			width: feeContentWidth,
		},
		feeHeaderText: {
			fontSize: 16,
			color: colors.text,
			fontWeight: '600',
		},
		scrollContent: {
			height: feeScrollHeight,
			width: feeContentWidth,
		},
		feeCard: {
			height: 120,
			width: feeContentWidth,
			padding: 10,
			borderBottomWidth: 1,
			borderColor: colors.border,
		},
		categoryName: {
			fontSize: fonts.small,
			color: colors.text,
			fontWeight: weights.semibold,
			flex: 1,
		},
		feeRow: {
			flexDirection: 'row',
			marginBottom: fonts.small,
			justifyContent: 'space-between',
		},
		feeType: {
			width: 130,
			fontSize: fonts.small,
			color: colors.text,
		},
		feeColon: {
			fontSize: fonts.small,
			color: colors.text,
			fontWeight: weights.semibold,
			marginRight: 5,
		},
		feeAmount: {
			fontSize: fonts.small,
			width: 60,
			textAlign: 'right',
			color: colors.text,
			fontWeight: 'bold',
		},
		checkBox: {
			paddingHorizontal: 0,
			marginLeft: 20,
		},
		feeFooter: {
			flexDirection: 'row',
			borderTopWidth: 1,
			borderColor: colors.border,
			height: MODAL_HEADER_HEIGHT,
			alignItems: 'center',
		},
		tabButton: {
			height: 35,
			width: buttonWidth,
			marginRight: 20,
		},
		buttonText: {
			fontSize: fonts.regular,
		},
		smallTxt: {
			fontSize: fonts.small,
		},
		illustration: {
			height: 180,
			width: 180,
		},
		button: {
			marginTop: 20,
			width: buttonWidth,
			height: 30,
		},
		addNewText: {
			fontSize: fonts.small,
			color: colors.holderColor,
			marginTop: 20,
		},
		addNewCover: {
			width: '100%',
			alignItems: 'center',
		},
		issueCover: {
			width: '100%',
		},
		issueDesc: {
			fontSize: fonts.small,
			marginTop: 10,
			color: colors.holderColor,
		},
		issueTxt: {
			fontSize: fonts.small,
			color: colors.rubyRed,
			marginTop: 10,
		},
		issueBtns: {
			flexDirection: 'row',
			justifyContent: 'space-between',
		},
		goldNote: {
			backgroundColor: colors.greenLight,
			borderColor: colors.greenDark,
			borderWidth: 1,
			padding: 5,
			borderRadius: 5,
			marginVertical: 10,
		},
		goldNoteTxt: {
			fontSize: fonts.small,
			color: colors.greenDark,
		},
		alreadyExists: {
			fontSize: fonts.small,
			color: colors.primary,
			height: 70,
		},
	});
	const navigation = useNavigation();
	const [isBusy, setBusy] = useState(false);
	const [noFilms, setNoFilms] = useState(false);
	const [filmLoading, setFilmLoading] = useState(false);
	const [filmError, setFilmError] = useState(false);
	const [isGoldInCart, setIsGoldInCart] = useState(false);
	const [addGoldSubscription, setAddGoldSubscription] = useState(false);
	const [loadingCategories, setLoadingCategories] = useState(false);
	const [categoryError, setCategoryError] = useState(false);
	const [visible, setVisible] = useState(false);
	const [currentIssues, setCurrentIssues] = useState([]);
	const [currentFilm, setCurrentFilm] = useState(null);
	const [films, setFilms] = useState([]);
	const [festivalCategoryFees, setFestivalCategoryFees] = useState([]);
	const [selectedFee, setSelectedFee] = useState(new Map());
	const baseModal = useRef();

	const show = () => {
		setVisible(true);
		setSelectedFee(new Map());
		loadFilms();
	};

	const closeModal = () => {
		setVisible(false);
		setCurrentFilm(null);
		setFilms([]);
		setFestivalCategoryFees([]);
		onClose();
	};

	useEffect(() => {
		if (active) {
			show();
		} else {
			closeModal();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [active]);

	const createFilmProject = () => {
		navigation.navigate('FilmCreate', {});
		closeModal();
	};

	const editProject = () => {
		navigation.navigate('FilmCreate', {
			filmId: currentFilm,
		});
		closeModal();
	};

	const viewProject = () => {
		navigation.navigate('FilmView', {
			filmId: currentFilm,
		});
		closeModal();
	};

	const resetStates = () => {
		setCurrentIssues([]);
		setFilms([]);
		setFilmLoading(true);
		setFilmError(false);
		setAddGoldSubscription(false);
		setSelectedFee(new Map());
	};

	const loadFilms = async () => {
		try {
			resetStates();
			const response = await Backend.Film.getFilmsForSubmissions({
				isPublished: true,
				isActive: true,
				categoryError: false,
			});
			if (response.success) {
				const data = response.data || { films: [] };
				if (data.films.length === 0) {
					setNoFilms(true);
					return;
				}
				const mFilms = data.films.map(({ title, id }) => ({
					label: title,
					value: id,
				}));
				setFilms(mFilms);
				if (!currentFilm) {
					selectFilm(data.films[0]);
				}
				setIsGoldInCart(data?.goldSubscriptionInCart || false);
			} else {
				throw new Error(response?.message || ERROR_TEXT);
			}
		} catch (err) {
			setFilmError(true);
			baseModal.current.error(err.message);
		} finally {
			setFilmLoading(false);
		}
	};

	const selectFilm = async (film) => {
		setCurrentFilm(film.id);
		if (film.issues.length) {
			setCurrentIssues(film.issues);
		} else {
			loadCategories(film.id);
		}
	};

	const selectFee = (feeCategoryId, feeType, isGoldMember) => {
		const mSelectedFee = new Map(selectedFee);
		const currentSelected = mSelectedFee.get(feeCategoryId);
		if (feeType === currentSelected) {
			mSelectedFee.set(feeCategoryId, false);
		} else {
			mSelectedFee.set(feeCategoryId, feeType);
		}
		setSelectedFee(mSelectedFee);

		let hasAddedGold = false;
		// eslint-disable-next-line no-unused-vars
		for (const [k, v] of mSelectedFee) {
			if (v === GOLD_FEE) {
				hasAddedGold = true;
				break;
			}
		}
		const mAddGoldSubs = !isGoldMember && !isGoldInCart && hasAddedGold;
		setAddGoldSubscription(mAddGoldSubs);
	};

	const loadCategories = async (filmId) => {
		try {
			setFestivalCategoryFees([]);
			setLoadingCategories(true);
			setCategoryError(false);
			const response = await Backend.Festival.submissionCategories({
				filmId: filmId || currentFilm,
				festivalId,
			});
			if (response.success) {
				setFestivalCategoryFees(response.data);
			} else {
				throw new Error(response.message || ERROR_TEXT);
			}
		} catch (err) {
			setCategoryError(true);
			baseModal.current.error(err.message);
		} finally {
			setLoadingCategories(false);
		}
	};

	const addToCart = async (checkout = true) => {
		try {
			setBusy(true);
			const festivalCategoryFeeIds = Array.from(selectedFee.keys());
			if (festivalCategoryFeeIds.length === 0) {
				throw new Error('Please select atleast one category');
			}
			const response = await Backend.Cart.addFilmToCartMulti({
				filmId: currentFilm,
				festivalCategoryFeeIds,
				includeGoldMembership: addGoldSubscription,
			});
			if (response.success) {
				if (!checkout) {
					baseModal.current.success('Add to cart successfully');
				} else if (onCheckout) {
					onCheckout(checkout);
					closeModal();
				}
			} else {
				throw new Error(response.message || ERROR_TEXT);
			}
		} catch (err) {
			baseModal.current.error(err.message);
		} finally {
			setBusy(false);
		}
	};

	const renderIssues = () => {
		return (
			<View style={style.issueCover}>
				<Text style={style.issueDesc}>
					We have found some issues in this film please fix them to submit film.
				</Text>
				{currentIssues.map((issue, idx) => (
					<Text style={style.issueTxt} key={idx}>
						• {issue}
					</Text>
				))}
				<View style={style.issueBtns}>
					<Button
						style={style.button}
						text="Edit Project"
						type={Button.OUTLINE_PRIMARY}
						textStyle={style.smallTxt}
						onPress={editProject}
					/>
					<Button
						style={style.button}
						text="View Project"
						type={Button.OUTLINE_PRIMARY}
						textStyle={style.smallTxt}
						onPress={viewProject}
					/>
				</View>
			</View>
		);
	};

	const renderFee = (category, index) => {
		const feeType = selectedFee.get(category.id);
		const standardFeeSelected = feeType === STANDARD_FEE;
		const goldFeeSelected = feeType === GOLD_FEE;
		return (
			<View style={style.feeCard} key={category.id}>
				<Text style={style.categoryName}>{category.name}</Text>
				<View>
					{category.alreadySubmitted || category.alreadyAddedToCart ? (
						<Text style={style.alreadyExists}>
							You have already{' '}
							{category.alreadySubmitted
								? 'submitted this film to this category'
								: 'added this film to cart for this category'}
						</Text>
					) : (
						<>
							<FeeCard
								onChange={() =>
									selectFee(category.id, STANDARD_FEE, category.isGoldMember)
								}
								amount={category.standardFee}
								category={category}
								name="Standard Fee"
								isGold={false}
								checked={standardFeeSelected}
								style={style}
							/>
							<FeeCard
								onChange={() =>
									selectFee(category.id, GOLD_FEE, category.isGoldMember)
								}
								amount={category.goldFee}
								category={category}
								name="Gold Fee"
								isGold
								checked={goldFeeSelected}
								style={style}
							/>
						</>
					)}
				</View>
			</View>
		);
	};

	return (
		<ModalBase
			ref={baseModal}
			onClose={closeModal}
			visible={visible}
			height={contentHeight}
			width={contentWidth}
		>
			<ModalHeader title={festivalName} onBackPress={closeModal} />

			{noFilms ? (
				<View style={style.addNewCover}>
					<RNImage
						style={style.illustration}
						source={{ uri: movie_form }}
						resizeMode="contain"
					/>
					<Text style={style.addNewText}>
						To submit film you must add a project first
					</Text>
					<Button
						style={style.button}
						text="Add New Film"
						type={Button.OUTLINE_PRIMARY}
						textStyle={style.smallTxt}
						onPress={createFilmProject}
					/>
				</View>
			) : (
				<Preloader
					isBusy={filmLoading}
					onRetry={loadFilms}
					hasError={filmError}
					isEmpty={false}
				>
					<OptionInput
						style={style.optionInput}
						onSelect={(sr) => {
							setCurrentFilm(sr);
						}}
						selectedValue={currentFilm}
						options={films}
						title="Select Film"
					/>

					<View style={style.feeContent}>
						{currentIssues.length ? (
							renderIssues()
						) : (
							<>
								<View style={style.feeHeader}>
									<Text style={style.feeHeaderText}>Category</Text>
									<Text style={style.feeHeaderText}>Fee</Text>
								</View>
								<Preloader
									isBusy={loadingCategories}
									onRetry={loadCategories}
									hasError={categoryError}
									isEmpty={false}
								>
									<View style={style.scrollContent}>
										<ScrollView>
											{addGoldSubscription ? (
												<View style={style.goldNote}>
													<Text style={style.goldNoteTxt}>
														Gold membership will be added to your cart
													</Text>
												</View>
											) : null}
											{festivalCategoryFees.map(renderFee)}
										</ScrollView>
									</View>
									<View style={style.feeFooter}>
										<Button
											text="Add to cart"
											icon="shopping-cart"
											iconSize={18}
											type={Button.OUTLINE_ICON_PRIMARY}
											style={style.tabButton}
											textStyle={style.buttonText}
											onPress={() => {
												addToCart(false);
											}}
										/>
										<Button
											text="Checkout"
											icon="zap"
											iconSize={18}
											type={Button.ICON_PRIMARY}
											style={style.tabButton}
											textStyle={style.buttonText}
											onPress={() => {
												addToCart(true);
											}}
										/>
									</View>
								</Preloader>
							</>
						)}
					</View>
				</Preloader>
			)}
			<Loading busy={isBusy} />
		</ModalBase>
	);
};

const FeeCard = ({
	category,
	amount,
	isGold,
	checked,
	name,
	onChange,
	style,
}) => {
	let disabled = false;
	// eslint-disable-next-line eqeqeq
	if (amount == 0 || !category.enabled || (category.isGoldMember && !isGold)) {
		disabled = true;
	}
	const opacity = disabled ? 0.4 : 1;
	const formatted = Number(amount).toFixed(2);
	return (
		<View
			style={[style.feeRow, { opacity }]}
			pointerEvents={disabled ? 'none' : 'auto'}
		>
			<Text style={style.feeType}>{name}</Text>
			<Text style={style.feeColon}>:</Text>
			<Text style={style.feeAmount}>
				{category.currency.symbol}
				{formatted}
			</Text>

			<Checkbox
				onChange={onChange}
				checked={checked}
				cardStyle={style.checkBox}
				width={30}
			/>
		</View>
	);
};

export default FilmSubmission;