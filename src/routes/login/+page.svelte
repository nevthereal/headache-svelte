<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import Input from '@/components/ui/input/input.svelte';
	import { signin } from '@/remote/auth.remote';

	const errors = $derived(signin.fields.password.issues()?.map((i) => i.message));
</script>

<main class="flex min-h-screen items-center justify-center p-4">
	<Card.Root class="w-full max-w-md">
		<Card.Header>
			<Card.Title>Headache Tracker</Card.Title>
			<Card.Description>Enter your password to access</Card.Description>
		</Card.Header>
		<Card.Content>
			<form {...signin} class="space-y-4">
				<Field.Field>
					<Field.Label for="password">Password</Field.Label>
					<Input
						id="password"
						name="password"
						type="password"
						placeholder="Enter your password"
						required
						autofocus
					/>
					{#if errors}
						<Field.Error>{new Intl.ListFormat('en').format(errors)}</Field.Error>
					{/if}
				</Field.Field>
				<Button type="submit" class="w-full">Log In</Button>
			</form>
		</Card.Content>
	</Card.Root>
</main>
