import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities';
import { Post } from '../../post/entities';

@Entity('instagrams')
export class Instagram {
  @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
  id!: string;

  @Column({ nullable: false, unique: true })
  username!: string;

  @Column({ nullable: false })
  password!: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ nullable: true })
  followers?: number;

  @Column({ nullable: true })
  following?: number;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: false, default: false })
  isAuthorized!: boolean;

  @Column({ nullable: false, default: new Date() })
  lastActive!: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt!: Date;

  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, (user) => user.instagrams, { onDelete: 'CASCADE' })
  user!: User;

  @OneToMany(() => Post, (post) => post.instagram)
  posts!: Post[];
}
