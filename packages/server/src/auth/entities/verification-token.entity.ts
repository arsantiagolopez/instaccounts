import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ValueTransformer,
} from 'typeorm';

const transformer: Record<'date', ValueTransformer> = {
  date: {
    from: (date: string | null) => date && new Date(parseInt(date, 10)),
    to: (date?: Date) => date?.valueOf().toString(),
  },
};

@Entity({ name: 'verification_tokens' })
export class VerificationToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  token!: string;

  @Column({ type: 'varchar' })
  identifier!: string;

  @Column({ type: 'varchar', transformer: transformer.date })
  expires!: string;
}
