import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // UUID vindo do SQL
      required: true,
    },
    products: [
      {
        productId: {
          type: String, // id do produto vindo do SQL
          required: true,
        },
        name: String,   // opcional, pode guardar snapshot do nome do produto
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "shipped", "delivered", "canceled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Purchase", PurchaseSchema);
