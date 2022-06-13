import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Instagram } from '../../instagram/entities';

@Entity('posts')
export class Post {
  @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
  id!: string;

  @Column({ nullable: false })
  username!: string;

  @Column({ nullable: false })
  height!: number;

  @Column({ nullable: false })
  width!: number;

  @Column({ nullable: false })
  image!: string;

  @Column({ nullable: true })
  caption?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: false })
  comments!: number;

  @Column({ nullable: false })
  likes!: number;

  @Column({ nullable: false })
  timestamp!: Date;

  @Column({ nullable: false, default: false })
  isCarousel!: boolean;

  @Column({ type: 'varchar', array: true, nullable: true })
  carouselImages?: string[];

  @Column({ type: 'uuid' })
  instagramId!: string;

  @ManyToOne(() => Instagram, (instagram) => instagram.posts, {
    onDelete: 'CASCADE',
  })
  instagram!: Instagram;
}
