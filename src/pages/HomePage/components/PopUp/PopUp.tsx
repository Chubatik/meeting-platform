import React from 'react'

import classes from './PopUp.module.scss'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const PopUp = ({ trigger, setTrigger }) => {
  return (
    trigger && (
      <div className={classes.popUpWrapper}>
        <button onClick={() => setTrigger(false)}>
          <svg width="32" height="31" viewBox="0 0 32 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30.1426 1.35791L1.85831 29.6422" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M30.1426 29.6421L1.85831 1.35782" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <div className={classes.popUpInner}>
          <h2>Create the new meeting</h2>
          <label htmlFor="username">User name</label>
          <input type="text" name="username" placeholder="Your Name" />
          <div className={classes.linkWrapper}>
            <div className={classes.linkInput}>
              <label htmlFor="link">Copy Link</label>
              <input type="text" name="link" value="https://CreWeb/call/..." />
            </div>
            <button>
              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9.5 12.5H15.5"
                  stroke="#FF7E05"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.5 6.5H16.5C18.0913 6.5 19.6174 7.13214 20.7426 8.25736C21.8679 9.38258 22.5 10.9087 22.5 12.5C22.5 14.0913 21.8679 15.6174 20.7426 16.7426C19.6174 17.8679 18.0913 18.5 16.5 18.5H15.5"
                  stroke="#FF7E05"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.5 18.5H8.5C6.9087 18.5 5.38258 17.8679 4.25736 16.7426C3.13214 15.6174 2.5 14.0913 2.5 12.5C2.5 10.9087 3.13214 9.38258 4.25736 8.25736C5.38258 7.13214 6.9087 6.5 8.5 6.5H9.5"
                  stroke="#FF7E05"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Copy Link
            </button>
          </div>
          <button>Join</button>
        </div>
      </div>
    )
  )
}
