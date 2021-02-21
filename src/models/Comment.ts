import {
  Column,
  CreateDateColumn,
  Entity,
  getConnection,
  ManyToOne,
  PrimaryGeneratedColumn,
  Repository,
  UpdateDateColumn,
} from 'typeorm'
import { Issue } from './Issue'
import { User } from './User'

@Entity()
export class Comment {
  static getRepository(): Repository<Comment> {
    return getConnection().getRepository(Comment)
  }

  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Issue, { nullable: false, onDelete: 'CASCADE' })
  issue: Issue

  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  author: User

  @Column('text')
  content: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
