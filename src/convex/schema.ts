import { zodToConvex } from 'convex-helpers/server/zod4';
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import z from 'zod';

export const POTENTIAL_CAUSES = [
	'Caffeine',
	'Alcohol',
	'Sleep deprivation',
	'Dehydration',
	'Stress',
	'Screen time',
	'Weather change',
	'Bright light',
	'Bedtime',
	'Illness'
] as const;

export const HEADACHE_LOCATIONS = [
	'Left temple',
	'Right temple',
	'Back of head',
	'Front of head',
	'Left side',
	'Right side',
	'Top of head',
	'Whole head'
] as const;

export const TIMES = ['Morning', 'Noon', 'Afternoon', 'Evening'] as const;

export const entrySchema = z.object({
	intensity: z.union([z.string().transform((i) => parseInt(String(i))), z.number()]),
	notes: z.string().optional(),
	causes: z.array(z.string()).optional(),
	locations: z.array(z.string()).optional(),
	timeOfDay: z.enum(TIMES)
});

export const entrySchemaConvex = zodToConvex(entrySchema);

export default defineSchema({
	entries: defineTable(entrySchemaConvex)
});
