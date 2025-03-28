import React from 'react';

const CommentHeader = ({ author, anonymousAuthor, createdAt }) => {
  const formattedDate = new Date(createdAt).toLocaleString();

  return (
    <div
      style={{
        width: '400px',
        height: '100px',
        backgroundColor: '#f9f9f9',
        borderRadius: '15px 15px 0 0', // Закруглені лише верхні кути
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
      }}
    >
      <div>
        <strong>
          {author ? author.username : anonymousAuthor ? anonymousAuthor.username : 'Анонім'}
          {author ? '' : ' (Анонім)'}
        </strong>
        <p style={{ margin: '5px 0', fontSize: '12px', color: '#777' }}>
          {author ? author.email : anonymousAuthor ? anonymousAuthor.email : 'Немає емайлу'}
        </p>
      </div>
      <div style={{ fontSize: '12px', color: '#777' }}>{formattedDate}</div>
    </div>
  );
};

export default CommentHeader;
