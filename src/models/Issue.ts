import {
  Column,
  CreateDateColumn,
  Entity,
  getConnection,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Repository,
  UpdateDateColumn,
} from 'typeorm'
import { Attachment } from './Attachment'
import { Comment } from './Comment'
import { Project } from './Project'
import { Release } from './Release'
import { User } from './User'

const types = ['bug', 'feature'] as const
export type Type = typeof types[number]

const statuses = ['to do', 'doing', 'done'] as const
export type Status = typeof statuses[number]

@Entity()
export class Issue {
  static getRepository(): Repository<Issue> {
    return getConnection().getRepository(Issue)
  }

  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Project, { nullable: false, onDelete: 'CASCADE' })
  project: Project

  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  author: User

  @ManyToOne(() => Release, { nullable: false, onDelete: 'RESTRICT' })
  release: Release

  @Column()
  type: Type

  @Column({ default: 'to do' })
  status: Status

  @Column({ default: 0 })
  priority: number

  @Column({ default: 0 })
  points: number

  @Column()
  title: string

  @Column('text')
  description: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => Attachment, (attachment) => attachment.issue)
  attachments: Attachment[]

  @OneToMany(() => Comment, (comment) => comment.issue)
  comments: Comment[]
}
