<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { useQuery } from 'convex-svelte';
	import { api } from '$convex/_generated/api';
	import { Slider } from '@/components/ui/slider';
	import Textarea from '@/components/ui/textarea/textarea.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import { HEADACHE_LOCATIONS, POTENTIAL_CAUSES, TIMES } from '$convex/schema';
	import Button from '@/components/ui/button/button.svelte';
	import * as Entries from '$lib/remote/entries.remote';
	import HeadacheChart from '@/components/headache-chart.svelte';

	const query = useQuery(api.entries.getAll, {});

	let intensity = $state(0);
	let locations = $state([]);
	let causes = $state([]);
	let timeOfDay = $state<(typeof TIMES)[number]>('Morning');
</script>

<main class="grid grid-cols-3 gap-4 p-16">
	<Card.Root>
		{JSON.stringify(Entries.add.fields.allIssues())}
		<Card.Content>
			<form {...Entries.add}>
				<Field.Set>
					<Field.Legend>New entry</Field.Legend>
					<Field.Description>Create a new Headache Entry.</Field.Description>
					<Field.Group>
						<Field.Field>
							<Field.Label class="justify-between" for="intensity"
								>Intensity <span>({intensity})</span></Field.Label
							>
							<Slider type="single" bind:value={intensity} min={0} max={5} step={0.5} />
							<input hidden name="intensity" type="number" step={0.5} bind:value={intensity} />
						</Field.Field>
						<Field.Field>
							<Field.Label for="notes">Notes</Field.Label>
							<Textarea name="notes" />
						</Field.Field>
						<Field.Field>
							<Field.Label for="locations[]">Locations</Field.Label>
							<Select.Root type="multiple" name="locations[]" bind:value={locations}>
								<Select.Trigger>{locations.length} selected</Select.Trigger>
								<Select.Content>
									<Select.Group>
										{#each HEADACHE_LOCATIONS as loc (loc)}
											<Select.Item value={loc} label={loc}>
												{loc}
											</Select.Item>
										{/each}
									</Select.Group>
								</Select.Content>
							</Select.Root>
						</Field.Field>
						<Field.Field>
							<Field.Label for="causes[]">Potential causes</Field.Label>
							<Select.Root type="multiple" name="causes[]" bind:value={causes}>
								<Select.Trigger>{causes.length} selected</Select.Trigger>
								<Select.Content>
									<Select.Group>
										{#each POTENTIAL_CAUSES as cause (cause)}
											<Select.Item value={cause} label={cause}>
												{cause}
											</Select.Item>
										{/each}
									</Select.Group>
								</Select.Content>
							</Select.Root>
						</Field.Field>
						<Field.Field>
							<Field.Label for="timeOfDay">Time of the day</Field.Label>
							<Select.Root type="single" name="timeOfDay" bind:value={timeOfDay}>
								<Select.Trigger>{timeOfDay}</Select.Trigger>
								<Select.Content>
									<Select.Group>
										{#each TIMES as time (time)}
											<Select.Item value={time} label={time}>
												{time}
											</Select.Item>
										{/each}
									</Select.Group>
								</Select.Content>
							</Select.Root>
						</Field.Field>
					</Field.Group>
					<Field.Field orientation="horizontal">
						<Button type="submit">Create</Button>
					</Field.Field>
				</Field.Set>
			</form>
		</Card.Content>
	</Card.Root>
	<Card.Root class="col-span-2">
		<Card.Header>
			<Card.Title>Headache Intensity - Last 7 Days</Card.Title>
			<Card.Description>Track your headache intensity over time</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if query.isLoading}
				<div class="flex h-[250px] items-center justify-center">
					<p class="text-muted-foreground">Loading chart data...</p>
				</div>
			{:else if query.error}
				<div class="flex h-[250px] items-center justify-center">
					<p class="text-destructive">Error loading chart data</p>
				</div>
			{:else if query.data && query.data.length > 0}
				<HeadacheChart entries={query.data} />
			{:else}
				<div class="flex h-[250px] items-center justify-center">
					<p class="text-muted-foreground">No data available. Start tracking your headaches!</p>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</main>
