module.exports = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/src/models/**/*.js'],
  migrations: ['dist/migrations/*.js'],
  subscribers: ['dist/subscribers/*.js'],
  synchronize: false,
  ...(process.env.NODE_ENV !== 'production' && {
    entities: ['src/models/**/*.ts'],
    migrations: ['migrations/*.ts'],
    subscribers: ['subscribers/*.ts'],
    logging: process.env.DB_LOGGING === 'true',
    cli: {
      entitiesDir: 'src/models',
      migrationsDir: 'migrations',
      subscribersDir: 'subscribers',
    },
  }),
}
