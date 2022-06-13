import { Instagram } from 'src/instagram/entities';

export interface PublicInstagram extends Partial<Instagram> {
  password?: string;
}
