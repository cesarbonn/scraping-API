"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = __importDefault(require("./models/server"));
const cronjob_1 = __importDefault(require("./utils/cronjob"));
// Load environment variables from .env
dotenv_1.default.config();
console.log('Valor de NODE_EXTRA_CA_CERTS:', process.env.NODE_EXTRA_CA_CERTS); // intermediate certificate necessary to validate the chain when connecting to www.bcv.org.ve.
// We create an instance of your Server class.
const serverInitializer = new server_1.default();
const app = serverInitializer.getApp();
exports.default = app;
// **KEY PART FOR TESTING!**
// This code block only executes if this file (app.ts, compiled to JS)
// is the main script executed with `node`.
// It will NOT execute when the file is imported by your tests.
if (require.main === module) {
    serverInitializer.listen();
    // Execute the cronjob. Consider if the cronjob should also run in tests
    // or if it is only for the production environment.
    (0, cronjob_1.default)();
}
//# sourceMappingURL=app.js.map