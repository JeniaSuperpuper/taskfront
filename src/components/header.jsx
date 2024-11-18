import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Modal from './Modal';
import LoginForm from './LoginForm';
import RegisterForm from './RegistForm';
import ProfileForm from './ProfileForm';
import AddProjectForm from './AddProjectForm';
import AddTaskForm from './AddTaskForm';
import DeleteProjectForm from './DeleteProjectForm';
import MessagesComponent from './MessagesList';
import axios from 'axios';

function Header() {
  const [registerModalActive, setRegisterModalActive] = useState(false);
  const [loginModalActive, setLoginModalActive] = useState(false);
  const [messageModalActive, setMessageModalActive] = useState(false);
  const [addProjectModalActive, setAddProjectModalActive] = useState(false);
  const [deleteProjectModalActive, setDeleteProjectModalActive] = useState(false);
  const [addTaskModalActive, setAddTaskModalActive] = useState(false);
  const [profileModalActive, setProfileModalActive] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [messageCount, setMessageCount] = useState(0); // Добавляем состояние для количества сообщений

  useEffect(() => {
    const checkLoggedIn = () => {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        setIsLoggedIn(true);
        try {
          const decodedToken = jwtDecode(accessToken);
          setUserId(decodedToken.user_id); // Предполагается, что поле user_id содержит userId
          setIsAdmin(decodedToken.is_superuser); // Используем поле is_superuser для проверки роли администратора
        } catch (error) {
          console.error('Error decoding JWT token:', error);
        }
      }
    };

    checkLoggedIn();

    // Настройка axios interceptors
    axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          handleLogout();
        }
        return Promise.reject(error);
      }
    );
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
    setUserId(null);
    setIsAdmin(false);
  };

  return (
    <div className="Header">
      {isLoggedIn ? (
        <>
          {isAdmin && (
            <div className="admin_buttons_wrap">
              <button className='button' onClick={() => setAddProjectModalActive(true)}>Добавить проект</button>
              <Modal active={addProjectModalActive} setActive={setAddProjectModalActive}>
                <AddProjectForm />
              </Modal>
              <button className='button' onClick={() => setDeleteProjectModalActive(true)}>Удалить проект</button>
              <Modal active={deleteProjectModalActive} setActive={setDeleteProjectModalActive}>
                <DeleteProjectForm />
              </Modal>
              <button className='button' onClick={() => setAddTaskModalActive(true)}>Добавить задачу</button>
              <Modal active={addTaskModalActive} setActive={setAddTaskModalActive}>
                <AddTaskForm />
              </Modal>
            </div>
          )}
          <button onClick={handleLogout} className='button'>Logout</button>
          <button onClick={() => setProfileModalActive(true)} className='button'>Profile</button>
          <Modal active={profileModalActive} setActive={setProfileModalActive}>
            <ProfileForm userId={userId} />
          </Modal>
          <button onClick={() => setMessageModalActive(true)} className='button'>Messages ({messageCount})</button> {/* Отображаем количество сообщений */}
          <Modal active={messageModalActive} setActive={setMessageModalActive}>
            <MessagesComponent setMessageCount={setMessageCount} /> {/* Передаем функцию для обновления количества сообщений */}
          </Modal>
        </>
      ) : (
        <>
          <button onClick={() => setRegisterModalActive(true)} className='button'>Login</button>
          <Modal active={registerModalActive} setActive={setRegisterModalActive}>
            <LoginForm setIsLoggedIn={setIsLoggedIn} />
          </Modal>

          <button onClick={() => setLoginModalActive(true)} className='button'>Register</button>
          <Modal active={loginModalActive} setActive={setLoginModalActive}>
            <RegisterForm setIsLoggedIn={setIsLoggedIn} />
          </Modal>
        </>
      )}
    </div>
  );
}

export default Header;