import mongoose from "mongoose";


const OrderSchema = new mongoose.Schema({
    user: {
        id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    },
    products: [{
        id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        quantity: {
            type: String,
            required: true,
        },
    },
    ],
    status: {
        type: String,
        required: true,
        enum: ['Em Preparação', 'Processando', 'Enviado', 'Entregue', 'Cancelado', 'Pedido Recebido'],
        default: 'Processando',
    },

},
    {
        timestamps: true,
    }
);

export default mongoose.model('Order', OrderSchema);