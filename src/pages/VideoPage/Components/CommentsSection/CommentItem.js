import React from "react";
import styles from "./CommentsSection.module.scss";

const CommentItem = ({ name, content }) => {
    return (
        <div className={styles.commentItem}>
            <strong>{name}</strong>
            <p>{content}</p>
        </div>
    );
};

export default CommentItem;
