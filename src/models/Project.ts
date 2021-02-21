import {
  Column,
  CreateDateColumn,
  Entity,
  getConnection,
  OneToMany,
  PrimaryGeneratedColumn,
  Repository,
  UpdateDateColumn,
} from 'typeorm'
import { Issue } from './Issue'
import { Release } from './Release'

@Entity()
export class Project {
  static getRepository(): Repository<Project> {
    return getConnection().getRepository(Project)
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 10, unique: true })
  key: string

  @Column({ length: 40 })
  name: string

  @Column('text', { nullable: true })
  description?: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => Issue, (issue) => issue.project)
  issues: Issue[]

  @OneToMany(() => Release, (release) => release.project)
  releases: Release[]
}
