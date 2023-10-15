/* eslint-disable max-len */
import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

export const PostsList: React.FC = () => {
  const {
    posts,
    updateSelectedPost,
    selectedPost,
    updateCommentWritingStatus,
  } = useContext(AppContext);

  return (
    <div data-cy="PostsList">
      <p className="title">Posts:</p>

      <table className="table is-fullwidth is-striped is-hoverable is-narrow">
        <thead>
          <tr className="has-background-link-light">
            <th>#</th>
            <th>Title</th>
            <th> </th>
          </tr>
        </thead>

        <tbody>
          {posts.map((post) => (
            <tr key={post.id} data-cy="Post">
              <td data-cy="PostId">{post.id}</td>

              <td data-cy="PostTitle">
                {post.title}
              </td>

              <td className="has-text-right is-vcentered">
                <button
                  type="button"
                  data-cy="PostButton"
                  className={`button is-link ${selectedPost !== post.id ? 'is-light' : ''}`}
                  onClick={() => {
                    updateCommentWritingStatus(false);

                    if (post.id !== selectedPost) {
                      updateSelectedPost(post.id);
                    } else {
                      updateSelectedPost(0);
                    }
                  }}
                >
                  {selectedPost !== post.id ? 'Open' : 'Close'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
