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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsumeMediaReturnType = exports.CreateProducerTransport = exports.RtpCapabilities = exports.LoginUserResponse = void 0;
const User_1 = require("../entities/User");
const type_graphql_1 = require("type-graphql");
let LoginUserResponse = class LoginUserResponse {
};
exports.LoginUserResponse = LoginUserResponse;
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], LoginUserResponse.prototype, "token", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User, { nullable: true }),
    __metadata("design:type", typeof (_a = typeof User_1.User !== "undefined" && User_1.User) === "function" ? _a : Object)
], LoginUserResponse.prototype, "user", void 0);
exports.LoginUserResponse = LoginUserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], LoginUserResponse);
let RtpCapabilities = class RtpCapabilities {
};
exports.RtpCapabilities = RtpCapabilities;
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], RtpCapabilities.prototype, "kind", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], RtpCapabilities.prototype, "uri", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number, { nullable: true }),
    __metadata("design:type", Number)
], RtpCapabilities.prototype, "preferredId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], RtpCapabilities.prototype, "preferredEncrypt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], RtpCapabilities.prototype, "direction", void 0);
exports.RtpCapabilities = RtpCapabilities = __decorate([
    (0, type_graphql_1.ObjectType)()
], RtpCapabilities);
let CreateProducerTransport = class CreateProducerTransport {
};
exports.CreateProducerTransport = CreateProducerTransport;
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], CreateProducerTransport.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], CreateProducerTransport.prototype, "iceParameters", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], CreateProducerTransport.prototype, "iceCandidates", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], CreateProducerTransport.prototype, "dtlsParameters", void 0);
exports.CreateProducerTransport = CreateProducerTransport = __decorate([
    (0, type_graphql_1.ObjectType)()
], CreateProducerTransport);
let ConsumeMediaReturnType = class ConsumeMediaReturnType {
};
exports.ConsumeMediaReturnType = ConsumeMediaReturnType;
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], ConsumeMediaReturnType.prototype, "producerId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], ConsumeMediaReturnType.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], ConsumeMediaReturnType.prototype, "kind", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], ConsumeMediaReturnType.prototype, "rtpParameters", void 0);
exports.ConsumeMediaReturnType = ConsumeMediaReturnType = __decorate([
    (0, type_graphql_1.ObjectType)()
], ConsumeMediaReturnType);
//# sourceMappingURL=ReturnTypes.js.map