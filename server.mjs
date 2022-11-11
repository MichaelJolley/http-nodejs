import { createServer } from 'http';
import pg from 'pg';



createServer(async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Max-Age', 2592000);

  const url = req.url;

  if (url.startsWith('/pokemon')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });

    const poke = url.replace('/pokemon/', '');

    console.log(poke);
    const client = clientGen();
    await client.connect();
    const pokeEntry = await client.query('SELECT * from pokemon where name=$1', [poke]);
    const pokemon = pokeEntry.rows[0];
    await client.end();

    console.log(pokemon);

    const client2 = clientGen();
    await client2.connect();
    const evolvedEntries = await client2.query('SELECT * from pokemon where id=$1', [pokemon.evolved_to]);

    await client2.end();

    res.end(JSON.stringify(evolvedEntries.rows));
  }

  res.end();
}).listen(process.env.PORT);


function clientGen() {
  return new pg.Client({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    ssl: false,
  });
}