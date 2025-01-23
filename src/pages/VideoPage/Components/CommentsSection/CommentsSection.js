import React from "react";
import styles from "./CommentsSection.module.scss";
import CommentItem from "./CommentItem";

const CommentsSection = () => {
  const comments = [
    { id: 1, name: "Vợ anh Gấu🐼", content: "mono đăng lại kìa" },
    { id: 2, name: "Mike", content: "quay rồi mà lại cắt đoạn bạn áo xanh..." },
  ];

  return (
    <div className={styles.commentsSection}>
      {comments.map((comment) => (
        <CommentItem key={comment.id} name={comment.name} content={comment.content} />
      ))}
    </div>
  );
};

export default CommentsSection;
