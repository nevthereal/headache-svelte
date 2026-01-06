<script lang="ts">
	import { scaleBand } from 'd3-scale';
	import { curveLinear } from 'd3-shape';
	import dayjs from 'dayjs';
	import type { Doc } from '$convex/_generated/dataModel';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import { LineChart } from 'layerchart';
	import { SvelteMap } from 'svelte/reactivity';

	let { entries }: { entries: Doc<'entries'>[] } = $props();

	// Generate all dates for the last 7 days
	const allDates = $derived.by(() => {
		const dates: string[] = [];
		for (let i = 6; i >= 0; i--) {
			dates.push(dayjs().subtract(i, 'days').format('DD.MM'));
		}
		return dates;
	});

	// Create a map of entries by date
	const entriesByDate = $derived.by(() => {
		const map = new SvelteMap<string, Doc<'entries'>>();
		entries.forEach((e) => {
			const dateLabel = dayjs(e._creationTime).format('DD.MM');
			map.set(dateLabel, e);
		});
		return map;
	});

	// Merge: ensure all dates are in the chart, with entries where they exist
	const chartData = $derived.by(() => {
		return allDates.map((dateLabel) => ({
			dateLabel,
			intensity: entriesByDate.get(dateLabel)?.intensity ?? null
		}));
	});

	const chartConfig = {
		intensity: {
			label: 'Intensity',
			color: '#3066BE'
		}
	} satisfies Chart.ChartConfig;
</script>

<Chart.Container config={chartConfig}>
	<LineChart
		props={{
			xAxis: {
				format: (d: string) => d
			},
			spline: { curve: curveLinear, motion: 'tween', strokeWidth: 2 }
		}}
		xScale={scaleBand().padding(0)}
		data={chartData}
		x="dateLabel"
		y="intensity"
		yDomain={[0, 5]}
		series={[
			{
				key: 'intensity',
				label: 'Intensity',
				color: chartConfig.intensity.color
			}
		]}
	>
		{#snippet tooltip()}
			<Chart.Tooltip />
		{/snippet}
	</LineChart>
</Chart.Container>
