import Sequelize, { Model, DataTypes } from 'sequelize';


import bcrypt from 'bcrypt';

class User extends Model {
    static init(sequelize) {
        super.init({
            name: Sequelize.STRING,
            email: Sequelize.STRING,
            password: Sequelize.VIRTUAL,
            password_hash: Sequelize.STRING,
            role: {
                type: Sequelize.STRING,
                defaultValue: 'user', 
            },
            resetToken: {
                type: DataTypes.STRING,
                allowNull: true, 
            },
        },
            {
                sequelize,
            }
        );

        this.addHook('beforeSave', async (user) => {
            if (user.password) {
                user.password_hash = await bcrypt.hash(user.password, 10);
            }
        });
        return this;
    }

    checkPassword(password) {
        return bcrypt.compare(password, this.password_hash);
    }
}

export default User;