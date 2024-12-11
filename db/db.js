import { Sequelize, DataTypes } from "sequelize";

// Thiết lập kết nối Sequelize
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",  
});

const Product = sequelize.define("Product", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  roles: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  secret_phrase: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

sequelize.sync().then(() => {
  console.log("Database synced!");
});

export { sequelize, Product, User };
