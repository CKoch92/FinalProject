import { Time } from "@angular/common";
import { Timestamp } from "rxjs/internal/operators/timestamp";
import { Post } from "./post";
import { User } from "./user";

export class Comment {

  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  post: Post;
  isEnabled: boolean;

  constructor(
  id: number = 0,
  content: string = '',
  createdAt: Date = new Date(),
  updatedAt: Date = new Date(),
  user: User = new User(),
  post: Post = new Post(),
  isEnabled: boolean = true
  ){
    this.id = id;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.user = user;
    this.post = post;
    this.isEnabled = isEnabled;
  }

}
