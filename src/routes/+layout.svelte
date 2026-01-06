<script lang="ts">
	import './layout.css';
	import { PUBLIC_CONVEX_URL } from '$env/static/public';
	import { setupConvex } from 'convex-svelte';
	import { isLoggedIn, signout } from '@/remote/auth.remote';

	import { goto } from '$app/navigation';
	import { Button } from '@/components/ui/button';

	const { children } = $props();
	setupConvex(PUBLIC_CONVEX_URL);

	const loggedIn = $derived(await isLoggedIn());
</script>

<div class="flex justify-between p-4">
	<a href="/" class="text-lg font-bold">Headache tracker</a>
	{#if loggedIn}
		<div class="flex gap-2">
			<Button variant="outline" href="/entries">Manage entries</Button>
			<Button variant="outline" onclick={async () => await signout().then(() => goto('/login'))}
				>Log out</Button
			>
		</div>
	{/if}
</div>
{@render children()}
