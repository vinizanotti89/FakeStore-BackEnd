import mongoose from 'mongoose';

const PurchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.Mixed,
          required: true,
        },
        name: { 
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        image: String,
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: 'completed',
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Purchase', PurchaseSchema);

