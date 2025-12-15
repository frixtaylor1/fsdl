/**
 * Copyright (c) 2025 Kevin Daniel Taylor
 * Licensed under the MIT License (see the LICENSE file in the project root).
 */
import Signal from './signal.js';

type ElementType<TTag extends keyof HTMLElementTagNameMap> = HTMLElementTagNameMap[TTag];
type StyleAttr                                             = Partial<CSSStyleDeclaration>;

type EventHandler  = (e: Event) => void;
type PrimitiveAttr = string | number | boolean | StyleAttr | HTMLElement | EventHandler | Signal<any>;

type AttributeKeys<T> = {
    [K in keyof T]: T[K] extends PrimitiveAttr ? K : never
}[keyof T];

type EventKeys = 'onclick' | 'onmouseenter' | 'onmouseleave' | 'onmouseover' | 'onmouseout' | 'onfocus' | 'onblur' | 'onchange' | 'oninput' | 'onsubmit' | 'ondblclick' | 'onkeydown' | 'onkeyup' | 'onkeypress';

type TypAttributeKey<TTag extends keyof HTMLElementTagNameMap> = AttributeKeys<HTMLElementTagNameMap[TTag]> |
        EventKeys |
        `data-${string}` |
        `aria-${string}`;

type tag_attributes<TTag extends keyof HTMLElementTagNameMap> = Partial<
    Record<TypAttributeKey<TTag>, PrimitiveAttr>
> & {
    style?: Partial<CSSStyleDeclaration>;
};

function text<T>(signal: Signal<T>): Text {
    const node = document.createTextNode(String(signal.value));

    signal.subscribe(() => {
        node.textContent = String(signal.value);
    });

    return node;
}

function createElement<TTag extends keyof HTMLElementTagNameMap>(
    tag: TTag,
    attrs: tag_attributes<TTag> = {},
    ...children: (HTMLElement | string | Text)[] 
): ElementType<TTag> {
    const element = document.createElement(tag) as ElementType<TTag>;

    const { style, ...parsedAttrs } = attrs;
    
    if (style) {
        Object.assign(element.style, style);
    }

    const eventMap: Record<string, string> = {
        onclick: 'click',
        onmouseenter: 'mouseenter',
        onmouseleave: 'mouseleave',
        onmouseover: 'mouseover',
        onmouseout: 'mouseout',
        onfocus: 'focus',
        onblur: 'blur',
        onchange: 'change',
        oninput: 'input',
        onsubmit: 'submit',
        ondblclick: 'dblclick',
        onkeydown: 'keydown',
        onkeyup: 'keyup',
        onkeypress: 'keypress',
    };

    for (const [key, value] of Object.entries(parsedAttrs)) {
        const eventType = eventMap[key];
        if (eventType) {
            element.addEventListener(eventType, value as EventHandler);
        } else if (key.startsWith('data-') || key.startsWith('aria-')) {
            element.setAttribute(key, String(value));
        } else {
            (element as any)[key] = value;
        }
    }

    for (const child of children) {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    }

    return element;
}

type ChildrenType = HTMLElement | string | Text;

