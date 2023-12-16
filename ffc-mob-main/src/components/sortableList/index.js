import React, { useMemo, useEffect } from 'react';
import Animated from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Item from './item';
// Hooks
import {
	useSharedValue,
	useAnimatedRef,
	useAnimatedScrollHandler,
} from 'react-native-reanimated';

import { WINDOW_WIDTH } from 'utils/constants';

const SortableGrid = ({
	triggerComponent,
	children,
	numColumns = 2,
	itemSize,
	isEnabled = true,
	onSort,
}) => {
	const scrollView = useAnimatedRef();
	const scrollY = useSharedValue(0);
	const positions = useSharedValue(
		Object.assign(
			{},
			...children.map((child, index) => ({
				[child.props.id]: index,
			}))
		)
	);
	const scrollHeight = useMemo(
		() => Math.ceil(children.length / numColumns) * itemSize,
		[itemSize, numColumns, children.length]
	);
	const handleOnScroll = useAnimatedScrollHandler(() => ({
		onScroll: ({ contentOffset: { y } }) => {
			scrollY.value = y;
		},
	}));
	return (
		<GestureHandlerRootView>
			<Animated.ScrollView
				ref={scrollView}
				contentContainerStyle={{
					height: scrollHeight,
					width: WINDOW_WIDTH,
				}}
				showsVerticalScrollIndicator={false}
				scrollEventThrottle={16}
				onScroll={handleOnScroll}
			>
				{children.map((child) => {
					return (
						<Item
							isEnabled={isEnabled}
							numColumns={numColumns}
							positions={positions}
							key={child.props.id}
							id={child.props.id}
							size={itemSize}
							scrollY={scrollY}
							contentHeight={scrollHeight}
							scrollView={scrollView}
							onUpdate={onSort}
							triggerComponent={triggerComponent}
						>
							{child}
						</Item>
					);
				})}
			</Animated.ScrollView>
		</GestureHandlerRootView>
	);
};

export default SortableGrid;
