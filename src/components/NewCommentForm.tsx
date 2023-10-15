/* eslint-disable no-console */
import React, { useContext, useState } from 'react';
import { client } from '../utils/fetchClient';
import { AppContext } from '../contexts/AppContext';
import { CommentData } from '../types/Comment';

interface FiledsErrors {
  nameError: boolean,
  emailError: boolean,
  textError: boolean,
}

interface FiledsValues {
  nameValue: string,
  emailValue: string,
  textValue: string,
}

export const NewCommentForm: React.FC = () => {
  const [errors, setErrors] = useState<FiledsErrors>({
    nameError: false,
    emailError: false,
    textError: false,
  });

  const [cantAddError, setCantAddError] = useState(false);

  const { selectedPost, updateComments, comments } = useContext(AppContext);

  const [fieldsValues, setFieldsValues] = useState<FiledsValues>({
    nameValue: '',
    emailValue: '',
    textValue: '',
  });

  const [commentAddingLoading, setCommentAddingLoading] = useState(false);

  return (
    <form
      data-cy="NewCommentForm"
      onSubmit={(event) => {
        event.preventDefault();

        setErrors({
          nameError: !fieldsValues.nameValue.length,
          emailError: !fieldsValues.emailValue.length,
          textError: !fieldsValues.textValue.length,
        });

        setCantAddError(false);

        if (
          !fieldsValues.nameValue.length
          || !fieldsValues.emailValue.length
          || !fieldsValues.textValue.length
        ) {
          return;
        }

        setCommentAddingLoading(true);

        client.post<CommentData>('/comments', {
          postId: selectedPost,
          name: fieldsValues.nameValue,
          email: fieldsValues.emailValue,
          body: fieldsValues.textValue,
        })
          .then((newComment) => {
            updateComments([...comments, newComment]);
            setFieldsValues({
              nameValue: fieldsValues.nameValue,
              emailValue: fieldsValues.emailValue,
              textValue: '',
            });
          })
          .catch(() => {
            setCantAddError(true);
          })
          .finally(() => {
            setCommentAddingLoading(false);
          });
      }}
    >
      <div className="field" data-cy="NameField">
        <label className="label" htmlFor="comment-author-name">
          Author Name
        </label>

        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="name"
            id="comment-author-name"
            placeholder="Name Surname"
            className={`input ${errors.nameError ? 'is-danger' : ''}`}
            value={fieldsValues.nameValue}
            onChange={(event) => {
              setFieldsValues({
                nameValue: event.target.value,
                emailValue: fieldsValues.emailValue,
                textValue: fieldsValues.textValue,
              });

              setErrors({
                nameError: false,
                emailError: errors.emailError,
                textError: errors.textError,
              });
            }}
          />

          <span className="icon is-small is-left">
            <i className="fas fa-user" />
          </span>

          {errors.nameError && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>

        {errors.nameError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Name is required
          </p>
        )}
      </div>

      <div className="field" data-cy="EmailField">
        <label className="label" htmlFor="comment-author-email">
          Author Email
        </label>

        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="email"
            id="comment-author-email"
            placeholder="email@test.com"
            className={`input ${errors.emailError ? 'is-danger' : ''}`}
            value={fieldsValues.emailValue}
            onChange={(event) => {
              setFieldsValues({
                nameValue: fieldsValues.nameValue,
                emailValue: event.target.value,
                textValue: fieldsValues.textValue,
              });

              setErrors({
                nameError: errors.nameError,
                emailError: false,
                textError: errors.textError,
              });
            }}
          />

          <span className="icon is-small is-left">
            <i className="fas fa-envelope" />
          </span>

          {errors.emailError && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>

        {errors.emailError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Email is required
          </p>
        )}
      </div>

      <div className="field" data-cy="BodyField">
        <label className="label" htmlFor="comment-body">
          Comment Text
        </label>

        <div className="control">
          <textarea
            id="comment-body"
            name="body"
            placeholder="Type comment here"
            className={`textarea ${errors.textError ? 'is-danger' : ''}`}
            value={fieldsValues.textValue}
            onChange={(event) => {
              setFieldsValues({
                nameValue: fieldsValues.nameValue,
                emailValue: fieldsValues.emailValue,
                textValue: event.target.value,
              });

              setErrors({
                nameError: errors.nameError,
                emailError: errors.emailError,
                textError: false,
              });
            }}
          />
        </div>

        {errors.textError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Enter some text
          </p>
        )}
      </div>

      {cantAddError && (
        <p className="is-danger notification" data-cy="CantAddComment">
          Cant`t add comment
        </p>
      )}

      <div className="field is-grouped">
        <div className="control">
          <button
            type="submit"
            className={`button is-link ${commentAddingLoading ? 'is-loading' : ''}`}
          >
            Add
          </button>
        </div>

        <div className="control">
          {/* eslint-disable-next-line react/button-has-type */}
          <button
            type="reset"
            className="button is-link is-light"
            onClick={() => {
              setErrors({
                nameError: false,
                emailError: false,
                textError: false,
              });
              setFieldsValues({
                nameValue: '',
                emailValue: '',
                textValue: '',
              });
            }}
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
};
