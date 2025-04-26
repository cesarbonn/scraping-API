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
const express_1 = __importDefault(require("express"));
const rate_1 = __importDefault(require("../routes/rate"));
const cors_1 = __importDefault(require("cors"));
const connection_1 = __importDefault(require("../database/connection"));
class Server {
    constructor() {
        this.apiPaths = {
            rates: '/api/rates'
        };
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '8000';
        this.serverInstance = null;
        //metodos iniciales
        this.dbConnection();
        this.middlewares();
        this.routes();
    }
    dbConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.NODE_ENV === 'test') {
                console.log('dbConnection method skipped in test environment');
                return;
            }
            try {
                yield connection_1.default.authenticate();
                console.log('Database online');
            }
            catch (error) {
                throw new Error(error instanceof Error ? error.message : String(error));
            }
        });
    }
    middlewares() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
    }
    routes() {
        this.app.use(this.apiPaths.rates, rate_1.default);
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
    getApp() {
        return this.app;
    }
    close(done) {
        if (this.serverInstance) {
            console.log('Closing server');
            this.serverInstance.close(done);
        }
        else if (done) {
            done();
        }
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map