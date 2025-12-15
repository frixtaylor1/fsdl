/**
 * Copyright (c) 2025 Kevin Daniel Taylor
 * Licensed under the MIT License (see the LICENSE file in the project root).
 */
type Subscriber = () => void;

export default class Signal<T> {
    private _value: T;
    private subs = new Set<Subscriber>();

    constructor(value: T) {
        this._value = value;
    }

    get value(): T {
        return this._value;
    }

    set value(v: T) {
        if (Object.is(v, this._value)) return;
        this._value = v;
        this.subs.forEach(fn => fn());
    }

    subscribe(fn: Subscriber) {
        this.subs.add(fn);
        return () => this.subs.delete(fn);
    }
}