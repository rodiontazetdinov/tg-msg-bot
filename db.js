const { Sequelize } = require('sequelize');

module.exports = new Sequelize(
     'db_name',
     'postgres',
     'Postgres1',
     {
        host: '192.168.0.108',
        port: '5432',
        dialect: 'postgres'
     }
);