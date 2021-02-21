import {
  Column,
  CreateDateColumn,
  Entity,
  getConnection,
  PrimaryGeneratedColumn,
  Repository,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class User {
  static getRepository(): Repository<User> {
    return getConnection().getRepository(User)
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 40, unique: true })
  username: string

  @Column('char', { length: 64 })
  password: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
