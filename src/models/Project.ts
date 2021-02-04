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

@Entity()
export class Project {
  static getRepository(): Repository<Project> {
    return getConnection().getRepository(Project)
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ nullable: true })
  description?: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => Issue, (issue) => issue.release)
  issues: Issue[]
}
