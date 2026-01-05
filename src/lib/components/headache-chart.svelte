<script lang="ts">
	import { scaleBand } from 'd3-scale';

	import dayjs from 'dayjs';
	import type { Doc } from '$convex/_generated/dataModel';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import { AreaChart } from 'layerchart';

	const chartConfig = {} satisfies Chart.ChartConfig;

	let { entries }: { entries: Doc<'entries'>[] } = $props();
</script>

<Chart.Container config={chartConfig}>
	<AreaChart
		props={{
			xAxis: {
				format: (d: Date) => Intl.DateTimeFormat().format(d)
			}
		}}
		data={entries.map((e) => ({
			...e,
			createdAt: dayjs(e._creationTime).toDate()
		}))}
		x="createdAt"
		y="intensity"
		yDomain={[0, 5]}
		xDomain={[dayjs().subtract(7, 'days').toDate(), dayjs().toDate()]}
		xPadding={[10]}
	>
		{#snippet tooltip()}
			<Chart.Tooltip />
		{/snippet}
	</AreaChart>
</Chart.Container>
