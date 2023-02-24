
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Schedules a callback to run immediately after the component has been updated.
     *
     * The first time the callback runs will be after the initial `onMount`
     */
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.53.1' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    function construct_svelte_component_dev(component, props) {
        const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
        try {
            const instance = new component(props);
            if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
                throw new Error(error_message);
            }
            return instance;
        }
        catch (err) {
            const { message } = err;
            if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
                throw new Error(error_message);
            }
            else {
                throw err;
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /**
     * @typedef {Object} WrappedComponent Object returned by the `wrap` method
     * @property {SvelteComponent} component - Component to load (this is always asynchronous)
     * @property {RoutePrecondition[]} [conditions] - Route pre-conditions to validate
     * @property {Object} [props] - Optional dictionary of static props
     * @property {Object} [userData] - Optional user data dictionary
     * @property {bool} _sveltesparouter - Internal flag; always set to true
     */

    /**
     * @callback AsyncSvelteComponent
     * @returns {Promise<SvelteComponent>} Returns a Promise that resolves with a Svelte component
     */

    /**
     * @callback RoutePrecondition
     * @param {RouteDetail} detail - Route detail object
     * @returns {boolean|Promise<boolean>} If the callback returns a false-y value, it's interpreted as the precondition failed, so it aborts loading the component (and won't process other pre-condition callbacks)
     */

    /**
     * @typedef {Object} WrapOptions Options object for the call to `wrap`
     * @property {SvelteComponent} [component] - Svelte component to load (this is incompatible with `asyncComponent`)
     * @property {AsyncSvelteComponent} [asyncComponent] - Function that returns a Promise that fulfills with a Svelte component (e.g. `{asyncComponent: () => import('Foo.svelte')}`)
     * @property {SvelteComponent} [loadingComponent] - Svelte component to be displayed while the async route is loading (as a placeholder); when unset or false-y, no component is shown while component
     * @property {object} [loadingParams] - Optional dictionary passed to the `loadingComponent` component as params (for an exported prop called `params`)
     * @property {object} [userData] - Optional object that will be passed to events such as `routeLoading`, `routeLoaded`, `conditionsFailed`
     * @property {object} [props] - Optional key-value dictionary of static props that will be passed to the component. The props are expanded with {...props}, so the key in the dictionary becomes the name of the prop.
     * @property {RoutePrecondition[]|RoutePrecondition} [conditions] - Route pre-conditions to add, which will be executed in order
     */

    /**
     * Wraps a component to enable multiple capabilities:
     * 1. Using dynamically-imported component, with (e.g. `{asyncComponent: () => import('Foo.svelte')}`), which also allows bundlers to do code-splitting.
     * 2. Adding route pre-conditions (e.g. `{conditions: [...]}`)
     * 3. Adding static props that are passed to the component
     * 4. Adding custom userData, which is passed to route events (e.g. route loaded events) or to route pre-conditions (e.g. `{userData: {foo: 'bar}}`)
     * 
     * @param {WrapOptions} args - Arguments object
     * @returns {WrappedComponent} Wrapped component
     */
    function wrap$1(args) {
        if (!args) {
            throw Error('Parameter args is required')
        }

        // We need to have one and only one of component and asyncComponent
        // This does a "XNOR"
        if (!args.component == !args.asyncComponent) {
            throw Error('One and only one of component and asyncComponent is required')
        }

        // If the component is not async, wrap it into a function returning a Promise
        if (args.component) {
            args.asyncComponent = () => Promise.resolve(args.component);
        }

        // Parameter asyncComponent and each item of conditions must be functions
        if (typeof args.asyncComponent != 'function') {
            throw Error('Parameter asyncComponent must be a function')
        }
        if (args.conditions) {
            // Ensure it's an array
            if (!Array.isArray(args.conditions)) {
                args.conditions = [args.conditions];
            }
            for (let i = 0; i < args.conditions.length; i++) {
                if (!args.conditions[i] || typeof args.conditions[i] != 'function') {
                    throw Error('Invalid parameter conditions[' + i + ']')
                }
            }
        }

        // Check if we have a placeholder component
        if (args.loadingComponent) {
            args.asyncComponent.loading = args.loadingComponent;
            args.asyncComponent.loadingParams = args.loadingParams || undefined;
        }

        // Returns an object that contains all the functions to execute too
        // The _sveltesparouter flag is to confirm the object was created by this router
        const obj = {
            component: args.asyncComponent,
            userData: args.userData,
            conditions: (args.conditions && args.conditions.length) ? args.conditions : undefined,
            props: (args.props && Object.keys(args.props).length) ? args.props : {},
            _sveltesparouter: true
        };

        return obj
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function parse(str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules\svelte-spa-router\Router.svelte generated by Svelte v3.53.1 */

    const { Error: Error_1$1, Object: Object_1$1, console: console_1$2 } = globals;

    // (267:0) {:else}
    function create_else_block$2(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(267:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (260:0) {#if componentParams}
    function create_if_block$4(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(260:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$4, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1$1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(component, userData, ...conditions) {
    	// Use the new wrap method and show a deprecation warning
    	// eslint-disable-next-line no-console
    	console.warn('Method `wrap` from `svelte-spa-router` is deprecated and will be removed in a future version. Please use `svelte-spa-router/wrap` instead. See http://bit.ly/svelte-spa-router-upgrading');

    	return wrap$1({ component, userData, conditions });
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf('#/');

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: '/';

    	// Check if there's a querystring
    	const qsPosition = location.indexOf('?');

    	let querystring = '';

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener('hashchange', update, false);

    	return function stop() {
    		window.removeEventListener('hashchange', update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);
    const params = writable(undefined);

    async function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	// Note: this will include scroll state in history even when restoreScrollState is false
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined
    	);

    	window.location.hash = (location.charAt(0) == '#' ? '' : '#') + location;
    }

    async function pop() {
    	// Execute this code when the current call stack is complete
    	await tick();

    	window.history.back();
    }

    async function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	const dest = (location.charAt(0) == '#' ? '' : '#') + location;

    	try {
    		const newState = { ...history.state };
    		delete newState['__svelte_spa_router_scrollX'];
    		delete newState['__svelte_spa_router_scrollY'];
    		window.history.replaceState(newState, undefined, dest);
    	} catch(e) {
    		// eslint-disable-next-line no-console
    		console.warn('Caught exception while replacing the current page. If you\'re running this in the Svelte REPL, please note that the `replace` method might not work in this environment.');
    	}

    	// The method above doesn't trigger the hashchange event, so let's do that manually
    	window.dispatchEvent(new Event('hashchange'));
    }

    function link(node, opts) {
    	opts = linkOpts(opts);

    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != 'a') {
    		throw Error('Action "link" can only be used with <a> tags');
    	}

    	updateLink(node, opts);

    	return {
    		update(updated) {
    			updated = linkOpts(updated);
    			updateLink(node, updated);
    		}
    	};
    }

    function restoreScroll(state) {
    	// If this exists, then this is a back navigation: restore the scroll position
    	if (state) {
    		window.scrollTo(state.__svelte_spa_router_scrollX, state.__svelte_spa_router_scrollY);
    	} else {
    		// Otherwise this is a forward navigation: scroll to top
    		window.scrollTo(0, 0);
    	}
    }

    // Internal function used by the link function
    function updateLink(node, opts) {
    	let href = opts.href || node.getAttribute('href');

    	// Destination must start with '/' or '#/'
    	if (href && href.charAt(0) == '/') {
    		// Add # to the href attribute
    		href = '#' + href;
    	} else if (!href || href.length < 2 || href.slice(0, 2) != '#/') {
    		throw Error('Invalid value for "href" attribute: ' + href);
    	}

    	node.setAttribute('href', href);

    	node.addEventListener('click', event => {
    		// Prevent default anchor onclick behaviour
    		event.preventDefault();

    		if (!opts.disabled) {
    			scrollstateHistoryHandler(event.currentTarget.getAttribute('href'));
    		}
    	});
    }

    // Internal function that ensures the argument of the link action is always an object
    function linkOpts(val) {
    	if (val && typeof val == 'string') {
    		return { href: val };
    	} else {
    		return val || {};
    	}
    }

    /**
     * The handler attached to an anchor tag responsible for updating the
     * current history state with the current scroll state
     *
     * @param {string} href - Destination
     */
    function scrollstateHistoryHandler(href) {
    	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined
    	);

    	// This will force an update as desired, but this time our scroll state will be attached
    	window.location.hash = href;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = '' } = $$props;
    	let { restoreScrollState = false } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
     */
    		constructor(path, component) {
    			if (!component || typeof component != 'function' && (typeof component != 'object' || component._sveltesparouter !== true)) {
    				throw Error('Invalid component object');
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == 'string' && (path.length < 1 || path.charAt(0) != '/' && path.charAt(0) != '*') || typeof path == 'object' && !(path instanceof RegExp)) {
    				throw Error('Invalid value for "path" argument - strings must start with / or *');
    			}

    			const { pattern, keys } = parse(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == 'object' && component._sveltesparouter === true) {
    				this.component = component.component;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    				this.props = component.props || {};
    			} else {
    				// Convert the component to a function that returns a Promise, to normalize it
    				this.component = () => Promise.resolve(component);

    				this.conditions = [];
    				this.props = {};
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, check if it matches the start of the path.
    			// If not, bail early, else remove it before we run the matching.
    			if (prefix) {
    				if (typeof prefix == 'string') {
    					if (path.startsWith(prefix)) {
    						path = path.substr(prefix.length) || '/';
    					} else {
    						return null;
    					}
    				} else if (prefix instanceof RegExp) {
    					const match = path.match(prefix);

    					if (match && match[0]) {
    						path = path.substr(match[0].length) || '/';
    					} else {
    						return null;
    					}
    				}
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				// In the match parameters, URL-decode all values
    				try {
    					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || '') || null;
    				} catch(e) {
    					out[this._keys[i]] = null;
    				}

    				i++;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {object} [userData] - Custom data passed by the user
     * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
     * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {boolean} Returns true if all the conditions succeeded
     */
    		async checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!await this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;
    	let props = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	async function dispatchNextTick(name, detail) {
    		// Execute this code when the current call stack is complete
    		await tick();

    		dispatch(name, detail);
    	}

    	// If this is set, then that means we have popped into this var the state of our last scroll position
    	let previousScrollState = null;

    	let popStateChanged = null;

    	if (restoreScrollState) {
    		popStateChanged = event => {
    			// If this event was from our history.replaceState, event.state will contain
    			// our scroll history. Otherwise, event.state will be null (like on forward
    			// navigation)
    			if (event.state && (event.state.__svelte_spa_router_scrollY || event.state.__svelte_spa_router_scrollX)) {
    				previousScrollState = event.state;
    			} else {
    				previousScrollState = null;
    			}
    		};

    		// This is removed in the destroy() invocation below
    		window.addEventListener('popstate', popStateChanged);

    		afterUpdate(() => {
    			restoreScroll(previousScrollState);
    		});
    	}

    	// Always have the latest value of loc
    	let lastLoc = null;

    	// Current object of the component loaded
    	let componentObj = null;

    	// Handle hash change events
    	// Listen to changes in the $loc store and update the page
    	// Do not use the $: syntax because it gets triggered by too many things
    	const unsubscribeLoc = loc.subscribe(async newLoc => {
    		lastLoc = newLoc;

    		// Find a route matching the location
    		let i = 0;

    		while (i < routesList.length) {
    			const match = routesList[i].match(newLoc.location);

    			if (!match) {
    				i++;
    				continue;
    			}

    			const detail = {
    				route: routesList[i].path,
    				location: newLoc.location,
    				querystring: newLoc.querystring,
    				userData: routesList[i].userData,
    				params: match && typeof match == 'object' && Object.keys(match).length
    				? match
    				: null
    			};

    			// Check if the route can be loaded - if all conditions succeed
    			if (!await routesList[i].checkConditions(detail)) {
    				// Don't display anything
    				$$invalidate(0, component = null);

    				componentObj = null;

    				// Trigger an event to notify the user, then exit
    				dispatchNextTick('conditionsFailed', detail);

    				return;
    			}

    			// Trigger an event to alert that we're loading the route
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoading', Object.assign({}, detail));

    			// If there's a component to show while we're loading the route, display it
    			const obj = routesList[i].component;

    			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
    			if (componentObj != obj) {
    				if (obj.loading) {
    					$$invalidate(0, component = obj.loading);
    					componentObj = obj;
    					$$invalidate(1, componentParams = obj.loadingParams);
    					$$invalidate(2, props = {});

    					// Trigger the routeLoaded event for the loading component
    					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
    					dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    						component,
    						name: component.name,
    						params: componentParams
    					}));
    				} else {
    					$$invalidate(0, component = null);
    					componentObj = null;
    				}

    				// Invoke the Promise
    				const loaded = await obj();

    				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
    				if (newLoc != lastLoc) {
    					// Don't update the component, just exit
    					return;
    				}

    				// If there is a "default" property, which is used by async routes, then pick that
    				$$invalidate(0, component = loaded && loaded.default || loaded);

    				componentObj = obj;
    			}

    			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    			if (match && typeof match == 'object' && Object.keys(match).length) {
    				$$invalidate(1, componentParams = match);
    			} else {
    				$$invalidate(1, componentParams = null);
    			}

    			// Set static props, if any
    			$$invalidate(2, props = routesList[i].props);

    			// Dispatch the routeLoaded event then exit
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    				component,
    				name: component.name,
    				params: componentParams
    			})).then(() => {
    				params.set(componentParams);
    			});

    			return;
    		}

    		// If we're still here, there was no match, so show the empty component
    		$$invalidate(0, component = null);

    		componentObj = null;
    		params.set(undefined);
    	});

    	onDestroy(() => {
    		unsubscribeLoc();
    		popStateChanged && window.removeEventListener('popstate', popStateChanged);
    	});

    	const writable_props = ['routes', 'prefix', 'restoreScrollState'];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		writable,
    		derived,
    		tick,
    		_wrap: wrap$1,
    		wrap,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		params,
    		push,
    		pop,
    		replace,
    		link,
    		restoreScroll,
    		updateLink,
    		linkOpts,
    		scrollstateHistoryHandler,
    		onDestroy,
    		createEventDispatcher,
    		afterUpdate,
    		parse,
    		routes,
    		prefix,
    		restoreScrollState,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		props,
    		dispatch,
    		dispatchNextTick,
    		previousScrollState,
    		popStateChanged,
    		lastLoc,
    		componentObj,
    		unsubscribeLoc
    	});

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    		if ('component' in $$props) $$invalidate(0, component = $$props.component);
    		if ('componentParams' in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('previousScrollState' in $$props) previousScrollState = $$props.previousScrollState;
    		if ('popStateChanged' in $$props) popStateChanged = $$props.popStateChanged;
    		if ('lastLoc' in $$props) lastLoc = $$props.lastLoc;
    		if ('componentObj' in $$props) componentObj = $$props.componentObj;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
    			// Update history.scrollRestoration depending on restoreScrollState
    			history.scrollRestoration = restoreScrollState ? 'manual' : 'auto';
    		}
    	};

    	return [
    		component,
    		componentParams,
    		props,
    		routes,
    		prefix,
    		restoreScrollState,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get routes() {
    		throw new Error_1$1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1$1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1$1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1$1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1$1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1$1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\assets\etc\Loading.svelte generated by Svelte v3.53.1 */

    const file$5 = "src\\assets\\etc\\Loading.svelte";

    function create_fragment$7(ctx) {
    	let button;
    	let svg;
    	let path0;
    	let path1;
    	let t;

    	const block = {
    		c: function create() {
    			button = element("button");
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			t = text("\r\n  Loading...");
    			attr_dev(path0, "d", "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z");
    			attr_dev(path0, "fill", "currentColor");
    			add_location(path0, file$5, 2, 4, 408);
    			attr_dev(path1, "d", "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z");
    			attr_dev(path1, "fill", "#1C64F2");
    			add_location(path1, file$5, 6, 4, 830);
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "role", "status");
    			attr_dev(svg, "class", "inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600");
    			attr_dev(svg, "viewBox", "0 0 100 101");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$5, 1, 2, 221);
    			button.disabled = true;
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "py-2.5 px-5 mr-2 text-sm font-medium text-gray-900 bg-white rounded-lg border-0 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 inline-flex items-center");
    			add_location(button, file$5, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, svg);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(button, t);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Loading', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Loading> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Loading extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loading",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\layout\Atype.svelte generated by Svelte v3.53.1 */

    const file$4 = "src\\layout\\Atype.svelte";
    const get_content_slot_changes$1 = dirty => ({});
    const get_content_slot_context$1 = ctx => ({});
    const get_navbar_slot_changes = dirty => ({});
    const get_navbar_slot_context = ctx => ({});

    function create_fragment$6(ctx) {
    	let div0;
    	let t;
    	let div1;
    	let current;
    	const navbar_slot_template = /*#slots*/ ctx[1].navbar;
    	const navbar_slot = create_slot(navbar_slot_template, ctx, /*$$scope*/ ctx[0], get_navbar_slot_context);
    	const content_slot_template = /*#slots*/ ctx[1].content;
    	const content_slot = create_slot(content_slot_template, ctx, /*$$scope*/ ctx[0], get_content_slot_context$1);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			if (navbar_slot) navbar_slot.c();
    			t = space();
    			div1 = element("div");
    			if (content_slot) content_slot.c();
    			attr_dev(div0, "class", "navbar h-[50px] md:h-[54px]");
    			add_location(div0, file$4, 0, 0, 0);
    			attr_dev(div1, "class", "content h-[calc(100%-50px)] md:h-[calc(100%-54px)]");
    			add_location(div1, file$4, 4, 0, 79);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);

    			if (navbar_slot) {
    				navbar_slot.m(div0, null);
    			}

    			insert_dev(target, t, anchor);
    			insert_dev(target, div1, anchor);

    			if (content_slot) {
    				content_slot.m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (navbar_slot) {
    				if (navbar_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						navbar_slot,
    						navbar_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(navbar_slot_template, /*$$scope*/ ctx[0], dirty, get_navbar_slot_changes),
    						get_navbar_slot_context
    					);
    				}
    			}

    			if (content_slot) {
    				if (content_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						content_slot,
    						content_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(content_slot_template, /*$$scope*/ ctx[0], dirty, get_content_slot_changes$1),
    						get_content_slot_context$1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar_slot, local);
    			transition_in(content_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar_slot, local);
    			transition_out(content_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (navbar_slot) navbar_slot.d(detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div1);
    			if (content_slot) content_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Atype', slots, ['navbar','content']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Atype> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Atype extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Atype",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    const map = writable();
    const siteList = writable(); // 사이트리스트 정보
    const modal = writable(false); // 모달창 토글
    const siteModal = writable(false); // 사이트 세부정보창
    const siteListModal = writable(false); // 사이트 리스트 창
    const roadViewUrl = writable(""); // 로드뷰 링크 주소
    const mapCenter = writable(); // pop 지도 중심 위치

    // 인허가 기능 관련 정보
    readable([
      // 공식 법정동 시도명 리스트 입니다.
      "강원도",
      "서울특별시",
      "경기도",
      "인천광역시",
      "충청북도",
      "대전광역시",
      "세종특별자치시",
      "충청남도",
      "전라북도",
      "광주광역시",
      "전라남도",
      "대구광역시",
      "경상북도",
      "부산광역시",
      "울산광역시",
      "경상남도",
      "제주특별자치도",
      "제주특별자치도",
    ]);
    readable({
      // 다음 주소 api의 시도명을 법정동 시도로 변환하는 맵입니다.
      강원: "강원도",
      강원도: "강원도",
      서울: "서울특별시",
      서울특별시: "서울특별시",
      경기: "경기도",
      경기도: "경기도",
      인천: "인천광역시",
      인천광역시: "인천광역시",
      충북: "충청북도",
      충청북도: "충청북도",
      대전: "대전광역시",
      대전광역시: "대전광역시",
      세종: "세종특별자치시",
      세종특별자치시: "세종특별자치시",
      충남: "충청남도",
      충청남도: "충청남도",
      전북: "전라북도",
      전라북도: "전라북도",
      광주: "광주광역시",
      광주광역시: "광주광역시",
      전남: "전라남도",
      전라남도: "전라남도",
      대구: "대구광역시",
      대구광역시: "대구광역시",
      경북: "경상북도",
      경상북도: "경상북도",
      부산: "부산광역시",
      부산광역시: "부산광역시",
      울산: "울산광역시",
      울산광역시: "울산광역시",
      경남: "경상남도",
      경상남도: "경상남도",
      제주: "제주특별자치도",
      제주도: "제주특별자치도",
      제주특별자치도: "제주특별자치도",
    });

    //
    const modalToggle = writable(false); // 모달창 토글 상태
    const detailElem = writable(); // pop 지도 메뉴 모달창의 사이트 정보 상태
    const mapLevel = writable(12); // pop 지도 확대축소 레벨
    const roadVeiwBtnUrl = writable("");

    const rightSideModal = writable(); // 우측 모달 엘리먼트
    const rightSideModalScrollTop = writable(0); // 우측 모달의 스크롤바 포지션

    const mobileView = readable(
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        navigator.userAgent
      )
    );

    /* src\assets\etc\Search.svelte generated by Svelte v3.53.1 */

    function detailVeiw(elem) {
    	modalToggle.set(true);
    	detailElem.set(elem);
    	rightSideModalScrollTop.set(0);
    	roadVeiwBtnUrl.set("https://map.kakao.com/link/roadview/" + elem.yAxis + "," + elem.xAxis);
    	mapLevel.set(4);
    	mapCenter.set(new kakao.maps.LatLng(elem.yAxis, elem.xAxis));
    }

    /* src\components\Navbar.svelte generated by Svelte v3.53.1 */

    const { console: console_1$1 } = globals;

    const file$3 = "src\\components\\Navbar.svelte";

    // (234:6) {:else}
    function create_else_block_1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill-rule", "evenodd");
    			attr_dev(path, "d", "M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z");
    			attr_dev(path, "clip-rule", "evenodd");
    			add_location(path, file$3, 235, 11, 7873);
    			attr_dev(svg, "class", "w-6 h-6");
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$3, 234, 8, 7746);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(234:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (230:6) {#if open}
    function create_if_block_2$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M4.5 15.75l7.5-7.5 7.5 7.5");
    			add_location(path, file$3, 231, 10, 7619);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "1.5");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "class", "w-6 h-6");
    			add_location(svg, file$3, 230, 8, 7478);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(230:6) {#if open}",
    		ctx
    	});

    	return block;
    }

    // (243:4) {#if open}
    function create_if_block_1$1(ctx) {
    	let ul;
    	let li0;
    	let a0;
    	let t0;
    	let a0_class_value;
    	let t1;
    	let li1;
    	let a1;
    	let t2;
    	let a1_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			t0 = text("지도보기");
    			t1 = space();
    			li1 = element("li");
    			a1 = element("a");
    			t2 = text("About");
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "class", a0_class_value = "" + ((/*$location*/ ctx[3] === '/' ? 'active' : '') + " flex-initial py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 dark:text-white md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" + " svelte-13gtopq"));
    			add_location(a0, file$3, 248, 10, 8630);
    			attr_dev(li0, "class", "max-sm:my-2");
    			add_location(li0, file$3, 247, 8, 8594);
    			attr_dev(a1, "href", "/about");
    			attr_dev(a1, "class", a1_class_value = "" + ((/*$location*/ ctx[3] === '/about' ? 'active' : '') + " flex-initial py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 dark:text-white md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" + " svelte-13gtopq"));
    			add_location(a1, file$3, 257, 10, 9058);
    			attr_dev(li1, "class", "max-sm:my-2");
    			add_location(li1, file$3, 256, 8, 9022);
    			attr_dev(ul, "class", "flex flex-col p-4 border border-gray-100 rounded-lg bg-gray-50 z-50 max-sm:absolute max-sm:top-14 max-sm:left-2 md:flex-row md:space-x-8 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700");
    			add_location(ul, file$3, 244, 6, 8310);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(a0, t0);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(a1, t2);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(link.call(null, a0)),
    					action_destroyer(link.call(null, a1))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$location*/ 8 && a0_class_value !== (a0_class_value = "" + ((/*$location*/ ctx[3] === '/' ? 'active' : '') + " flex-initial py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 dark:text-white md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" + " svelte-13gtopq"))) {
    				attr_dev(a0, "class", a0_class_value);
    			}

    			if (dirty & /*$location*/ 8 && a1_class_value !== (a1_class_value = "" + ((/*$location*/ ctx[3] === '/about' ? 'active' : '') + " flex-initial py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 dark:text-white md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" + " svelte-13gtopq"))) {
    				attr_dev(a1, "class", a1_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(243:4) {#if open}",
    		ctx
    	});

    	return block;
    }

    // (287:8) {:else}
    function create_else_block$1(ctx) {
    	let div;
    	let button;
    	let svg;
    	let path;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M4.5 15.75l7.5-7.5 7.5 7.5");
    			add_location(path, file$3, 295, 16, 10854);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "1.5");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "class", "w-5 h-5");
    			add_location(svg, file$3, 294, 14, 10707);
    			add_location(button, file$3, 288, 12, 10541);
    			attr_dev(div, "class", "flex-initial inset-y-0 items-center pl-3 pr-2");
    			add_location(div, file$3, 287, 10, 10468);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(button, svg);
    			append_dev(svg, path);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(287:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (272:8) {#if !searchToggle}
    function create_if_block$3(ctx) {
    	let div;
    	let button;
    	let svg;
    	let path;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill-rule", "evenodd");
    			attr_dev(path, "d", "M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z");
    			attr_dev(path, "clip-rule", "evenodd");
    			add_location(path, file$3, 282, 17, 10211);
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "class", "w-5 h-5 text-gray-500");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$3, 281, 14, 10064);
    			attr_dev(button, "class", "pt-1 pr-2");
    			add_location(button, file$3, 274, 12, 9852);
    			attr_dev(div, "class", "flex-initial inset-y-0 items-center pl-3");
    			add_location(div, file$3, 272, 10, 9697);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(button, svg);
    			append_dev(svg, path);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", prevent_default(/*click_handler_1*/ ctx[7]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(272:8) {#if !searchToggle}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let nav;
    	let div1;
    	let button;
    	let t0;
    	let h1;
    	let t2;
    	let t3;
    	let form;
    	let label;
    	let t5;
    	let div0;
    	let t6;
    	let div2;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*open*/ ctx[0]) return create_if_block_2$1;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*open*/ ctx[0] && create_if_block_1$1(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (!/*searchToggle*/ ctx[1]) return create_if_block$3;
    		return create_else_block$1;
    	}

    	let current_block_type_1 = select_block_type_1(ctx);
    	let if_block2 = current_block_type_1(ctx);

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div1 = element("div");
    			button = element("button");
    			if_block0.c();
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "건물대장";
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			form = element("form");
    			label = element("label");
    			label.textContent = "검색";
    			t5 = space();
    			div0 = element("div");
    			if_block2.c();
    			t6 = space();
    			div2 = element("div");
    			attr_dev(button, "class", "flex-none items-center p-2 my-1 ml-2 text-sm md:hidden");
    			add_location(button, file$3, 228, 4, 7347);
    			attr_dev(h1, "class", "flex-none p-1 text-lg md:ml-8 dark:text-white");
    			add_location(h1, file$3, 240, 4, 8121);
    			attr_dev(label, "for", "simple-search");
    			attr_dev(label, "class", "sr-only");
    			add_location(label, file$3, 269, 6, 9565);
    			attr_dev(div0, "class", "flex justify-end");
    			add_location(div0, file$3, 270, 6, 9626);
    			attr_dev(form, "class", "relative flex-none flex justify-self-end mr-2");
    			attr_dev(form, "role", "search");
    			add_location(form, file$3, 268, 4, 9483);
    			attr_dev(div1, "class", "flex items-center justify-between");
    			add_location(div1, file$3, 227, 2, 7294);
    			attr_dev(div2, "class", "fixed bg-white py-2 border max-sm:w-full max-sm:h-[400px] md:w-96 md:h-[500px] md:right-0 h-96 top-10 md:top-14");
    			set_style(div2, "display", "none");
    			set_style(div2, "overflow", "hidden");
    			set_style(div2, "z-index", "999");
    			set_style(div2, "-webkit-overflow-scrolling", "touch");
    			add_location(div2, file$3, 303, 2, 11059);
    			attr_dev(nav, "class", "bg-white border-b z-50");
    			add_location(nav, file$3, 226, 0, 7254);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div1);
    			append_dev(div1, button);
    			if_block0.m(button, null);
    			append_dev(div1, t0);
    			append_dev(div1, h1);
    			append_dev(div1, t2);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t3);
    			append_dev(div1, form);
    			append_dev(form, label);
    			append_dev(form, t5);
    			append_dev(form, div0);
    			if_block2.m(div0, null);
    			append_dev(nav, t6);
    			append_dev(nav, div2);
    			/*div2_binding*/ ctx[9](div2);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(button, null);
    				}
    			}

    			if (/*open*/ ctx[0]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					if_block1.m(div1, t3);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx)) && if_block2) {
    				if_block2.p(ctx, dirty);
    			} else {
    				if_block2.d(1);
    				if_block2 = current_block_type_1(ctx);

    				if (if_block2) {
    					if_block2.c();
    					if_block2.m(div0, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    			if_block2.d();
    			/*div2_binding*/ ctx[9](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function waitForElment(selector) {
    	return new Promise(resolve => {
    			if (document.querySelector(selector)) {
    				return resolve(document.querySelector(selector));
    			}

    			const observer = new MutationObserver(mutations => {
    					if (document.querySelector(selector)) {
    						resolve(document.querySelector(selector));
    						observer.disconnect();
    					}
    				});

    			observer.observe(document.body, { childList: true, subtree: true });
    		});
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $siteListModal;
    	let $siteModal;
    	let $modal;
    	let $siteList;
    	let $rightSideModal;
    	let $map;
    	let $detailElem;
    	let $roadViewUrl;
    	let $mapCenter;
    	let $mobileView;
    	let $location;
    	validate_store(siteListModal, 'siteListModal');
    	component_subscribe($$self, siteListModal, $$value => $$invalidate(10, $siteListModal = $$value));
    	validate_store(siteModal, 'siteModal');
    	component_subscribe($$self, siteModal, $$value => $$invalidate(11, $siteModal = $$value));
    	validate_store(modal, 'modal');
    	component_subscribe($$self, modal, $$value => $$invalidate(12, $modal = $$value));
    	validate_store(siteList, 'siteList');
    	component_subscribe($$self, siteList, $$value => $$invalidate(13, $siteList = $$value));
    	validate_store(rightSideModal, 'rightSideModal');
    	component_subscribe($$self, rightSideModal, $$value => $$invalidate(14, $rightSideModal = $$value));
    	validate_store(map, 'map');
    	component_subscribe($$self, map, $$value => $$invalidate(15, $map = $$value));
    	validate_store(detailElem, 'detailElem');
    	component_subscribe($$self, detailElem, $$value => $$invalidate(16, $detailElem = $$value));
    	validate_store(roadViewUrl, 'roadViewUrl');
    	component_subscribe($$self, roadViewUrl, $$value => $$invalidate(17, $roadViewUrl = $$value));
    	validate_store(mapCenter, 'mapCenter');
    	component_subscribe($$self, mapCenter, $$value => $$invalidate(18, $mapCenter = $$value));
    	validate_store(mobileView, 'mobileView');
    	component_subscribe($$self, mobileView, $$value => $$invalidate(19, $mobileView = $$value));
    	validate_store(location, 'location');
    	component_subscribe($$self, location, $$value => $$invalidate(3, $location = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navbar', slots, []);
    	let open = $mobileView ? false : true;
    	let searchInput;
    	let searchTerm = "";
    	let searchToggle = false;

    	const startSearch = () => {
    		$$invalidate(1, searchToggle = true);

    		waitForElment("#simple-search").then(elm => {
    			console.log(elm);
    			searchInput.focus();
    		});
    	};

    	// 우편번호 찾기 화면을 넣을 element
    	var findAddressPopup;

    	function closeDaumPostcode() {
    		// iframe을 넣은 element를 안보이게 한다.
    		$$invalidate(2, findAddressPopup.style.display = "none", findAddressPopup);
    	}

    	// let roadViewUrl;
    	function Pin(elem) {
    		let geocoder = new kakao.maps.services.Geocoder();
    		let address = elem.address;
    		var rc = new kakao.maps.RoadviewClient(); // 좌표를 통한 로드뷰의 panoid를 추출하기 위한 로드뷰 help객체 생성

    		return geocoder.addressSearch(address, function (result, status) {
    			if (status == kakao.maps.services.Status.OK) {
    				// setMarkerLabel(result, label);
    				console.log("지오코더 : ", result, status);

    				setMarker(elem, result);
    				set_store_value(mapCenter, $mapCenter = new kakao.maps.LatLng(result[0].y, result[0].x), $mapCenter);
    				$map.setLevel(4);
    				$map.setCenter($mapCenter);

    				// elem.xAxis = result[0].x; // x축 추가
    				// elem.yAxis = result[0].y; // y축 추가
    				// var rc = new kakao.maps.RoadviewClient(); // 좌표를 통한 로드뷰의 panoid를 추출하기 위한 로드뷰 help객체 생성
    				rc.getNearestPanoId($mapCenter, 50, function (panoId) {
    					set_store_value(roadViewUrl, $roadViewUrl = "https://map.kakao.com/?panoid=" + panoId, $roadViewUrl); //Kakao 지도 로드뷰로 보내는 링크
    					console.log("panoid : ", $roadViewUrl, panoId);
    				});
    			}
    		});
    	}

    	function setMarker(elem, coord) {
    		let coords = new kakao.maps.LatLng(coord[0].y, coord[0].x);

    		// let imageSrc = "/public/icon/pv.png",
    		//   imageSize = new kakao.maps.Size(24, 24),
    		//   imageOption = { offset: new kakao.maps.Point(16, 28) },
    		// markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
    		let marker = new kakao.maps.Marker({
    				map: $map,
    				title: elem.id,
    				// image: markerImage,
    				position: coords,
    				clickable: true
    			});

    		console.log("setmarker:", elem);

    		// let markerLabel = new kakao.maps.CustomOverlay({
    		//   content: makePinLabel(elem),
    		//   map: kakaomap,
    		//   position: coords,
    		//   yAnchor: 0,
    		// });
    		// markers.push({ marker: marker, label: markerLabel });
    		// ms.push(marker);
    		//   let clusterer = new kakao.maps.MarkerClusterer({
    		//   map: kakaomap, // 마커들을 클러스터로 관리하고 표시할 지도 객체
    		//   averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
    		//   minLevel: 5, // 클러스터 할 최소 지도 레벨
    		// });
    		//   clusterer.addMarker(marker);
    		kakao.maps.event.addListener(marker, "click", function () {
    			set_store_value(detailElem, $detailElem = elem, $detailElem);
    			console.log("333333", $detailElem);

    			// siteInfo = elem;
    			$map.setLevel(4);

    			$map.setCenter(new kakao.maps.LatLng(coord[0].y, coord[0].x));

    			// kakaomap.panTo(new kakao.maps.LatLng(coord[0].y, coord[0].x));
    			// kakaomap.panBy(200, 0);
    			set_store_value(modal, $modal = true, $modal);

    			set_store_value(siteModal, $siteModal = true, $siteModal);
    			set_store_value(siteListModal, $siteListModal = false, $siteListModal);
    			detailVeiw(elem);

    			if ($rightSideModal != undefined) {
    				set_store_value(rightSideModal, $rightSideModal.scrollTop = 0, $rightSideModal);
    			}
    		});
    	}

    	const cityName = {
    		강원: "강원도",
    		강원도: "강원도",
    		서울: "서울특별시",
    		서울특별시: "서울특별시",
    		경기: "경기도",
    		경기도: "경기도",
    		인천: "인천광역시",
    		인천광역시: "인천광역시",
    		충북: "충청북도",
    		충청북도: "충청북도",
    		대전: "대전광역시",
    		대전광역시: "대전광역시",
    		세종: "세종특별자치시",
    		세종특별자치시: "세종특별자치시",
    		충남: "충청남도",
    		충청남도: "충청남도",
    		전북: "전라북도",
    		전라북도: "전라북도",
    		광주: "광주광역시",
    		광주광역시: "광주광역시",
    		전남: "전라남도",
    		전라남도: "전라남도",
    		대구: "대구광역시",
    		대구광역시: "대구광역시",
    		경북: "경상북도",
    		경상북도: "경상북도",
    		부산: "부산광역시",
    		부산광역시: "부산광역시",
    		울산: "울산광역시",
    		울산광역시: "울산광역시",
    		경남: "경상남도",
    		경상남도: "경상남도",
    		제주: "제주특별자치도",
    		제주도: "제주특별자치도",
    		제주특별자치도: "제주특별자치도"
    	};

    	function execDaumPostcode() {
    		new daum.Postcode({
    				oncomplete(data) {
    					// 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
    					// 각 주소의 노출 규칙에 따라 주소를 조합한다.
    					// 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
    					// var addr = data.roadAddress; // 주소 변수
    					console.log("5555", data);

    					let roadAddressArr = data.roadAddress.split(" ");

    					let jibunAddressArr = data.autoJibunAddress == ""
    					? data.jibunAddress.split(" ")
    					: data.autoJibunAddress.split(" ");

    					console.log("6666", roadAddressArr, " / ", jibunAddressArr, " / ", jibunAddressArr[jibunAddressArr.length - 1]);
    					console.log("7777", data.autoJibunAddress, data.autoJibunAddress == "");
    					let sido = cityName[data.sido];
    					let sigungu = data.sigungu;
    					let roadname = data.roadname;
    					let bname1 = data.bname1;
    					let bname2 = data.bname2;
    					let bname = data.bname;
    					let roadAddress = sido + " " + sigungu + " " + roadname + " " + roadAddressArr[roadAddressArr.length - 1];

    					let jibunAddress = bname1 != ""
    					? sido + " " + sigungu + " " + bname1 + " " + bname2 + " " + jibunAddressArr[jibunAddressArr.length - 1]
    					: sido + " " + sigungu + " " + bname + " " + jibunAddressArr[jibunAddressArr.length - 1];

    					console.log("88888", roadAddress, " / ", jibunAddress);

    					var site = {
    						id: $siteList.length + 1,
    						address: roadAddress,
    						jibun: jibunAddress,
    						name: data.buildingName ? data.buildingName : "N/A",
    						owner: "-",
    						todos: []
    					};

    					set_store_value(siteList, $siteList = [...$siteList, site], $siteList);
    					console.log("새로 등록한 사이트", site, site.jibun);
    					Pin(site);
    					detailVeiw(site);
    					set_store_value(modal, $modal = true, $modal);
    					set_store_value(siteModal, $siteModal = true, $siteModal);
    					set_store_value(siteListModal, $siteListModal = false, $siteListModal);
    					$$invalidate(1, searchToggle = false);
    					$$invalidate(2, findAddressPopup.style.display = "none", findAddressPopup);
    				},
    				width: "100%",
    				height: "100%",
    				maxSuggestItems: 5
    			}).embed(findAddressPopup);

    		// iframe을 넣은 element를 보이게 한다.
    		$$invalidate(2, findAddressPopup.style.display = "block", findAddressPopup);
    	} // iframe을 넣은 element의 위치를 화면의 가운데로 이동시킨다.
    	// initLayerPosition();

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, open = !open);

    	const click_handler_1 = () => {
    		$$invalidate(1, searchToggle = true);
    		execDaumPostcode();
    	};

    	const click_handler_2 = () => {
    		$$invalidate(1, searchToggle = false);
    		closeDaumPostcode();
    	};

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			findAddressPopup = $$value;
    			$$invalidate(2, findAddressPopup);
    		});
    	}

    	$$self.$capture_state = () => ({
    		link,
    		location,
    		detailVeiw,
    		mobileView,
    		siteList,
    		rightSideModal,
    		map,
    		modal,
    		siteModal,
    		siteListModal,
    		detailElem,
    		mapCenter,
    		roadViewUrl,
    		open,
    		searchInput,
    		searchTerm,
    		searchToggle,
    		waitForElment,
    		startSearch,
    		findAddressPopup,
    		closeDaumPostcode,
    		Pin,
    		setMarker,
    		cityName,
    		execDaumPostcode,
    		$siteListModal,
    		$siteModal,
    		$modal,
    		$siteList,
    		$rightSideModal,
    		$map,
    		$detailElem,
    		$roadViewUrl,
    		$mapCenter,
    		$mobileView,
    		$location
    	});

    	$$self.$inject_state = $$props => {
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    		if ('searchInput' in $$props) searchInput = $$props.searchInput;
    		if ('searchTerm' in $$props) searchTerm = $$props.searchTerm;
    		if ('searchToggle' in $$props) $$invalidate(1, searchToggle = $$props.searchToggle);
    		if ('findAddressPopup' in $$props) $$invalidate(2, findAddressPopup = $$props.findAddressPopup);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		open,
    		searchToggle,
    		findAddressPopup,
    		$location,
    		closeDaumPostcode,
    		execDaumPostcode,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		div2_binding
    	];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\pages\About.svelte generated by Svelte v3.53.1 */
    const file$2 = "src\\pages\\About.svelte";

    // (7:2) 
    function create_navbar_slot(ctx) {
    	let navbar;
    	let current;

    	navbar = new Navbar({
    			props: { slot: "navbar" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navbar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navbar, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navbar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_navbar_slot.name,
    		type: "slot",
    		source: "(7:2) ",
    		ctx
    	});

    	return block;
    }

    // (8:2) 
    function create_content_slot$1(ctx) {
    	let div3;
    	let div2;
    	let h10;
    	let t1;
    	let p0;
    	let t3;
    	let p1;
    	let t5;
    	let p2;
    	let t6;
    	let span;
    	let t8;
    	let p3;
    	let t9;
    	let strong;
    	let t11;
    	let t12;
    	let h11;
    	let t14;
    	let div0;
    	let figure0;
    	let img0;
    	let img0_src_value;
    	let t15;
    	let figcaption0;
    	let t17;
    	let h12;
    	let t19;
    	let div1;
    	let figure1;
    	let img1;
    	let img1_src_value;
    	let t20;
    	let figcaption1;
    	let t22;
    	let h13;
    	let t24;
    	let h14;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			h10 = element("h1");
    			h10.textContent = "간편한 모바일 건축물대장 열람";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "건축물대장 한 번 열어 보려고 회원가입 하고";
    			t3 = space();
    			p1 = element("p");
    			p1.textContent = "이런저런 보안프로그램 깔고...";
    			t5 = space();
    			p2 = element("p");
    			t6 = text("불편한건 이제 그만 ");
    			span = element("span");
    			span.textContent = "🙅🏻‍♀️";
    			t8 = space();
    			p3 = element("p");
    			t9 = text("건축물대장 열람은 쉽고 빠르게 ");
    			strong = element("strong");
    			strong.textContent = "건물대장";
    			t11 = text("에서!");
    			t12 = space();
    			h11 = element("h1");
    			h11.textContent = "지도와 함께 건물정보";
    			t14 = space();
    			div0 = element("div");
    			figure0 = element("figure");
    			img0 = element("img");
    			t15 = space();
    			figcaption0 = element("figcaption");
    			figcaption0.textContent = "PC 버전";
    			t17 = space();
    			h12 = element("h1");
    			h12.textContent = "어디서든 모바일로 건물정보";
    			t19 = space();
    			div1 = element("div");
    			figure1 = element("figure");
    			img1 = element("img");
    			t20 = space();
    			figcaption1 = element("figcaption");
    			figcaption1.textContent = "모바일 버전";
    			t22 = space();
    			h13 = element("h1");
    			h13.textContent = "- 2023년 2월 11일 건축물대장 Beta 오픈";
    			t24 = space();
    			h14 = element("h1");
    			h14.textContent = "gunmuldaejang@gmail.com";
    			attr_dev(h10, "class", "text-3xl mb-10");
    			add_location(h10, file$2, 9, 6, 253);
    			attr_dev(p0, "class", "text-slate-600");
    			add_location(p0, file$2, 10, 6, 309);
    			attr_dev(p1, "class", "text-slate-600");
    			add_location(p1, file$2, 11, 6, 371);
    			attr_dev(span, "class", "text-3xl");
    			add_location(span, file$2, 12, 49, 469);
    			attr_dev(p2, "class", "text-slate-600 mb-10");
    			add_location(p2, file$2, 12, 6, 426);
    			add_location(strong, file$2, 14, 55, 569);
    			attr_dev(p3, "class", "text-slate-600 mb-36");
    			add_location(p3, file$2, 14, 6, 520);
    			attr_dev(h11, "class", "text-3xl mb-10");
    			add_location(h11, file$2, 16, 6, 607);
    			attr_dev(img0, "class", "h-auto max-w-full rounded-lg");
    			if (!src_url_equal(img0.src, img0_src_value = "/public/img/desktop.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "");
    			add_location(img0, file$2, 20, 10, 757);
    			attr_dev(figcaption0, "class", "mt-2 text-sm text-center text-gray-500");
    			add_location(figcaption0, file$2, 21, 10, 850);
    			attr_dev(figure0, "class", "max-w-lg mb-36");
    			add_location(figure0, file$2, 19, 8, 714);
    			attr_dev(div0, "class", "grow w-100 flex justify-center");
    			add_location(div0, file$2, 18, 6, 660);
    			attr_dev(h12, "class", "text-3xl mb-10");
    			add_location(h12, file$2, 25, 6, 970);
    			attr_dev(img1, "class", "h-auto max-w-full rounded-lg");
    			if (!src_url_equal(img1.src, img1_src_value = "/public/img/mobile1.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "");
    			add_location(img1, file$2, 28, 10, 1121);
    			attr_dev(figcaption1, "class", "mt-2 text-sm text-center text-gray-500");
    			add_location(figcaption1, file$2, 29, 10, 1214);
    			attr_dev(figure1, "class", "max-w-xs mb-24");
    			add_location(figure1, file$2, 27, 8, 1078);
    			attr_dev(div1, "class", "grow w-100 flex justify-center");
    			add_location(div1, file$2, 26, 6, 1024);
    			attr_dev(h13, "class", "text-lx font-thin");
    			add_location(h13, file$2, 33, 6, 1335);
    			attr_dev(h14, "class", "text-lx mb-36 font-thin");
    			add_location(h14, file$2, 34, 6, 1406);
    			attr_dev(div2, "class", "mt-10 flex flex-col");
    			add_location(div2, file$2, 8, 4, 212);
    			attr_dev(div3, "class", "p-3 text-center");
    			attr_dev(div3, "slot", "content");
    			add_location(div3, file$2, 7, 2, 162);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, h10);
    			append_dev(div2, t1);
    			append_dev(div2, p0);
    			append_dev(div2, t3);
    			append_dev(div2, p1);
    			append_dev(div2, t5);
    			append_dev(div2, p2);
    			append_dev(p2, t6);
    			append_dev(p2, span);
    			append_dev(div2, t8);
    			append_dev(div2, p3);
    			append_dev(p3, t9);
    			append_dev(p3, strong);
    			append_dev(p3, t11);
    			append_dev(div2, t12);
    			append_dev(div2, h11);
    			append_dev(div2, t14);
    			append_dev(div2, div0);
    			append_dev(div0, figure0);
    			append_dev(figure0, img0);
    			append_dev(figure0, t15);
    			append_dev(figure0, figcaption0);
    			append_dev(div2, t17);
    			append_dev(div2, h12);
    			append_dev(div2, t19);
    			append_dev(div2, div1);
    			append_dev(div1, figure1);
    			append_dev(figure1, img1);
    			append_dev(figure1, t20);
    			append_dev(figure1, figcaption1);
    			append_dev(div2, t22);
    			append_dev(div2, h13);
    			append_dev(div2, t24);
    			append_dev(div2, h14);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot$1.name,
    		type: "slot",
    		source: "(8:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let atype;
    	let current;

    	atype = new Atype({
    			props: {
    				$$slots: {
    					content: [create_content_slot$1],
    					navbar: [create_navbar_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(atype.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(atype, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const atype_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				atype_changes.$$scope = { dirty, ctx };
    			}

    			atype.$set(atype_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(atype.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(atype.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(atype, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Atype, Navbar });
    	return [];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\components\SlideModal.svelte generated by Svelte v3.53.1 */

    const file$1 = "src\\components\\SlideModal.svelte";
    const get_content_slot_changes = dirty => ({});
    const get_content_slot_context = ctx => ({});

    // (22:2) {#if rightSideModalScrollTop > 200}
    function create_if_block$2(ctx) {
    	let button;
    	let svg;
    	let path;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t = text("맨 위로");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75");
    			add_location(path, file$1, 27, 8, 926);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "1.5");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "class", "w-5 h-5");
    			add_location(svg, file$1, 26, 7, 787);
    			attr_dev(button, "class", "text-blue-700 hover:text-blue-500 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:text-blue-500 max-sm:bottom-14 bottom-10 md:bottom-3 right-1 z-50");
    			set_style(button, "position", "fixed");
    			set_style(button, "z-index", "999");
    			add_location(button, file$1, 22, 4, 499);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, svg);
    			append_dev(svg, path);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*moveTop*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(22:2) {#if rightSideModalScrollTop > 200}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	const content_slot_template = /*#slots*/ ctx[4].content;
    	const content_slot = create_slot(content_slot_template, ctx, /*$$scope*/ ctx[3], get_content_slot_context);
    	let if_block = /*rightSideModalScrollTop*/ ctx[1] > 200 && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if (content_slot) content_slot.c();
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "flex flex-col relative");
    			add_location(div0, file$1, 17, 4, 365);
    			attr_dev(div1, "class", "modal-content md:p-3");
    			add_location(div1, file$1, 16, 2, 325);
    			attr_dev(div2, "class", "modal-container z-40 max-sm:w-full md:w-1/3 svelte-g6tp0k");
    			add_location(div2, file$1, 9, 0, 144);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);

    			if (content_slot) {
    				content_slot.m(div0, null);
    			}

    			append_dev(div2, t);
    			if (if_block) if_block.m(div2, null);
    			/*div2_binding*/ ctx[5](div2);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div2, "scroll", /*scroll_handler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (content_slot) {
    				if (content_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						content_slot,
    						content_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(content_slot_template, /*$$scope*/ ctx[3], dirty, get_content_slot_changes),
    						get_content_slot_context
    					);
    				}
    			}

    			if (/*rightSideModalScrollTop*/ ctx[1] > 200) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(div2, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(content_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(content_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (content_slot) content_slot.d(detaching);
    			if (if_block) if_block.d();
    			/*div2_binding*/ ctx[5](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SlideModal', slots, ['content']);
    	let rightSideModal;
    	let rightSideModalScrollTop;

    	function moveTop() {
    		$$invalidate(0, rightSideModal.scrollTop = 0, rightSideModal);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SlideModal> was created with unknown prop '${key}'`);
    	});

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			rightSideModal = $$value;
    			$$invalidate(0, rightSideModal);
    		});
    	}

    	const scroll_handler = () => {
    		$$invalidate(1, rightSideModalScrollTop = rightSideModal.scrollTop);
    	};

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		rightSideModal,
    		rightSideModalScrollTop,
    		moveTop
    	});

    	$$self.$inject_state = $$props => {
    		if ('rightSideModal' in $$props) $$invalidate(0, rightSideModal = $$props.rightSideModal);
    		if ('rightSideModalScrollTop' in $$props) $$invalidate(1, rightSideModalScrollTop = $$props.rightSideModalScrollTop);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		rightSideModal,
    		rightSideModalScrollTop,
    		moveTop,
    		$$scope,
    		slots,
    		div2_binding,
    		scroll_handler
    	];
    }

    class SlideModal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SlideModal",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /**
     * 천단위 콤마 형식으로 포맷팅합니다.
     * @param {string} val
     * @param {number} fixed 소수점 표시 자리수, 기본값은 2입니다.
     * @returns 천단위 콤마가 붙은 숫자를 string으로 반환합니다.
     */
    function addComma(val, fixed = 2) {
      return Number(val)
        .toFixed(fixed)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function parseXML(data) {
      var xml, tmp;
      if (!data || typeof data !== "string") {
        return null;
      }
      try {
        if (window.DOMParser) {
          // Standard
          tmp = new DOMParser();
          xml = tmp.parseFromString(data, "text/xml");
        } else {
          // IE
          xml = new ActiveXObject("Microsoft.XMLDOM");
          xml.async = "false";
          xml.loadXML(data);
        }
      } catch (e) {
        xml = undefined;
      }
      if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
        throw new Error("Invalid XML: " + data);
      }
      return xml;
    }

    function xml2json(xml) {
      try {
        var obj = {};
        if (xml.children.length > 0) {
          for (var i = 0; i < xml.children.length; i++) {
            var item = xml.children.item(i);
            var nodeName = item.nodeName;

            if (typeof obj[nodeName] == "undefined") {
              obj[nodeName] = xml2json(item);
            } else {
              if (typeof obj[nodeName].push == "undefined") {
                var old = obj[nodeName];

                obj[nodeName] = [];
                obj[nodeName].push(old);
              }
              obj[nodeName].push(xml2json(item));
            }
          }
        } else {
          obj = xml.textContent;
        }
        return obj;
      } catch (e) {
        console.log(e.message);
      }
    }

    function xmlStr2Json(xmlStr) {
      return xml2json(parseXML(xmlStr));
    }

    /* src\components\PermissionMap.svelte generated by Svelte v3.53.1 */

    const { Error: Error_1, Object: Object_1, console: console_1 } = globals;
    const file = "src\\components\\PermissionMap.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[33] = list[i];
    	return child_ctx;
    }

    // (205:2) {#if !modalToggle}
    function create_if_block_4(ctx) {
    	let button;
    	let svg;
    	let path;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z");
    			add_location(path, file, 207, 8, 6208);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "1.5");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "class", "w-6 h-6");
    			add_location(svg, file, 206, 7, 6069);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "openModal rounded-md absolute p-1.5 z-10 max-sm:bottom-5 md:top-5 right-5 svelte-2i2pv4");
    			add_location(button, file, 205, 4, 5933);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, svg);
    			append_dev(svg, path);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*siteListView*/ ctx[15], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(205:2) {#if !modalToggle}",
    		ctx
    	});

    	return block;
    }

    // (217:2) {#if modalToggle}
    function create_if_block$1(ctx) {
    	let sidemodal;
    	let current;

    	sidemodal = new SlideModal({
    			props: {
    				$$slots: { content: [create_content_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sidemodal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sidemodal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const sidemodal_changes = {};

    			if (dirty[0] & /*sideModal, siteDetailInfo, $roadViewUrl, modalToggle, siteDetailToggle, siteList, markers, dateSelected, sidoSelected, siteListModalToggle*/ 2046 | dirty[1] & /*$$scope*/ 32) {
    				sidemodal_changes.$$scope = { dirty, ctx };
    			}

    			sidemodal.$set(sidemodal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidemodal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidemodal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sidemodal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(217:2) {#if modalToggle}",
    		ctx
    	});

    	return block;
    }

    // (221:8) {#if siteListModalToggle}
    function create_if_block_3(ctx) {
    	let div0;
    	let h1;
    	let t1;
    	let button0;
    	let svg;
    	let path;
    	let t2;
    	let div1;
    	let select;
    	let option0;
    	let option1;
    	let t5;
    	let input;
    	let t6;
    	let button1;
    	let t8;
    	let p;
    	let t9_value = /*siteList*/ ctx[7].length + "";
    	let t9;
    	let t10;
    	let t11;
    	let div2;
    	let mounted;
    	let dispose;
    	let each_value = /*siteList*/ ctx[7];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "건축인허가(신축) 리스트";
    			t1 = space();
    			button0 = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t2 = space();
    			div1 = element("div");
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "서울특별시";
    			option1 = element("option");
    			option1.textContent = "경기도(예정)";
    			t5 = space();
    			input = element("input");
    			t6 = space();
    			button1 = element("button");
    			button1.textContent = "조회";
    			t8 = space();
    			p = element("p");
    			t9 = text(t9_value);
    			t10 = text("개의 신축 인허가 정보가 있습니다.");
    			t11 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h1, "class", "text-lg font-bold");
    			add_location(h1, file, 222, 12, 6874);
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M6 18L18 6M6 6l12 12");
    			add_location(path, file, 229, 16, 7230);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "1.5");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "class", "w-5 h-5 pointer-events-none");
    			add_location(svg, file, 228, 14, 7063);
    			add_location(button0, file, 223, 12, 6936);
    			attr_dev(div0, "class", "flex justify-between my-3");
    			add_location(div0, file, 221, 10, 6821);
    			option0.__value = "서울특별시";
    			option0.value = option0.__value;
    			option0.selected = true;
    			add_location(option0, file, 237, 14, 7647);
    			option1.__value = "경기도";
    			option1.value = option1.__value;
    			add_location(option1, file, 238, 14, 7708);
    			attr_dev(select, "type", "text");
    			attr_dev(select, "class", "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 mr-2");
    			if (/*sidoSelected*/ ctx[9] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[18].call(select));
    			add_location(select, file, 236, 12, 7451);
    			attr_dev(input, "type", "number");
    			attr_dev(input, "step", "1");
    			attr_dev(input, "max", /*today*/ ctx[11].getFullYear());
    			attr_dev(input, "class", "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 mr-2 w-32");
    			add_location(input, file, 240, 12, 7781);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 mx-2");
    			add_location(button1, file, 241, 12, 8018);
    			attr_dev(div1, "class", "flex my-5");
    			add_location(div1, file, 235, 10, 7414);
    			attr_dev(p, "class", "my-5");
    			add_location(p, file, 254, 10, 8552);
    			attr_dev(div2, "class", "flex-col");
    			add_location(div2, file, 255, 10, 8620);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			append_dev(div0, button0);
    			append_dev(button0, svg);
    			append_dev(svg, path);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			select_option(select, /*sidoSelected*/ ctx[9]);
    			append_dev(div1, t5);
    			append_dev(div1, input);
    			set_input_value(input, /*dateSelected*/ ctx[8]);
    			append_dev(div1, t6);
    			append_dev(div1, button1);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t9);
    			append_dev(p, t10);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, div2, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[17], false, false, false),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[18]),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[19]),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[20], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*sidoSelected*/ 512) {
    				select_option(select, /*sidoSelected*/ ctx[9]);
    			}

    			if (dirty[0] & /*dateSelected*/ 256 && to_number(input.value) !== /*dateSelected*/ ctx[8]) {
    				set_input_value(input, /*dateSelected*/ ctx[8]);
    			}

    			if (dirty[0] & /*siteList*/ 128 && t9_value !== (t9_value = /*siteList*/ ctx[7].length + "")) set_data_dev(t9, t9_value);

    			if (dirty[0] & /*siteDetailInfo, siteList, siteDetailView, focus*/ 73920) {
    				each_value = /*siteList*/ ctx[7];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div2, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(221:8) {#if siteListModalToggle}",
    		ctx
    	});

    	return block;
    }

    // (257:12) {#each siteList as site}
    function create_each_block(ctx) {
    	let button;
    	let dl;
    	let div0;
    	let dd0;
    	let t1;
    	let dt0;
    	let t2_value = /*site*/ ctx[33].bldNm + "";
    	let t2;
    	let t3;
    	let div1;
    	let dd1;
    	let t5;
    	let dt1;
    	let t6_value = /*site*/ ctx[33].mainPurpsCdNm + "";
    	let t6;
    	let t7;
    	let div2;
    	let dd2;
    	let t9;
    	let dt2;
    	let t10_value = addComma(/*site*/ ctx[33].totArea) + "";
    	let t10;
    	let t11;
    	let t12;
    	let div3;
    	let dd3;
    	let t14;
    	let dt3;
    	let t15_value = addComma(/*site*/ ctx[33].archArea) + "";
    	let t15;
    	let t16;
    	let t17;
    	let div4;
    	let dd4;
    	let t19;
    	let dt4;
    	let t20_value = /*site*/ ctx[33].platPlc + "";
    	let t20;
    	let t21;
    	let mounted;
    	let dispose;

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[21](/*site*/ ctx[33]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			dl = element("dl");
    			div0 = element("div");
    			dd0 = element("dd");
    			dd0.textContent = "건물명";
    			t1 = space();
    			dt0 = element("dt");
    			t2 = text(t2_value);
    			t3 = space();
    			div1 = element("div");
    			dd1 = element("dd");
    			dd1.textContent = "용도";
    			t5 = space();
    			dt1 = element("dt");
    			t6 = text(t6_value);
    			t7 = space();
    			div2 = element("div");
    			dd2 = element("dd");
    			dd2.textContent = "연면적";
    			t9 = space();
    			dt2 = element("dt");
    			t10 = text(t10_value);
    			t11 = text(" ㎡");
    			t12 = space();
    			div3 = element("div");
    			dd3 = element("dd");
    			dd3.textContent = "건축면적";
    			t14 = space();
    			dt3 = element("dt");
    			t15 = text(t15_value);
    			t16 = text(" ㎡");
    			t17 = space();
    			div4 = element("div");
    			dd4 = element("dd");
    			dd4.textContent = "주소";
    			t19 = space();
    			dt4 = element("dt");
    			t20 = text(t20_value);
    			t21 = space();
    			attr_dev(dd0, "class", "font-light text-gray-500 dark:text-gray-400");
    			add_location(dd0, file, 267, 20, 9150);
    			attr_dev(dt0, "class", "mb-2 text-xl font-bold truncate");
    			add_location(dt0, file, 268, 20, 9236);
    			attr_dev(div0, "class", "flex flex-col");
    			add_location(div0, file, 266, 18, 9101);
    			attr_dev(dd1, "class", "font-light text-gray-500 dark:text-gray-400");
    			add_location(dd1, file, 272, 20, 9394);
    			attr_dev(dt1, "class", "mb-2 text-xl font-bold");
    			add_location(dt1, file, 273, 20, 9479);
    			attr_dev(div1, "class", "flex flex-col");
    			add_location(div1, file, 271, 18, 9345);
    			attr_dev(dd2, "class", "font-light text-gray-500 dark:text-gray-400");
    			add_location(dd2, file, 277, 20, 9636);
    			attr_dev(dt2, "class", "mb-2 text-xl font-bold");
    			add_location(dt2, file, 278, 20, 9722);
    			attr_dev(div2, "class", "flex flex-col");
    			add_location(div2, file, 276, 18, 9587);
    			attr_dev(dd3, "class", "font-light text-gray-500 dark:text-gray-400");
    			add_location(dd3, file, 282, 20, 9885);
    			attr_dev(dt3, "class", "mb-2 text-xl font-bold");
    			add_location(dt3, file, 283, 20, 9972);
    			attr_dev(div3, "class", "flex flex-col");
    			add_location(div3, file, 281, 18, 9836);
    			attr_dev(dd4, "class", "font-light text-gray-500 dark:text-gray-400");
    			add_location(dd4, file, 287, 20, 10133);
    			attr_dev(dt4, "class", "mb-2 text-xl font-bold");
    			add_location(dt4, file, 288, 20, 10218);
    			attr_dev(div4, "class", "col-span-2");
    			add_location(div4, file, 286, 18, 10087);
    			attr_dev(dl, "class", "grid grid-cols-2 mx-auto text-gray-900 gap-4");
    			add_location(dl, file, 265, 16, 9024);
    			attr_dev(button, "class", "w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 my-4 text-start");
    			add_location(button, file, 257, 14, 8696);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, dl);
    			append_dev(dl, div0);
    			append_dev(div0, dd0);
    			append_dev(div0, t1);
    			append_dev(div0, dt0);
    			append_dev(dt0, t2);
    			append_dev(div0, t3);
    			append_dev(dl, div1);
    			append_dev(div1, dd1);
    			append_dev(div1, t5);
    			append_dev(div1, dt1);
    			append_dev(dt1, t6);
    			append_dev(div1, t7);
    			append_dev(dl, div2);
    			append_dev(div2, dd2);
    			append_dev(div2, t9);
    			append_dev(div2, dt2);
    			append_dev(dt2, t10);
    			append_dev(dt2, t11);
    			append_dev(div2, t12);
    			append_dev(dl, div3);
    			append_dev(div3, dd3);
    			append_dev(div3, t14);
    			append_dev(div3, dt3);
    			append_dev(dt3, t15);
    			append_dev(dt3, t16);
    			append_dev(div3, t17);
    			append_dev(dl, div4);
    			append_dev(div4, dd4);
    			append_dev(div4, t19);
    			append_dev(div4, dt4);
    			append_dev(dt4, t20);
    			append_dev(button, t21);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*siteList*/ 128 && t2_value !== (t2_value = /*site*/ ctx[33].bldNm + "")) set_data_dev(t2, t2_value);
    			if (dirty[0] & /*siteList*/ 128 && t6_value !== (t6_value = /*site*/ ctx[33].mainPurpsCdNm + "")) set_data_dev(t6, t6_value);
    			if (dirty[0] & /*siteList*/ 128 && t10_value !== (t10_value = addComma(/*site*/ ctx[33].totArea) + "")) set_data_dev(t10, t10_value);
    			if (dirty[0] & /*siteList*/ 128 && t15_value !== (t15_value = addComma(/*site*/ ctx[33].archArea) + "")) set_data_dev(t15, t15_value);
    			if (dirty[0] & /*siteList*/ 128 && t20_value !== (t20_value = /*site*/ ctx[33].platPlc + "")) set_data_dev(t20, t20_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(257:12) {#each siteList as site}",
    		ctx
    	});

    	return block;
    }

    // (298:8) {#if siteDetailToggle && siteDetailInfo}
    function create_if_block_1(ctx) {
    	let div0;
    	let button0;
    	let svg0;
    	let path0;
    	let t0;
    	let h1;
    	let t2;
    	let button1;
    	let svg1;
    	let path1;
    	let t3;
    	let div1;
    	let table;
    	let tbody;
    	let tr0;
    	let th0;
    	let t5;
    	let td0;
    	let t6_value = /*siteDetailInfo*/ ctx[6].platPlc + "";
    	let t6;
    	let t7;
    	let t8;
    	let tr1;
    	let th1;
    	let t10;
    	let td1;
    	let t11_value = /*siteDetailInfo*/ ctx[6].mainPurpsCdNm + "";
    	let t11;
    	let t12;
    	let tr2;
    	let th2;
    	let t14;
    	let td2;
    	let t15_value = /*siteDetailInfo*/ ctx[6].totArea + "";
    	let t15;
    	let t16;
    	let tr3;
    	let th3;
    	let t18;
    	let td3;
    	let t19_value = /*siteDetailInfo*/ ctx[6].bldNm + "";
    	let t19;
    	let t20;
    	let tr4;
    	let th4;
    	let t22;
    	let td4;
    	let t23_value = /*siteDetailInfo*/ ctx[6].useAprDay + "";
    	let t23;
    	let t24;
    	let tr5;
    	let th5;
    	let t26;
    	let td5;
    	let t27_value = /*siteDetailInfo*/ ctx[6].archPmsDay + "";
    	let t27;
    	let t28;
    	let tr6;
    	let th6;
    	let t30;
    	let td6;
    	let t31_value = /*siteDetailInfo*/ ctx[6].archPmsDay + "";
    	let t31;
    	let t32;
    	let tr7;
    	let th7;
    	let t34;
    	let td7;
    	let t35_value = /*siteDetailInfo*/ ctx[6].guyukCdNm + "";
    	let t35;
    	let t36;
    	let tr8;
    	let th8;
    	let t38;
    	let td8;
    	let t39_value = /*siteDetailInfo*/ ctx[6].archArea + "";
    	let t39;
    	let t40;
    	let tr9;
    	let th9;
    	let t42;
    	let td9;
    	let t43_value = /*siteDetailInfo*/ ctx[6].bcRat + "";
    	let t43;
    	let t44;
    	let tr10;
    	let th10;
    	let t46;
    	let td10;
    	let t47_value = /*siteDetailInfo*/ ctx[6].vlRatEstmTotArea + "";
    	let t47;
    	let t48;
    	let tr11;
    	let th11;
    	let t50;
    	let td11;
    	let t51_value = /*siteDetailInfo*/ ctx[6].stcnsSchedDay + "";
    	let t51;
    	let t52;
    	let tr12;
    	let th12;
    	let t54;
    	let td12;
    	let t55_value = /*siteDetailInfo*/ ctx[6].stcnsDelayDay + "";
    	let t55;
    	let t56;
    	let tr13;
    	let th13;
    	let t58;
    	let td13;
    	let t59_value = /*siteDetailInfo*/ ctx[6].stcnsSchedDay + "";
    	let t59;
    	let t60;
    	let tr14;
    	let th14;
    	let t62;
    	let td14;
    	let t63_value = /*siteDetailInfo*/ ctx[6].realStcnsDay + "";
    	let t63;
    	let t64;
    	let tr15;
    	let th15;
    	let t66;
    	let td15;
    	let t67_value = /*siteDetailInfo*/ ctx[6].jimokCdNm + "";
    	let t67;
    	let t68;
    	let tr16;
    	let th16;
    	let t70;
    	let td16;
    	let t71_value = /*siteDetailInfo*/ ctx[6].jiyukCdNm + "";
    	let t71;
    	let mounted;
    	let dispose;
    	let if_block = /*$roadViewUrl*/ ctx[10] && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			button0 = element("button");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "상세보기";
    			t2 = space();
    			button1 = element("button");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t3 = space();
    			div1 = element("div");
    			table = element("table");
    			tbody = element("tbody");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "주소";
    			t5 = space();
    			td0 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			if (if_block) if_block.c();
    			t8 = space();
    			tr1 = element("tr");
    			th1 = element("th");
    			th1.textContent = "주용도";
    			t10 = space();
    			td1 = element("td");
    			t11 = text(t11_value);
    			t12 = space();
    			tr2 = element("tr");
    			th2 = element("th");
    			th2.textContent = "연면적";
    			t14 = space();
    			td2 = element("td");
    			t15 = text(t15_value);
    			t16 = space();
    			tr3 = element("tr");
    			th3 = element("th");
    			th3.textContent = "건물명";
    			t18 = space();
    			td3 = element("td");
    			t19 = text(t19_value);
    			t20 = space();
    			tr4 = element("tr");
    			th4 = element("th");
    			th4.textContent = "사용승인일";
    			t22 = space();
    			td4 = element("td");
    			t23 = text(t23_value);
    			t24 = space();
    			tr5 = element("tr");
    			th5 = element("th");
    			th5.textContent = "건축허가일";
    			t26 = space();
    			td5 = element("td");
    			t27 = text(t27_value);
    			t28 = space();
    			tr6 = element("tr");
    			th6 = element("th");
    			th6.textContent = "건축허가일";
    			t30 = space();
    			td6 = element("td");
    			t31 = text(t31_value);
    			t32 = space();
    			tr7 = element("tr");
    			th7 = element("th");
    			th7.textContent = "구역명";
    			t34 = space();
    			td7 = element("td");
    			t35 = text(t35_value);
    			t36 = space();
    			tr8 = element("tr");
    			th8 = element("th");
    			th8.textContent = "건축면적(㎡)";
    			t38 = space();
    			td8 = element("td");
    			t39 = text(t39_value);
    			t40 = space();
    			tr9 = element("tr");
    			th9 = element("th");
    			th9.textContent = "건폐율(%)";
    			t42 = space();
    			td9 = element("td");
    			t43 = text(t43_value);
    			t44 = space();
    			tr10 = element("tr");
    			th10 = element("th");
    			th10.textContent = "용적률(%)";
    			t46 = space();
    			td10 = element("td");
    			t47 = text(t47_value);
    			t48 = space();
    			tr11 = element("tr");
    			th11 = element("th");
    			th11.textContent = "착공예정일";
    			t50 = space();
    			td11 = element("td");
    			t51 = text(t51_value);
    			t52 = space();
    			tr12 = element("tr");
    			th12 = element("th");
    			th12.textContent = "착공연기일";
    			t54 = space();
    			td12 = element("td");
    			t55 = text(t55_value);
    			t56 = space();
    			tr13 = element("tr");
    			th13 = element("th");
    			th13.textContent = "착공예정일";
    			t58 = space();
    			td13 = element("td");
    			t59 = text(t59_value);
    			t60 = space();
    			tr14 = element("tr");
    			th14 = element("th");
    			th14.textContent = "실제착공일";
    			t62 = space();
    			td14 = element("td");
    			t63 = text(t63_value);
    			t64 = space();
    			tr15 = element("tr");
    			th15 = element("th");
    			th15.textContent = "지목";
    			t66 = space();
    			td15 = element("td");
    			t67 = text(t67_value);
    			t68 = space();
    			tr16 = element("tr");
    			th16 = element("th");
    			th16.textContent = "지역";
    			t70 = space();
    			td16 = element("td");
    			t71 = text(t71_value);
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "d", "M15.75 19.5L8.25 12l7.5-7.5");
    			add_location(path0, file, 301, 16, 10738);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "stroke-width", "1.5");
    			attr_dev(svg0, "stroke", "currentColor");
    			attr_dev(svg0, "class", "w-6 h-6");
    			add_location(svg0, file, 300, 14, 10591);
    			add_location(button0, file, 299, 12, 10543);
    			add_location(h1, file, 304, 12, 10884);
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "d", "M6 18L18 6M6 6l12 12");
    			add_location(path1, file, 311, 16, 11205);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "stroke-width", "1.5");
    			attr_dev(svg1, "stroke", "currentColor");
    			attr_dev(svg1, "class", "w-5 h-5 pointer-events-none");
    			add_location(svg1, file, 310, 14, 11038);
    			add_location(button1, file, 305, 12, 10911);
    			attr_dev(div0, "class", "flex justify-between my-3");
    			add_location(div0, file, 298, 10, 10490);
    			attr_dev(th0, "scope", "row");
    			attr_dev(th0, "class", "px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50");
    			add_location(th0, file, 325, 18, 11827);
    			attr_dev(td0, "class", "px-6 py-4 flex");
    			add_location(td0, file, 326, 18, 11943);
    			attr_dev(tr0, "class", "border-b border-gray-200");
    			add_location(tr0, file, 324, 16, 11770);
    			attr_dev(th1, "scope", "row");
    			attr_dev(th1, "class", "px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50");
    			add_location(th1, file, 341, 18, 12930);
    			attr_dev(td1, "class", "px-6 py-4");
    			add_location(td1, file, 342, 18, 13047);
    			attr_dev(tr1, "class", "border-b border-gray-200");
    			add_location(tr1, file, 340, 16, 12873);
    			attr_dev(th2, "scope", "row");
    			attr_dev(th2, "class", "px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50");
    			add_location(th2, file, 345, 18, 13202);
    			attr_dev(td2, "class", "px-6 py-4");
    			add_location(td2, file, 346, 18, 13319);
    			attr_dev(tr2, "class", "border-b border-gray-200");
    			add_location(tr2, file, 344, 16, 13145);
    			attr_dev(th3, "scope", "row");
    			attr_dev(th3, "class", "px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50");
    			add_location(th3, file, 349, 18, 13468);
    			attr_dev(td3, "class", "px-6 py-4");
    			add_location(td3, file, 350, 18, 13585);
    			attr_dev(tr3, "class", "border-b border-gray-200");
    			add_location(tr3, file, 348, 16, 13411);
    			attr_dev(th4, "scope", "row");
    			attr_dev(th4, "class", "px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50");
    			add_location(th4, file, 353, 18, 13732);
    			attr_dev(td4, "class", "px-6 py-4");
    			add_location(td4, file, 354, 18, 13851);
    			attr_dev(tr4, "class", "border-b border-gray-200");
    			add_location(tr4, file, 352, 16, 13675);
    			attr_dev(th5, "scope", "row");
    			attr_dev(th5, "class", "px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50");
    			add_location(th5, file, 357, 18, 14002);
    			attr_dev(td5, "class", "px-6 py-4");
    			add_location(td5, file, 358, 18, 14121);
    			attr_dev(tr5, "class", "border-b border-gray-200");
    			add_location(tr5, file, 356, 16, 13945);
    			attr_dev(th6, "scope", "row");
    			attr_dev(th6, "class", "px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50");
    			add_location(th6, file, 361, 18, 14273);
    			attr_dev(td6, "class", "px-6 py-4");
    			add_location(td6, file, 362, 18, 14392);
    			attr_dev(tr6, "class", "border-b border-gray-200");
    			add_location(tr6, file, 360, 16, 14216);
    			attr_dev(th7, "scope", "row");
    			attr_dev(th7, "class", "px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50");
    			add_location(th7, file, 365, 18, 14544);
    			attr_dev(td7, "class", "px-6 py-4");
    			add_location(td7, file, 366, 18, 14661);
    			attr_dev(tr7, "class", "border-b border-gray-200");
    			add_location(tr7, file, 364, 16, 14487);
    			attr_dev(th8, "scope", "row");
    			attr_dev(th8, "class", "px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50");
    			add_location(th8, file, 369, 18, 14812);
    			attr_dev(td8, "class", "px-6 py-4");
    			add_location(td8, file, 370, 18, 14933);
    			attr_dev(tr8, "class", "border-b border-gray-200");
    			add_location(tr8, file, 368, 16, 14755);
    			attr_dev(th9, "scope", "row");
    			attr_dev(th9, "class", "px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50");
    			add_location(th9, file, 373, 18, 15083);
    			attr_dev(td9, "class", "px-6 py-4");
    			add_location(td9, file, 374, 18, 15203);
    			attr_dev(tr9, "class", "border-b border-gray-200");
    			add_location(tr9, file, 372, 16, 15026);
    			attr_dev(th10, "scope", "row");
    			attr_dev(th10, "class", "px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50");
    			add_location(th10, file, 377, 18, 15350);
    			attr_dev(td10, "class", "px-6 py-4");
    			add_location(td10, file, 378, 18, 15470);
    			attr_dev(tr10, "class", "border-b border-gray-200");
    			add_location(tr10, file, 376, 16, 15293);
    			attr_dev(th11, "scope", "row");
    			attr_dev(th11, "class", "px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50");
    			add_location(th11, file, 381, 18, 15628);
    			attr_dev(td11, "class", "px-6 py-4");
    			add_location(td11, file, 382, 18, 15747);
    			attr_dev(tr11, "class", "border-b border-gray-200");
    			add_location(tr11, file, 380, 16, 15571);
    			attr_dev(th12, "scope", "row");
    			attr_dev(th12, "class", "px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50");
    			add_location(th12, file, 385, 18, 15902);
    			attr_dev(td12, "class", "px-6 py-4");
    			add_location(td12, file, 386, 18, 16021);
    			attr_dev(tr12, "class", "border-b border-gray-200");
    			add_location(tr12, file, 384, 16, 15845);
    			attr_dev(th13, "scope", "row");
    			attr_dev(th13, "class", "px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50");
    			add_location(th13, file, 389, 18, 16176);
    			attr_dev(td13, "class", "px-6 py-4");
    			add_location(td13, file, 390, 18, 16295);
    			attr_dev(tr13, "class", "border-b border-gray-200");
    			add_location(tr13, file, 388, 16, 16119);
    			attr_dev(th14, "scope", "row");
    			attr_dev(th14, "class", "px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50");
    			add_location(th14, file, 393, 18, 16450);
    			attr_dev(td14, "class", "px-6 py-4");
    			add_location(td14, file, 394, 18, 16569);
    			attr_dev(tr14, "class", "border-b border-gray-200");
    			add_location(tr14, file, 392, 16, 16393);
    			attr_dev(th15, "scope", "row");
    			attr_dev(th15, "class", "px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50");
    			add_location(th15, file, 397, 18, 16723);
    			attr_dev(td15, "class", "px-6 py-4");
    			add_location(td15, file, 398, 18, 16839);
    			attr_dev(tr15, "class", "border-b border-gray-200");
    			add_location(tr15, file, 396, 16, 16666);
    			attr_dev(th16, "scope", "row");
    			attr_dev(th16, "class", "px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50");
    			add_location(th16, file, 401, 18, 16990);
    			attr_dev(td16, "class", "px-6 py-4");
    			add_location(td16, file, 402, 18, 17106);
    			attr_dev(tr16, "class", "border-b border-gray-200");
    			add_location(tr16, file, 400, 16, 16933);
    			add_location(tbody, file, 323, 14, 11745);
    			attr_dev(table, "class", "w-full text-sm text-left text-gray-500");
    			add_location(table, file, 317, 12, 11424);
    			attr_dev(div1, "class", "relative overflow-x-auto shadow-md");
    			add_location(div1, file, 316, 10, 11362);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, button0);
    			append_dev(button0, svg0);
    			append_dev(svg0, path0);
    			append_dev(div0, t0);
    			append_dev(div0, h1);
    			append_dev(div0, t2);
    			append_dev(div0, button1);
    			append_dev(button1, svg1);
    			append_dev(svg1, path1);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, table);
    			append_dev(table, tbody);
    			append_dev(tbody, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t5);
    			append_dev(tr0, td0);
    			append_dev(td0, t6);
    			append_dev(td0, t7);
    			if (if_block) if_block.m(td0, null);
    			append_dev(tbody, t8);
    			append_dev(tbody, tr1);
    			append_dev(tr1, th1);
    			append_dev(tr1, t10);
    			append_dev(tr1, td1);
    			append_dev(td1, t11);
    			append_dev(tbody, t12);
    			append_dev(tbody, tr2);
    			append_dev(tr2, th2);
    			append_dev(tr2, t14);
    			append_dev(tr2, td2);
    			append_dev(td2, t15);
    			append_dev(tbody, t16);
    			append_dev(tbody, tr3);
    			append_dev(tr3, th3);
    			append_dev(tr3, t18);
    			append_dev(tr3, td3);
    			append_dev(td3, t19);
    			append_dev(tbody, t20);
    			append_dev(tbody, tr4);
    			append_dev(tr4, th4);
    			append_dev(tr4, t22);
    			append_dev(tr4, td4);
    			append_dev(td4, t23);
    			append_dev(tbody, t24);
    			append_dev(tbody, tr5);
    			append_dev(tr5, th5);
    			append_dev(tr5, t26);
    			append_dev(tr5, td5);
    			append_dev(td5, t27);
    			append_dev(tbody, t28);
    			append_dev(tbody, tr6);
    			append_dev(tr6, th6);
    			append_dev(tr6, t30);
    			append_dev(tr6, td6);
    			append_dev(td6, t31);
    			append_dev(tbody, t32);
    			append_dev(tbody, tr7);
    			append_dev(tr7, th7);
    			append_dev(tr7, t34);
    			append_dev(tr7, td7);
    			append_dev(td7, t35);
    			append_dev(tbody, t36);
    			append_dev(tbody, tr8);
    			append_dev(tr8, th8);
    			append_dev(tr8, t38);
    			append_dev(tr8, td8);
    			append_dev(td8, t39);
    			append_dev(tbody, t40);
    			append_dev(tbody, tr9);
    			append_dev(tr9, th9);
    			append_dev(tr9, t42);
    			append_dev(tr9, td9);
    			append_dev(td9, t43);
    			append_dev(tbody, t44);
    			append_dev(tbody, tr10);
    			append_dev(tr10, th10);
    			append_dev(tr10, t46);
    			append_dev(tr10, td10);
    			append_dev(td10, t47);
    			append_dev(tbody, t48);
    			append_dev(tbody, tr11);
    			append_dev(tr11, th11);
    			append_dev(tr11, t50);
    			append_dev(tr11, td11);
    			append_dev(td11, t51);
    			append_dev(tbody, t52);
    			append_dev(tbody, tr12);
    			append_dev(tr12, th12);
    			append_dev(tr12, t54);
    			append_dev(tr12, td12);
    			append_dev(td12, t55);
    			append_dev(tbody, t56);
    			append_dev(tbody, tr13);
    			append_dev(tr13, th13);
    			append_dev(tr13, t58);
    			append_dev(tr13, td13);
    			append_dev(td13, t59);
    			append_dev(tbody, t60);
    			append_dev(tbody, tr14);
    			append_dev(tr14, th14);
    			append_dev(tr14, t62);
    			append_dev(tr14, td14);
    			append_dev(td14, t63);
    			append_dev(tbody, t64);
    			append_dev(tbody, tr15);
    			append_dev(tr15, th15);
    			append_dev(tr15, t66);
    			append_dev(tr15, td15);
    			append_dev(td15, t67);
    			append_dev(tbody, t68);
    			append_dev(tbody, tr16);
    			append_dev(tr16, th16);
    			append_dev(tr16, t70);
    			append_dev(tr16, td16);
    			append_dev(td16, t71);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*siteListView*/ ctx[15], false, false, false),
    					listen_dev(button1, "click", /*click_handler_3*/ ctx[22], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*siteDetailInfo*/ 64 && t6_value !== (t6_value = /*siteDetailInfo*/ ctx[6].platPlc + "")) set_data_dev(t6, t6_value);

    			if (/*$roadViewUrl*/ ctx[10]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					if_block.m(td0, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*siteDetailInfo*/ 64 && t11_value !== (t11_value = /*siteDetailInfo*/ ctx[6].mainPurpsCdNm + "")) set_data_dev(t11, t11_value);
    			if (dirty[0] & /*siteDetailInfo*/ 64 && t15_value !== (t15_value = /*siteDetailInfo*/ ctx[6].totArea + "")) set_data_dev(t15, t15_value);
    			if (dirty[0] & /*siteDetailInfo*/ 64 && t19_value !== (t19_value = /*siteDetailInfo*/ ctx[6].bldNm + "")) set_data_dev(t19, t19_value);
    			if (dirty[0] & /*siteDetailInfo*/ 64 && t23_value !== (t23_value = /*siteDetailInfo*/ ctx[6].useAprDay + "")) set_data_dev(t23, t23_value);
    			if (dirty[0] & /*siteDetailInfo*/ 64 && t27_value !== (t27_value = /*siteDetailInfo*/ ctx[6].archPmsDay + "")) set_data_dev(t27, t27_value);
    			if (dirty[0] & /*siteDetailInfo*/ 64 && t31_value !== (t31_value = /*siteDetailInfo*/ ctx[6].archPmsDay + "")) set_data_dev(t31, t31_value);
    			if (dirty[0] & /*siteDetailInfo*/ 64 && t35_value !== (t35_value = /*siteDetailInfo*/ ctx[6].guyukCdNm + "")) set_data_dev(t35, t35_value);
    			if (dirty[0] & /*siteDetailInfo*/ 64 && t39_value !== (t39_value = /*siteDetailInfo*/ ctx[6].archArea + "")) set_data_dev(t39, t39_value);
    			if (dirty[0] & /*siteDetailInfo*/ 64 && t43_value !== (t43_value = /*siteDetailInfo*/ ctx[6].bcRat + "")) set_data_dev(t43, t43_value);
    			if (dirty[0] & /*siteDetailInfo*/ 64 && t47_value !== (t47_value = /*siteDetailInfo*/ ctx[6].vlRatEstmTotArea + "")) set_data_dev(t47, t47_value);
    			if (dirty[0] & /*siteDetailInfo*/ 64 && t51_value !== (t51_value = /*siteDetailInfo*/ ctx[6].stcnsSchedDay + "")) set_data_dev(t51, t51_value);
    			if (dirty[0] & /*siteDetailInfo*/ 64 && t55_value !== (t55_value = /*siteDetailInfo*/ ctx[6].stcnsDelayDay + "")) set_data_dev(t55, t55_value);
    			if (dirty[0] & /*siteDetailInfo*/ 64 && t59_value !== (t59_value = /*siteDetailInfo*/ ctx[6].stcnsSchedDay + "")) set_data_dev(t59, t59_value);
    			if (dirty[0] & /*siteDetailInfo*/ 64 && t63_value !== (t63_value = /*siteDetailInfo*/ ctx[6].realStcnsDay + "")) set_data_dev(t63, t63_value);
    			if (dirty[0] & /*siteDetailInfo*/ 64 && t67_value !== (t67_value = /*siteDetailInfo*/ ctx[6].jimokCdNm + "")) set_data_dev(t67, t67_value);
    			if (dirty[0] & /*siteDetailInfo*/ 64 && t71_value !== (t71_value = /*siteDetailInfo*/ ctx[6].jiyukCdNm + "")) set_data_dev(t71, t71_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(298:8) {#if siteDetailToggle && siteDetailInfo}",
    		ctx
    	});

    	return block;
    }

    // (329:20) {#if $roadViewUrl}
    function create_if_block_2(ctx) {
    	let a;
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			a = element("a");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "d", "M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z");
    			add_location(path, file, 331, 26, 12405);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "1.5");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "class", "w-5 h-5 pointer-events-none");
    			add_location(svg, file, 330, 25, 12228);
    			attr_dev(a, "href", /*$roadViewUrl*/ ctx[10]);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noreferrer");
    			attr_dev(a, "class", "text-indigo-600 hover:text-indigo-500 ml-2");
    			attr_dev(a, "title", "로드맵 보기");
    			add_location(a, file, 329, 22, 12080);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, svg);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$roadViewUrl*/ 1024) {
    				attr_dev(a, "href", /*$roadViewUrl*/ ctx[10]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(329:20) {#if $roadViewUrl}",
    		ctx
    	});

    	return block;
    }

    // (219:6) 
    function create_content_slot(ctx) {
    	let div;
    	let t;
    	let if_block0 = /*siteListModalToggle*/ ctx[3] && create_if_block_3(ctx);
    	let if_block1 = /*siteDetailToggle*/ ctx[4] && /*siteDetailInfo*/ ctx[6] && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div, "slot", "content");
    			attr_dev(div, "class", "flex flex-col relative px-2 pb-10");
    			add_location(div, file, 218, 6, 6664);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t);
    			if (if_block1) if_block1.m(div, null);
    			/*div_binding*/ ctx[23](div);
    		},
    		p: function update(ctx, dirty) {
    			if (/*siteListModalToggle*/ ctx[3]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					if_block0.m(div, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*siteDetailToggle*/ ctx[4] && /*siteDetailInfo*/ ctx[6]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			/*div_binding*/ ctx[23](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot.name,
    		type: "slot",
    		source: "(219:6) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let t;
    	let current;
    	let if_block0 = !/*modalToggle*/ ctx[2] && create_if_block_4(ctx);
    	let if_block1 = /*modalToggle*/ ctx[2] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div, "class", "h-full relative");
    			add_location(div, file, 202, 0, 5830);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t);
    			if (if_block1) if_block1.m(div, null);
    			/*div_binding_1*/ ctx[24](div);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!/*modalToggle*/ ctx[2]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_4(ctx);
    					if_block0.c();
    					if_block0.m(div, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*modalToggle*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*modalToggle*/ 4) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			/*div_binding_1*/ ctx[24](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const apiKey = "GO8tFIo30%2BUG6NoXSzlVzxv2j8eQFigKu9a8RJ9qY47kAnl2u27pVjWIDlvlZ09Yo3NNJeyRt3UJovtQ5Z11ew%3D%3D";

    // 법정동코드 api
    async function getStanReginCdList() {
    	let url = "http://api.odcloud.kr/api/15063424/v1/uddi:6d7fd177-cc7d-426d-ba80-9b137edf6066";
    	url += "?serviceKey=" + apiKey;
    	url += "&page=" + 1;
    	url += "&perPage=" + 1000;
    	url += "&returnType=" + "json";
    	url += "&locatadd_nm=" + "서울특별시";
    	console.log("법정동 코드 api url : ", url);

    	return fetch(url).then(resp => {
    		return resp.text();
    	}).catch(error => {
    		throw new Error(error);
    	});
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $roadViewUrl;
    	validate_store(roadViewUrl, 'roadViewUrl');
    	component_subscribe($$self, roadViewUrl, $$value => $$invalidate(10, $roadViewUrl = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PermissionMap', slots, []);
    	let map; // 카카오지도 객체를 담을 변수입니다.
    	let mapContainer; // 카카오지도를 담을 영역 태그 컨테이너 입니다.
    	let markers = []; // 마커를 담을 배열입니다.

    	// 모달 관련 변수
    	let modalToggle = false;

    	let siteListModalToggle = false;
    	let siteDetailToggle = false;
    	let expand = "";
    	let sideModal;

    	// 사이트 정보 관련 변수
    	let siteDetailInfo; // 사이트 세부 정보를 담는 변수입니다.

    	let siteList = []; // 인허가api 결과를 담는 변수입니다.

    	// 검색어를 담을 변수입니다.
    	let searchTerm = "";

    	let today = new Date();
    	let dateSelected = today.getFullYear();
    	let totalArea = 10000; // 면적 조건
    	let sidoSelected = "서울특별시"; // 시도

    	// 법정동코드 리스트
    	const codeList = [
    		"1165010100",
    		"1165010200",
    		"1165010300",
    		"1165010400",
    		"1165010600",
    		"1165010700",
    		"1165010800",
    		"1165010900",
    		"1165011000",
    		"1111010100"
    	]; //서울특별시 서초구 방배동
    	// 서울특별시 종로구 청운동

    	// 카카오지도에 마커를 표시하고 클릭 이벤트를 등록하는 함수입니다.
    	function pin(elem) {
    		let geocoder = new kakao.maps.services.Geocoder();
    		let rc = new kakao.maps.RoadviewClient(); // 좌표를 통한 로드뷰의 panoid를 추출하기 위한 로드뷰 help객체 생성

    		return geocoder.addressSearch(elem.platPlc, function (coord, status) {
    			if (status == kakao.maps.services.Status.OK) {
    				elem.coord = coord[0]; // coord(위경도) 속성을 추가합니다.
    				let coords = new kakao.maps.LatLng(elem.coord.y, elem.coord.x);

    				// let marker = new kakao.maps.Marker({
    				//   map: map,
    				//   title: elem.id,
    				//   position: coords,
    				//   clickable: true,
    				// });
    				setMarker(elem, coord);

    				rc.getNearestPanoId(coords, 50, function (panoId) {
    					roadViewUrl.set("https://map.kakao.com/?panoid=" + panoId); //Kakao 지도 로드뷰로 보내는 링크
    				});
    			}
    		});
    	}

    	function focus(elem) {
    		map.setLevel(4);
    		map.setCenter(new kakao.maps.LatLng(elem.coord.y, elem.coord.x));
    	}

    	//////////
    	function setMarker(elem, coord) {
    		let coords = new kakao.maps.LatLng(coord[0].y, coord[0].x);

    		let marker = new kakao.maps.Marker({
    				map,
    				title: elem.platPlc,
    				position: coords,
    				clickable: true
    			});

    		$$invalidate(1, markers = [...markers, marker]);
    		$$invalidate(1, markers = [...markers, marker]);

    		kakao.maps.event.addListener(marker, "click", function () {
    			map.setLevel(4);
    			map.setCenter(new kakao.maps.LatLng(coord[0].y, coord[0].x));
    			$$invalidate(6, siteDetailInfo = elem);
    			siteDetailView();
    		});
    	}

    	// 건축인허가정보 서비스 api
    	async function getApBasisOulnInfo(code, start, end) {
    		let url = "http://apis.data.go.kr/1613000/ArchPmsService_v2/getApBasisOulnInfo";
    		url += "?sigunguCd=" + code.substr(0, 5);
    		url += "&bjdongCd=" + code.substr(5, 5);
    		url += "&numOfRows=" + 1000;
    		url += "&pageNo=" + 1;
    		url += "&startDate=" + start;
    		url += "&endDate=" + end;
    		url += "&serviceKey=" + apiKey;

    		return fetch(url).then(resp => {
    			return resp.text();
    		}).then(xmlStr => {
    			return xmlStr2Json(xmlStr).response.body.items.item;
    		}).catch(error => {
    			throw new Error(error);
    		});
    	}

    	// 법정동코드(10자리)로 인허가정보를 반환합니다.
    	async function getInfo(code) {
    		let year = dateSelected;
    		let startMonth = "01";
    		let startDay = "01";

    		let endMonth = dateSelected == today.getFullYear()
    		? String(Number(today.getMonth() + 1)).padStart(2, "0")
    		: "12";

    		let endDay = dateSelected == today.getFullYear()
    		? String(Number(today.getDate() - 1)).padStart(2, "0")
    		: "31";

    		let start = year + startMonth + startDay;
    		let end = year + endMonth + endDay;
    		let info = await getApBasisOulnInfo(code, start, end);

    		if (info == undefined) {
    			// 인허가정보가 없으면 함수를 종료합니다.
    			return;
    		}

    		if (Array.isArray(info)) {
    			Object.values(info).forEach(function (el) {
    				if (Number(el.totArea) >= totalArea && Number(el.archPmsDay) >= Number(start) && el.archGbCdNm == "신축") {
    					pin(el);
    					$$invalidate(7, siteList = [...siteList, el]);
    				}
    			});
    		} else {
    			if (Number(info.totArea) >= totalArea && Number(info.archPmsDay) >= Number(start) && info.archGbCdNm == "신축") {
    				pin(info);
    				$$invalidate(7, siteList = [...siteList, info]);
    			}
    		}
    	}

    	function siteListView() {
    		$$invalidate(2, modalToggle = true);
    		$$invalidate(3, siteListModalToggle = true);
    		$$invalidate(4, siteDetailToggle = false);
    	}

    	function siteDetailView() {
    		$$invalidate(2, modalToggle = true);
    		$$invalidate(3, siteListModalToggle = false);
    		$$invalidate(4, siteDetailToggle = true);
    	}

    	function closeModal() {
    		$$invalidate(2, modalToggle = false);
    	}

    	onMount(async () => {
    		let mapOption = {
    			center: new kakao.maps.LatLng(37.5042135, 127.0016985),
    			level: 8
    		};

    		map = new kakao.maps.Map(mapContainer, mapOption);

    		codeList.forEach(async function (code) {
    			await getInfo(code);
    		});
    	}); // getStanReginCdList();

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<PermissionMap> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(2, modalToggle = false);
    	};

    	function select_change_handler() {
    		sidoSelected = select_value(this);
    		$$invalidate(9, sidoSelected);
    	}

    	function input_input_handler() {
    		dateSelected = to_number(this.value);
    		$$invalidate(8, dateSelected);
    	}

    	const click_handler_1 = () => {
    		markers.forEach(marker => marker.setMap(null)); // 이전에 지도에 표시된 마커를 모두 지웁니다.
    		$$invalidate(7, siteList = []); // 사이트 리스트 변수를 초기화 합니다.
    		$$invalidate(1, markers = []);
    		codeList.forEach(code => getInfo(code));
    	};

    	const click_handler_2 = site => {
    		$$invalidate(6, siteDetailInfo = site);
    		siteDetailView();
    		focus(site);
    	};

    	const click_handler_3 = () => {
    		$$invalidate(2, modalToggle = false);
    	};

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			sideModal = $$value;
    			$$invalidate(5, sideModal);
    		});
    	}

    	function div_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			mapContainer = $$value;
    			$$invalidate(0, mapContainer);
    		});
    	}

    	$$self.$capture_state = () => ({
    		SideModal: SlideModal,
    		roadViewUrl,
    		xmlStr2Json,
    		addComma,
    		onMount,
    		map,
    		mapContainer,
    		markers,
    		modalToggle,
    		siteListModalToggle,
    		siteDetailToggle,
    		expand,
    		sideModal,
    		siteDetailInfo,
    		siteList,
    		searchTerm,
    		today,
    		dateSelected,
    		totalArea,
    		sidoSelected,
    		apiKey,
    		codeList,
    		pin,
    		focus,
    		setMarker,
    		getApBasisOulnInfo,
    		getStanReginCdList,
    		getInfo,
    		siteListView,
    		siteDetailView,
    		closeModal,
    		$roadViewUrl
    	});

    	$$self.$inject_state = $$props => {
    		if ('map' in $$props) map = $$props.map;
    		if ('mapContainer' in $$props) $$invalidate(0, mapContainer = $$props.mapContainer);
    		if ('markers' in $$props) $$invalidate(1, markers = $$props.markers);
    		if ('modalToggle' in $$props) $$invalidate(2, modalToggle = $$props.modalToggle);
    		if ('siteListModalToggle' in $$props) $$invalidate(3, siteListModalToggle = $$props.siteListModalToggle);
    		if ('siteDetailToggle' in $$props) $$invalidate(4, siteDetailToggle = $$props.siteDetailToggle);
    		if ('expand' in $$props) expand = $$props.expand;
    		if ('sideModal' in $$props) $$invalidate(5, sideModal = $$props.sideModal);
    		if ('siteDetailInfo' in $$props) $$invalidate(6, siteDetailInfo = $$props.siteDetailInfo);
    		if ('siteList' in $$props) $$invalidate(7, siteList = $$props.siteList);
    		if ('searchTerm' in $$props) searchTerm = $$props.searchTerm;
    		if ('today' in $$props) $$invalidate(11, today = $$props.today);
    		if ('dateSelected' in $$props) $$invalidate(8, dateSelected = $$props.dateSelected);
    		if ('totalArea' in $$props) totalArea = $$props.totalArea;
    		if ('sidoSelected' in $$props) $$invalidate(9, sidoSelected = $$props.sidoSelected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		mapContainer,
    		markers,
    		modalToggle,
    		siteListModalToggle,
    		siteDetailToggle,
    		sideModal,
    		siteDetailInfo,
    		siteList,
    		dateSelected,
    		sidoSelected,
    		$roadViewUrl,
    		today,
    		codeList,
    		focus,
    		getInfo,
    		siteListView,
    		siteDetailView,
    		click_handler,
    		select_change_handler,
    		input_input_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		div_binding,
    		div_binding_1
    	];
    }

    class PermissionMap extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PermissionMap",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\pages\PermissionMap.svelte generated by Svelte v3.53.1 */

    function create_fragment$1(ctx) {
    	let permissionmap;
    	let current;
    	permissionmap = new PermissionMap({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(permissionmap.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(permissionmap, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(permissionmap.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(permissionmap.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(permissionmap, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PermissionMap', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PermissionMap> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ PermissionMap });
    	return [];
    }

    class PermissionMap_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PermissionMap_1",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    // import Dashboard from "./pages/Dashboard.svelte";
    // import Insight from "./pages/Insight.svelte";
    // import Setting from "./pages/Setting.svelte";
    // import Sites from "./pages/Sites.svelte";
    // import SitesDetailView from "./pages/SiteDetail.svelte";
    // import Log from "./pages/Log.svelte";
    // import Login from "./pages/Signin.svelte";
    // import Signup from "./pages/Signup.svelte";

    const routes = {
      "/": PermissionMap_1,
      "/map": PermissionMap_1,
      "/about": About,
      // "/login": Login,
      // "/signup": Signup,
      // "/home": Dashboard,
      // "/sites": Sites,
      // "/pop": Dashboard,
      // "/pop/dashboard": Dashboard,
      // "/pop/map": Map,
      // "/pop/sites": Sites,
      // "/pop/sites/:id": SitesDetailView,
      // "/pop/sites/log/:id": Log,
      // "/pop/insight": Insight,
      // "/pop/setting": Setting,
    };

    /* src\App.svelte generated by Svelte v3.53.1 */

    // (16:0) {:else}
    function create_else_block(ctx) {
    	let router;
    	let current;
    	router = new Router({ props: { routes: routes }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(16:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (14:0) {#if loading}
    function create_if_block(ctx) {
    	let loading_1;
    	let current;
    	loading_1 = new Loading({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loading_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loading_1, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loading_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(14:0) {#if loading}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loading*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let loading = true;

    	onMount(async () => {
    		$$invalidate(0, loading = false);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Router, onMount, Loading, paths: routes, loading });

    	$$self.$inject_state = $$props => {
    		if ('loading' in $$props) $$invalidate(0, loading = $$props.loading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [loading];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
      target: document.body,
      props: {
        // name: 'world'
      },
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
