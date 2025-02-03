"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pubnub_1 = __importDefault(require("pubnub"));
class Pubnub {
    constructor(publishKey, subscribeKey) {
        this.publishKey = publishKey;
        this.subscribeKey = subscribeKey;
    }
    connect() {
        this.pubnub = new pubnub_1.default({
            publishKey: this.publishKey,
            subscribeKey: this.subscribeKey,
            uuid: "sdfsdfsdfds"
        });
    }
    publish(publishPayload) {
        this.pubnub.publish(publishPayload, function (status, response) {
        });
    }
    subscribe(channels) {
        this.pubnub.subscribe({
            channels: channels
        });
    }
    addListener() {
        this.pubnub.addListener({
            message: function (m) {
                console.log("found messags");
                console.log(m);
            },
            presence: function (p) {
            },
            signal: function (s) {
            },
            objects: (objectEvent) => {
            },
            messageAction: function (ma) {
            },
            file: function (event) {
            },
            status: function (s) {
            },
        });
    }
}
exports.default = new Pubnub('pub-c-a2053f29-e590-4d0f-9ebe-7460edd2d9d1', 'sub-c-b3d2e390-9082-11eb-9de7-3a1dcc291cdf');
//# sourceMappingURL=PubNub.js.map