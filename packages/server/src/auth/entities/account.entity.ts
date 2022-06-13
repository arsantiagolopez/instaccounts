import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  ValueTransformer,
} from 'typeorm';
import { User } from './user.entity';

const transformer: Record<'bigint', ValueTransformer> = {
  bigint: {
    from: (bigInt: string | null) => bigInt && parseInt(bigInt, 10),
    to: (bigInt?: number) => bigInt?.toString(),
  },
};

@Entity({ name: 'accounts' })
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  type!: string;

  @Column({ type: 'varchar' })
  provider!: string;

  @Column({ type: 'varchar' })
  providerAccountId!: string;

  @Column({ type: 'varchar', nullable: true })
  refresh_token!: string;

  @Column({ type: 'varchar', nullable: true })
  access_token!: string | null;

  @Column({
    type: 'bigint',
    nullable: true,
    transformer: transformer.bigint,
  })
  expires_at!: number | null;

  @Column({ type: 'varchar', nullable: true })
  token_type!: string | null;

  @Column({ type: 'varchar', nullable: true })
  scope!: string | null;

  @Column({ type: 'varchar', nullable: true })
  id_token!: string | null;

  @Column({ type: 'varchar', nullable: true })
  session_state!: string | null;

  @Column({ type: 'varchar', nullable: true })
  oauth_token_secret!: string | null;

  @Column({ type: 'varchar', nullable: true })
  oauth_token!: string | null;

  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, (user) => user.accounts, {
    createForeignKeyConstraints: true,
  })
  user!: User;
}
