import { NextPage } from "next";
import { Account, App, Instagram, Post, Session, User } from "./entities";

export interface StyleProps {
  [key: string]: any;
}

export interface Action {
  name: string;
  active: boolean;
}

interface PictureAndPosts {
  profilePic: string;
  posts: Post[];
}

export type ProtectedPage<Props> = NextPage<Props> & { isProtected?: boolean };

export type AccountsWithPosts = Record<string, PictureAndPosts>;

export type { User, Session, Instagram, Account, Post, App };