export { text };
export function a(         attrs?: tag_attributes<'a'>, ...children: ChildrenType[]):           HTMLAnchorElement           { return createElement('a',             attrs, ...children); }
export function abbr(      attrs?: tag_attributes<'abbr'>, ...children: ChildrenType[]):        HTMLElement                 { return createElement('abbr',          attrs, ...children); }
export function address(   attrs?: tag_attributes<'address'>, ...children: ChildrenType[]):     HTMLElement                 { return createElement('address',       attrs, ...children); }
export function area(      attrs?: tag_attributes<'area'>, ...children: ChildrenType[]):        HTMLAreaElement             { return createElement('area',          attrs, ...children); }
export function article(   attrs?: tag_attributes<'article'>, ...children: ChildrenType[]):     HTMLElement                 { return createElement('article',       attrs, ...children); }
export function aside(     attrs?: tag_attributes<'aside'>, ...children: ChildrenType[]):       HTMLElement                 { return createElement('aside',         attrs, ...children); }
export function audio(     attrs?: tag_attributes<'audio'>, ...children: ChildrenType[]):       HTMLAudioElement            { return createElement('audio',         attrs, ...children); }
export function b(         attrs?: tag_attributes<'b'>, ...children: ChildrenType[]):           HTMLElement                 { return createElement('b',             attrs, ...children); }
export function base(      attrs?: tag_attributes<'base'>, ...children: ChildrenType[]):        HTMLBaseElement             { return createElement('base',          attrs, ...children); }
export function bdi(       attrs?: tag_attributes<'bdi'>, ...children: ChildrenType[]):         HTMLElement                 { return createElement('bdi',           attrs, ...children); }
export function bdo(       attrs?: tag_attributes<'bdo'>, ...children: ChildrenType[]):         HTMLElement                 { return createElement('bdo',           attrs, ...children); }
export function blockquote(attrs?: tag_attributes<'blockquote'>, ...children: ChildrenType[]):  HTMLQuoteElement            { return createElement('blockquote',    attrs, ...children); }
export function body(      attrs?: tag_attributes<'body'>, ...children: ChildrenType[]):        HTMLBodyElement             { return createElement('body',          attrs, ...children); }
export function br(        attrs?: tag_attributes<'br'>, ...children: ChildrenType[]):          HTMLBRElement               { return createElement('br',            attrs, ...children); }
export function button(    attrs?: tag_attributes<'button'>, ...children: ChildrenType[]):      HTMLButtonElement           { return createElement('button',        attrs, ...children); }
export function canvas(    attrs?: tag_attributes<'canvas'>, ...children: ChildrenType[]):      HTMLCanvasElement           { return createElement('canvas',        attrs, ...children); }
export function caption(   attrs?: tag_attributes<'caption'>, ...children: ChildrenType[]):     HTMLTableCaptionElement     { return createElement('caption',       attrs, ...children); }
export function cite(      attrs?: tag_attributes<'cite'>, ...children: ChildrenType[]):        HTMLElement                 { return createElement('cite',          attrs, ...children); }
export function code(      attrs?: tag_attributes<'code'>, ...children: ChildrenType[]):        HTMLElement                 { return createElement('code',          attrs, ...children); }
export function col(       attrs?: tag_attributes<'col'>, ...children: ChildrenType[]):         HTMLTableColElement         { return createElement('col',           attrs, ...children); }
export function colgroup(  attrs?: tag_attributes<'colgroup'>, ...children: ChildrenType[]):    HTMLTableColElement         { return createElement('colgroup',      attrs, ...children); }
export function data(      attrs?: tag_attributes<'data'>, ...children: ChildrenType[]):        HTMLDataElement             { return createElement('data',          attrs, ...children); }
export function datalist(  attrs?: tag_attributes<'datalist'>, ...children: ChildrenType[]):    HTMLDataListElement         { return createElement('datalist',      attrs, ...children); }
export function dd(        attrs?: tag_attributes<'dd'>, ...children: ChildrenType[]):          HTMLElement                 { return createElement('dd',            attrs, ...children); }
export function del(       attrs?: tag_attributes<'del'>, ...children: ChildrenType[]):         HTMLModElement              { return createElement('del',           attrs, ...children); }
export function details(   attrs?: tag_attributes<'details'>, ...children: ChildrenType[]):     HTMLDetailsElement          { return createElement('details',       attrs, ...children); }
export function dfn(       attrs?: tag_attributes<'dfn'>, ...children: ChildrenType[]):         HTMLElement                 { return createElement('dfn',           attrs, ...children); }
export function dialog(    attrs?: tag_attributes<'dialog'>, ...children: ChildrenType[]):      HTMLDialogElement           { return createElement('dialog',        attrs, ...children); }
export function div(       attrs?: tag_attributes<'div'>, ...children: ChildrenType[]):         HTMLDivElement              { return createElement('div',           attrs, ...children); }
export function dl(        attrs?: tag_attributes<'dl'>, ...children: ChildrenType[]):          HTMLDListElement            { return createElement('dl',            attrs, ...children); }
export function dt(        attrs?: tag_attributes<'dt'>, ...children: ChildrenType[]):          HTMLElement                 { return createElement('dt',            attrs, ...children); }
export function em(        attrs?: tag_attributes<'em'>, ...children: ChildrenType[]):          HTMLElement                 { return createElement('em',            attrs, ...children); }
export function embed(     attrs?: tag_attributes<'embed'>, ...children: ChildrenType[]):       HTMLEmbedElement            { return createElement('embed',         attrs, ...children); }
export function fieldset(  attrs?: tag_attributes<'fieldset'>, ...children: ChildrenType[]):    HTMLFieldSetElement         { return createElement('fieldset',      attrs, ...children); }
export function figcaption(attrs?: tag_attributes<'figcaption'>, ...children: ChildrenType[]):  HTMLElement                 { return createElement('figcaption',    attrs, ...children); }
export function figure(    attrs?: tag_attributes<'figure'>, ...children: ChildrenType[]):      HTMLElement                 { return createElement('figure',        attrs, ...children); }
export function footer(    attrs?: tag_attributes<'footer'>, ...children: ChildrenType[]):      HTMLElement                 { return createElement('footer',        attrs, ...children); }
export function form(      attrs?: tag_attributes<'form'>, ...children: ChildrenType[]):        HTMLFormElement             { return createElement('form',          attrs, ...children); }
export function h1(        attrs?: tag_attributes<'h1'>, ...children: ChildrenType[]):          HTMLHeadingElement          { return createElement('h1',            attrs, ...children); }
export function h2(        attrs?: tag_attributes<'h2'>, ...children: ChildrenType[]):          HTMLHeadingElement          { return createElement('h2',            attrs, ...children); }
export function h3(        attrs?: tag_attributes<'h3'>, ...children: ChildrenType[]):          HTMLHeadingElement          { return createElement('h3',            attrs, ...children); }
export function h4(        attrs?: tag_attributes<'h4'>, ...children: ChildrenType[]):          HTMLHeadingElement          { return createElement('h4',            attrs, ...children); }
export function h5(        attrs?: tag_attributes<'h5'>, ...children: ChildrenType[]):          HTMLHeadingElement          { return createElement('h5',            attrs, ...children); }
export function h6(        attrs?: tag_attributes<'h6'>, ...children: ChildrenType[]):          HTMLHeadingElement          { return createElement('h6',            attrs, ...children); }
export function head(      attrs?: tag_attributes<'head'>, ...children: ChildrenType[]):        HTMLHeadElement             { return createElement('head',          attrs, ...children); }
export function header(    attrs?: tag_attributes<'header'>, ...children: ChildrenType[]):      HTMLElement                 { return createElement('header',        attrs, ...children); }
export function hgroup(    attrs?: tag_attributes<'hgroup'>, ...children: ChildrenType[]):      HTMLElement                 { return createElement('hgroup',        attrs, ...children); }
export function hr(        attrs?: tag_attributes<'hr'>, ...children: ChildrenType[]):          HTMLHRElement               { return createElement('hr',            attrs, ...children); }
export function html(      attrs?: tag_attributes<'html'>, ...children: ChildrenType[]):        HTMLHtmlElement             { return createElement('html',          attrs, ...children); }
export function i(         attrs?: tag_attributes<'i'>, ...children: ChildrenType[]):           HTMLElement                 { return createElement('i',             attrs, ...children); }
export function iframe(    attrs?: tag_attributes<'iframe'>, ...children: ChildrenType[]):      HTMLIFrameElement           { return createElement('iframe',        attrs, ...children); }
export function img(       attrs?: tag_attributes<'img'>, ...children: ChildrenType[]):         HTMLImageElement            { return createElement('img',           attrs, ...children); }
export function input(     attrs?: tag_attributes<'input'>, ...children: ChildrenType[]):       HTMLInputElement            { return createElement('input',         attrs, ...children); }
export function ins(       attrs?: tag_attributes<'ins'>, ...children: ChildrenType[]):         HTMLModElement              { return createElement('ins',           attrs, ...children); }
export function kbd(       attrs?: tag_attributes<'kbd'>, ...children: ChildrenType[]):         HTMLElement                 { return createElement('kbd',           attrs, ...children); }
export function label(     attrs?: tag_attributes<'label'>, ...children: ChildrenType[]):       HTMLLabelElement            { return createElement('label',         attrs, ...children); }
export function legend(    attrs?: tag_attributes<'legend'>, ...children: ChildrenType[]):      HTMLLegendElement           { return createElement('legend',        attrs, ...children); }
export function li(        attrs?: tag_attributes<'li'>, ...children: ChildrenType[]):          HTMLLIElement               { return createElement('li',            attrs, ...children); }
export function link(      attrs?: tag_attributes<'link'>, ...children: ChildrenType[]):        HTMLLinkElement             { return createElement('link',          attrs, ...children); }
export function main(      attrs?: tag_attributes<'main'>, ...children: ChildrenType[]):        HTMLElement                 { return createElement('main',          attrs, ...children); }
export function map(       attrs?: tag_attributes<'map'>, ...children: ChildrenType[]):         HTMLMapElement              { return createElement('map',           attrs, ...children); }
export function mark(      attrs?: tag_attributes<'mark'>, ...children: ChildrenType[]):        HTMLElement                 { return createElement('mark',          attrs, ...children); }
export function meta(      attrs?: tag_attributes<'meta'>, ...children: ChildrenType[]):        HTMLMetaElement             { return createElement('meta',          attrs, ...children); }
export function meter(     attrs?: tag_attributes<'meter'>, ...children: ChildrenType[]):       HTMLMeterElement            { return createElement('meter',         attrs, ...children); }
export function nav(       attrs?: tag_attributes<'nav'>, ...children: ChildrenType[]):         HTMLElement                 { return createElement('nav',           attrs, ...children); }
export function noscript(  attrs?: tag_attributes<'noscript'>, ...children: ChildrenType[]):    HTMLElement                 { return createElement('noscript',      attrs, ...children); }
export function object(    attrs?: tag_attributes<'object'>, ...children: ChildrenType[]):      HTMLObjectElement           { return createElement('object',        attrs, ...children); }
export function ol(        attrs?: tag_attributes<'ol'>, ...children: ChildrenType[]):          HTMLOListElement            { return createElement('ol',            attrs, ...children); }
export function optgroup(  attrs?: tag_attributes<'optgroup'>, ...children: ChildrenType[]):    HTMLOptGroupElement         { return createElement('optgroup',      attrs, ...children); }
export function option(    attrs?: tag_attributes<'option'>, ...children: ChildrenType[]):      HTMLOptionElement           { return createElement('option',        attrs, ...children); }
export function output(    attrs?: tag_attributes<'output'>, ...children: ChildrenType[]):      HTMLOutputElement           { return createElement('output',        attrs, ...children); }
export function p(         attrs?: tag_attributes<'p'>, ...children: ChildrenType[]):           HTMLParagraphElement        { return createElement('p',             attrs, ...children); }
export function picture(   attrs?: tag_attributes<'picture'>, ...children: ChildrenType[]):     HTMLPictureElement          { return createElement('picture',       attrs, ...children); }
export function pre(       attrs?: tag_attributes<'pre'>, ...children: ChildrenType[]):         HTMLPreElement              { return createElement('pre',           attrs, ...children); }
export function progress(  attrs?: tag_attributes<'progress'>, ...children: ChildrenType[]):    HTMLProgressElement         { return createElement('progress',      attrs, ...children); }
export function q(         attrs?: tag_attributes<'q'>, ...children: ChildrenType[]):           HTMLQuoteElement            { return createElement('q',             attrs, ...children); }
export function rp(        attrs?: tag_attributes<'rp'>, ...children: ChildrenType[]):          HTMLElement                 { return createElement('rp',            attrs, ...children); }
export function rt(        attrs?: tag_attributes<'rt'>, ...children: ChildrenType[]):          HTMLElement                 { return createElement('rt',            attrs, ...children); }
export function ruby(      attrs?: tag_attributes<'ruby'>, ...children: ChildrenType[]):        HTMLElement                 { return createElement('ruby',          attrs, ...children); }
export function s(         attrs?: tag_attributes<'s'>, ...children: ChildrenType[]):           HTMLElement                 { return createElement('s',             attrs, ...children); }
export function samp(      attrs?: tag_attributes<'samp'>, ...children: ChildrenType[]):        HTMLElement                 { return createElement('samp',          attrs, ...children); }
export function script(    attrs?: tag_attributes<'script'>, ...children: ChildrenType[]):      HTMLScriptElement           { return createElement('script',        attrs, ...children); }
export function section(   attrs?: tag_attributes<'section'>, ...children: ChildrenType[]):     HTMLElement                 { return createElement('section',       attrs, ...children); }
export function select(    attrs?: tag_attributes<'select'>, ...children: ChildrenType[]):      HTMLSelectElement           { return createElement('select',        attrs, ...children); }
export function slot(      attrs?: tag_attributes<'slot'>, ...children: ChildrenType[]):        HTMLSlotElement             { return createElement('slot',          attrs, ...children); }
export function small(     attrs?: tag_attributes<'small'>, ...children: ChildrenType[]):       HTMLElement                 { return createElement('small',         attrs, ...children); }
export function source(    attrs?: tag_attributes<'source'>, ...children: ChildrenType[]):      HTMLSourceElement           { return createElement('source',        attrs, ...children); }
export function span(      attrs?: tag_attributes<'span'>, ...children: ChildrenType[]):        HTMLElement                 { return createElement('span',          attrs, ...children); }
export function strong(    attrs?: tag_attributes<'strong'>, ...children: ChildrenType[]):      HTMLElement                 { return createElement('strong',        attrs, ...children); }
export function style(     attrs?: tag_attributes<'style'>, ...children: ChildrenType[]):       HTMLStyleElement            { return createElement('style',         attrs, ...children); }
export function sub(       attrs?: tag_attributes<'sub'>, ...children: ChildrenType[]):         HTMLElement                 { return createElement('sub',           attrs, ...children); }
export function summary(   attrs?: tag_attributes<'summary'>, ...children: ChildrenType[]):     HTMLElement                 { return createElement('summary',       attrs, ...children); }
export function sup(       attrs?: tag_attributes<'sup'>, ...children: ChildrenType[]):         HTMLElement                 { return createElement('sup',           attrs, ...children); }
export function table(     attrs?: tag_attributes<'table'>, ...children: ChildrenType[]):       HTMLTableElement            { return createElement('table',         attrs, ...children); }
export function tbody(     attrs?: tag_attributes<'tbody'>, ...children: ChildrenType[]):       HTMLTableSectionElement     { return createElement('tbody',         attrs, ...children); }
export function td(        attrs?: tag_attributes<'td'>, ...children: ChildrenType[]):          HTMLTableCellElement        { return createElement('td',            attrs, ...children); }
export function template(  attrs?: tag_attributes<'template'>, ...children: ChildrenType[]):    HTMLTemplateElement         { return createElement('template',      attrs, ...children); }
export function textarea(  attrs?: tag_attributes<'textarea'>, ...children: ChildrenType[]):    HTMLTextAreaElement         { return createElement('textarea',      attrs, ...children); }
export function tfoot(     attrs?: tag_attributes<'tfoot'>, ...children: ChildrenType[]):       HTMLTableSectionElement     { return createElement('tfoot',         attrs, ...children); }
export function th(        attrs?: tag_attributes<'th'>, ...children: ChildrenType[]):          HTMLTableCellElement        { return createElement('th',            attrs, ...children); }
export function thead(     attrs?: tag_attributes<'thead'>, ...children: ChildrenType[]):       HTMLTableSectionElement     { return createElement('thead',         attrs, ...children); }
export function time(      attrs?: tag_attributes<'time'>, ...children: ChildrenType[]):        HTMLTimeElement             { return createElement('time',          attrs, ...children); }
export function title(     attrs?: tag_attributes<'title'>, ...children: ChildrenType[]):       HTMLTitleElement            { return createElement('title',         attrs, ...children); }
export function tr(        attrs?: tag_attributes<'tr'>, ...children: ChildrenType[]):          HTMLTableRowElement         { return createElement('tr',            attrs, ...children); }
export function track(     attrs?: tag_attributes<'track'>, ...children: ChildrenType[]):       HTMLTrackElement            { return createElement('track',         attrs, ...children); }
export function u(         attrs?: tag_attributes<'u'>, ...children: ChildrenType[]):           HTMLElement                 { return createElement('u',             attrs, ...children); }
export function ul(        attrs?: tag_attributes<'ul'>, ...children: ChildrenType[]):          HTMLUListElement            { return createElement('ul',            attrs, ...children); }
export function var_(      attrs?: tag_attributes<'var'>, ...children: ChildrenType[]):         HTMLElement                 { return createElement('var',           attrs, ...children); }
export function video(     attrs?: tag_attributes<'video'>, ...children: ChildrenType[]):       HTMLVideoElement            { return createElement('video',         attrs, ...children); }
export function wbr(       attrs?: tag_attributes<'wbr'>, ...children: ChildrenType[]):         HTMLElement                 { return createElement('wbr',           attrs, ...children); }