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
const express_1 = require("express");
const rates_1 = require("../controllers/rates");
const router = (0, express_1.Router)();
// Versión con tipado explícito y manejo de errores
router.get('/current', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, rates_1.getRateCurrent)(req, res);
    }
    catch (error) {
        next(error);
    }
}));
router.get('/history', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, rates_1.getRatesHistory)(req, res);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
//# sourceMappingURL=rate.js.map