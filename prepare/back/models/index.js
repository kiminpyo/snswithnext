const Sequelize = require('sequelize');
/* 업데이트 */
/*  const comment  = require('./comment') */
const env = process.env.NODE_ENV || 'development';
/* config에는 
 "development": {
    "username": "root",
    "password": "",
    "database": "react-nodebird",
    "host": "127.0.0.1",
    "port": "3306",
    "dialect": "mysql"
  },이 담긴다. 우선은 개발용이기 때문에 */
const config = require('../config/config')[env];
/* 이안에 db정보 다 담는다. */
const db ={};

/* sequelisze가 node랑 mysql을 연결 (mysql2 driver(npm i myspl2) 이용)해준다 */

const sequelize = new Sequelize(config.database, config.username, config.password, config);
/* 업데이트 */
db.Comment = require('./comment')(sequelize,Sequelize)
db.Hashtag = require('./hashtag')(sequelize,Sequelize);
db.Image = require('./image')(sequelize,Sequelize);
db.Post = require('./post')(sequelize,Sequelize);
db.User = require('./user')(sequelize,Sequelize);

/* 반복문 돌면서 관계들 연결해주는 곳 */
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
