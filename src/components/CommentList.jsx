import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddCommentForm from './AddCommentForm';

const CommentList = ({ taskId }) => {
    const [comments, setComments] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/v1/tasks/${taskId}/comments/`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                });
                setComments(response.data);
            } catch (error) {
                setError('Ошибка при загрузке комментариев');
            }
        };

        if (taskId) {
            fetchComments();
        }
    }, [taskId]);

    const handleCommentAdded = (newComment) => {
        setComments([...comments, newComment]);
    };

    return (
        <div className="comment-list-container">
            {error && <div className="error-message">{error}</div>}
            <ul className="comment-list">
                {comments.map(comment => (
                    <li key={comment.id} className="comment-item">
                        <p className="comment-name">{comment.name}</p>
                        <p className="comment-body">{comment.body}</p>
                        <p className="comment-created">Создан: {new Date(comment.create).toLocaleDateString()}</p>
                        <p className="comment-updated">Обновлен: {new Date(comment.update).toLocaleDateString()}</p>
                    </li>
                ))}
            </ul>
            <div className="CommentForm">
                <AddCommentForm taskId={taskId} onCommentAdded={handleCommentAdded} />
            </div>

        </div>
    );
};

export default CommentList;