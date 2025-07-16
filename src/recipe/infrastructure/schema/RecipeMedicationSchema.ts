import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../database/sequelize';

class RecipeMedicationModel extends Model {
  public id!: number;
  public recipe_id!: number;
  public medication_id!: number;
  public supplied!: boolean;
}

RecipeMedicationModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    recipe_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    medication_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    supplied: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'recipe_medication',
    tableName: 'recipe_medication',
    timestamps: false
  }
).sync({alter: true});

export default RecipeMedicationModel;