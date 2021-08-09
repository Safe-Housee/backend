sed -i "s/'bYD4ZDMsh1'/process.env.DB_USER/g"  ./src/config/config.js
sed -i "s/'bYD4ZDMsh1'/process.env.DB_NAME/g"  ./src/config/config.js
sed -i "s/'FgOmcxE5NS'/process.env.DB_PASS/g"  ./src/config/config.js
sed -i "s/'remotemysql.com'/process.env.DB_HOST/g"  ./src/config/config.js