import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../database/sequelize';

class UserModel extends Model {
  public id!: number;
  public role!: string;
  public nombre!: string;
  public apellido_paterno!: string;
  public apellido_materno!: string;
  public curp!: string;
  public rfc!: string;
  public email!: string;
  public password!: string;
  public cedula_profesional!: string;
}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apellido_paterno: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apellido_materno: {
      type: DataTypes.STRING,
      allowNull: true
    },
    curp: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rfc: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cedula_profesional: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'users',
    tableName: 'users',
    timestamps: false
  }
);

export default UserModel;