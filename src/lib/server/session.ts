import { dev } from '$app/environment';
import type { Cookies } from '@sveltejs/kit';

const SESSION_COOKIE_NAME = 'session_id';
const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export interface SessionData {
	timestamp: number;
	expiresAt: number;
}

/**
 * Generate a secure session ID
 */
function generateSessionId(): string {
	return crypto.getRandomValues(new Uint8Array(32)).reduce((acc, byte) => {
		return acc + byte.toString(16).padStart(2, '0');
	}, '');
}

/**
 * Create a new session and set it in cookies
 */
export function createSession(cookies: Cookies): string {
	const sessionId = generateSessionId();
	const now = Date.now();
	const expiresAt = now + SESSION_MAX_AGE * 1000;

	cookies.set(SESSION_COOKIE_NAME, sessionId, {
		httpOnly: true,
		secure: !dev,
		sameSite: 'strict',
		path: '/',
		maxAge: SESSION_MAX_AGE
	});

	return sessionId;
}

/**
 * Get the current session ID from cookies
 */
export function getSessionId(cookies: Cookies): string | undefined {
	return cookies.get(SESSION_COOKIE_NAME);
}

/**
 * Check if a session is valid
 */
export function isSessionValid(cookies: Cookies): boolean {
	const sessionId = getSessionId(cookies);
	return !!sessionId;
}

/**
 * Destroy the current session
 */
export function destroySession(cookies: Cookies): void {
	cookies.delete(SESSION_COOKIE_NAME, {
		path: '/',
		httpOnly: true,
		secure: !dev,
		sameSite: 'strict'
	});
}

/**
 * Extend the session expiration
 */
export function extendSession(cookies: Cookies): void {
	const sessionId = getSessionId(cookies);
	if (sessionId) {
		cookies.set(SESSION_COOKIE_NAME, sessionId, {
			httpOnly: true,
			secure: !dev,
			sameSite: 'strict',
			path: '/',
			maxAge: SESSION_MAX_AGE
		});
	}
}
