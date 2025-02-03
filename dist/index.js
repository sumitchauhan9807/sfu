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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaSoup = void 0;
require("reflect-metadata");
const path_1 = __importDefault(require("path"));
require("dotenv").config({ path: path_1.default.join(__dirname, ".env") });
console.log(path_1.default.join(__dirname, "../", ".env"));
const server_1 = require("@apollo/server");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const express4_1 = require("@apollo/server/express4");
const MediaSoup_1 = require("./resolvers/MediaSoup");
const type_graphql_1 = require("type-graphql");
const PubNub_1 = __importDefault(require("./services/PubNub"));
const index_1 = require("./mediasoup/index");
const Main = () => __awaiter(void 0, void 0, void 0, function* () {
    PubNub_1.default.connect();
    PubNub_1.default.subscribe(["hello_world"]);
    PubNub_1.default.addListener();
    console.log(process.env.JWT_KEY);
    const schema = yield (0, type_graphql_1.buildSchema)({
        resolvers: [MediaSoup_1.MediaSoup],
    });
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
    }));
    app.use("/static/media", express_1.default.static("front-end/static/media"));
    app.use("/static/img", express_1.default.static("front-end/static/img"));
    app.use("/static/css", express_1.default.static("front-end/static/css"));
    app.use("/static/js", express_1.default.static("front-end/static/js"));
    const httpServer = http_1.default.createServer(app);
    const server = new server_1.ApolloServer({
        schema,
    });
    yield server.start();
    app.get("/", (req, res, next) => {
        res.send("hello from global fun");
    });
    app.use("/graphql", (0, cors_1.default)({ origin: ["https://sneaky-paradise.com"] }), express_1.default.json(), (0, express4_1.expressMiddleware)(server, {
        context: (_a) => __awaiter(void 0, [_a], void 0, function* ({ req }) { return ({ token: req.headers.token }); }),
    }));
    yield new Promise((resolve) => httpServer.listen({ port: 4001 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4001/graphql`, path_1.default.join(__dirname, "../", ".env"));
});
exports.mediaSoup = new index_1.MediaSoup();
exports.mediaSoup.initMediaSoup().then(() => {
    console.log("Mediasoup class initted successfuly");
    Main();
});
//# sourceMappingURL=index.js.map