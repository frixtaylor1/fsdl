/**
 * Copyright (c) 2025 Kevin Daniel Taylor
 * Licensed under the MIT License (see the LICENSE file in the project root).
 */
import { style } from './lib/dom.js';
import { initializeRouter } from './src/router/router.js';

function entryPoint() {
    const GlobalStyles = style({}, `
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            background: #f8f9fa;
        }
    `);


    document.body.onload = () => {
        document.head.appendChild(GlobalStyles);
        initializeRouter();
    }
}

entryPoint();
