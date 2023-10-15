/* eslint-disable no-console */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

export const UserSelector: React.FC = () => {
  const [menuActive, setMenuActive] = useState(false);

  const {
    users,
    selectedUser,
    updateSelectedUser,
  } = useContext(AppContext);

  return (
    <div
      data-cy="UserSelector"
      className={`dropdown ${menuActive ? 'is-active' : ''}`}
    >
      <div className="dropdown-trigger">
        <button
          type="button"
          className="button"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={() => {
            setMenuActive(!menuActive);
          }}
        >
          <span>
            {users.find((user) => {
              return user.id === selectedUser;
            })?.name || 'Choose a user' }
          </span>

          <span className="icon is-small">
            <i className="fas fa-angle-down" aria-hidden="true" />
          </span>
        </button>
      </div>

      <div
        className="dropdown-menu"
        id="dropdown-menu"
        role="menu"
      >
        <div className="dropdown-content">
          {users.map(user => (
            <a
              key={user.id}
              href={`user-${user.id}`}
              className={`dropdown-item ${selectedUser === user.id ? 'is-active' : ''}`}
              onClick={(event) => {
                event.preventDefault();
                setMenuActive(false);

                if (selectedUser !== user.id) {
                  updateSelectedUser(user.id);
                }
              }}
            >
              {user.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
