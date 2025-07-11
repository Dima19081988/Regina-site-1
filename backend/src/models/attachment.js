import sequelize from "../config/sequelize.ts";
import { DataTypes } from "sequelize";

const Attachment = sequelize.define('Attachment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    file_name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    file_data: {
        type: DataTypes.BLOB('long'),
        allowNull: false,
    },
    mime_type: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    size: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'attachments',
    timestamps: false
});

export default Attachment;