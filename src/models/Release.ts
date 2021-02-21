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
import { Issue } from './Issue'
import { Project } from './Project'

@Entity()
export class Release {
  static getRepository(): Repository<Release> {
    return getConnection().getRepository(Release)
  }

  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Project, { nullable: false, onDelete: 'CASCADE' })
  project: Project

  @Column({ length: 40 })
  name: string

  @Column()
  dueDate: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => Issue, (issue) => issue.release)
  issues: Issue[]
}
