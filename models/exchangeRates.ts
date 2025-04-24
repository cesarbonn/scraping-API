import { DataTypes, Model, Optional } from "sequelize";
import db from "../database/connection";

interface ExchangeRateAttributes {
    currency: string;
    rate: number;
    date: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface ExchangeRateCreationAttributes extends Optional<ExchangeRateAttributes, 'createdAt' | 'updatedAt'> {}

class ExchangeRate extends Model<ExchangeRateAttributes, ExchangeRateCreationAttributes> 
    implements ExchangeRateAttributes {
        public currency!: string;
        public rate!: number;
        public date!: string;
        public readonly createdAt!: Date;
        public readonly updatedAt!: Date;
}

ExchangeRate.init({
    currency: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    rate: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: 'ExchangeRates',
    timestamps: true,
    freezeTableName: true
});

export default ExchangeRate;