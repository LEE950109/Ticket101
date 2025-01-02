import { Amplify } from '@aws-amplify/core';
import { AppSyncEventProvider } from '../../Providers/AWSAppSyncEventsProvider/index.mjs';
import { appsyncRequest } from './appsyncRequest.mjs';
import { configure, normalizeAuth, serializeEvents } from './utils.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * @experimental API may change in future versions
 *
 * Establish a WebSocket connection to an Events channel
 *
 * @example
 * const channel = await events.connect("default/channel")
 *
 * channel.subscribe({
 *   next: (data) => { console.log(data) },
 *   error: (err) => { console.error(err) },
 * })
 *
 * @example // authMode override
 * const channel = await events.connect("default/channel", { authMode: "userPool" })
 *
 * @param channel - channel path; `<namespace>/<channel>`
 * @param options - request overrides: `authMode`, `authToken`
 *
 */
async function connect(channel, options) {
    const providerOptions = configure();
    providerOptions.authenticationType = normalizeAuth(options?.authMode, providerOptions.authenticationType);
    await AppSyncEventProvider.connect(providerOptions);
    let _subscription;
    const sub = (observer, subOptions) => {
        const subscribeOptions = { ...providerOptions, query: channel };
        subscribeOptions.authenticationType = normalizeAuth(subOptions?.authMode, subscribeOptions.authenticationType);
        _subscription = AppSyncEventProvider
            .subscribe(subscribeOptions)
            .subscribe(observer);
        return _subscription;
    };
    const close = () => {
        _subscription && _subscription.unsubscribe();
    };
    return {
        subscribe: sub,
        close,
        // publish: pub,
    };
}
/**
 * @experimental API may change in future versions
 *
 * Publish events to a channel via HTTP request
 *
 * @example
 * await events.post("default/channel", { some: "event" })
 *
 * @example // event batching
 * await events.post("default/channel", [{ some: "event" }, { some: "event2" }])
 *
 * @example // authMode override
 * await events.post("default/channel", { some: "event" }, { authMode: "userPool" })
 *
 * @param channel - channel path; `<namespace>/<channel>`
 * @param event - JSON-serializable value or an array of values
 * @param options - request overrides: `authMode`, `authToken`
 *
 * @returns void on success
 * @throws on error
 */
async function post(channel, event, options) {
    const providerOptions = configure();
    providerOptions.authenticationType = normalizeAuth(options?.authMode, providerOptions.authenticationType);
    // trailing slash required in publish
    const normalizedChannelName = channel[0] === '/' ? channel : `/${channel}`;
    const publishOptions = {
        ...providerOptions,
        query: normalizedChannelName,
        variables: serializeEvents(event),
        authToken: options?.authToken,
    };
    const abortController = new AbortController();
    const res = await appsyncRequest(Amplify, publishOptions, {}, abortController);
    if (res.failed?.length > 0) {
        return res.failed;
    }
}
/**
 * @experimental API may change in future versions
 *
 * Close WebSocket connection, disconnect listeners and reconnect observers
 *
 * @example
 * await events.closeAll()
 *
 * @returns void on success
 * @throws on error
 */
async function closeAll() {
    await AppSyncEventProvider.close();
}

export { closeAll, connect, post };
//# sourceMappingURL=index.mjs.map
