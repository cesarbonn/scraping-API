"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
// Define the ExchangeRate model class, extending Sequelize's Model class and implementing the defined attributes interface
class ExchangeRate extends sequelize_1.Model {
}
// Initialize the ExchangeRate model with its attributes and options
ExchangeRate.init({
    currency: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    rate: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false // Rate cannot be null
    },
    date: {
        type: sequelize_1.DataTypes.DATEONLY, // Data type for date is DATEONLY (YYYY-MM-DD)
        allowNull: false // Date cannot be null
    }
}, {
    sequelize: connection_1.default,
    modelName: 'ExchangeRates',
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
    freezeTableName: true // Prevent Sequelize from pluralizing the table name
});
exports.default = ExchangeRate;
//# sourceMappingURL=exchangeRates.js.map