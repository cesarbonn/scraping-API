"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
class ExchangeRate extends sequelize_1.Model {
}
ExchangeRate.init({
    currency: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    rate: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false
    }
}, {
    sequelize: connection_1.default,
    modelName: 'ExchangeRates',
    timestamps: true,
    freezeTableName: true
});
exports.default = ExchangeRate;
//# sourceMappingURL=exchangeRates.js.map