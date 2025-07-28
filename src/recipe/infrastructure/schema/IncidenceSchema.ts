import { Model, DataTypes } from "sequelize";
import sequelize from "../../../database/sequelize";

class IncidenceModel extends Model {
  public id!: number;
  public recipe_medication_id!: number;
  public created_at!: Date;
}

IncidenceModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    recipe_medication_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: "incidence",
    tableName: "incidence",
    timestamps: false,
  }
).sync({ alter: true });

export default IncidenceModel;