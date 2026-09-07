/**
 * Copyright (c) 2025 Kevin Daniel Taylor
 * Licensed under the MIT License (see the LICENSE file in the project root).
 */
import Signal, { signal } from './signal.js';

export type ComponentProps = Record<string, any>;

export interface WebComponentContext<P extends ComponentProps = ComponentProps> {
    props: { [K in keyof P]: Signal<P[K]> };
    shadowRoot: ShadowRoot | null;
    element: HTMLElement;
    emit: (eventName: string, detail?: any) => void;
}

export interface WebComponentConfig<P extends ComponentProps = ComponentProps> {
    props?: P;
    shadow?: boolean | ShadowRootMode;
    styles?: string;
    setup: (ctx: WebComponentContext<P>) => HTMLElement | HTMLElement[] | void;
}

function camelToKebab(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function kebabToCamel(str: string): string {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Defines and registers a Custom Element (Web Component) with reactive props.
 */
export function defineWebComponent<P extends ComponentProps = ComponentProps>(
    tagName: string,
    config: WebComponentConfig<P>
): typeof HTMLElement {
    if (customElements.get(tagName)) {
        return customElements.get(tagName)!;
    }

    const defaultProps = config.props || ({} as P);
    const propKeys = Object.keys(defaultProps);
    const observedAttrs = propKeys.map(camelToKebab);
    const attrToPropMap = new Map<string, string>();
    observedAttrs.forEach((attr, idx) => {
        attrToPropMap.set(attr, propKeys[idx]!);
    });

    class CustomFSDLElement extends HTMLElement {
        static get observedAttributes() {
            return observedAttrs;
        }

        public propSignals: { [K in keyof P]: Signal<any> } = {} as any;
        private _shadow: ShadowRoot | null = null;

        constructor() {
            super();
            // Initialize prop signals with default values
            for (const key of propKeys) {
                this.propSignals[key as keyof P] = signal(defaultProps[key]);
            }

            const shadowMode = config.shadow === false ? null : (config.shadow === 'closed' ? 'closed' : 'open');
            if (shadowMode) {
                this._shadow = this.attachShadow({ mode: shadowMode });
            }
        }

        connectedCallback() {
            const root = this._shadow || this;

            // Inject styles if provided
            if (config.styles) {
                const styleEl = document.createElement('style');
                styleEl.textContent = config.styles;
                root.appendChild(styleEl);
            }

            // Sync initial attributes
            for (const attr of observedAttrs) {
                if (this.hasAttribute(attr)) {
                    this.updatePropFromAttr(attr, this.getAttribute(attr));
                }
            }

            const emit = (eventName: string, detail?: any) => {
                this.dispatchEvent(new CustomEvent(eventName, {
                    bubbles: true,
                    composed: true,
                    detail
                }));
            };

            const context: WebComponentContext<P> = {
                props: this.propSignals,
                shadowRoot: this._shadow,
                element: this,
                emit
            };

            const content = config.setup(context);
            if (content) {
                if (Array.isArray(content)) {
                    content.forEach(child => root.appendChild(child));
                } else {
                    root.appendChild(content);
                }
            }
        }

        attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
            if (oldValue !== newValue) {
                this.updatePropFromAttr(name, newValue);
            }
        }

        private updatePropFromAttr(attrName: string, value: string | null) {
            const propKey = attrToPropMap.get(attrName) || kebabToCamel(attrName);
            const sig = this.propSignals[propKey as keyof P];
            if (sig) {
                const defaultVal = defaultProps[propKey];
                if (typeof defaultVal === 'number') {
                    sig.value = value !== null ? Number(value) : defaultVal;
                } else if (typeof defaultVal === 'boolean') {
                    sig.value = value !== null && value !== 'false';
                } else {
                    sig.value = value ?? defaultVal;
                }
            }
        }
    }

    customElements.define(tagName, CustomFSDLElement);
    return CustomFSDLElement;
}

/**
 * Creates a Web Component and returns an FSDL-compatible DOM builder function.
 */
export function createWebComponent<P extends ComponentProps = ComponentProps>(
    tagName: string,
    config: WebComponentConfig<P>
) {
    defineWebComponent(tagName, config);

    return function builder(
        attrs: Partial<Record<string, any>> = {},
        ...children: any[]
    ): HTMLElement {
        const el = document.createElement(tagName);
        for (const [key, value] of Object.entries(attrs)) {
            if (key.startsWith('on')) {
                const eventName = key.slice(2).toLowerCase();
                el.addEventListener(eventName, value);
            } else {
                const attrName = camelToKebab(key);
                if (value instanceof Signal) {
                    value.subscribe(() => {
                        el.setAttribute(attrName, String(value.value));
                    });
                    el.setAttribute(attrName, String(value.value));
                } else {
                    el.setAttribute(attrName, String(value));
                }
            }
        }
        for (const child of children) {
            if (typeof child === 'string' || typeof child === 'number') {
                el.appendChild(document.createTextNode(String(child)));
            } else if (child instanceof HTMLElement || child instanceof Text) {
                el.appendChild(child);
            }
        }
        return el;
    };
}
