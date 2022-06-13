import { App } from 'src/app/entities';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Instagram } from '../../instagram/entities';
import { Account, Session } from './index';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', nullable: true })
  name!: string | null;

  @Column({ type: 'varchar', nullable: true, unique: true })
  email!: string | null;

  @Column({ type: 'varchar', nullable: true })
  emailVerified!: string | null;

  @Column({ type: 'varchar', nullable: true })
  image!: string | null;

  @OneToMany(() => Session, (session) => session.user)
  sessions!: Session[];

  @OneToMany(() => Account, (account) => account.user)
  accounts!: Account[];

  @OneToMany(() => Instagram, (instagram) => instagram.user)
  instagrams!: Instagram[];

  @OneToMany(() => App, (app) => app.user)
  apps!: App[];
}
