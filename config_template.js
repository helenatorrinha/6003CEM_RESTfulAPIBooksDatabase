/**
 * @file config_template.js
 * @module config
 * @description The configuration file for the database connection
 */

exports.config = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "username",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_DATABASE || "db_name"
}

exports.jwtSecret = process.env.JWT_SECRET || "the_secret";