"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = __importDefault(require("./models/server"));
const cronjob_1 = __importDefault(require("./utils/cronjob"));
dotenv_1.default.config();
console.log('Valor de NODE_EXTRA_CA_CERTS:', process.env.NODE_EXTRA_CA_CERTS);
const server = new server_1.default();
(0, cronjob_1.default)();
server.listen();
//# sourceMappingURL=app.js.map