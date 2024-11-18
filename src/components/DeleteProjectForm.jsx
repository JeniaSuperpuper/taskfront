import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeleteProjectForm = () => {
    const [project, setProject] = useState('');
    const [error, setError] = useState('');
    const [projects, setProjects] = useState([]);

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

        fetchProjects();
    }, []);

    const handleDelete = async () => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/v1/projects/${project}/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            // Обновляем список проектов
            const updatedProjects = projects.filter(proj => proj.id !== project);
            setProjects(updatedProjects);
            setProject('');
            setError('');
        } catch (error) {
            setError('Ошибка при удалении проекта');
        }
    };

    return (
        <form>
            <div>
                <label htmlFor="project">Выберите проект для удаления:</label>
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
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <button className='button' type="submit" onClick={handleDelete}>Удалить проект</button>
        </form>
    );
};

export default DeleteProjectForm;