/**
 * Copyright (c) 2025 Kevin Daniel Taylor
 * Licensed under the MIT License (see the LICENSE file in the project root).
 */
type Subscriber = () => void;

let activeEffect: Subscriber | null = null;

export default class Signal<T> {
    private _value: T;
    private subs = new Set<Subscriber>();

    constructor(value: T) {
        this._value = value;
    }

    get value(): T {
        if (activeEffect) {
            this.subs.add(activeEffect);
        }
        return this._value;
    }

    set value(v: T) {
        if (Object.is(v, this._value)) return;
        this._value = v;
        this.notify();
    }

    peek(): T {
        return this._value;
    }

    subscribe(fn: Subscriber): () => void {
        this.subs.add(fn);
        return () => this.subs.delete(fn);
    }

    notify(): void {
        // Clone subscribers to avoid issues if subscribers mutate the set during notification
        const subList = Array.from(this.subs);
        subList.forEach(fn => fn());
    }
}

/**
 * Creates a reactive signal.
 */
export function signal<T>(initialValue: T): Signal<T> {
    return new Signal<T>(initialValue);
}

/**
 * Creates an effect that re-runs when its signal dependencies change.
 * Can return a cleanup function.
 */
export function effect(fn: () => void | (() => void)): () => void {
    let cleanup: void | (() => void);

    const runEffect = () => {
        if (cleanup && typeof cleanup === 'function') {
            cleanup();
        }
        const previousEffect = activeEffect;
        activeEffect = runEffect;
        try {
            cleanup = fn();
        } finally {
            activeEffect = previousEffect;
        }
    };

    runEffect();

    return () => {
        if (cleanup && typeof cleanup === 'function') {
            cleanup();
        }
    };
}

/**
 * Creates a derived read-only signal computed from other signals.
 */
export function computed<T>(fn: () => T): Signal<T> {
    const compSignal = signal<T>(undefined as unknown as T);
    
    effect(() => {
        compSignal.value = fn();
    });

    return compSignal;
}