import { redirect, type Handle } from '@sveltejs/kit';
import { isSessionValid, extendSession } from '$lib/server/session';

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/login'];

export const handle: Handle = async ({ event, resolve }) => {
	const { url, cookies, locals } = event;
	const pathname = url.pathname;

	// Check if the current route is public
	const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route);

	// Extend session for authenticated users on every request
	if (isSessionValid(cookies)) {
		extendSession(cookies);
		locals.authenticated = true;
	} else {
		locals.authenticated = false;
	}

	// Redirect to login if trying to access protected route without session
	if (!isPublicRoute && !locals.authenticated) {
		throw redirect(303, '/login');
	}

	// Redirect to home if trying to access login while authenticated
	if (isPublicRoute && pathname === '/login' && locals.authenticated) {
		throw redirect(303, '/');
	}

	return resolve(event);
};
