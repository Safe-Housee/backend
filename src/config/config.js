require("dotenv/config");

module.exports = {
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	host: process.env.DB_HOST,
	port: "3306",
	dialect: "mysql",
	define: {
		createdAt: "created_at",
		updatedAt: "updated_at",
	},
};
