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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Followers = void 0;
const typeorm_1 = require("typeorm");
const vacation_entity_1 = require("./vacation.entity");
const user_entity_1 = require("./user.entity");
let Followers = class Followers {
};
exports.Followers = Followers;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Object)
], Followers.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: "userId" }),
    __metadata("design:type", Object)
], Followers.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vacation_entity_1.Vacation),
    (0, typeorm_1.JoinColumn)({ name: "vacationId" }),
    __metadata("design:type", Object)
], Followers.prototype, "vacation", void 0);
exports.Followers = Followers = __decorate([
    (0, typeorm_1.Entity)()
], Followers);
