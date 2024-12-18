import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../utils/database';

interface TestAttributes {
  id: number;
  testType: string;
  score: number;
  timestamp: Date;
}

interface TestCreationAttributes extends Optional<TestAttributes, 'id' | 'timestamp'> {}

class Test extends Model<TestAttributes, TestCreationAttributes> implements TestAttributes {
  public id!: number;
  public testType!: string;
  public score!: number;
  public timestamp!: Date;
}

Test.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    testType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Test',
    tableName: 'Tests',
  }
);

export default Test;
