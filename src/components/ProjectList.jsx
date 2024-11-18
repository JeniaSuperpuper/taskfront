import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const ProjectList = ({ onProjectSelect }) => {
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [sortBy, setSortBy] = useState('created_asc'); // По умолчанию сортировка по времени создания (от старых к новым)
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isSuperuser, setIsSuperuser] = useState(false);
    const [editingProjectId, setEditingProjectId] = useState(null);
    const [editedProject, setEditedProject] = useState({
        title: '',
        description: '',
        status: 'AC',
        project_users: [],
    });

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

        // Декодируем JWT-токен для получения user_id и is_superuser
        const token = localStorage.getItem('access_token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setCurrentUserId(decodedToken.user_id);
            setIsSuperuser(decodedToken.is_superuser);
        }

        fetchProjects();
        fetchUsers();
    }, []);

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const applySort = () => {
        let sortedProjects = [...projects];

        switch (sortBy) {
            case 'created_asc':
                sortedProjects.sort((a, b) => new Date(a.created) - new Date(b.created));
                break;
            case 'created_desc':
                sortedProjects.sort((a, b) => new Date(b.created) - new Date(a.created));
                break;
            case 'updated_asc':
                sortedProjects.sort((a, b) => new Date(a.update) - new Date(b.update));
                break;
            case 'updated_desc':
                sortedProjects.sort((a, b) => new Date(b.update) - new Date(a.update));
                break;
            case 'title_asc':
                sortedProjects.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'title_desc':
                sortedProjects.sort((a, b) => b.title.localeCompare(a.title));
                break;
            default:
                break;
        }

        setProjects(sortedProjects);
    };

    const filterProjectsByUser = () => {
        if (isSuperuser) {
            return projects; // Суперпользователь видит все проекты
        } else if (currentUserId) {
            return projects.filter(project => project.project_users.includes(currentUserId) && project.status === 'AC');
        }
        return [];
    };

    const filteredProjects = filterProjectsByUser();

    const handleEditProject = (projectId) => {
        if (!isSuperuser) return; // Только суперпользователь может редактировать проекты

        const projectToEdit = projects.find(project => project.id === projectId);
        if (projectToEdit) {
            setEditedProject({
                title: projectToEdit.title,
                description: projectToEdit.description,
                status: projectToEdit.status,
                project_users: projectToEdit.project_users,
            });
            setEditingProjectId(projectId);
        }
    };

    const handleSaveProject = async () => {
        if (!isSuperuser) return; // Только суперпользователь может сохранять изменения

        try {
            await axios.put(`http://127.0.0.1:8000/api/v1/projects/${editingProjectId}/`, editedProject, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            const updatedProjects = projects.map(project => project.id === editingProjectId ? { ...project, ...editedProject } : project);
            setProjects(updatedProjects);
            setEditingProjectId(null);
        } catch (error) {
            setError('Ошибка при сохранении проекта');
        }
    };

    const handleCancelEdit = () => {
        setEditingProjectId(null);
    };

    const handleUserChange = (e) => {
        const options = e.target.options;
        const value = [];
        for (let i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        setEditedProject({ ...editedProject, project_users: value });
    };

    return (
        <div className="project-list-container">
            <div className="sort-controls">
                <label className='label_sort' htmlFor="sortBy">Сортировать по:</label>
                <select  className='sort_by' id="sortBy" value={sortBy} onChange={handleSortChange}>
                    <option value="created_asc">Времени создания (от старых к новым)</option>
                    <option value="created_desc">Времени создания (от новых к старым)</option>
                    <option value="updated_asc">Времени обновления (от старых к новым)</option>
                    <option value="updated_desc">Времени обновления (от новых к старым)</option>
                    <option value="title_asc">Названию (от А до Я)</option>
                    <option value="title_desc">Названию (от Я до А)</option>
                </select>
                <button className='button' onClick={applySort}>Применить сортировку</button>
            </div>
            {error && <div className="error-message">{error}</div>}
            {editingProjectId ? (
                <div className="edit-project-form">
                    <h3>Редактирование проекта</h3>
                    <div>
                        <label htmlFor="title">Название проекта:</label>
                        <input
                            type="text"
                            id="title"
                            value={editedProject.title}
                            onChange={(e) => setEditedProject({ ...editedProject, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="description">Описание:</label>
                        <textarea
                            id="description"
                            value={editedProject.description}
                            onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="status">Статус:</label>
                        <select
                            id="status"
                            value={editedProject.status}
                            onChange={(e) => setEditedProject({ ...editedProject, status: e.target.value })}
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
                            value={editedProject.project_users}
                            onChange={handleUserChange}
                        >
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.username}</option>
                            ))}
                        </select>
                    </div>
                    <button type='submit' className='button' onClick={handleSaveProject}>Сохранить</button>
                    <button type='submit' className='button' onClick={handleCancelEdit}>Отмена</button>
                </div>
            ) : (
                <ul className="project-list">
                    {filteredProjects.map(project => (
                        <li key={project.id} className="project-item">
                            {isSuperuser && (
                                <div className="buttons_wrap">
                                    <button className="edit-button button" onClick={() => handleEditProject(project.id)}>Редактировать</button>
                                </div>
                            )}
                            <div onClick={() => onProjectSelect(project.id)}>
                                <h3>{project.title}</h3>
                                <p>{project.description}</p>
                                <p>Статус: {project.status === 'AC' ? 'Active' : 'Archive'}</p>
                                <p>Создан: {new Date(project.created).toLocaleString()}</p>
                                <p>Обновлен: {new Date(project.update).toLocaleString()}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProjectList;