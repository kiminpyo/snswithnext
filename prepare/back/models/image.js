const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) =>{
    const Image = sequelize.define('Image', { // Images테이블 생성, Image이 MySQL에는 소문자+복수로 저장됨 (Images)
        /* id는 mySQL에서 기본적으로 들어있다. */
        src: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
    },{
        /* 한글 저장 방식(utf8) + 이모티콘(utf8mb4)*/
        charset: 'utf8',
        collate: 'utf8_general_ci',  /* 이모티콘 저장 */


    });
    Image.associate = (db) => {
        db.Image.belongsTo(db.Post)
    };
    return Image;
}