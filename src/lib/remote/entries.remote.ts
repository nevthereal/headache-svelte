import { form } from '$app/server';
import { api } from '$convex/_generated/api';
import { entrySchema } from '$convex/schema';
import { ConvexHttpClient } from 'convex/browser';
import { PUBLIC_CONVEX_URL } from '$env/static/public';

export const add = form(entrySchema, (data) => {
	const client = new ConvexHttpClient(PUBLIC_CONVEX_URL);
	client.mutation(api.entries.create, data);
});
