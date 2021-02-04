module.exports = {
  type: 'sqlite',
  database: process.env.DB_PATH,
  entities: ['dist/src/models/**/*.js'],
  migrations: ['dist/migrations/*.js'],
  subscribers: ['dist/subscribers/*.js'],
  synchronize: false,
  ...(process.env.NODE_ENV !== 'production' && {
    entities: ['src/models/**/*.ts'],
    migrations: ['migrations/*.ts'],
    subscribers: ['subscribers/*.ts'],
    logging: process.env.MYSQL_LOGGING === 'true',
    cli: {
      entitiesDir: 'src/models',
      migrationsDir: 'migrations',
      subscribersDir: 'subscribers',
    },
  }),
}
