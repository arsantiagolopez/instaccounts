import { Request } from 'express';

export interface RequestWithUserId extends Request {
  userId?: string;
}
