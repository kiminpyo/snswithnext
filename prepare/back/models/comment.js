

module.exports = (sequelize, DataTypes) =>{
    const Comment = sequelize.define('Comment', { // Comments테이블 생성, Comment이 MySQL에는 소문자+복수로 저장됨 (Comments)
        /* id는 mySQL에서 기본적으로 들어있다. */
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    },{
        /* 한글 저장 방식(utf8) + 이모티콘(utf8mb4)*/
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',  /* 이모티콘 저장 */


    });
    Comment.associate = (db) => {
        /* belongsTo를 두는 곳에 새로운 컬럼이 생기게 만든다. (하나의 댓글에 대한 소유자, 유저 게시글이 존재)
         UserId: 1 
         PostId: 3 과 같은,
          */
        db.Comment.belongsTo(db.User)
        db.Comment.belongsTo(db.Post)
    };
    return Comment;
}