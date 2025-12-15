/**
 * Copyright (c) 2025 Kevin Daniel Taylor
 * Licensed under the MIT License (see the LICENSE file in the project root).
 */
import landing from "../views/landing";
import routes from "./routes";

type QueryParams = { [key: string]: string };
type RouteState = {
    content: any;
} | null;

export function initializeRouter() {
    window.addEventListener('popstate', () => {
        const path = window.location.hash.slice(1) || '/';
        renderRoute(path);
    });

    const initialPath = window.location.hash.slice(1) || '/';
    renderRoute(initialPath);

    window.addEventListener('hashchange', function(event) {
        event.preventDefault();
    });

    window.addEventListener('popstate', function(event) {
        event.preventDefault();
    });
}

function renderRoute(path: string) {
    document.body.innerHTML = '';

    const page = routes[path] || landing;

    document.body.appendChild(page());
}

export function navigate(path: string, queryParams: QueryParams = {}, state: RouteState = null) {
    window.history.pushState({}, '', `#${path}`);
    renderRoute(path);
}
