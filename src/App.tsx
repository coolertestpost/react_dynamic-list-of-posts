/* eslint-disable max-len */
/* eslint-disable no-console */
import React, { useEffect, useState, useRef } from 'react';
import 'bulma/bulma.sass';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';

import classNames from 'classnames';
import { PostsList } from './components/PostsList';
import { PostDetails } from './components/PostDetails';
import { UserSelector } from './components/UserSelector';
import { Loader } from './components/Loader';
import { User } from './types/User';
import { client } from './utils/fetchClient';
import { AppContext } from './contexts/AppContext';
import { Post } from './types/Post';
import { CommentData } from './types/Comment';

export enum Errors {
  noPosts,
  postsLoading,
  noError,
}

export const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User['id'] | ''>('');
  const [postsLoading, setPostsLoading] = useState(false);

  const isFirstRender = useRef(true);

  const [error, setError] = useState<Errors>(Errors.noError);

  const [posts, setPosts] = useState<Post[]>([]);

  const [selectedPost, setSelectedPost] = useState<Post['id'] | ''>('');

  const [commentWriting, setCommentWriting] = useState(false);

  // console.log({ posts });

  const [comments, setComments] = useState<CommentData[]>([]);

  const updateComments = (data: CommentData[]) => {
    setComments(data);
  };

  const updateCommentWritingStatus = (value: boolean) => {
    setCommentWriting(value);
  };

  const updateSelectedUser = (id: User['id']) => {
    setError(Errors.noError);
    setSelectedUser(id);
    setSelectedPost('');
  };

  const updateSelectedPost = (id: Post['id']) => {
    setSelectedPost(id);
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      return;
    }

    setPostsLoading(true);
    client.get<Post[]>(`/posts?userId=${selectedUser}`).then((res) => {
      setPosts(res);
      if (!res.length) {
        setError(Errors.noPosts);
      }
    }).catch(() => {
      setError(Errors.postsLoading);
    }).finally(() => {
      setPostsLoading(false);
    });
  }, [selectedUser]);

  useEffect(() => {
    client.get<User[]>('/users').then((res) => {
      setUsers(res);
    });
  }, []);

  return (
    <AppContext.Provider value={{
      users,
      selectedUser,
      updateSelectedUser,
      posts,
      updateSelectedPost,
      selectedPost,
      commentWriting,
      updateCommentWritingStatus,
      comments,
      updateComments,
    }}
    >
      <main className="section">
        <div className="container">
          <div className="tile is-ancestor">
            <div className="tile is-parent">
              <div className="tile is-child box is-success">
                <div className="block">
                  <UserSelector />
                </div>

                <div className="block" data-cy="MainContent">
                  {!selectedUser && (
                    <p data-cy="NoSelectedUser">
                      No user selected
                    </p>
                  )}

                  {postsLoading && <Loader />}

                  {error === Errors.postsLoading ? (
                    <div
                      className="notification is-danger"
                      data-cy="PostsLoadingError"
                    >
                      Something went wrong!
                    </div>
                  ) : ''}

                  {error === Errors.noPosts ? (
                    <div className="notification is-warning" data-cy="NoPostsYet">
                      No posts yet
                    </div>
                  ) : ''}

                  {!postsLoading && posts.length > 0 && error === Errors.noError && <PostsList />}
                </div>
              </div>
            </div>

            <div
              data-cy="Sidebar"
              className={classNames(
                'tile',
                'is-parent',
                'is-8-desktop',
                'Sidebar',
                {
                  'Sidebar--open': selectedPost,
                },
              )}
            >
              <div className="tile is-child box is-success ">
                <PostDetails />
              </div>
            </div>
          </div>
        </div>
      </main>
    </AppContext.Provider>
  );
};
