import { mutation, query } from './_generated/server';
import { api } from './_generated/api';
import { entrySchemaConvex } from './schema';
import dayjs from 'dayjs';

export const getLastWeek = query({
	args: {},
	handler: async (ctx) => {
		const tasks = await ctx.db
			.query('entries')
			.filter((q) =>
				q.gte(
					q.field('_creationTime'),
					dayjs().subtract(1, 'week').startOf('day').toDate().getTime()
				)
			)
			.collect();

		return tasks;
	}
});

export const getAll = query({
	args: {},
	handler: async (ctx) => {
		const tasks = await ctx.db.query('entries').collect();
		return tasks;
	}
});

export const getToday = query({
	args: {},
	handler: async (ctx) => {
		const startOfDay = new Date();
		startOfDay.setHours(0, 0, 0, 0);
		const startOfToday = startOfDay.getTime();

		// Get the end of today (23:59:59.999) in milliseconds
		const endOfDay = new Date();
		endOfDay.setHours(23, 59, 59, 999);
		const endOfToday = endOfDay.getTime();

		const todaysEntries = await ctx.db
			.query('entries')
			.filter((q) =>
				q.and(
					q.gte(q.field('_creationTime'), startOfToday),
					q.lte(q.field('_creationTime'), endOfToday)
				)
			)
			.collect();

		if (todaysEntries.length === 0) {
			return false;
		}
		return true;
	}
});

export const create = mutation({
	args: entrySchemaConvex,
	handler: async (ctx, args) => {
		// Get the start of today (midnight) in milliseconds

		// Query entries created today (between start and end of day)
		const entryToday = await ctx.runQuery(api.entries.getToday);

		if (entryToday) {
			return new Response('there already is an entry for today');
		}

		// Create the new entry
		const entryId = await ctx.db.insert('entries', {
			intensity: args.intensity,
			notes: args.notes,
			locations: args.locations,
			causes: args.causes,
			timeOfDay: args.timeOfDay
		});

		return entryId;
	}
});
