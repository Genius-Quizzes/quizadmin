import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './styles.css';

// Import the new components
import Dashboard from './dashboard';
import QuestionManagement from './questionManage';
import UploadQuestion from './uploadquestion';
import UserManage from './usermanagement';

// Firebase imports
import { db } from './firebase'; 
import { collection, getDocs } from 'firebase/firestore';

const App = () => {
  // State to manage the search query
  const [searchQuery, setSearchQuery] = useState('');

  // Function to handle change in search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Router>
      <div className="macbook-pro">
        {/* Sidebar */}
        <div className="sidebar">
          <h1 className="admin-title">Genius Quizzes<br />Admin</h1>

          <Link to="/" className="menu-item">
            <img src="Home.svg" alt="Home Icon" className="icon" />
            <p>Dashboard</p>
          </Link>

          <Link to="/question-management" className="menu-item">
            <img src="Question.svg" alt="Question Icon" className="icon" />
            <p>Question Management</p>
          </Link>

          <Link to="/upload" className="menu-item">
            <img src="Upload.svg" alt="Upload Icon" className="icon" />
            <p>Upload Questions</p>
          </Link>

          <Link to="/user-management" className="menu-item">
            <img src="UserManage.svg" alt="User Icon" className="icon" />
            <p>User Management</p>
          </Link>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="top-bar">
            <div className="search-bar">
              <img src="Search.svg" alt="Search Icon" className="search-icon" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>
            <div className="user-controls">
              <div className="logout">
                <p>Log Out</p>
              </div>
              <div className="admin-button">
                <p>Admin</p>
              </div>
            </div>
          </div>

          {/* Define the Routes here */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/question-management" element={<QuestionManagement />} />
            <Route path="/upload" element={<UploadQuestion />} />
            <Route path="/user-management" element={<UserManage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
