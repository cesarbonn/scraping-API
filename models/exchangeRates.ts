import { DataTypes, Model, Optional } from "sequelize";
import db from "../database/connection";

// Define the attributes for the ExchangeRate model
interface ExchangeRateAttributes {
    currency: string;
    rate: number;
    date: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Define the attributes required for creating a new ExchangeRate instance (createdAt and updatedAt are optional)
interface ExchangeRateCreationAttributes extends Optional<ExchangeRateAttributes, 'createdAt' | 'updatedAt'> { }

// Define the ExchangeRate model class, extending Sequelize's Model class and implementing the defined attributes interface
class ExchangeRate extends Model<ExchangeRateAttributes, ExchangeRateCreationAttributes>
    implements ExchangeRateAttributes {
    public currency!: string;
    public rate!: number;
    public date!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

// Initialize the ExchangeRate model with its attributes and options
ExchangeRate.init({
    currency: {
        type: DataTypes.STRING, 
        primaryKey: true,
        allowNull: false 
    },
    rate: {
        type: DataTypes.FLOAT, 
        allowNull: false // Rate cannot be null
    },
    date: {
        type: DataTypes.DATEONLY, // Data type for date is DATEONLY (YYYY-MM-DD)
        allowNull: false // Date cannot be null
    }
}, {
    sequelize: db, 
    modelName: 'ExchangeRates', 
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
    freezeTableName: true // Prevent Sequelize from pluralizing the table name
});

export default ExchangeRate;