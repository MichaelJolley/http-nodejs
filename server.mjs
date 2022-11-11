import { createServer } from 'http';
import pg from 'pg';

const client = new pg.Client({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  ssl: false,
});

createServer(async (req, res) => {

  const url = req.url;

  if (url.startsWith('/pokemon')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });

    const poke = url.replace('/pokemon/', '');

    await client.connect();
    const pokeEntry = await client.query('SELECT * from pokemon where name=$1', [poke]);
    const pokemon = pokeEntry.rows[0];

    console.log(pokemon);

    const evolvedEntries = await client.query('SELECT * from pokemon where evolved_to=$1', [pokemon.id]);
    await client.end();

    res.end(JSON.stringify(evolvedEntries.rows));
  }

  res.end();
}).listen(process.env.PORT);
