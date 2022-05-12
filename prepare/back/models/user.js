module.exports = (sequelize, DataTypes) =>{
    const User = sequelize.define('User', { // users테이블 생성, User이 MySQL에는 소문자+복수로 저장됨 (users)
        /* id는 mySQL에서 기본적으로 들어있다. */
       
        email:{
            type: DataTypes.STRING(30),
            allowNull: false, //false면 필수
            unique: true ,/* 고유한 값 */

        },
        nickname: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(100), /* 암호화를 하면 길이가 늘어나기 때문에  */
            allowNull: false
        },
    },{
        /* 한글 저장 방식*/
        charset: 'utf8',
        collate: 'utf8_general_ci', 

    });
    /* 관계형 데이터 베이스  */
    User.associate = (db) => {
        /* 사람이 포스트를 여러개 가지고 있다. */
        db.User.hasMany(db.Post)
        db.User.hasMany(db.Comment);
        /* 사용자랑 게시글의 좋아요 관계 through와 as는 대문자가 좋다. */
        db.User.belongsToMany(db.Post, {through: 'Like',as: 'Liked'})
        /* 팔로우 팔로워 , 위와 through는 테이블이름을 foreignkey는 컬럼의 키값의 이름을 바꿔준다 바꿔준다  */
        db.User.belongsToMany(db.User, {through: 'Follow', as: "Followers", foreignKey:" FollowingId"})
        db.User.belongsToMany(db.User, {through: 'Follow', as: "Followings", foreignKey : "FollowerId"})
       
    };
    return User;
}