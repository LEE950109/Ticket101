import { USER_AGENT_HEADER, getAmplifyUserAgent } from '@aws-amplify/core/internals/utils';
import { MESSAGE_TYPES, DEFAULT_KEEP_ALIVE_TIMEOUT } from '../constants.mjs';
import { AWSWebSocketProvider } from '../AWSWebSocketProvider/index.mjs';
import { awsRealTimeHeaderBasedAuth } from '../AWSWebSocketProvider/authHeaders.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const PROVIDER_NAME = 'AWSAppSyncEventsProvider';
const WS_PROTOCOL_NAME = 'aws-appsync-event-ws';
const CONNECT_URI = ''; // events does not expect a connect uri
class AWSAppSyncEventProvider extends AWSWebSocketProvider {
    constructor() {
        super({
            providerName: PROVIDER_NAME,
            wsProtocolName: WS_PROTOCOL_NAME,
            connectUri: CONNECT_URI,
        });
    }
    getProviderName() {
        return PROVIDER_NAME;
    }
    async connect(options) {
        super.connect(options);
    }
    subscribe(options, customUserAgentDetails) {
        return super.subscribe(options, customUserAgentDetails).pipe();
    }
    async publish(options, customUserAgentDetails) {
        super.publish(options, customUserAgentDetails);
    }
    async _prepareSubscriptionPayload({ options, subscriptionId, customUserAgentDetails, additionalCustomHeaders, libraryConfigHeaders, publish, }) {
        const { appSyncGraphqlEndpoint, authenticationType, query, apiKey, region, } = options;
        // This will be needed for WS publish
        // const data = {
        // 	events: [variables],
        // };
        const serializedData = JSON.stringify({ channel: query });
        const headers = {
            ...(await awsRealTimeHeaderBasedAuth({
                apiKey,
                appSyncGraphqlEndpoint,
                authenticationType,
                payload: serializedData,
                canonicalUri: '',
                region,
                additionalCustomHeaders,
            })),
            ...libraryConfigHeaders,
            ...additionalCustomHeaders,
            [USER_AGENT_HEADER]: getAmplifyUserAgent(customUserAgentDetails),
        };
        // Commented out code will be needed for WS publish
        const subscriptionMessage = {
            id: subscriptionId,
            channel: query,
            // events: [JSON.stringify(variables)],
            authorization: {
                ...headers,
            },
            // payload: {
            // 	events: serializedData,
            // 	extensions: {
            // 		authorization: {
            // 			...headers,
            // 		},
            // 	},
            // },
            type: publish
                ? MESSAGE_TYPES.EVENT_PUBLISH
                : MESSAGE_TYPES.EVENT_SUBSCRIBE,
        };
        const serializedSubscriptionMessage = JSON.stringify(subscriptionMessage);
        return serializedSubscriptionMessage;
    }
    _handleSubscriptionData(message) {
        this.logger.debug(`subscription message from AWS AppSync Events: ${message.data}`);
        const { id = '', event: payload, type, } = JSON.parse(String(message.data));
        const { observer = null, query = '', variables = {}, } = this.subscriptionObserverMap.get(id) || {};
        this.logger.debug({ id, observer, query, variables });
        if (type === MESSAGE_TYPES.DATA && payload) {
            const deserializedEvent = JSON.parse(payload);
            if (observer) {
                observer.next({ id, type, event: deserializedEvent });
            }
            else {
                this.logger.debug(`observer not found for id: ${id}`);
            }
            return [true, { id, type, payload: deserializedEvent }];
        }
        return [false, { id, type, payload }];
    }
    _unsubscribeMessage(subscriptionId) {
        return {
            id: subscriptionId,
            type: MESSAGE_TYPES.EVENT_STOP,
        };
    }
    _extractConnectionTimeout(data) {
        const { connectionTimeoutMs = DEFAULT_KEEP_ALIVE_TIMEOUT } = data;
        return connectionTimeoutMs;
    }
    _extractErrorCodeAndType(data) {
        const { errors: [{ errorType = '', errorCode = 0 } = {}] = [] } = data;
        return { errorCode, errorType };
    }
}
const AppSyncEventProvider = new AWSAppSyncEventProvider();

export { AWSAppSyncEventProvider, AppSyncEventProvider };
//# sourceMappingURL=index.mjs.map
