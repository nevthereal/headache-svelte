import { command, form, query, getRequestEvent } from '$app/server';
import { APP_PASSWORD } from '$env/static/private';
import { createSession, destroySession, isSessionValid } from '@/server/session';
import { invalid, redirect } from '@sveltejs/kit';
import z from 'zod';

export const signin = form(z.object({ password: z.string() }), ({ password }, issue) => {
	const { cookies } = getRequestEvent();

	if (!password || typeof password !== 'string') {
		return invalid(issue.password('Password is not a string'));
	}

	if (password !== APP_PASSWORD) {
		return invalid(issue.password('Password is wrong'));
	}

	createSession(cookies);
	throw redirect(303, '/');
});

export const signout = command(() => {
	const { cookies } = getRequestEvent();

	destroySession(cookies);
});

export const isLoggedIn = query(() => {
	const { cookies } = getRequestEvent();
	return isSessionValid(cookies);
});
