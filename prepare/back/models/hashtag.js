const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) =>{
    const Hashtag = sequelize.define('Hashtag', { // Hashtags테이블 생성, Hashtag이 MySQL에는 소문자+복수로 저장됨 (Hashtags)
        /* id는 mySQL에서 기본적으로 들어있다. */
        name:{
            type: DataTypes.STRING(20),
            allowNull: false
        },
    },{
        /* 한글 저장 방식(utf8) + 이모티콘(utf8mb4)*/
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',  /* 이모티콘 저장 */


    });
    Hashtag.associate = (db) => {
        /* 인스타그램을 잘 생각해보자 */
        db.Hashtag.belongsToMany(db.Post, {through: 'PostHashtag'})
    };
    return Hashtag;
}