import React from 'react';
import { User } from '../types/User';
import { Post } from '../types/Post';
import { CommentData } from '../types/Comment';

type Props = {
  users: User[],
  selectedUser: User['id'] | '',
  updateSelectedUser: (id: User['id']) => void,
  posts: Post[],
  updateSelectedPost: (id: Post['id']) => void,
  selectedPost: Post['id'] | '',
  commentWriting: boolean,
  updateCommentWritingStatus: (value: boolean) => void,
  comments: CommentData[],
  updateComments: (data: CommentData[]) => void,
};

export const AppContext = React.createContext<Props>({
  users: [],
  selectedUser: '',
  updateSelectedUser: () => {},
  posts: [],
  updateSelectedPost: () => {},
  selectedPost: '',
  commentWriting: false,
  updateCommentWritingStatus: () => {},
  comments: [],
  updateComments: () => {},
});
