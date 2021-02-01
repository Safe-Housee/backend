const mysql = require('mysql2/promise');

async function clear() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'safehouse',
    database: 'safehouse',
  });

  const haveUser = await connection.query('select * from tb_usuario');

  console.log('Começando limpeza no banco para os testes \n');

  if (haveUser) {
    console.log('Apagando tb_usuario');
    await connection.query('delete from tb_usuario');
  }
  console.log('\n');
  console.log('Fim da limpeza');

  process.exit(0);
}

clear();
