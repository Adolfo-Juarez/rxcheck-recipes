import { Model, DataTypes } from "sequelize";
import sequelize from "../../../database/sequelize";
import { RecipeStatus } from "../../domain/model/Recipe";

class RecipeModel extends Model {
  public id!: number;
  public patient_id!: string;
  public doctor_id!: string;
  public issue_at!: Date;
  public expires_at!: Date;
  public qr_path!: string;
  public pdf_path!: string;
  public signature!: string;
  public status!: RecipeStatus;
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
      allowNull: false,
    },
    doctor_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    issue_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    qr_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pdf_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    signature: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      allowNull: false,
      defaultValue: RecipeStatus.PENDING,
      values: ["pending", "partially_supplied", "supplied"]
    },
  },
  {
    sequelize,
    modelName: "recipe",
    tableName: "recipe",
    timestamps: false,
  }
).sync({ alter: true });

export default RecipeModel;
