"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaSoup = void 0;
const type_graphql_1 = require("type-graphql");
const ReturnTypes_1 = require("../types/ReturnTypes");
const index_1 = require("../index");
let MediaSoup = class MediaSoup {
    hello() {
        return __awaiter(this, void 0, void 0, function* () {
            return "Hello World!";
        });
    }
    getRtpCapabilities() {
        return __awaiter(this, void 0, void 0, function* () {
            let router = yield index_1.mediaSoup.getRouter();
            return JSON.stringify(router === null || router === void 0 ? void 0 : router.rtpCapabilities);
        });
    }
    createProducerTransport(modelId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                index_1.mediaSoup.removeRoom(modelId);
                const { router, transport, clientTransportParams } = yield index_1.mediaSoup.createWebRtcTransport();
                index_1.mediaSoup.addRoom(modelId, transport, router);
                return {
                    id: clientTransportParams.id,
                    iceParameters: JSON.stringify(clientTransportParams.iceParameters),
                    iceCandidates: JSON.stringify(clientTransportParams.iceCandidates),
                    dtlsParameters: JSON.stringify(clientTransportParams.dtlsParameters),
                };
            }
            catch (e) {
                throw new Error(e);
            }
        });
    }
    connectProducerTransport(dtlsParameters, transportId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let transport = index_1.mediaSoup.rooms.find((r) => r.transport.internal.transportId == transportId);
                if (!transport)
                    throw Error('Transport not found');
                dtlsParameters = JSON.parse(dtlsParameters);
                if (transport.transport.dtlsState == 'new') {
                    yield transport.transport.connect({ dtlsParameters: dtlsParameters });
                }
                return true;
            }
            catch (e) {
                console.log(e);
                throw new Error(e);
            }
        });
    }
    startProducing(kind, rtpParameters, transportId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("START PRODUCING", kind);
                let transport = index_1.mediaSoup.rooms.find((r) => r.transport.internal.transportId == transportId);
                if (!transport)
                    throw Error('Transport not found');
                rtpParameters = JSON.parse(rtpParameters);
                let producer = yield transport.transport.produce({ kind, rtpParameters });
                producer.on("close", () => {
                    console.log("PRODUCER CLODES");
                });
                index_1.mediaSoup.addProducer(transportId, producer, kind);
                return producer.id;
            }
            catch (e) {
                console.log(e);
                throw new Error(e);
            }
        });
    }
    createConsumerTransport(clientId, modelId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("createConsumerTransport");
            try {
                let modelRoom = index_1.mediaSoup.rooms.find((r) => r.modelId == modelId);
                if (!modelRoom)
                    throw Error("Room Not Found");
                let findTransport = modelRoom.consumers.find((c) => c.clientId == clientId);
                if (findTransport) {
                    index_1.mediaSoup.removeConsumerTransport(modelId, clientId);
                }
                const { transport, clientTransportParams } = yield index_1.mediaSoup.createWebRtcTransport(modelRoom.router);
                index_1.mediaSoup.addConsumerTransport(clientId, modelId, transport);
                return {
                    id: clientTransportParams.id,
                    iceParameters: JSON.stringify(clientTransportParams.iceParameters),
                    iceCandidates: JSON.stringify(clientTransportParams.iceCandidates),
                    dtlsParameters: JSON.stringify(clientTransportParams.dtlsParameters),
                };
            }
            catch (e) {
                console.log(e);
                throw new Error(e);
            }
        });
    }
    consumeMedia(rtpCapabilities, modelId, clientId, kind) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("consumeMedia");
                rtpCapabilities = JSON.parse(rtpCapabilities);
                let producerRoom = index_1.mediaSoup.getProducerTransport(modelId);
                if (!producerRoom)
                    throw Error('Producer Transport Not Found');
                let consumerTransport = producerRoom.consumers.find((c) => c.clientId == clientId);
                if (!consumerTransport)
                    throw Error('Consumer Transport Not Found');
                if (!consumerTransport.consumer) {
                    consumerTransport.consumer = {};
                }
                let producer = producerRoom.producer[kind];
                if (!producer)
                    throw Error(`Producer of type ${kind} Not Found`);
                console.log(producer);
                if (!producer) {
                    throw Error('Producer Not Found');
                }
                else if (false) {
                    throw Error('Cannot Consume');
                }
                else {
                    consumerTransport.consumer[kind] = yield consumerTransport.transport.consume({
                        producerId: producer.id,
                        rtpCapabilities,
                        paused: true,
                    });
                    consumerTransport.consumer[kind].on('transportclose', () => {
                        console.log("Consumer transport closed. Just fyi");
                        consumerTransport === null || consumerTransport === void 0 ? void 0 : consumerTransport.consumer.close();
                    });
                    const consumerParams = {
                        producerId: producer.id,
                        id: consumerTransport.consumer[kind].id,
                        kind: consumerTransport.consumer[kind].kind,
                        rtpParameters: JSON.stringify(consumerTransport.consumer[kind].rtpParameters),
                    };
                    return consumerParams;
                }
            }
            catch (e) {
                console.log(e);
                throw new Error(e);
            }
        });
    }
    connectConsumerTransport(modelId, clientId, dtlsParameters) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("connectConsumerTransport");
            try {
                let producerRoom = index_1.mediaSoup.getProducerTransport(modelId);
                if (!producerRoom)
                    throw Error('Producer Transport Not Found');
                let consumerTransport = producerRoom.consumers.find((c) => c.clientId == clientId);
                if (!consumerTransport)
                    throw Error('Consumer Transport Not Found');
                console.log(dtlsParameters);
                dtlsParameters = JSON.parse(dtlsParameters);
                yield consumerTransport.transport.connect({ dtlsParameters: dtlsParameters });
                return true;
            }
            catch (e) {
                console.log(e);
                throw new Error(e);
            }
        });
    }
    unpauseConsumer(modelId, clientId, kind) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("unpauseConsumer");
                let producerRoom = index_1.mediaSoup.getProducerTransport(modelId);
                console.log(producerRoom);
                if (!producerRoom)
                    throw Error('Producer Transport Not Found');
                let consumerTransport = producerRoom.consumers.find((c) => c.clientId == clientId);
                if (!consumerTransport)
                    throw Error('Consumer Transport Not Found');
                console.log(consumerTransport, "consumerTransport");
                yield consumerTransport.consumer[kind].resume();
                return true;
            }
            catch (e) {
                console.log(e);
                throw new Error(e);
            }
        });
    }
};
exports.MediaSoup = MediaSoup;
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MediaSoup.prototype, "hello", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MediaSoup.prototype, "getRtpCapabilities", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ReturnTypes_1.CreateProducerTransport),
    __param(0, (0, type_graphql_1.Arg)("modelId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MediaSoup.prototype, "createProducerTransport", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("dtlsParameters")),
    __param(1, (0, type_graphql_1.Arg)("transportId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MediaSoup.prototype, "connectProducerTransport", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)("kind")),
    __param(1, (0, type_graphql_1.Arg)("rtpParameters")),
    __param(2, (0, type_graphql_1.Arg)("transportId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MediaSoup.prototype, "startProducing", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ReturnTypes_1.CreateProducerTransport),
    __param(0, (0, type_graphql_1.Arg)("clientId")),
    __param(1, (0, type_graphql_1.Arg)("modelId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MediaSoup.prototype, "createConsumerTransport", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ReturnTypes_1.ConsumeMediaReturnType),
    __param(0, (0, type_graphql_1.Arg)("rtpCapabilities")),
    __param(1, (0, type_graphql_1.Arg)("modelId")),
    __param(2, (0, type_graphql_1.Arg)("clientId")),
    __param(3, (0, type_graphql_1.Arg)("kind")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], MediaSoup.prototype, "consumeMedia", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("modelId")),
    __param(1, (0, type_graphql_1.Arg)("clientId")),
    __param(2, (0, type_graphql_1.Arg)("dtlsParameters")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MediaSoup.prototype, "connectConsumerTransport", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("modelId")),
    __param(1, (0, type_graphql_1.Arg)("clientId")),
    __param(2, (0, type_graphql_1.Arg)("kind")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MediaSoup.prototype, "unpauseConsumer", null);
exports.MediaSoup = MediaSoup = __decorate([
    (0, type_graphql_1.Resolver)()
], MediaSoup);
//# sourceMappingURL=MediaSoup.js.map