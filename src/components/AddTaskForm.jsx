import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddTaskForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [project, setProject] = useState('');
    const [executor, setExecutor] = useState('');
    const [status, setStatus] = useState('GR');
    const [priority, setPriority] = useState('LW');
    const [term, setTerm] = useState('');
    const [responsibleForTest, setResponsibleForTest] = useState('');
    const [error, setError] = useState('');
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/v1/projects/', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                });
                setProjects(response.data);
            } catch (error) {
                setError('Ошибка при загрузке проектов');
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/v1/users', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                });
                setUsers(response.data);
            } catch (error) {
                setError('Ошибка при загрузке пользователей');
            }
        };

        fetchProjects();
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/tasks/', {
                title,
                description,
                project,
                executor,
                status,
                priority,
                term,
                responsible_for_test: responsibleForTest
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            // Очищаем форму после успешного добавления
            setTitle('');
            setDescription('');
            setProject('');
            setExecutor('');
            setStatus('GR');
            setPriority('LW');
            setTerm('');
            setResponsibleForTest('');
            setError('');

            // Обновляем список задач
            window.location.reload();
        } catch (error) {
            setError('Ошибка при добавлении задачи');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="title">Название задачи:</label>
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
                <label htmlFor="project">Проект:</label>
                <select
                    id="project"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                >
                    <option value="">Выберите проект</option>
                    {projects.map(proj => (
                        <option key={proj.id} value={proj.id}>{proj.title}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="executor">Исполнитель:</label>
                <select
                    id="executor"
                    value={executor}
                    onChange={(e) => setExecutor(e.target.value)}
                >
                    <option value="">Выберите исполнителя</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>{user.username}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="status">Статус:</label>
                <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="GR">Grooming</option>
                    <option value="IP">In Progress</option>
                    <option value="DV">Dev</option>
                    <option value="DN">Done</option>
                </select>
            </div>
            <div>
                <label htmlFor="priority">Приоритет:</label>
                <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value="LW">Low</option>
                    <option value="AR">Average</option>
                    <option value="HG">High</option>
                </select>
            </div>
            <div>
                <label htmlFor="term">Срок:</label>
                <input
                    type="date"
                    id="term"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="responsibleForTest">Ответственный за тестирование:</label>
                <input
                    type="text"
                    id="responsibleForTest"
                    value={responsibleForTest}
                    onChange={(e) => setResponsibleForTest(e.target.value)}
                />
            </div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <button className='button' type="submit">Добавить задачу</button>
        </form>
    );
};

export default AddTaskForm;