import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import CommentList from './CommentList';

const TaskList = ({ projectId, onBack }) => {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editedTask, setEditedTask] = useState({
        title: '',
        description: '',
        project: '',
        executor: '',
        status: 'GR',
        priority: 'LW',
        term: '',
        responsible_for_test: ''
    });
    const [isSuperuser, setIsSuperuser] = useState(false);
    const [sortBy, setSortBy] = useState('created_asc'); // По умолчанию сортировка по времени создания (от старых к новым)

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/v1/projects/${projectId}/tasks/`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                });
                setTasks(response.data);
            } catch (error) {
                setError('Ошибка при загрузке задач');
            }
        };

        const checkSuperuser = () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                const decodedToken = jwtDecode(token);
                setIsSuperuser(decodedToken.is_superuser);
            }
        };

        if (projectId) {
            fetchTasks();
            checkSuperuser();
        }
    }, [projectId]);

    const handleEditTask = (taskId) => {
        const taskToEdit = tasks.find(task => task.id === taskId);
        if (taskToEdit) {
            setEditedTask({
                title: taskToEdit.title,
                description: taskToEdit.description,
                project: taskToEdit.project,
                executor: taskToEdit.executor,
                status: taskToEdit.status,
                priority: taskToEdit.priority,
                term: taskToEdit.term,
                responsible_for_test: taskToEdit.responsible_for_test
            });
            setEditingTaskId(taskId);
        }
    };

    const handleSaveTask = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/v1/tasks/${editingTaskId}/`, editedTask, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            const updatedTasks = tasks.map(task => task.id === editingTaskId ? { ...task, ...editedTask } : task);
            setTasks(updatedTasks);
            setEditingTaskId(null);
        } catch (error) {
            setError('Ошибка при сохранении задачи');
        }
    };

    const handleCancelEdit = () => {
        setEditingTaskId(null);
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/v1/tasks/${taskId}/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            const updatedTasks = tasks.filter(task => task.id !== taskId);
            setTasks(updatedTasks);
        } catch (error) {
            setError('Ошибка при удалении задачи');
        }
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const applySort = () => {
        let sortedTasks = [...tasks];

        switch (sortBy) {
            case 'status_asc':
                sortedTasks.sort((a, b) => a.status.localeCompare(b.status));
                break;
            case 'status_desc':
                sortedTasks.sort((a, b) => b.status.localeCompare(a.status));
                break;
            case 'priority_asc':
                sortedTasks.sort((a, b) => a.priority.localeCompare(b.priority));
                break;
            case 'priority_desc':
                sortedTasks.sort((a, b) => b.priority.localeCompare(a.priority));
                break;
            case 'executor_asc':
                sortedTasks.sort((a, b) => a.executor.localeCompare(b.executor));
                break;
            case 'executor_desc':
                sortedTasks.sort((a, b) => b.executor.localeCompare(a.executor));
                break;
            default:
                break;
        }

        setTasks(sortedTasks);
    };

    return (
        <div className="task-list-container">
            <button className="back-button" onClick={onBack}>Назад</button>
            <div className="sort-controls">
                <label htmlFor="sortBy">Сортировать по:</label>
                <select id="sortBy" value={sortBy} onChange={handleSortChange}>
                    <option value="status_asc">Статусу (от А до Я)</option>
                    <option value="status_desc">Статусу (от Я до А)</option>
                    <option value="priority_asc">Приоритету (от А до Я)</option>
                    <option value="priority_desc">Приоритету (от Я до А)</option>
                    <option value="executor_asc">Исполнителю (от А до Я)</option>
                    <option value="executor_desc">Исполнителю (от Я до А)</option>
                </select>
                <button className='button' onClick={applySort}>Применить сортировку</button>
            </div>
            {error && <div className="error-message">{error}</div>}
            {editingTaskId ? (
                <div className="edit-task-form">
                    <h3>Редактирование задачи</h3>
                    <div>
                        <label htmlFor="title">Название задачи:</label>
                        <input
                            type="text"
                            id="title"
                            value={editedTask.title}
                            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="description">Описание:</label>
                        <textarea
                            id="description"
                            value={editedTask.description}
                            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="status">Статус:</label>
                        <select
                            id="status"
                            value={editedTask.status}
                            onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
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
                            value={editedTask.priority}
                            onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
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
                            value={editedTask.term}
                            onChange={(e) => setEditedTask({ ...editedTask, term: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="responsibleForTest">Ответственный за тестирование:</label>
                        <input
                            type="text"
                            id="responsibleForTest"
                            value={editedTask.responsible_for_test}
                            onChange={(e) => setEditedTask({ ...editedTask, responsible_for_test: e.target.value })}
                        />
                    </div>
                    <button type='submit' className='button' onClick={handleSaveTask}>Сохранить</button>
                    <button type='submit' className='button' onClick={handleCancelEdit}>Отмена</button>
                </div>
            ) : (
                <ul className="task-list">
                    {tasks.map(task => (
                        <li key={task.id} className="task-item">
                            {isSuperuser && (
                                <>
                                    <div className="buttons_wrap"> 
                                        <button className="edit-button button" onClick={() => handleEditTask(task.id)}>Редактировать</button>
                                        <button className="delete-button button" onClick={() => handleDeleteTask(task.id)}>Удалить</button>
                                    </div>
                                </>
                            )}
                            <h3>{task.title}</h3>
                            <p>{task.description}</p>
                            <p className="status" data-label="Статус">{task.status === 'GR' ? 'Grooming' : task.status === 'IP' ? 'In Progress' : task.status === 'DV' ? 'Dev' : 'Done'}</p>
                            <p className="priority" data-label="Приоритет">{task.priority === 'LW' ? 'Low' : task.priority === 'AR' ? 'Average' : 'High'}</p>
                            <p>Создана: {new Date(task.created).toLocaleString()}</p>
                            <p>Обновлена: {new Date(task.update).toLocaleString()}</p>
                            <p>Срок: {new Date(task.term).toLocaleDateString()}</p>
                            <p className="responsible-for-test">{task.responsible_for_test}</p>
                            <CommentList taskId={task.id} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TaskList;