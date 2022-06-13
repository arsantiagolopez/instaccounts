// Default entities with custom fields.
// Next-auth only allows for default entities
// Entity typings will include added fields/relations

import { AccountEntity, SessionEntity, UserEntity } from "../entities";

export interface User extends UserEntity {
  instagrams: Instagram[];
}

export interface Account extends AccountEntity {}
export interface Session extends SessionEntity {}

// Other entities

export interface Instagram {
  id: string;
  username: string;
  password: string;
  name?: string;
  bio?: string;
  followers?: number;
  following?: number;
  image?: string;
  isAuthorized: boolean;
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  user?: User;
  posts: Post[];
}

export interface Post {
  id: string;
  username: string;
  height: number;
  width: number;
  image: string;
  caption?: string;
  location?: string;
  comments: number;
  likes: number;
  timestamp: Date;
  isCarousel: boolean;
  carouselImages?: string[];
  instagramId: string;
  instagram: Instagram;
}

export interface App {
  id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
}
