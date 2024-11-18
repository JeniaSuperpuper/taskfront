import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AddCommentForm = ({ taskId, onCommentAdded }) => {
    const [body, setBody] = useState('');
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUsername(decodedToken.username);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/v1/tasks/${taskId}/comments/`, {
                name: username,
                body,
                task: taskId
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            // Очищаем форму после успешного добавления
            setBody('');
            setError('');

            // Вызываем функцию обратного вызова для обновления списка комментариев
            onCommentAdded(response.data);
        } catch (error) {
            setError('Ошибка при добавлении комментария');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-comment-form">
            <div className='comment_wrap'>
                <label className='comment_label' htmlFor="body">Комментарий:</label>
                <textarea 
                className='comment'
                    id="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button className='comment_button button' type="submit">Добавить комментарий</button>
        </form>
    );
};

export default AddCommentForm;