
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
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
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
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
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { ownerNode } = info.stylesheet;
                // there is no ownerNode if it runs on jsdom.
                if (ownerNode)
                    detach(ownerNode);
            });
            managed_styles.clear();
        });
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
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
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
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

    /* node_modules/svelte-spa-router/Router.svelte generated by Svelte v3.53.1 */

    const { Error: Error_1, Object: Object_1, console: console_1 } = globals;

    // (267:0) {:else}
    function create_else_block$1(ctx) {
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
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(267:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (260:0) {#if componentParams}
    function create_if_block$3(ctx) {
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
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(260:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$3, create_else_block$1];
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
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
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
    		id: create_fragment$b.name,
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

    const location$1 = derived(loc, $loc => $loc.location);
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

    function instance$b($$self, $$props, $$invalidate) {
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

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Router> was created with unknown prop '${key}'`);
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
    		location: location$1,
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

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/assets/etc/Loading.svelte generated by Svelte v3.53.1 */

    const file$9 = "src/assets/etc/Loading.svelte";

    function create_fragment$a(ctx) {
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
    			t = text("\n  Loading...");
    			attr_dev(path0, "d", "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z");
    			attr_dev(path0, "fill", "currentColor");
    			add_location(path0, file$9, 2, 4, 406);
    			attr_dev(path1, "d", "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z");
    			attr_dev(path1, "fill", "#1C64F2");
    			add_location(path1, file$9, 6, 4, 824);
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "role", "status");
    			attr_dev(svg, "class", "inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600");
    			attr_dev(svg, "viewBox", "0 0 100 101");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$9, 1, 2, 220);
    			button.disabled = true;
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "py-2.5 px-5 mr-2 text-sm font-medium text-gray-900 bg-white rounded-lg border-0 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 inline-flex items-center");
    			add_location(button, file$9, 0, 0, 0);
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
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props) {
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
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loading",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src/layout/Atype.svelte generated by Svelte v3.53.1 */

    const file$8 = "src/layout/Atype.svelte";
    const get_content_slot_changes = dirty => ({});
    const get_content_slot_context = ctx => ({});
    const get_navbar_slot_changes = dirty => ({});
    const get_navbar_slot_context = ctx => ({});

    function create_fragment$9(ctx) {
    	let div2;
    	let div0;
    	let t;
    	let div1;
    	let current;
    	const navbar_slot_template = /*#slots*/ ctx[1].navbar;
    	const navbar_slot = create_slot(navbar_slot_template, ctx, /*$$scope*/ ctx[0], get_navbar_slot_context);
    	const content_slot_template = /*#slots*/ ctx[1].content;
    	const content_slot = create_slot(content_slot_template, ctx, /*$$scope*/ ctx[0], get_content_slot_context);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			if (navbar_slot) navbar_slot.c();
    			t = space();
    			div1 = element("div");
    			if (content_slot) content_slot.c();
    			attr_dev(div0, "class", "navbar");
    			add_location(div0, file$8, 1, 2, 25);
    			attr_dev(div1, "class", "");
    			add_location(div1, file$8, 5, 2, 85);
    			attr_dev(div2, "class", "h-screen");
    			add_location(div2, file$8, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);

    			if (navbar_slot) {
    				navbar_slot.m(div0, null);
    			}

    			append_dev(div2, t);
    			append_dev(div2, div1);

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
    						: get_slot_changes(content_slot_template, /*$$scope*/ ctx[0], dirty, get_content_slot_changes),
    						get_content_slot_context
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
    			if (detaching) detach_dev(div2);
    			if (navbar_slot) navbar_slot.d(detaching);
    			if (content_slot) content_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Atype",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    const mobileView = readable(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

    /* src/components/Navbar.svelte generated by Svelte v3.53.1 */
    const file$7 = "src/components/Navbar.svelte";

    // (22:4) {#if open}
    function create_if_block$2(ctx) {
    	let div;
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
    	let t3;
    	let li2;
    	let a2;
    	let t4;
    	let a2_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			t0 = text("Home");
    			t1 = space();
    			li1 = element("li");
    			a1 = element("a");
    			t2 = text("자산목록");
    			t3 = space();
    			li2 = element("li");
    			a2 = element("a");
    			t4 = text("About");
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "class", a0_class_value = "" + ((/*$location*/ ctx[1] === '/' ? 'active' : '') + " block py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 dark:text-white md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" + " svelte-13gtopq"));
    			add_location(a0, file$7, 25, 12, 1382);
    			add_location(li0, file$7, 24, 10, 1365);
    			attr_dev(a1, "href", "/sites");
    			attr_dev(a1, "class", a1_class_value = "" + ((/*$location*/ ctx[1] === '/sites' ? 'active' : '') + " block py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 dark:text-white md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" + " svelte-13gtopq"));
    			add_location(a1, file$7, 34, 12, 1792);
    			add_location(li1, file$7, 33, 10, 1775);
    			attr_dev(a2, "href", "/about");
    			attr_dev(a2, "class", a2_class_value = "" + ((/*$location*/ ctx[1] === '/about' ? 'active' : '') + " block py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 dark:text-white md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" + " svelte-13gtopq"));
    			add_location(a2, file$7, 43, 12, 2212);
    			add_location(li2, file$7, 42, 10, 2195);
    			attr_dev(ul, "class", "flex flex-col p-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700");
    			add_location(ul, file$7, 23, 8, 1138);
    			attr_dev(div, "class", "w-full max-sm:w-64 max-sm:absolute max-sm:top-16 max-sm:mx-2 z-50");
    			add_location(div, file$7, 22, 6, 1050);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(a0, t0);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(a1, t2);
    			append_dev(ul, t3);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(a2, t4);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(link.call(null, a0)),
    					action_destroyer(link.call(null, a1)),
    					action_destroyer(link.call(null, a2))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$location*/ 2 && a0_class_value !== (a0_class_value = "" + ((/*$location*/ ctx[1] === '/' ? 'active' : '') + " block py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 dark:text-white md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" + " svelte-13gtopq"))) {
    				attr_dev(a0, "class", a0_class_value);
    			}

    			if (dirty & /*$location*/ 2 && a1_class_value !== (a1_class_value = "" + ((/*$location*/ ctx[1] === '/sites' ? 'active' : '') + " block py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 dark:text-white md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" + " svelte-13gtopq"))) {
    				attr_dev(a1, "class", a1_class_value);
    			}

    			if (dirty & /*$location*/ 2 && a2_class_value !== (a2_class_value = "" + ((/*$location*/ ctx[1] === '/about' ? 'active' : '') + " block py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 dark:text-white md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" + " svelte-13gtopq"))) {
    				attr_dev(a2, "class", a2_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(22:4) {#if open}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let nav;
    	let div;
    	let button;
    	let span;
    	let t1;
    	let svg;
    	let path;
    	let t2;
    	let mounted;
    	let dispose;
    	let if_block = /*open*/ ctx[0] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div = element("div");
    			button = element("button");
    			span = element("span");
    			span.textContent = "Open main menu";
    			t1 = space();
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t2 = space();
    			if (if_block) if_block.c();
    			attr_dev(span, "class", "sr-only");
    			add_location(span, file$7, 15, 6, 630);
    			attr_dev(path, "fill-rule", "evenodd");
    			attr_dev(path, "d", "M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z");
    			attr_dev(path, "clip-rule", "evenodd");
    			add_location(path, file$7, 17, 9, 804);
    			attr_dev(svg, "class", "w-6 h-6");
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$7, 16, 6, 680);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "inline-flex items-center p-2 mt-2 ml-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600");
    			add_location(button, file$7, 10, 4, 319);
    			attr_dev(div, "class", "container max-sm:relative flex flex-wrap items-center justify-between");
    			add_location(div, file$7, 9, 2, 231);
    			attr_dev(nav, "class", "dark:bg-gray-900 z-50");
    			add_location(nav, file$7, 8, 0, 193);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div);
    			append_dev(div, button);
    			append_dev(button, span);
    			append_dev(button, t1);
    			append_dev(button, svg);
    			append_dev(svg, path);
    			append_dev(div, t2);
    			if (if_block) if_block.m(div, null);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*open*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
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

    function instance$8($$self, $$props, $$invalidate) {
    	let $mobileView;
    	let $location;
    	validate_store(mobileView, 'mobileView');
    	component_subscribe($$self, mobileView, $$value => $$invalidate(3, $mobileView = $$value));
    	validate_store(location$1, 'location');
    	component_subscribe($$self, location$1, $$value => $$invalidate(1, $location = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navbar', slots, []);
    	let open = $mobileView ? false : true;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, open = !open);

    	$$self.$capture_state = () => ({
    		onMount,
    		link,
    		location: location$1,
    		mobileView,
    		open,
    		$mobileView,
    		$location
    	});

    	$$self.$inject_state = $$props => {
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [open, $location, click_handler];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/pages/About.svelte generated by Svelte v3.53.1 */
    const file$6 = "src/pages/About.svelte";

    // (7:2) 
    function create_navbar_slot$4(ctx) {
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
    		id: create_navbar_slot$4.name,
    		type: "slot",
    		source: "(7:2) ",
    		ctx
    	});

    	return block;
    }

    // (9:2) 
    function create_content_slot$4(ctx) {
    	let div;
    	let h1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "About11";
    			add_location(h1, file$6, 9, 4, 190);
    			attr_dev(div, "class", "");
    			attr_dev(div, "slot", "content");
    			add_location(div, file$6, 8, 2, 156);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot$4.name,
    		type: "slot",
    		source: "(9:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let atype;
    	let current;

    	atype = new Atype({
    			props: {
    				$$slots: {
    					content: [create_content_slot$4],
    					navbar: [create_navbar_slot$4]
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
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/pages/Dashboard.svelte generated by Svelte v3.53.1 */
    const file$5 = "src/pages/Dashboard.svelte";

    // (7:2) 
    function create_navbar_slot$3(ctx) {
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
    		id: create_navbar_slot$3.name,
    		type: "slot",
    		source: "(7:2) ",
    		ctx
    	});

    	return block;
    }

    // (9:2) 
    function create_content_slot$3(ctx) {
    	let div;
    	let h1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Dashboard";
    			add_location(h1, file$5, 9, 4, 198);
    			attr_dev(div, "class", "p-3 pe-5");
    			attr_dev(div, "slot", "content");
    			add_location(div, file$5, 8, 2, 156);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot$3.name,
    		type: "slot",
    		source: "(9:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let atype;
    	let current;

    	atype = new Atype({
    			props: {
    				$$slots: {
    					content: [create_content_slot$3],
    					navbar: [create_navbar_slot$3]
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
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dashboard', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dashboard> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Atype, Navbar });
    	return [];
    }

    class Dashboard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dashboard",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    // List of nodes to update
    const nodes = [];

    // Current location
    let location;

    // Function that updates all nodes marking the active ones
    function checkActive(el) {
        const matchesLocation = el.pattern.test(location);
        toggleClasses(el, el.className, matchesLocation);
        toggleClasses(el, el.inactiveClassName, !matchesLocation);
    }

    function toggleClasses(el, className, shouldAdd) {
        (className || '').split(' ').forEach((cls) => {
            if (!cls) {
                return
            }
            // Remove the class firsts
            el.node.classList.remove(cls);

            // If the pattern doesn't match, then set the class
            if (shouldAdd) {
                el.node.classList.add(cls);
            }
        });
    }

    // Listen to changes in the location
    loc.subscribe((value) => {
        // Update the location
        location = value.location + (value.querystring ? '?' + value.querystring : '');

        // Update all nodes
        nodes.map(checkActive);
    });

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* src/assets/btn/Alternative.svelte generated by Svelte v3.53.1 */

    const file$4 = "src/assets/btn/Alternative.svelte";

    function create_fragment$5(ctx) {
    	let button;
    	let t;
    	let button_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(/*name*/ ctx[0]);
    			attr_dev(button, "type", "button");

    			attr_dev(button, "class", button_class_value = /*active*/ ctx[1]
    			? "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
    			: "py-2.5 px-5 mr-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700");

    			add_location(button, file$4, 5, 0, 68);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 1) set_data_dev(t, /*name*/ ctx[0]);

    			if (dirty & /*active*/ 2 && button_class_value !== (button_class_value = /*active*/ ctx[1]
    			? "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
    			: "py-2.5 px-5 mr-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700")) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
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

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Alternative', slots, []);
    	let { name } = $$props;
    	let { active = false } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (name === undefined && !('name' in $$props || $$self.$$.bound[$$self.$$.props['name']])) {
    			console.warn("<Alternative> was created without expected prop 'name'");
    		}
    	});

    	const writable_props = ['name', 'active'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Alternative> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('active' in $$props) $$invalidate(1, active = $$props.active);
    	};

    	$$self.$capture_state = () => ({ name, active });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('active' in $$props) $$invalidate(1, active = $$props.active);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, active, click_handler];
    }

    class Alternative extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { name: 0, active: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Alternative",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get name() {
    		throw new Error("<Alternative>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Alternative>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Alternative>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Alternative>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * 천단위 콤마 형식으로 포맷팅합니다.
     * @param {string} val
     * @param {number} fixed 소수점 표시 자리수, 기본값은 2입니다.
     * @returns 천단위 콤마가 붙은 숫자를 string으로 반환합니다.
     */

    /**
     * form을 제출하고 서버의 응답에 따라 메시지를 띄우고 리다이렉트 동작합니다.
     * @param {element} formElement
     * @returns 요청결과 경고창 또는 페이지 리다이렉트
     */
    function submitForm(formElement) {
      window.event.preventDefault();

      // 함수 호출에 사용된 버튼을 disable로 상태 변경합니다.
      let btn = window.event.target;
      btn.disable = true;

      // formElement에 정의된 method가 없으면 에러를 던집니다.
      if (formElement.method == "") {
        throw new Error("제출 되는 formElement에 method가 없습니다.");
      }

      // html에서 지정한 유효성 검증을 먼저 수행합니다.
      if (!formElement.checkValidity()) {
        formElement.reportValidity();
        return;
      }

      let formData = new FormData(formElement);
      let action = formElement.action;
      let xhr = new XMLHttpRequest();

      xhr.open(formElement.method, action);

      xhr.onload = function () {
        let data = JSON.parse(xhr.responseText);

        if (xhr.status == 200 || xhr.status == 201) {
          alert(data["message"] + "(" + xhr.status + ")");

          if (data["redirect_url"] == "previous" && document.referrer == "") {
            return close(); // 이전 경로로 이동할 때 이전 경로가 없으면 탭을 닫습니다.
          } else if (data["redirect_url"] == "previous") {
            return (window.location.href = document.referrer); // 이전 경로로 이동합니다.
          } else if (data["redirect_url"] == "refresh") {
            return window.location.reload(); // 페이지를 새로고침 합니다.
          } else if (data["redirect_url"] == "") {
            return;
          } else {
            return (window.location.href = data["redirect_url"]);
          }
        } else {
          return alert(data["message"] + "(" + xhr.status + ")");
        }
      };

      xhr.send(formData);
    }

    /* src/components/Form.svelte generated by Svelte v3.53.1 */

    const file$3 = "src/components/Form.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (7:2) {#each form.inputElements as f}
    function create_each_block$1(ctx) {
    	let div;
    	let label;
    	let t0_value = /*f*/ ctx[1].label + "";
    	let t0;
    	let label_for_value;
    	let t1;
    	let input;
    	let input_type_value;
    	let input_id_value;
    	let input_name_value;
    	let input_placeholder_value;
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			attr_dev(label, "for", label_for_value = "id-" + /*f*/ ctx[1].name);
    			attr_dev(label, "class", "block mb-2 text-sm font-medium text-gray-900 dark:text-white");
    			add_location(label, file$3, 8, 6, 200);
    			attr_dev(input, "type", input_type_value = /*f*/ ctx[1].type);
    			attr_dev(input, "class", "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500");
    			attr_dev(input, "id", input_id_value = "id-" + /*f*/ ctx[1].name);
    			attr_dev(input, "name", input_name_value = /*f*/ ctx[1].name);
    			attr_dev(input, "placeholder", input_placeholder_value = /*f*/ ctx[1].placeholder);
    			add_location(input, file$3, 10, 6, 322);
    			attr_dev(div, "class", "mb-6");
    			add_location(div, file$3, 7, 4, 175);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(label, t0);
    			append_dev(div, t1);
    			append_dev(div, input);
    			append_dev(div, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*form*/ 1 && t0_value !== (t0_value = /*f*/ ctx[1].label + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*form*/ 1 && label_for_value !== (label_for_value = "id-" + /*f*/ ctx[1].name)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty & /*form*/ 1 && input_type_value !== (input_type_value = /*f*/ ctx[1].type)) {
    				attr_dev(input, "type", input_type_value);
    			}

    			if (dirty & /*form*/ 1 && input_id_value !== (input_id_value = "id-" + /*f*/ ctx[1].name)) {
    				attr_dev(input, "id", input_id_value);
    			}

    			if (dirty & /*form*/ 1 && input_name_value !== (input_name_value = /*f*/ ctx[1].name)) {
    				attr_dev(input, "name", input_name_value);
    			}

    			if (dirty & /*form*/ 1 && input_placeholder_value !== (input_placeholder_value = /*f*/ ctx[1].placeholder)) {
    				attr_dev(input, "placeholder", input_placeholder_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(7:2) {#each form.inputElements as f}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let form_1;
    	let div;
    	let h3;
    	let t0_value = /*form*/ ctx[0].title + "";
    	let t0;
    	let t1;
    	let form_1_action_value;
    	let each_value = /*form*/ ctx[0].inputElements;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			form_1 = element("form");
    			div = element("div");
    			h3 = element("h3");
    			t0 = text(t0_value);
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h3, file$3, 5, 28, 109);
    			attr_dev(div, "class", "mb-5 text-xl");
    			add_location(div, file$3, 5, 2, 83);
    			attr_dev(form_1, "method", "POST");
    			attr_dev(form_1, "action", form_1_action_value = /*form*/ ctx[0].action);
    			add_location(form_1, file$3, 4, 0, 39);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form_1, anchor);
    			append_dev(form_1, div);
    			append_dev(div, h3);
    			append_dev(h3, t0);
    			append_dev(form_1, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(form_1, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*form*/ 1 && t0_value !== (t0_value = /*form*/ ctx[0].title + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*form*/ 1) {
    				each_value = /*form*/ ctx[0].inputElements;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(form_1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*form*/ 1 && form_1_action_value !== (form_1_action_value = /*form*/ ctx[0].action)) {
    				attr_dev(form_1, "action", form_1_action_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form_1);
    			destroy_each(each_blocks, detaching);
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
    	validate_slots('Form', slots, []);
    	let { form } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (form === undefined && !('form' in $$props || $$self.$$.bound[$$self.$$.props['form']])) {
    			console.warn("<Form> was created without expected prop 'form'");
    		}
    	});

    	const writable_props = ['form'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Form> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('form' in $$props) $$invalidate(0, form = $$props.form);
    	};

    	$$self.$capture_state = () => ({ form });

    	$$self.$inject_state = $$props => {
    		if ('form' in $$props) $$invalidate(0, form = $$props.form);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [form];
    }

    class Form extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { form: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Form",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get form() {
    		throw new Error("<Form>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set form(value) {
    		throw new Error("<Form>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/Sites.svelte generated by Svelte v3.53.1 */
    const file$2 = "src/pages/Sites.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	child_ctx[13] = i;
    	return child_ctx;
    }

    // (241:2) 
    function create_navbar_slot$2(ctx) {
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
    		id: create_navbar_slot$2.name,
    		type: "slot",
    		source: "(241:2) ",
    		ctx
    	});

    	return block;
    }

    // (280:6) {#if modalForm}
    function create_if_block_6(ctx) {
    	let div1;
    	let div0;
    	let button;
    	let svg;
    	let path;
    	let t;
    	let form;
    	let div1_transition;
    	let current;
    	let mounted;
    	let dispose;

    	form = new Form({
    			props: { form: /*formData*/ ctx[3] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t = space();
    			create_component(form.$$.fragment);
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "d", "M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z");
    			add_location(path, file$2, 289, 16, 8319);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke-width", "1.5");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "class", "w-6 h-6");
    			add_location(svg, file$2, 288, 14, 8173);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "absolute text-gray-900 bg-white focus:outline-none hover:text-red-400 focus:ring-2 focus:ring-gray-200 font-medium rounded-full text-sm dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700");
    			set_style(button, "top", "15px");
    			set_style(button, "right", "15px");
    			add_location(button, file$2, 282, 12, 7773);
    			attr_dev(div0, "class", "bg-white border rounded p-4 relative");
    			set_style(div0, "min-width", "500px");
    			set_style(div0, "max-width", "700px");
    			set_style(div0, "max-height", "90%");
    			set_style(div0, "overflow-y", "auto");
    			add_location(div0, file$2, 281, 10, 7632);
    			attr_dev(div1, "class", "flex items-center justify-center");
    			set_style(div1, "position", "fixed");
    			set_style(div1, "top", "0");
    			set_style(div1, "left", "0");
    			set_style(div1, "width", "100%");
    			set_style(div1, "height", "100%");
    			set_style(div1, "overflow", "hidden");
    			set_style(div1, "z-index", "900");
    			set_style(div1, "background-color", "rgba(0, 0, 0, 0.6)");
    			add_location(div1, file$2, 280, 8, 7400);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, button);
    			append_dev(button, svg);
    			append_dev(svg, path);
    			append_dev(div0, t);
    			mount_component(form, div0, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(form.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, { duration: 100 }, true);
    				div1_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(form.$$.fragment, local);
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, { duration: 100 }, false);
    			div1_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(form);
    			if (detaching && div1_transition) div1_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(280:6) {#if modalForm}",
    		ctx
    	});

    	return block;
    }

    // (302:8) {#if search == "" || site.name.includes(search) || site.address.includes(search) || site.owner.includes(search)}
    function create_if_block$1(ctx) {
    	let a;
    	let div0;
    	let h50;
    	let t0_value = /*site*/ ctx[11].name + "";
    	let t0;
    	let h50_class_value;
    	let t1;
    	let span0;
    	let t2_value = /*site*/ ctx[11].owner + "";
    	let t2;
    	let span0_class_value;
    	let t3;
    	let div1;
    	let h51;
    	let t4_value = /*site*/ ctx[11].totalCurrentKW + "";
    	let t4;
    	let t5;
    	let span1;
    	let t7;
    	let t8;
    	let t9;
    	let t10;
    	let mounted;
    	let dispose;
    	let if_block0 = /*site*/ ctx[11].sun && create_if_block_5(ctx);
    	let if_block1 = /*site*/ ctx[11].wind && create_if_block_4(ctx);
    	let if_block2 = /*site*/ ctx[11].ess && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			a = element("a");
    			div0 = element("div");
    			h50 = element("h5");
    			t0 = text(t0_value);
    			t1 = space();
    			span0 = element("span");
    			t2 = text(t2_value);
    			t3 = space();
    			div1 = element("div");
    			h51 = element("h5");
    			t4 = text(t4_value);
    			t5 = space();
    			span1 = element("span");
    			span1.textContent = "kW";
    			t7 = space();
    			if (if_block0) if_block0.c();
    			t8 = space();
    			if (if_block1) if_block1.c();
    			t9 = space();
    			if (if_block2) if_block2.c();
    			t10 = space();

    			attr_dev(h50, "class", h50_class_value = "text-2xl tracking-tight text-gray-900 dark:text-white " + (/*search*/ ctx[1] != '' && /*site*/ ctx[11].name.includes(/*search*/ ctx[1])
    			? 'text-red-500'
    			: ''));

    			add_location(h50, file$2, 304, 14, 9098);

    			attr_dev(span0, "class", span0_class_value = "font-normal dark:text-gray-400 " + (/*search*/ ctx[1] != '' && /*site*/ ctx[11].address.includes(/*search*/ ctx[1])
    			? 'text-red-500'
    			: 'text-gray-600'));

    			add_location(span0, file$2, 307, 14, 9294);
    			attr_dev(div0, "class", "flex justify-between p-4 leading-normal");
    			add_location(div0, file$2, 303, 12, 9030);
    			attr_dev(span1, "class", "text-lg text-slate-500");
    			add_location(span1, file$2, 311, 157, 9668);
    			attr_dev(h51, "class", "mb-10 text-3xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r to-emerald-500 from-emerald-600");
    			add_location(h51, file$2, 311, 14, 9525);
    			attr_dev(div1, "class", "flex flex-col p-4 mb-3");
    			add_location(div1, file$2, 310, 12, 9474);
    			attr_dev(a, "href", "/pop/sites/" + /*site*/ ctx[11].id);
    			attr_dev(a, "class", "flex-col mb-5 bg-white border rounded-lg shadow-md md:flex-row md:w-96 md:mx-5 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700");
    			add_location(a, file$2, 302, 10, 8808);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, div0);
    			append_dev(div0, h50);
    			append_dev(h50, t0);
    			append_dev(div0, t1);
    			append_dev(div0, span0);
    			append_dev(span0, t2);
    			append_dev(a, t3);
    			append_dev(a, div1);
    			append_dev(div1, h51);
    			append_dev(h51, t4);
    			append_dev(h51, t5);
    			append_dev(h51, span1);
    			append_dev(div1, t7);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t8);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t9);
    			if (if_block2) if_block2.m(div1, null);
    			append_dev(a, t10);

    			if (!mounted) {
    				dispose = action_destroyer(link.call(null, a));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*search*/ 2 && h50_class_value !== (h50_class_value = "text-2xl tracking-tight text-gray-900 dark:text-white " + (/*search*/ ctx[1] != '' && /*site*/ ctx[11].name.includes(/*search*/ ctx[1])
    			? 'text-red-500'
    			: ''))) {
    				attr_dev(h50, "class", h50_class_value);
    			}

    			if (dirty & /*search*/ 2 && span0_class_value !== (span0_class_value = "font-normal dark:text-gray-400 " + (/*search*/ ctx[1] != '' && /*site*/ ctx[11].address.includes(/*search*/ ctx[1])
    			? 'text-red-500'
    			: 'text-gray-600'))) {
    				attr_dev(span0, "class", span0_class_value);
    			}

    			if (/*site*/ ctx[11].sun) if_block0.p(ctx, dirty);
    			if (/*site*/ ctx[11].wind) if_block1.p(ctx, dirty);
    			if (/*site*/ ctx[11].ess) if_block2.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(302:8) {#if search == \\\"\\\" || site.name.includes(search) || site.address.includes(search) || site.owner.includes(search)}",
    		ctx
    	});

    	return block;
    }

    // (313:14) {#if site.sun}
    function create_if_block_5(ctx) {
    	let div0;
    	let svg;
    	let path;
    	let t0;
    	let span;
    	let t1_value = /*site*/ ctx[11].sun.current.kw + "";
    	let t1;
    	let t2;
    	let t3;
    	let div2;
    	let div1;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t0 = space();
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = text(" kW");
    			t3 = space();
    			div2 = element("div");
    			div1 = element("div");
    			attr_dev(path, "fill-rule", "evenodd");
    			attr_dev(path, "clip-rule", "evenodd");
    			attr_dev(path, "d", "M0.4 12.8C0.1792 12.8 0 12.6208 0 12.4V0.4C0 0.1792 0.1792 0 0.4 0H15.6C15.8208 0 16 0.1792 16 0.4V12.4C16 12.6208 15.8208 12.8 15.6 12.8H8.8V14.4H12.4C12.6208 14.4 12.8 14.5792 12.8 14.8V15.6C12.8 15.8208 12.6208 16 12.4 16H3.6C3.3792 16 3.2 15.8208 3.2 15.6V14.8C3.2 14.5792 3.3792 14.4 3.6 14.4H7.2V12.8H0.4ZM6.96018 7.19792H1.84018C1.72658 7.19792 1.63138 7.27712 1.60658 7.38272L1.60018 7.43792V10.9579C1.60018 11.0715 1.67938 11.1667 1.78498 11.1915L1.84018 11.1979H6.96018C7.07378 11.1979 7.16898 11.1187 7.19378 11.0131L7.20018 10.9579V7.43792C7.20018 7.30512 7.09298 7.19792 6.96018 7.19792ZM14.1599 7.19792H9.03994C8.92634 7.19792 8.83114 7.27712 8.80634 7.38272L8.79994 7.43792V10.9579C8.79994 11.0715 8.87914 11.1667 8.98474 11.1915L9.03994 11.1979H14.1599C14.2735 11.1979 14.3687 11.1187 14.3935 11.0131L14.3999 10.9579V7.43792C14.3999 7.30512 14.2927 7.19792 14.1599 7.19792ZM6.96018 1.6H1.84018C1.72658 1.6 1.63138 1.6792 1.60658 1.7848L1.60018 1.84V5.36C1.60018 5.4736 1.67938 5.5688 1.78498 5.5936L1.84018 5.6H6.96018C7.07378 5.6 7.16898 5.5208 7.19378 5.4152L7.20018 5.36V1.84C7.20018 1.7072 7.09298 1.6 6.96018 1.6ZM14.1599 1.6H9.03994C8.92634 1.6 8.83114 1.6792 8.80634 1.7848L8.79994 1.84V5.36C8.79994 5.4736 8.87914 5.5688 8.98474 5.5936L9.03994 5.6H14.1599C14.2735 5.6 14.3687 5.5208 14.3935 5.4152L14.3999 5.36V1.84C14.3999 1.7072 14.2927 1.6 14.1599 1.6Z");
    			attr_dev(path, "fill", "gray");
    			add_location(path, file$2, 315, 20, 9931);
    			attr_dev(svg, "width", "22");
    			attr_dev(svg, "height", "22");
    			attr_dev(svg, "viewBox", "0 0 16 16");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$2, 314, 18, 9815);
    			attr_dev(span, "class", "ml-2");
    			add_location(span, file$2, 322, 18, 11527);
    			attr_dev(div0, "class", "flex items-center");
    			add_location(div0, file$2, 313, 16, 9765);
    			attr_dev(div1, "class", "bg-blue-600 h-2.5 rounded-full");
    			set_style(div1, "width", /*site*/ ctx[11].sun.current.kw / /*site*/ ctx[11].sun.ratingOutputKW * 100 + "%");
    			add_location(div1, file$2, 327, 18, 11749);
    			attr_dev(div2, "class", "w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 my-2");
    			add_location(div2, file$2, 326, 16, 11657);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, svg);
    			append_dev(svg, path);
    			append_dev(div0, t0);
    			append_dev(div0, span);
    			append_dev(span, t1);
    			append_dev(span, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(313:14) {#if site.sun}",
    		ctx
    	});

    	return block;
    }

    // (331:14) {#if site.wind}
    function create_if_block_4(ctx) {
    	let div0;
    	let svg;
    	let path;
    	let t0;
    	let span;
    	let t1_value = /*site*/ ctx[11].wind.current.kw + "";
    	let t1;
    	let t2;
    	let t3;
    	let div2;
    	let div1;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t0 = space();
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = text(" kW");
    			t3 = space();
    			div2 = element("div");
    			div1 = element("div");
    			attr_dev(path, "fill-rule", "evenodd");
    			attr_dev(path, "clip-rule", "evenodd");
    			attr_dev(path, "d", "M11.5095 0.333328C11.7909 0.333328 12.0192 0.555592 12.0192 0.829452V7.29891C13.0641 6.34238 14.5381 5.7639 16.1498 5.79069C19.1437 5.84229 21.5912 7.96868 21.6646 10.6408L21.6666 10.8472L21.6575 11.3433C21.6534 11.5864 21.4689 11.7859 21.2303 11.8236L21.1386 11.8305L13.3577 11.6975C14.7032 12.6799 15.5871 14.3339 15.5871 16.2093C15.5871 19.1483 13.4168 21.5446 10.7001 21.6617L10.4901 21.6667H9.98045C9.72969 21.6667 9.52173 21.491 9.47892 21.2598L9.47076 21.1705V14.5899C8.49216 15.3103 7.23526 15.736 5.8489 15.7132C2.69086 15.6586 0.285116 13.297 0.334046 10.5148L0.341182 10.1606C0.346279 9.88669 0.578698 9.6684 0.860047 9.67435L7.52884 9.78747C6.52781 8.79026 5.90293 7.36837 5.90293 5.79069C5.90293 2.77624 8.1843 0.333328 10.9998 0.333328H11.5095ZM11.5095 13.1202V19.2969L11.7062 19.2146C12.6767 18.7631 13.3862 17.7877 13.5238 16.6218L13.5421 16.4015L13.5482 16.209C13.5482 14.8556 12.7806 13.6947 11.6879 13.1956L11.5095 13.1202ZM2.66844 11.4053L2.68373 11.4717C3.06294 12.9303 4.38202 13.9861 5.87847 14.0119L6.05788 14.0099C7.48196 13.9553 8.74905 12.969 9.1619 11.5819L9.18025 11.5164L2.66844 11.4053ZM16.1141 7.77393C14.6768 7.75012 13.4454 8.43576 12.8592 9.42503L12.7715 9.58379L12.7165 9.70088L19.4393 9.81499L19.3884 9.69592C18.9337 8.71161 17.8674 7.96146 16.5534 7.8037L16.319 7.78286L16.1141 7.77393ZM9.98048 8.87782V2.70107L9.96825 2.70603C8.78475 3.16048 7.94172 4.36904 7.94172 5.78994L7.94681 5.98244C8.01511 7.24458 8.75212 8.31521 9.78272 8.79546L9.98048 8.87782Z");
    			attr_dev(path, "fill", "gray");
    			add_location(path, file$2, 333, 20, 12123);
    			attr_dev(svg, "width", "22");
    			attr_dev(svg, "height", "22");
    			attr_dev(svg, "viewBox", "0 0 22 22");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$2, 332, 18, 12007);
    			attr_dev(span, "class", "ml-2");
    			add_location(span, file$2, 340, 18, 13833);
    			attr_dev(div0, "class", "flex items-center");
    			add_location(div0, file$2, 331, 16, 11957);
    			attr_dev(div1, "class", "bg-blue-600 h-2.5 rounded-full");
    			set_style(div1, "width", /*site*/ ctx[11].wind.current.kw / /*site*/ ctx[11].wind.ratingOutputKW * 100 + "%");
    			add_location(div1, file$2, 345, 18, 14056);
    			attr_dev(div2, "class", "w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 my-2");
    			add_location(div2, file$2, 344, 16, 13964);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, svg);
    			append_dev(svg, path);
    			append_dev(div0, t0);
    			append_dev(div0, span);
    			append_dev(span, t1);
    			append_dev(span, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(331:14) {#if site.wind}",
    		ctx
    	});

    	return block;
    }

    // (349:14) {#if site.ess}
    function create_if_block_1(ctx) {
    	let div0;
    	let t;
    	let div2;
    	let div1;

    	function select_block_type(ctx, dirty) {
    		if (/*site*/ ctx[11].ess.current.mode == 1) return create_if_block_2;
    		if (/*site*/ ctx[11].ess.current.mode == 2) return create_if_block_3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			div2 = element("div");
    			div1 = element("div");
    			attr_dev(div0, "class", "flex items-center");
    			add_location(div0, file$2, 349, 16, 14265);

    			attr_dev(div1, "class", "" + ((/*site*/ ctx[11].ess.current.mode == 1
    			? 'bg-green-400'
    			: 'bg-red-400') + " h-2.5 rounded-full"));

    			set_style(div1, "width", (/*site*/ ctx[11].ess.current.mode == 1
    			? /*site*/ ctx[11].ess.current.kw / /*site*/ ctx[11].ess.ratingInputKW * 100
    			: /*site*/ ctx[11].ess.current.kw / /*site*/ ctx[11].ess.ratingOutputKW * 100) + "%");

    			add_location(div1, file$2, 380, 18, 16850);
    			attr_dev(div2, "class", "flex flex-inline w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2 mb-1");
    			add_location(div2, file$2, 379, 16, 16736);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			if (if_block) if_block.m(div0, null);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    		},
    		p: function update(ctx, dirty) {
    			if (if_block) if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);

    			if (if_block) {
    				if_block.d();
    			}

    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(349:14) {#if site.ess}",
    		ctx
    	});

    	return block;
    }

    // (364:55) 
    function create_if_block_3(ctx) {
    	let svg0;
    	let path0;
    	let path1;
    	let t0;
    	let span;
    	let t1_value = /*site*/ ctx[11].ess.current.kw + "";
    	let t1;
    	let t2;
    	let t3;
    	let svg1;
    	let path2;

    	const block = {
    		c: function create() {
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			t0 = space();
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = text(" kW");
    			t3 = space();
    			svg1 = svg_element("svg");
    			path2 = svg_element("path");
    			attr_dev(path0, "d", "M16.67 2.23371e-06C17.4 2.26562e-06 18 0.600002 18 1.33L18 3L20 3L20 7L18 7L18 8.67C18 9.4 17.4 10 16.67 10L1.33 10C0.976143 9.99802 0.637492 9.85588 0.388211 9.60473C0.138929 9.35357 -0.000663569 9.01386 3.43616e-06 8.66L3.75656e-06 1.33C0.00198743 0.976142 0.14412 0.637489 0.395276 0.388208C0.646431 0.138926 0.98614 -0.000665441 1.34 1.56362e-06L16.67 2.23371e-06ZM15 2.5L2.5 2.5L2.5 7.5L15 7.5L15 2.5Z");
    			attr_dev(path0, "fill", "#ED8987");
    			add_location(path0, file$2, 365, 22, 15565);
    			attr_dev(path1, "fill-rule", "evenodd");
    			attr_dev(path1, "clip-rule", "evenodd");
    			attr_dev(path1, "d", "M4.375 3.75L5.625 3.75L5.625 6.25L4.375 6.25L4.375 3.75Z");
    			attr_dev(path1, "fill", "#ED8987");
    			attr_dev(path1, "stroke", "#ED8987");
    			add_location(path1, file$2, 369, 22, 16092);
    			attr_dev(svg0, "width", "22");
    			attr_dev(svg0, "height", "11");
    			attr_dev(svg0, "viewBox", "0 0 20 10");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg0, file$2, 364, 20, 15447);
    			attr_dev(span, "class", "ml-2");
    			add_location(span, file$2, 371, 20, 16281);
    			attr_dev(path2, "stroke-linecap", "round");
    			attr_dev(path2, "stroke-linejoin", "round");
    			attr_dev(path2, "d", "M8.25 6.75L12 3m0 0l3.75 3.75M12 3v18");
    			add_location(path2, file$2, 375, 22, 16548);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "stroke-width", "1.5");
    			attr_dev(svg1, "stroke", "currentColor");
    			attr_dev(svg1, "class", "w-4 h-4");
    			add_location(svg1, file$2, 374, 20, 16396);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg0, anchor);
    			append_dev(svg0, path0);
    			append_dev(svg0, path1);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, span, anchor);
    			append_dev(span, t1);
    			append_dev(span, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, svg1, anchor);
    			append_dev(svg1, path2);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(svg1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(364:55) ",
    		ctx
    	});

    	return block;
    }

    // (351:18) {#if site.ess.current.mode == 1}
    function create_if_block_2(ctx) {
    	let svg0;
    	let path0;
    	let t0;
    	let span;
    	let t1_value = /*site*/ ctx[11].ess.current.kw + "";
    	let t1;
    	let t2;
    	let t3;
    	let svg1;
    	let path1;

    	const block = {
    		c: function create() {
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t0 = space();
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = text(" kW");
    			t3 = space();
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M18 8.67L18 7L20 7L20 3L18 3L18 1.33C18 0.6 17.4 -1.1365e-07 16.67 -1.45559e-07L1.34 -8.15655e-07C0.599998 -8.48001e-07 -1.93358e-06 0.599999 -1.96548e-06 1.33L-2.28589e-06 8.66C-0.000669873 9.01386 0.138925 9.35357 0.388206 9.60473C0.637487 9.85588 0.976139 9.99802 1.33 10L16.67 10C17.4 10 18 9.4 18 8.67ZM2 4L7.5 4L7.5 2L15 6L9.5 6L9.5 8L2 4Z");
    			attr_dev(path0, "fill", "green");
    			add_location(path0, file$2, 352, 22, 14486);
    			attr_dev(svg0, "width", "22");
    			attr_dev(svg0, "height", "11");
    			attr_dev(svg0, "viewBox", "0 0 20 10");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg0, file$2, 351, 20, 14368);
    			attr_dev(span, "class", "ml-2");
    			add_location(span, file$2, 357, 20, 14975);
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "d", "M15.75 17.25L12 21m0 0l-3.75-3.75M12 21V3");
    			add_location(path1, file$2, 361, 22, 15242);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "stroke-width", "1.5");
    			attr_dev(svg1, "stroke", "currentColor");
    			attr_dev(svg1, "class", "w-4 h-4");
    			add_location(svg1, file$2, 360, 20, 15090);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg0, anchor);
    			append_dev(svg0, path0);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, span, anchor);
    			append_dev(span, t1);
    			append_dev(span, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, svg1, anchor);
    			append_dev(svg1, path1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(svg1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(351:18) {#if site.ess.current.mode == 1}",
    		ctx
    	});

    	return block;
    }

    // (301:6) {#each siteList.data as site, i}
    function create_each_block(ctx) {
    	let show_if = /*search*/ ctx[1] == "" || /*site*/ ctx[11].name.includes(/*search*/ ctx[1]) || /*site*/ ctx[11].address.includes(/*search*/ ctx[1]) || /*site*/ ctx[11].owner.includes(/*search*/ ctx[1]);
    	let if_block_anchor;
    	let if_block = show_if && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*search*/ 2) show_if = /*search*/ ctx[1] == "" || /*site*/ ctx[11].name.includes(/*search*/ ctx[1]) || /*site*/ ctx[11].address.includes(/*search*/ ctx[1]) || /*site*/ ctx[11].owner.includes(/*search*/ ctx[1]);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(301:6) {#each siteList.data as site, i}",
    		ctx
    	});

    	return block;
    }

    // (243:2) 
    function create_content_slot$2(ctx) {
    	let div5;
    	let div3;
    	let div0;
    	let h3;
    	let span0;
    	let t1;
    	let span1;
    	let alternative;
    	let t2;
    	let form;
    	let label;
    	let t4;
    	let div2;
    	let div1;
    	let svg;
    	let path;
    	let t5;
    	let input;
    	let t6;
    	let t7;
    	let div4;
    	let current;
    	let mounted;
    	let dispose;

    	alternative = new Alternative({
    			props: {
    				name: /*$mobileView*/ ctx[2] ? "+ 추가" : "+ 새로 등록하기"
    			},
    			$$inline: true
    		});

    	alternative.$on("click", /*click_handler*/ ctx[5]);
    	let if_block = /*modalForm*/ ctx[0] && create_if_block_6(ctx);
    	let each_value = /*siteList*/ ctx[4].data;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			span0 = element("span");
    			span0.textContent = `${/*siteList*/ ctx[4].data.length}`;
    			t1 = text("개의 발전소가 있습니다.\n          ");
    			span1 = element("span");
    			create_component(alternative.$$.fragment);
    			t2 = space();
    			form = element("form");
    			label = element("label");
    			label.textContent = "검색";
    			t4 = space();
    			div2 = element("div");
    			div1 = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t5 = space();
    			input = element("input");
    			t6 = space();
    			if (if_block) if_block.c();
    			t7 = space();
    			div4 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(span0, "class", "text-red-700");
    			add_location(span0, file$2, 246, 10, 5841);
    			attr_dev(span1, "class", "ml-2 md:ml-3");
    			add_location(span1, file$2, 247, 10, 5921);
    			attr_dev(h3, "class", "text-lg max-sm:pt-5");
    			add_location(h3, file$2, 245, 8, 5798);
    			attr_dev(div0, "class", "sm:flex-auto md:flex-none md:w-96");
    			add_location(div0, file$2, 244, 6, 5742);
    			attr_dev(label, "for", "simple-search");
    			attr_dev(label, "class", "sr-only");
    			add_location(label, file$2, 259, 8, 6266);
    			attr_dev(path, "fill-rule", "evenodd");
    			attr_dev(path, "d", "M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z");
    			attr_dev(path, "clip-rule", "evenodd");
    			add_location(path, file$2, 263, 15, 6627);
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "class", "w-5 h-5 text-gray-500 dark:text-gray-400");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$2, 262, 12, 6464);
    			attr_dev(div1, "class", "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none");
    			add_location(div1, file$2, 261, 10, 6369);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "id", "simple-search");
    			attr_dev(input, "class", "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500");
    			attr_dev(input, "placeholder", "Search");
    			input.required = true;
    			add_location(input, file$2, 266, 10, 6839);
    			attr_dev(div2, "class", "relative md:w-96");
    			add_location(div2, file$2, 260, 8, 6328);
    			attr_dev(form, "class", "sm:flex-auto md:flex-initial md:ml-4 max-sm:my-2");
    			attr_dev(form, "role", "search");
    			add_location(form, file$2, 258, 6, 6180);
    			attr_dev(div3, "class", "flex max-sm:flex-col-reverse justify-between my-4 max-sm:px-3 md:px-10");
    			add_location(div3, file$2, 243, 4, 5651);
    			attr_dev(div4, "class", "flex max-sm:flex-col flex-wrap px-3");
    			add_location(div4, file$2, 299, 4, 8588);
    			attr_dev(div5, "slot", "content");
    			add_location(div5, file$2, 242, 2, 5626);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h3);
    			append_dev(h3, span0);
    			append_dev(h3, t1);
    			append_dev(h3, span1);
    			mount_component(alternative, span1, null);
    			append_dev(div3, t2);
    			append_dev(div3, form);
    			append_dev(form, label);
    			append_dev(form, t4);
    			append_dev(form, div2);
    			append_dev(div2, div1);
    			append_dev(div1, svg);
    			append_dev(svg, path);
    			append_dev(div2, t5);
    			append_dev(div2, input);
    			append_dev(div3, t6);
    			if (if_block) if_block.m(div3, null);
    			append_dev(div5, t7);
    			append_dev(div5, div4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div4, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(input, "keyup", /*keyup_handler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const alternative_changes = {};
    			if (dirty & /*$mobileView*/ 4) alternative_changes.name = /*$mobileView*/ ctx[2] ? "+ 추가" : "+ 새로 등록하기";
    			alternative.$set(alternative_changes);

    			if (/*modalForm*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*modalForm*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_6(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div3, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*siteList, search*/ 18) {
    				each_value = /*siteList*/ ctx[4].data;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div4, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(alternative.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(alternative.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_component(alternative);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot$2.name,
    		type: "slot",
    		source: "(243:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let atype;
    	let current;

    	atype = new Atype({
    			props: {
    				$$slots: {
    					content: [create_content_slot$2],
    					navbar: [create_navbar_slot$2]
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

    			if (dirty & /*$$scope, search, modalForm, $mobileView*/ 16391) {
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
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function timeout(ms) {
    	return new Promise(resolve => setTimeout(resolve, ms));
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $mobileView;
    	validate_store(mobileView, 'mobileView');
    	component_subscribe($$self, mobileView, $$value => $$invalidate(2, $mobileView = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Sites', slots, []);

    	let formData = {
    		title: "새로운 발전소 추가하기",
    		action: "/",
    		inputElements: [
    			{
    				label: "발전소 이름",
    				name: "siteName",
    				type: "text",
    				placeholder: "발전소 이름을 입력하세요."
    			},
    			{
    				label: "자원보유자",
    				name: "owner",
    				type: "text",
    				placeholder: "개인 또는 법인명을 입력하세요."
    			},
    			{
    				label: "관리자",
    				name: "management",
    				type: "text",
    				placeholder: "직영 또는 위탁관리(법인)을 입력하세요."
    			},
    			{
    				label: "기타",
    				name: "memo",
    				type: "textarea",
    				placeholder: "기타 메모를 입력하세요."
    			}
    		]
    	};

    	let siteList = {
    		count: 7,
    		grandTotalMainRatingOutputKW: 3000,
    		grandTotalSubRatingOutputKW: 3000,
    		grandTotalRatingOutputKW: 6000,
    		maxCurrentKW: 350,
    		minCurrentKW: 200,
    		data: [
    			{
    				id: 1,
    				address: "서울 중구 세종대로7길 25",
    				name: "한빛1호",
    				owner: "중부발전",
    				mainRatingOutputKW: 500,
    				subRatingOutputKW: 500,
    				totalRatingOutputKW: 1000,
    				totalCurrentKW: 150,
    				sun: {
    					ratingOutputKW: 500,
    					current: {
    						timestamp: new Date("2022-12-08 23:00:00"),
    						kw: 350
    					}
    				},
    				ess: {
    					ratingInputKW: 500,
    					ratingOutputKW: 500,
    					current: {
    						timestamp: new Date("2022-12-08 23:00:00"),
    						mode: 1,
    						kw: 200
    					}
    				}
    			},
    			{
    				id: 2,
    				address: "서울 종로구 종로 33",
    				name: "한빛2호",
    				owner: "중부발전",
    				mainRatingOutputKW: 350,
    				totalRatingOutputKW: 350,
    				totalCurrentKW: 200,
    				sun: {
    					ratingOutputKW: 350,
    					current: {
    						timestamp: new Date("2022-12-08 23:00:00"),
    						kw: 200
    					}
    				}
    			},
    			{
    				id: 3,
    				address: "서울 서초구 서초대로52길 12",
    				name: "울진1호",
    				owner: "한수원",
    				mainRatingOutputKW: 300,
    				subRatingOutputKW: 500,
    				totalRatingOutputKW: 800,
    				totalCurrentKW: 150,
    				sun: {
    					ratingOutputKW: 300,
    					current: {
    						timestamp: new Date("2022-12-08 23:00:00"),
    						kw: 250
    					}
    				},
    				ess: {
    					ratingInputKW: 500,
    					ratingOutputKW: 500,
    					current: {
    						timestamp: new Date("2022-12-08 23:00:00"),
    						mode: 1,
    						kw: 200
    					}
    				}
    			},
    			{
    				id: 4,
    				address: "부산 해운대구 달맞이길 30",
    				name: "울진2호",
    				owner: "한수원",
    				mainRatingOutputKW: 500,
    				subRatingOutputKW: 500,
    				totalRatingOutputKW: 1000,
    				totalCurrentKW: 500,
    				sun: {
    					ratingOutputKW: 500,
    					current: {
    						timestamp: new Date("2022-12-08 23:00:00"),
    						kw: 300
    					}
    				},
    				ess: {
    					ratingInputKW: 500,
    					ratingOutputKW: 500,
    					current: {
    						timestamp: new Date("2022-12-08 23:00:00"),
    						mode: 2,
    						kw: 200
    					}
    				}
    			},
    			{
    				id: 5,
    				address: "광주 광산구 상무대로 420-25",
    				name: "순천1호",
    				owner: "남부발전",
    				mainRatingOutputKW: 500,
    				subRatingOutputKW: 500,
    				totalRatingOutputKW: 1000,
    				totalCurrentKW: 300,
    				sun: {
    					ratingOutputKW: 500,
    					current: {
    						timestamp: new Date("2022-12-08 23:00:00"),
    						kw: 200
    					}
    				},
    				ess: {
    					ratingInputKW: 500,
    					ratingOutputKW: 500,
    					current: {
    						timestamp: new Date("2022-12-08 23:00:00"),
    						mode: 2,
    						kw: 100
    					}
    				}
    			},
    			{
    				id: 6,
    				address: "강원 정선군 사북읍 하이원길 265",
    				name: "순천2호",
    				owner: "남부발전",
    				mainRatingOutputKW: 500,
    				totalRatingOutputKW: 500,
    				totalCurrentKW: 200,
    				sun: {
    					ratingOutputKW: 500,
    					current: {
    						timestamp: new Date("2022-12-08 23:00:00"),
    						kw: 200
    					}
    				}
    			},
    			{
    				id: 7,
    				address: "대전 유성구 대덕대로 480",
    				name: "순천3호",
    				owner: "남부발전",
    				mainRatingOutputKW: 500,
    				subRatingOutputKW: 500,
    				totalRatingOutputKW: 1000,
    				totalCurrentKW: 270,
    				sun: {
    					ratingOutputKW: 500,
    					current: {
    						timestamp: new Date("2022-12-08 23:00:00"),
    						kw: 270
    					}
    				},
    				ess: {
    					ratingInputKW: 500,
    					ratingOutputKW: 500,
    					current: {
    						timestamp: new Date("2022-12-08 23:00:00"),
    						mode: 1,
    						kw: 0
    					}
    				}
    			}
    		]
    	};

    	let modalForm = false;
    	let search = "";
    	let detailData;
    	let promise = getData();

    	async function getData() {
    		// let xhr = new XMLHttpRequest();
    		// xhr.open("get", "/getAllSites");  // api를 통해 데이터 획득
    		// if (xhr.status == 200) {
    		// return JSON.parse(xhr.responseText);  // 응답이 정상이면 json 반환
    		// }
    		await timeout(3000);

    		let result = detailData;
    		return result;
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Sites> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(0, modalForm = true);
    	};

    	const keyup_handler = e => {
    		$$invalidate(1, search = e.target.value);
    	};

    	const click_handler_1 = () => $$invalidate(0, modalForm = false);

    	$$self.$capture_state = () => ({
    		Navbar,
    		Atype,
    		link,
    		fade,
    		Form,
    		Alternative,
    		mobileView,
    		formData,
    		siteList,
    		modalForm,
    		search,
    		detailData,
    		promise,
    		getData,
    		timeout,
    		$mobileView
    	});

    	$$self.$inject_state = $$props => {
    		if ('formData' in $$props) $$invalidate(3, formData = $$props.formData);
    		if ('siteList' in $$props) $$invalidate(4, siteList = $$props.siteList);
    		if ('modalForm' in $$props) $$invalidate(0, modalForm = $$props.modalForm);
    		if ('search' in $$props) $$invalidate(1, search = $$props.search);
    		if ('detailData' in $$props) detailData = $$props.detailData;
    		if ('promise' in $$props) promise = $$props.promise;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		modalForm,
    		search,
    		$mobileView,
    		formData,
    		siteList,
    		click_handler,
    		keyup_handler,
    		click_handler_1
    	];
    }

    class Sites extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Sites",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/pages/Signin.svelte generated by Svelte v3.53.1 */
    const file$1 = "src/pages/Signin.svelte";

    // (11:2) 
    function create_navbar_slot$1(ctx) {
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
    		id: create_navbar_slot$1.name,
    		type: "slot",
    		source: "(11:2) ",
    		ctx
    	});

    	return block;
    }

    // (13:2) 
    function create_content_slot$1(ctx) {
    	let div9;
    	let div8;
    	let div7;
    	let div6;
    	let h4;
    	let t1;
    	let form_1;
    	let div0;
    	let label0;
    	let t3;
    	let input0;
    	let t4;
    	let div1;
    	let label1;
    	let t6;
    	let input1;
    	let t7;
    	let div3;
    	let div2;
    	let input2;
    	let t8;
    	let label2;
    	let t10;
    	let div4;
    	let button;
    	let t12;
    	let div5;
    	let a0;
    	let t14;
    	let span0;
    	let t16;
    	let a1;
    	let t18;
    	let span1;
    	let t20;
    	let a2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div8 = element("div");
    			div7 = element("div");
    			div6 = element("div");
    			h4 = element("h4");
    			h4.textContent = "🎮 로그인";
    			t1 = space();
    			form_1 = element("form");
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "이메일";
    			t3 = space();
    			input0 = element("input");
    			t4 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "패스워드";
    			t6 = space();
    			input1 = element("input");
    			t7 = space();
    			div3 = element("div");
    			div2 = element("div");
    			input2 = element("input");
    			t8 = space();
    			label2 = element("label");
    			label2.textContent = "이메일 저장하기";
    			t10 = space();
    			div4 = element("div");
    			button = element("button");
    			button.textContent = "로그인";
    			t12 = space();
    			div5 = element("div");
    			a0 = element("a");
    			a0.textContent = "회원가입";
    			t14 = space();
    			span0 = element("span");
    			span0.textContent = "|";
    			t16 = space();
    			a1 = element("a");
    			a1.textContent = "아이디 찾기";
    			t18 = space();
    			span1 = element("span");
    			span1.textContent = "|";
    			t20 = space();
    			a2 = element("a");
    			a2.textContent = "비밀번호 찾기";
    			attr_dev(h4, "class", "card-title mb-5");
    			add_location(h4, file$1, 16, 10, 370);
    			attr_dev(label0, "for", "email");
    			add_location(label0, file$1, 19, 14, 519);
    			attr_dev(input0, "type", "email");
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "id", "email");
    			attr_dev(input0, "name", "email");
    			attr_dev(input0, "placeholder", "abc123@gmail.com");
    			add_location(input0, file$1, 20, 14, 564);
    			attr_dev(div0, "class", "mb-3");
    			add_location(div0, file$1, 18, 12, 486);
    			attr_dev(label1, "for", "password");
    			add_location(label1, file$1, 23, 14, 727);
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "id", "password");
    			attr_dev(input1, "name", "password");
    			attr_dev(input1, "placeholder", "password");
    			add_location(input1, file$1, 24, 14, 776);
    			attr_dev(div1, "class", "mb-3");
    			add_location(div1, file$1, 22, 12, 694);
    			attr_dev(input2, "class", "form-check-input");
    			attr_dev(input2, "type", "checkbox");
    			attr_dev(input2, "id", "saveEmailCheck");
    			add_location(input2, file$1, 28, 16, 1012);
    			attr_dev(label2, "class", "form-check-label fw-light");
    			attr_dev(label2, "for", "saveEmailCheck");
    			add_location(label2, file$1, 29, 16, 1099);
    			attr_dev(div2, "class", "form-check");
    			add_location(div2, file$1, 27, 14, 971);
    			attr_dev(div3, "class", "d-flex justify-content-between mb-4");
    			add_location(div3, file$1, 26, 12, 907);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "btn btn-primary px-4");
    			add_location(button, file$1, 33, 14, 1278);
    			attr_dev(div4, "class", "d-grid gap-2 my-5");
    			add_location(div4, file$1, 32, 12, 1232);
    			attr_dev(form_1, "method", "post");
    			attr_dev(form_1, "action", "/login");
    			add_location(form_1, file$1, 17, 10, 420);
    			attr_dev(a0, "href", "/signup");
    			attr_dev(a0, "class", "card-link mx-4 text-decoration-none");
    			add_location(a0, file$1, 43, 12, 1583);
    			attr_dev(span0, "class", "text-muted");
    			add_location(span0, file$1, 44, 12, 1675);
    			attr_dev(a1, "href", "/");
    			attr_dev(a1, "class", "card-link mx-4 text-decoration-none");
    			add_location(a1, file$1, 45, 12, 1721);
    			attr_dev(span1, "class", "text-muted");
    			add_location(span1, file$1, 46, 12, 1800);
    			attr_dev(a2, "href", "/");
    			attr_dev(a2, "class", "card-link mx-4 text-decoration-none");
    			add_location(a2, file$1, 47, 12, 1846);
    			attr_dev(div5, "class", "my-5 text-center");
    			add_location(div5, file$1, 42, 10, 1540);
    			attr_dev(div6, "class", "card-body");
    			add_location(div6, file$1, 15, 8, 336);
    			attr_dev(div7, "class", "card svelte-vk3cwv");
    			add_location(div7, file$1, 14, 6, 309);
    			attr_dev(div8, "class", "container svelte-vk3cwv");
    			add_location(div8, file$1, 13, 4, 279);
    			attr_dev(div9, "slot", "content");
    			add_location(div9, file$1, 12, 2, 254);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div8);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div6, h4);
    			append_dev(div6, t1);
    			append_dev(div6, form_1);
    			append_dev(form_1, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t3);
    			append_dev(div0, input0);
    			append_dev(form_1, t4);
    			append_dev(form_1, div1);
    			append_dev(div1, label1);
    			append_dev(div1, t6);
    			append_dev(div1, input1);
    			append_dev(form_1, t7);
    			append_dev(form_1, div3);
    			append_dev(div3, div2);
    			append_dev(div2, input2);
    			append_dev(div2, t8);
    			append_dev(div2, label2);
    			append_dev(form_1, t10);
    			append_dev(form_1, div4);
    			append_dev(div4, button);
    			/*form_1_binding*/ ctx[2](form_1);
    			append_dev(div6, t12);
    			append_dev(div6, div5);
    			append_dev(div5, a0);
    			append_dev(div5, t14);
    			append_dev(div5, span0);
    			append_dev(div5, t16);
    			append_dev(div5, a1);
    			append_dev(div5, t18);
    			append_dev(div5, span1);
    			append_dev(div5, t20);
    			append_dev(div5, a2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", prevent_default(/*click_handler*/ ctx[1]), false, true, false),
    					action_destroyer(link.call(null, a0))
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			/*form_1_binding*/ ctx[2](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot$1.name,
    		type: "slot",
    		source: "(13:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let atype;
    	let current;

    	atype = new Atype({
    			props: {
    				$$slots: {
    					content: [create_content_slot$1],
    					navbar: [create_navbar_slot$1]
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

    			if (dirty & /*$$scope, form*/ 9) {
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
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Signin', slots, []);
    	let form;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Signin> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		submitForm(form);
    	};

    	function form_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			form = $$value;
    			$$invalidate(0, form);
    		});
    	}

    	$$self.$capture_state = () => ({ Atype, Navbar, submitForm, link, form });

    	$$self.$inject_state = $$props => {
    		if ('form' in $$props) $$invalidate(0, form = $$props.form);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [form, click_handler, form_1_binding];
    }

    class Signin extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Signin",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/pages/Signup.svelte generated by Svelte v3.53.1 */
    const file = "src/pages/Signup.svelte";

    // (60:2) 
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
    		source: "(60:2) ",
    		ctx
    	});

    	return block;
    }

    // (62:2) 
    function create_content_slot(ctx) {
    	let div16;
    	let div15;
    	let div14;
    	let div13;
    	let h4;
    	let t0;
    	let i;
    	let t1;
    	let form_1;
    	let div1;
    	let input0;
    	let t2;
    	let label0;
    	let t4;
    	let div0;
    	let t6;
    	let div5;
    	let input1;
    	let t7;
    	let label1;
    	let t9;
    	let div2;
    	let t11;
    	let div3;
    	let t13;
    	let div4;
    	let t15;
    	let div8;
    	let input2;
    	let t16;
    	let label2;
    	let t18;
    	let div6;
    	let t20;
    	let div7;
    	let t22;
    	let div10;
    	let input3;
    	let t23;
    	let label3;
    	let t25;
    	let div9;
    	let t27;
    	let div11;
    	let input4;
    	let t28;
    	let label4;
    	let t30;
    	let div12;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div16 = element("div");
    			div15 = element("div");
    			div14 = element("div");
    			div13 = element("div");
    			h4 = element("h4");
    			t0 = text("회원가입 ");
    			i = element("i");
    			t1 = space();
    			form_1 = element("form");
    			div1 = element("div");
    			input0 = element("input");
    			t2 = space();
    			label0 = element("label");
    			label0.textContent = "이메일";
    			t4 = space();
    			div0 = element("div");
    			div0.textContent = "이메일 형식에 맞춰 입력하세요.";
    			t6 = space();
    			div5 = element("div");
    			input1 = element("input");
    			t7 = space();
    			label1 = element("label");
    			label1.textContent = "패스워드";
    			t9 = space();
    			div2 = element("div");
    			div2.textContent = "문자, 숫자, 특수문자 포함 8~20자리를 입력하세요.(괄호 제외)";
    			t11 = space();
    			div3 = element("div");
    			div3.textContent = "사용 가능한 비밀번호 입니다.";
    			t13 = space();
    			div4 = element("div");
    			div4.textContent = "비밀번호 형식에 따라 다시 입력하세요.";
    			t15 = space();
    			div8 = element("div");
    			input2 = element("input");
    			t16 = space();
    			label2 = element("label");
    			label2.textContent = "패스워드 재입력";
    			t18 = space();
    			div6 = element("div");
    			div6.textContent = "비밀번호가 일치합니다.";
    			t20 = space();
    			div7 = element("div");
    			div7.textContent = "비밀번호가 일치하지 않습니다.";
    			t22 = space();
    			div10 = element("div");
    			input3 = element("input");
    			t23 = space();
    			label3 = element("label");
    			label3.textContent = "회사명";
    			t25 = space();
    			div9 = element("div");
    			div9.textContent = "소속된 회사 이름을 입력하세요.(권장)";
    			t27 = space();
    			div11 = element("div");
    			input4 = element("input");
    			t28 = space();
    			label4 = element("label");
    			label4.textContent = "개인정보이용 및 이메일 수신에 동의합니다.(필수)";
    			t30 = space();
    			div12 = element("div");
    			button = element("button");
    			button.textContent = "가입하기";
    			attr_dev(i, "class", "bi bi-person-plus-fill");
    			add_location(i, file, 65, 43, 1497);
    			attr_dev(h4, "class", "card-title mb-4");
    			add_location(h4, file, 65, 10, 1464);
    			attr_dev(input0, "type", "email");
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "id", "email");
    			attr_dev(input0, "name", "email");
    			attr_dev(input0, "placeholder", "abc123@gmail.com");
    			input0.required = true;
    			add_location(input0, file, 69, 14, 1664);
    			attr_dev(label0, "for", "email");
    			add_location(label0, file, 70, 14, 1831);
    			attr_dev(div0, "class", "invalid-feedback");
    			add_location(div0, file, 71, 14, 1876);
    			attr_dev(div1, "class", "mb-4 form-floating");
    			add_location(div1, file, 68, 12, 1617);
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "id", "password");
    			attr_dev(input1, "name", "password");
    			attr_dev(input1, "placeholder", "패스워드");
    			attr_dev(input1, "pattern", passwordPattern);
    			input1.required = true;
    			add_location(input1, file, 75, 14, 2009);
    			attr_dev(label1, "for", "password");
    			add_location(label1, file, 76, 14, 2221);
    			attr_dev(div2, "class", "form-text");
    			add_location(div2, file, 77, 14, 2270);
    			attr_dev(div3, "class", "valid-feedback");
    			add_location(div3, file, 78, 14, 2351);
    			attr_dev(div4, "class", "invalid-feedback");
    			add_location(div4, file, 79, 14, 2416);
    			attr_dev(div5, "class", "mb-2 form-floating");
    			add_location(div5, file, 74, 12, 1962);
    			attr_dev(input2, "type", "password");
    			attr_dev(input2, "class", "form-control");
    			attr_dev(input2, "id", "passwordConfirm");
    			attr_dev(input2, "name", "passwordConfirm");
    			attr_dev(input2, "placeholder", "패스워드 재확인");
    			attr_dev(input2, "pattern", passwordPattern);
    			input2.required = true;
    			add_location(input2, file, 83, 14, 2553);
    			attr_dev(label2, "for", "passwordConfirm");
    			add_location(label2, file, 84, 14, 2791);
    			attr_dev(div6, "class", "valid-feedback");
    			add_location(div6, file, 85, 14, 2851);
    			attr_dev(div7, "class", "invalid-feedback");
    			add_location(div7, file, 86, 14, 2912);
    			attr_dev(div8, "class", "mb-4 form-floating");
    			add_location(div8, file, 82, 12, 2506);
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "class", "form-control");
    			attr_dev(input3, "id", "organization");
    			attr_dev(input3, "name", "organization");
    			attr_dev(input3, "placeholder", "회사명");
    			add_location(input3, file, 90, 14, 3044);
    			attr_dev(label3, "for", "organization");
    			add_location(label3, file, 91, 14, 3157);
    			attr_dev(div9, "class", "form-text");
    			add_location(div9, file, 92, 14, 3209);
    			attr_dev(div10, "class", "mb-4 form-floating");
    			add_location(div10, file, 89, 12, 2997);
    			attr_dev(input4, "class", "form-check-input");
    			attr_dev(input4, "type", "checkbox");
    			attr_dev(input4, "id", "agree");
    			input4.required = true;
    			add_location(input4, file, 96, 14, 3336);
    			attr_dev(label4, "class", "form-check-label");
    			attr_dev(label4, "for", "agree");
    			add_location(label4, file, 97, 14, 3441);
    			attr_dev(div11, "class", "form-check mb-4");
    			add_location(div11, file, 95, 12, 3292);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "btn btn-primary");
    			add_location(button, file, 101, 14, 3595);
    			attr_dev(div12, "class", "d-grid gap-2");
    			add_location(div12, file, 100, 12, 3554);
    			attr_dev(form_1, "method", "POST");
    			attr_dev(form_1, "action", "/signup");
    			add_location(form_1, file, 67, 10, 1550);
    			attr_dev(div13, "class", "card-body");
    			add_location(div13, file, 64, 8, 1430);
    			attr_dev(div14, "class", "card svelte-1199ftc");
    			add_location(div14, file, 63, 6, 1403);
    			attr_dev(div15, "class", "container svelte-1199ftc");
    			add_location(div15, file, 62, 4, 1373);
    			attr_dev(div16, "slot", "content");
    			add_location(div16, file, 61, 2, 1348);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div16, anchor);
    			append_dev(div16, div15);
    			append_dev(div15, div14);
    			append_dev(div14, div13);
    			append_dev(div13, h4);
    			append_dev(h4, t0);
    			append_dev(h4, i);
    			append_dev(div13, t1);
    			append_dev(div13, form_1);
    			append_dev(form_1, div1);
    			append_dev(div1, input0);
    			append_dev(div1, t2);
    			append_dev(div1, label0);
    			append_dev(div1, t4);
    			append_dev(div1, div0);
    			append_dev(form_1, t6);
    			append_dev(form_1, div5);
    			append_dev(div5, input1);
    			set_input_value(input1, /*password*/ ctx[1]);
    			append_dev(div5, t7);
    			append_dev(div5, label1);
    			append_dev(div5, t9);
    			append_dev(div5, div2);
    			append_dev(div5, t11);
    			append_dev(div5, div3);
    			append_dev(div5, t13);
    			append_dev(div5, div4);
    			append_dev(form_1, t15);
    			append_dev(form_1, div8);
    			append_dev(div8, input2);
    			set_input_value(input2, /*confirm*/ ctx[2]);
    			append_dev(div8, t16);
    			append_dev(div8, label2);
    			append_dev(div8, t18);
    			append_dev(div8, div6);
    			append_dev(div8, t20);
    			append_dev(div8, div7);
    			append_dev(form_1, t22);
    			append_dev(form_1, div10);
    			append_dev(div10, input3);
    			append_dev(div10, t23);
    			append_dev(div10, label3);
    			append_dev(div10, t25);
    			append_dev(div10, div9);
    			append_dev(form_1, t27);
    			append_dev(form_1, div11);
    			append_dev(div11, input4);
    			append_dev(div11, t28);
    			append_dev(div11, label4);
    			append_dev(form_1, t30);
    			append_dev(form_1, div12);
    			append_dev(div12, button);
    			/*form_1_binding*/ ctx[7](form_1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "focus", initValidation, false, false, false),
    					listen_dev(input0, "blur", validate, false, false, false),
    					listen_dev(input1, "focus", initValidation, false, false, false),
    					listen_dev(input1, "blur", validate, false, false, false),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[5]),
    					listen_dev(input2, "focus", initValidation, false, false, false),
    					listen_dev(input2, "blur", /*passwordConfirmFn*/ ctx[3], false, false, false),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[6]),
    					listen_dev(input4, "click", validate, false, false, false),
    					listen_dev(button, "click", prevent_default(/*submit*/ ctx[4]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*password*/ 2 && input1.value !== /*password*/ ctx[1]) {
    				set_input_value(input1, /*password*/ ctx[1]);
    			}

    			if (dirty & /*confirm*/ 4 && input2.value !== /*confirm*/ ctx[2]) {
    				set_input_value(input2, /*confirm*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div16);
    			/*form_1_binding*/ ctx[7](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot.name,
    		type: "slot",
    		source: "(62:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let atype;
    	let current;

    	atype = new Atype({
    			props: {
    				$$slots: {
    					content: [create_content_slot],
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

    			if (dirty & /*$$scope, form, confirm, password*/ 519) {
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
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const passwordPattern = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&^])[A-Za-z\\d$@$!%*#?&^]{8,20}$";

    /**
     * 폼 인풋 엘리먼트의 부모 엘리먼트에 'was-validated' 클래스를 추가합니다.(부트스트랩용)
     * @param {Event & {target: HTMLInputElement}} e event
     */
    function validate(e) {
    	e.target.parentElement.classList.add("was-validated");
    }

    /**
     * 폼 인풋 엘리먼트의 부모 엘리먼트에 'was-validated' 클래스를 추가합니다.(부트스트랩용)
     * @param {Event & {target: HTMLInputElement}} e event
     */
    function initValidation(e) {
    	e.target.parentElement.classList.remove("was-validated");
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Signup', slots, []);

    	function passwordConfirmFn(e) {
    		if (password == confirm) {
    			e.target.setCustomValidity("");
    		} else {
    			e.target.setCustomValidity("비밀번호가 일치하지 않습니다.");
    		}

    		validate(e);
    	}

    	/**
     * 폼을 제출합니다.
     */
    	function submit() {
    		submitForm(form);
    	}

    	/** @type {HTMLElement} */
    	let form;

    	/** @type {HTMLElement} */
    	let passwordConfirm;

    	/** @type {string} */
    	let password;

    	/** @type {string} */
    	let confirm;

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Signup> was created with unknown prop '${key}'`);
    	});

    	function input1_input_handler() {
    		password = this.value;
    		$$invalidate(1, password);
    	}

    	function input2_input_handler() {
    		confirm = this.value;
    		$$invalidate(2, confirm);
    	}

    	function form_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			form = $$value;
    			$$invalidate(0, form);
    		});
    	}

    	$$self.$capture_state = () => ({
    		Atype,
    		Navbar,
    		submitForm,
    		validate,
    		passwordConfirmFn,
    		initValidation,
    		submit,
    		form,
    		passwordConfirm,
    		password,
    		confirm,
    		passwordPattern
    	});

    	$$self.$inject_state = $$props => {
    		if ('form' in $$props) $$invalidate(0, form = $$props.form);
    		if ('passwordConfirm' in $$props) passwordConfirm = $$props.passwordConfirm;
    		if ('password' in $$props) $$invalidate(1, password = $$props.password);
    		if ('confirm' in $$props) $$invalidate(2, confirm = $$props.confirm);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		form,
    		password,
    		confirm,
    		passwordConfirmFn,
    		submit,
    		input1_input_handler,
    		input2_input_handler,
    		form_1_binding
    	];
    }

    class Signup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Signup",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    const routes = {
      "/": Dashboard,
      "/home": Dashboard,
      "/sites": Sites,
      "/about": About,
      "/login": Signin,
      "/signup": Signup,
      // "/pop": Dashboard,
      // "/pop/dashboard": Dashboard,
      // "/pop/map": Map,
      // "/pop/sites": Sites,
      // "/pop/sites/:id": SitesDetailView,
      // "/pop/sites/log/:id": Log,
      // "/pop/insight": Insight,
      // "/pop/setting": Setting,
    };

    /* src/App.svelte generated by Svelte v3.53.1 */

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
