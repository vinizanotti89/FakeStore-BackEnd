import { Model, DataTypes } from "sequelize";

class Purchase extends Model {
  static init(sequelize) {
    super.init(
      {
        product: DataTypes.STRING,
        price: DataTypes.FLOAT,
        date: DataTypes.DATE,
        status: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: "Purchase",
      }
    );
  }
}

export default Purchase;
