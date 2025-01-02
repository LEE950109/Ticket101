'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSyncEventProvider = exports.AWSAppSyncEventProvider = void 0;
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const utils_1 = require("@aws-amplify/core/internals/utils");
const constants_1 = require("../constants");
const AWSWebSocketProvider_1 = require("../AWSWebSocketProvider");
const authHeaders_1 = require("../AWSWebSocketProvider/authHeaders");
const PROVIDER_NAME = 'AWSAppSyncEventsProvider';
const WS_PROTOCOL_NAME = 'aws-appsync-event-ws';
const CONNECT_URI = ''; // events does not expect a connect uri
class AWSAppSyncEventProvider extends AWSWebSocketProvider_1.AWSWebSocketProvider {
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
            ...(await (0, authHeaders_1.awsRealTimeHeaderBasedAuth)({
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
            [utils_1.USER_AGENT_HEADER]: (0, utils_1.getAmplifyUserAgent)(customUserAgentDetails),
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
                ? constants_1.MESSAGE_TYPES.EVENT_PUBLISH
                : constants_1.MESSAGE_TYPES.EVENT_SUBSCRIBE,
        };
        const serializedSubscriptionMessage = JSON.stringify(subscriptionMessage);
        return serializedSubscriptionMessage;
    }
    _handleSubscriptionData(message) {
        this.logger.debug(`subscription message from AWS AppSync Events: ${message.data}`);
        const { id = '', event: payload, type, } = JSON.parse(String(message.data));
        const { observer = null, query = '', variables = {}, } = this.subscriptionObserverMap.get(id) || {};
        this.logger.debug({ id, observer, query, variables });
        if (type === constants_1.MESSAGE_TYPES.DATA && payload) {
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
            type: constants_1.MESSAGE_TYPES.EVENT_STOP,
        };
    }
    _extractConnectionTimeout(data) {
        const { connectionTimeoutMs = constants_1.DEFAULT_KEEP_ALIVE_TIMEOUT } = data;
        return connectionTimeoutMs;
    }
    _extractErrorCodeAndType(data) {
        const { errors: [{ errorType = '', errorCode = 0 } = {}] = [] } = data;
        return { errorCode, errorType };
    }
}
exports.AWSAppSyncEventProvider = AWSAppSyncEventProvider;
exports.AppSyncEventProvider = new AWSAppSyncEventProvider();
//# sourceMappingURL=index.js.map
