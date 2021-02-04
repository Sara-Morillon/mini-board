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

@Entity()
export class Attachment {
  static getRepository(): Repository<Attachment> {
    return getConnection().getRepository(Attachment)
  }

  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Issue, { nullable: false, onDelete: 'CASCADE' })
  issue: Issue

  @Column()
  filename: string

  @Column()
  filepath: string

  @Column()
  mime: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
