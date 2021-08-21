require("dotenv/config");

module.exports = {
	username: "root",
	password: "safehouse",
	database: "safehouse",
	host: "localhost",
	port: "3306",
	dialect: "mysql",
	define: {
		createdAt: "created_at",
		updatedAt: "updated_at",
	},
};
