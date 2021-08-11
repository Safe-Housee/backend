sed -i "s/process.env.DB_USER/'bYD4ZDMsh1'/g"  ./src/config/config.js
sed -i "s/process.env.DB_NAME/'bYD4ZDMsh1'/g"  ./src/config/config.js
sed -i "s/process.env.DB_PASS/'FgOmcxE5NS'/g"  ./src/config/config.js
sed -i "s/process.env.DB_HOST/'remotemysql.com'/g"  ./src/config/config.js
sed -i "s/localhost/'remotemysql.com'/g"  ./src/database/connection.js
sed -i "s/root/'bYD4ZDMsh1'/g"  ./src/database/connection.js
sed -i "s/safehouse/'bYD4ZDMsh1'/g"  ./src/database/connection.js
sed -i "s/safehouse/'FgOmcxE5NS'/g"  ./src/database/connection.js

