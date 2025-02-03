"use strict";
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
const createWorkers = require("./createWorkers");
const config = require("../config/config");
const os = require("os");
const mediasoup = require("mediasoup");
const totalThreads = os.cpus().length;
const constants_1 = require("../constants");
class MediaSoup {
    constructor() {
        this.addProducer = (transportId, producer, kind) => {
            this.rooms = this.rooms.map((room) => {
                if (room.transport.internal.transportId == transportId) {
                    room.producer[kind] = producer;
                }
                return room;
            });
        };
        this.removeConsumerTransport = (modelId, clientId) => {
            let modelRoom = this.rooms.find((r) => r.modelId == modelId);
            if (!modelRoom)
                return;
            let consumers = modelRoom.consumers;
            let findConsumer = consumers.find((r) => r.clientId == clientId);
            if (!findConsumer)
                return;
            findConsumer.transport.close();
            consumers = consumers.filter((consumer) => {
                if (consumer.clientId != clientId) {
                    return true;
                }
                else {
                    return false;
                }
            });
            modelRoom.consumers = consumers;
            this.rooms = this.rooms.map((room) => {
                if (room.modelId == modelId) {
                    return modelRoom;
                }
                return room;
            });
        };
        this.addConsumerTransport = (clientId, modelId, transport) => {
            this.rooms = this.rooms.map((room) => {
                if (room.modelId == modelId) {
                    room.consumers.push({
                        clientId: clientId,
                        transport: transport
                    });
                }
                return room;
            });
        };
        this.getProducerTransport = (modelId) => {
            return this.rooms.find((room) => room.modelId == modelId);
        };
        this.getConsumerTransport = (modelId, clientId) => {
            return this.allConsumerTransports.find((transport) => transport.clientId == clientId);
        };
        this.allProducerTransports = [];
        this.allConsumerTransports = [];
        this.router = null;
        this.rooms = [];
    }
    initMediaSoup() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createWorkers();
        });
    }
    addRoom(modelId, transport, router) {
        this.rooms.push({
            modelId: modelId,
            transport: transport,
            router: router,
            producer: {
                audio: null,
                video: null
            },
            consumers: []
        });
    }
    removeRoom(modelId) {
        let findRoom = this.rooms.find((room) => room.modelId == modelId);
        if (!findRoom)
            return;
        findRoom.transport.close();
        this.rooms = this.rooms.filter((room) => {
            if (room.modelId != modelId) {
                return true;
            }
            else {
                return false;
            }
        });
    }
    createWorkers() {
        return __awaiter(this, void 0, void 0, function* () {
            let workers = [];
            for (let i = 0; i < totalThreads; i++) {
                const worker = yield mediasoup.createWorker({
                    rtcMinPort: config.workerSettings.rtcMinPort,
                    rtcMaxPort: config.workerSettings.rtcMaxPort,
                    logLevel: config.workerSettings.logLevel,
                    logTags: config.workerSettings.logTags,
                });
                worker.on("died", () => {
                    console.log("Worker has died");
                    process.exit(1);
                });
                workers.push(worker);
            }
            this.workers = workers;
        });
    }
    getRouter() {
        return __awaiter(this, void 0, void 0, function* () {
            let worker = yield this.getWorker();
            let router = yield worker.createRouter({
                mediaCodecs: config.routerMediaCodecs,
            });
            this.router = router;
            return router;
        });
    }
    createWebRtcTransport() {
        return __awaiter(this, arguments, void 0, function* (router = null) {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                if (!router) {
                    router = yield this.getRouter();
                }
                console.log(router, "routerrouterrouterrouterrouterrouterrouterrouter");
                const transport = yield router.createWebRtcTransport({
                    enableUdp: true,
                    enableTcp: true,
                    preferUdp: true,
                    listenInfos: constants_1.LISTEN_INFOS,
                    maxIncomingBitrate: 5000000,
                    initialAvailableOutgoingBitrate: 5000000
                });
                const clientTransportParams = {
                    id: transport.id,
                    iceParameters: transport.iceParameters,
                    iceCandidates: transport.iceCandidates,
                    dtlsParameters: transport.dtlsParameters,
                };
                resolve({ router, transport, clientTransportParams });
            }));
        });
    }
    getWorker() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const workersLoad = this.workers.map((worker) => {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    const stats = yield worker.getResourceUsage();
                    const cpuUsage = stats.ru_utime + stats.ru_stime;
                    resolve(cpuUsage);
                }));
            });
            const workersLoadCalc = yield Promise.all(workersLoad);
            let leastLoadedWorker = 0;
            let leastWorkerLoad = 0;
            for (let i = 0; i < workersLoadCalc.length; i++) {
                if (workersLoadCalc[i] < leastWorkerLoad) {
                    leastLoadedWorker = i;
                }
            }
            resolve(this.workers[leastLoadedWorker]);
        }));
    }
}
exports.MediaSoup = MediaSoup;
//# sourceMappingURL=index.js.map