/**
 * Copyright (c) 2025 Kevin Daniel Taylor
 * Licensed under the MIT License (see the LICENSE file in the project root).
 */
import landing from '../views/landing';
import login from '../views/login';

const routes: Record<string, CallableFunction> = {
    '/': landing,
    '/login': login,
};

export default routes;