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
const createWebRtcTransport = (router) => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    const transport = yield router.createWebRtcTransport({
        enableUdp: true,
        enableTcp: true,
        preferUdp: true,
        listenInfos: [
            {
                protocol: 'udp',
                ip: '127.0.0.1',
            },
            {
                protocol: 'tcp',
                ip: '127.0.0.1',
            }
        ]
    });
    const clientTransportParams = {
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters,
    };
    resolve({ transport, clientTransportParams });
}));
exports.default = createWebRtcTransport;
//# sourceMappingURL=createWebRtcTransport.js.map