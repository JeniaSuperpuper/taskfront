import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = () => {
    const [username, setUsername] = useState('');   
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); 

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/token/', {
                username,
                password
            });

            // Сохраняем токен в localStorage или другом хранилище
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);

            // Перенаправляем пользователя на нужную страницу
            window.location.href = '/';
        } catch (error) {
            setError('Неверное имя пользователя или пароль');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <h3 className='form__title'>Login</h3>
            <div>
                <label htmlFor="username">Имя пользователя:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="password">Пароль:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <button className='button' type="submit">Войти</button>
        </form>
    );
};

export default LoginForm;