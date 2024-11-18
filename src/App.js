import React, { useState } from 'react';
import ProjectList from './components/ProjectList';
import TaskList from './components/TaskList';
import './App.css';
import Header from './components/header';

function App() {
  const [selectedProjectId, setSelectedProjectId] = useState(null);


  const handleProjectSelect = (projectId) => {
    setSelectedProjectId(projectId);
  };

  const handleBack = () => {
    setSelectedProjectId(null);
  };

  return (
    <div className="App">
      <Header />
      {selectedProjectId ? (
        <>
          <TaskList projectId={selectedProjectId} onBack={handleBack} />
        </>
      ) : (
        <>
          <ProjectList onProjectSelect={handleProjectSelect} />
        </>
      )}

    </div>
  );
}

export default App;