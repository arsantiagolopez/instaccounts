import { Instagram } from 'src/instagram/entities';
import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('preferences')
export class Preferences {
  @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
  id!: string;

  @Column({ nullable: false, array: true })
  hashtags!: string;

  @Column({ nullable: false, array: true })
  competitors!: string;

  @Column({ nullable: false, array: true })
  locations!: string;

  @Column({ nullable: false })
  username!: string;

  @OneToOne(() => Instagram, (instagram) => instagram.preferences)
  instagram!: Instagram;
}
