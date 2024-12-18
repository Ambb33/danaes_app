import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../utils/database';
import Test from './Test';

interface TestQuestionAttributes {
  id: number;
  testId: number;
  question: string;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
}

interface TestQuestionCreationAttributes extends Optional<TestQuestionAttributes, 'id'> {}

class TestQuestion extends Model<TestQuestionAttributes, TestQuestionCreationAttributes> implements TestQuestionAttributes {
  public id!: number;
  public testId!: number;
  public question!: string;
  public userAnswer!: number;
  public correctAnswer!: number;
  public isCorrect!: boolean;
}

TestQuestion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    testId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Test,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userAnswer: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    correctAnswer: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'TestQuestion',
    tableName: 'TestQuestions',
  }
);

// Define associations
Test.hasMany(TestQuestion, { foreignKey: 'testId', as: 'questions', onDelete: 'CASCADE' });
TestQuestion.belongsTo(Test, { foreignKey: 'testId', as: 'test' });

export default TestQuestion;
