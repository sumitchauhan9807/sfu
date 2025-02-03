var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const os = require('os');
const mediasoup = require('mediasoup');
const totalThreads = os.cpus().length;
console.log(totalThreads, "thresdss");
const config = require('../config/config');
const createWorkers = () => new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
    let workers = [];
    for (let i = 0; i < totalThreads; i++) {
        const worker = yield mediasoup.createWorker({
            rtcMinPort: config.workerSettings.rtcMinPort,
            rtcMaxPort: config.workerSettings.rtcMaxPort,
            logLevel: config.workerSettings.logLevel,
            logTags: config.workerSettings.logTags,
        });
        worker.on('died', () => {
            console.log("Worker has died");
            process.exit(1);
        });
        workers.push(worker);
    }
    resolve(workers);
}));
module.exports = createWorkers;
//# sourceMappingURL=createWorkers.js.map