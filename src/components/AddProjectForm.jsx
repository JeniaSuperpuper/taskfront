import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddProjectForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('AC');
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Загрузка списка пользователей
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/v1/users/', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                });
                setUsers(response.data);
            } catch (error) {
                setError('Ошибка при загрузке пользователей');
            }
        };

        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/projects/', {
                title,
                description,
                status,
                project_users: selectedUsers
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            // Очищаем форму после успешного добавления
            setTitle('');
            setDescription('');
            setStatus('AC');
            setSelectedUsers([]);
            setError('');

            // Обновляем список проектов
            window.location.reload();
        } catch (error) {
            setError('Ошибка при добавлении проекта');
        }
    };

    const handleUserChange = (e) => {
        const options = e.target.options;
        const value = [];
        for (let i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        setSelectedUsers(value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="title">Название проекта:</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="description">Описание:</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="status">Статус:</label>
                <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="AC">Active</option>
                    <option value="AR">Archive</option>
                </select>
            </div>
            <div>
                <label htmlFor="project_users">Пользователи проекта:</label>
                <select
                    id="project_users"
                    multiple
                    value={selectedUsers}
                    onChange={handleUserChange}
                >
                    {users.map(user => (
                        <option key={user.id} value={user.id}>{user.username}</option>
                    ))}
                </select>
            </div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <button className='button' type="submit">Добавить проект</button>
        </form>
    );
};

export default AddProjectForm;