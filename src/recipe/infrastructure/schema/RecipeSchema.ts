import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../database/sequelize';

class RecipeModel extends Model {
  public id!: number;
  public patient_id!: string;
  public doctor_id!: string;
  public issue_at!: Date;
  public expires_at!: Date;
}

RecipeModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    patient_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    doctor_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    issue_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'recipe',
    tableName: 'recipe',
    timestamps: false
  }
).sync({alter: true});

export default RecipeModel;