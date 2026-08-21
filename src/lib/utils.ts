import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { resolve } from '$app/paths';
import type { Path, ResolvedPathname } from '$app/types';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function resolveInternalPath(path: string): ResolvedPathname {
	return resolve(path.replace(/^\/+/, '') as Path);
}

export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
