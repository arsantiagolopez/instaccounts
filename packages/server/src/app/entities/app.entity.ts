import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../auth/entities';

@Entity('apps')
export class App {
  @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
  id!: string;

  @Column({ unique: true, nullable: false })
  name!: string;

  @Column({ nullable: false })
  description!: string;

  @Column({ nullable: false })
  image!: string;

  @Column({ default: true, nullable: false })
  isActive!: boolean;

  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, (user) => user.apps, { onDelete: 'CASCADE' })
  user!: User;
}
