const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const UserTestResult = sequelize.define('UserTestResult', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    unique_id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      allowNull: false,
      unique: true
    },
    user_test_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user_tests',
        key: 'id'
      }
    },
    error_type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    line_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    suggestion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    execution_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'user_test_results'
  });

  return UserTestResult;
}; 