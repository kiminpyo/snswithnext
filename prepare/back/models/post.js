const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) =>{
    const Post = sequelize.define('Post', { // Posts테이블 생성, Post이 MySQL에는 소문자+복수로 저장됨 (Posts)
        /* id는 mySQL에서 기본적으로 들어있다. */
        content: {
            type: DataTypes.TEXT,
            allowNull: false, 
        },
        /*post id => retweet id로 바꿔준다. */
    },{
        /* 한글 저장 방식(utf8) + 이모티콘(utf8mb4)*/
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',  /* 이모티콘 저장 */



    });
    Post.associate = (db) => {
        /* 포스트는 user에 속해있다. */
        db.Post.belongsTo(db.User); // post.addUser , post.getUser(가져오기), post.setUser(수정)
        db.Post.hasMany(db.Comment); //post.addComments // post.getComments
        db.Post.hasMany(db.Image); //post.addImage //post.getImgaes 나 include를 써도된다.
        /* 인스타그램을 생각해라*/
        db.Post.belongsToMany(db.Hashtag ,{through: 'PostHashtag'}) //post.addHashtags
        /* 좋아요와 유저의 관계 through를 하면 새로 생긴 테이블의 이름을 Like로 설정가능 + as를 써서
        위의 post user 관계와 헷갈리지 않게 구분 */
        db.Post.belongsToMany(db.User ,{through: 'Like', as: 'Likers'}); /* 이렇게 하면 post.addLIkers가 생긴다, post.removeLikers도 생긴다 */
         /* 리트윗 ==> 한 게시글에 여러개의 리트윗이 되는데 
         어떤 게시글이 리트윗하면 주인이되는 리트윗은 하나(원본) */
        db.Post.belongsTo(db.Post, {as: 'Retweet'}) //post.addRetweet
    };
    return Post;
}