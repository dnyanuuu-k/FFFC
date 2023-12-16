import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Easing } from 'react-native';
import {
	Canvas,
	Path,
	Skia,
	useComputedValue,
	Text,
	useFont,
	useValue,
	runTiming,
	Line2DPathEffect,
	processTransform2d,
} from '@shopify/react-native-skia';
import { useTheme } from '@react-navigation/native';
import { WINDOW_WIDTH } from 'utils/constants';
import * as d3 from 'd3';
const fontFile = require('assets/fonts/Roboto-Regular.ttf');

const CANVAS_WIDTH = WINDOW_WIDTH;
const CANVAS_HEIGHT = CANVAS_WIDTH - 100;

const GRAPH_MARGIN = 20;
const GRAPH_BAR_WIDTH = 8;

const GRAPH_HEIGHT = CANVAS_HEIGHT - 2 * GRAPH_MARGIN;
const GRAPH_WIDTH = CANVAS_WIDTH;

const Graph = ({ data = [] }) => {
	const { colors } = useTheme();
	const style = useMemo(
		() =>
			StyleSheet.create({
				container: {
					marginTop: 10,
					backgroundColor: colors.card,
				},
				margin: {
					height: 10,
				},
				canvas: {
					height: CANVAS_HEIGHT,
					width: CANVAS_WIDTH,
				},
			}),
		[colors]
	);

	const font = useFont(fontFile, 10);
	const animationState = useValue(0);

	const xStart = 10;
	const xDomain = data.map((dataPoint) => dataPoint.label);
	const xRange = [xStart, GRAPH_WIDTH];
	const x = d3.scalePoint().domain(xDomain).range(xRange).padding(1);

	const yDomain = [0, d3.max(data, (dataPoint) => dataPoint.value) + 20];
	const yRange = [0, GRAPH_HEIGHT];
	const y = d3.scaleLinear().domain(yDomain).range(yRange);

	const yAxis = y.ticks(9);

	const graphPath = useComputedValue(() => {
		const path = Skia.Path.Make();
		let maxWidth = 0;
		let maxHeight = 0;
		path.moveTo(50, GRAPH_HEIGHT);
		data.forEach((dataPoint) => {
			const vx = x(dataPoint.label) + GRAPH_BAR_WIDTH;
			const vy = GRAPH_HEIGHT - y(dataPoint.value);
			path.lineTo(vx, vy * animationState.current);
			maxWidth = Math.max(maxWidth, vx);
			maxHeight = Math.min(maxWidth, vy);
		});
		path.lineTo(GRAPH_WIDTH, maxHeight);
		path.lineTo(GRAPH_WIDTH, GRAPH_HEIGHT);
		path.close();
		return path;
	}, [animationState]);

	const animate = () => {
		animationState.current = 0;

		runTiming(animationState, 1, {
			duration: 1200,
			easing: Easing.inOut(Easing.exp),
		});
	};

	useEffect(() => {
		if (data.length) {
			setTimeout(() => {
				animate();
			}, 100);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data.length]);

	if (!data.length) {
		return null;
	}

	return (
		<View style={style.container}>
			<View style={style.margin} />
			<Canvas style={style.canvas}>
				{yAxis.map((label, idx) => {
					const yPoint = GRAPH_HEIGHT - y(label);
					return (
						<Text
							key={label}
							font={font}
							x={xStart}
							y={yPoint}
							color={colors.text}
							text={label.toString()}
						/>
					);
				})}
				{data.map((dataPoint) => (
					<Text
						key={dataPoint.label}
						x={x(dataPoint.label) - 10}
						y={CANVAS_HEIGHT - 10}
						text={dataPoint.label}
						color={colors.text}
						font={font}
					/>
				))}
				<Path path={graphPath} color={colors.primary}>
					<Line2DPathEffect
						width={1}
						matrix={processTransform2d([{ scale: 4 }])}
					/>
				</Path>
			</Canvas>
		</View>
	);
};

export default Graph;
