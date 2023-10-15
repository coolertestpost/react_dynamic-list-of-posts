/* eslint-disable max-len */
/* eslint-disable no-console */
import React, {
  useContext,
  useRef,
  useEffect,
  useState,
} from 'react';

import { Loader } from './Loader';
import { NewCommentForm } from './NewCommentForm';
import { AppContext } from '../contexts/AppContext';
import { client } from '../utils/fetchClient';
import { CommentData, Comment } from '../types/Comment';

export const PostDetails: React.FC = () => {
  const {
    selectedPost,
    posts,
    updateCommentWritingStatus,
    commentWriting,
    comments,
    updateComments,
  } = useContext(AppContext);

  enum Errors {
    commentsLoading,
    noComments,
    noError,
    cantDeleteComment,
  }

  const [commentsLoading, setCommentsLoading] = useState(false);
  const [error, setError] = useState<Errors>(Errors.noError);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      return;
    }

    setCommentsLoading(true);

    setError(Errors.noError);
    client.get<CommentData[]>(`/comments?postId=${selectedPost}`)
      .then(res => {
        updateComments(res);
        if (!res.length) {
          setError(Errors.noComments);
        }
      })
      .catch(() => {
        setError(Errors.commentsLoading);
      })
      .finally(() => {
        setCommentsLoading(false);
      });
  }, [selectedPost]);

  return (
    <div className="content" data-cy="PostDetails">
      <div className="content" data-cy="PostDetails">
        <div className="block">
          <h2 data-cy="PostTitle">
            {`#${selectedPost} ${posts.find(post => post.id === selectedPost)?.title || ''}`}
          </h2>

          <p data-cy="PostBody">
            {posts.find(post => post.id === selectedPost)?.body || ''}
          </p>
        </div>

        <div className="block">
          {commentsLoading && <Loader />}

          {error === Errors.commentsLoading && (
            <div className="notification is-danger" data-cy="CommentsError">
              Something went wrong
            </div>
          )}

          {error === Errors.noComments && !comments.length ? (
            <p className="title is-4" data-cy="NoCommentsMessage">
              No comments yet
            </p>
          ) : ''}

          {error === Errors.cantDeleteComment && (
            <p className="is-danger notification" data-cy="CantDeleteComment">
              Cant`t delete comment
            </p>
          )}

          {!commentsLoading && comments.length > 0 && (
            <>
              <p className="title is-4">Comments:</p>
              {comments.map((comment) => (
                <article
                  key={Math.random()}
                  className="message is-small"
                  data-cy="Comment"
                >
                  <div className="message-header">
                    <a href={`mailto:${comment.email}`} data-cy="CommentAuthor">
                      {comment.name}
                    </a>
                    <button
                      data-cy="CommentDelete"
                      type="button"
                      className="delete is-small"
                      aria-label="delete"
                      onClick={() => {
                        setError(Errors.noError);
                        client.get<Comment[]>(`/comments?postId=${selectedPost}`)
                          .then((res) => {
                            client.delete(`/comments/${res.find(com => com.body === comment.body)?.id}`);
                            updateComments(comments.filter(
                              commentToUpdate => res.find(com => com.body === commentToUpdate.body)?.body !== comment.body,
                            ));
                          })
                          .catch(() => {
                            setError(Errors.cantDeleteComment);
                          });
                      }}
                    >
                      delete button
                    </button>
                  </div>

                  <div className="message-body" data-cy="CommentBody">
                    {comment.body}
                  </div>
                </article>
              ))}
            </>
          )}

          {!commentWriting && (
            <button
              data-cy="WriteCommentButton"
              type="button"
              className="button is-link"
              onClick={() => {
                updateCommentWritingStatus(true);
              }}
            >
              Write a comment
            </button>
          )}
        </div>

        {commentWriting && <NewCommentForm />}
      </div>
    </div>
  );
};
