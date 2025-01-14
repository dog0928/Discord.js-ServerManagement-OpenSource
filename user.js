const { Sequelize, DataTypes } = require('sequelize');

// Sequelizeインスタンスを作成
const sequelize = new Sequelize(process.env.DB, 'root', process.env.DB_PASS, {
    host: process.env.DB_IP,
    dialect: 'postgres',
    logging: false,
});

// モデルを定義
const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mcname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    uuid: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// モデルを同期化（テーブルが存在しない場合は作成されます）
User.sync();

// ユーザーIDを指定して、該当するユーザーのUUIDとMC名を取得する関数
async function getUserInfo(userId) {
    try {
        // ユーザーIDに対応するユーザーをデータベースから取得
        const user = await User.findOne({ where: { userid: userId } });
        if (user) {
            // ユーザーが見つかった場合はUUIDとMC名を返す
            return { uuid: user.uuid, mcname: user.mcname };
        } else {
            // ユーザーが見つからなかった場合はnullを返す
            return null;
        }
    } catch (error) {
        console.error('Error getting user info:', error);
        throw error;
    }
}

module.exports = { User, getUserInfo };
