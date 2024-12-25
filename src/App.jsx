import React, { useState, useEffect } from "react";
import Chat from "./components/Chat";
import { FaMoon, FaSun, FaBars, FaTimes, FaGithub, FaRobot } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

const STORAGE_KEY = 'jarvis_chat_messages';
const THEME_KEY = 'jarvis_theme';

const saveMessagesToStorage = (messages) => {
  try {
    if (!Array.isArray(messages)) {
      console.error('Invalid messages format');
      return false;
    }
    
    const serializedMessages = JSON.stringify(messages);
    localStorage.setItem(STORAGE_KEY, serializedMessages);
    console.log('Successfully saved messages:', messages);
    
    // Verify the save
    const verification = localStorage.getItem(STORAGE_KEY);
    if (!verification) {
      console.error('Save verification failed');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving messages:', error);
    return false;
  }
};

const loadMessagesFromStorage = () => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (!savedData) {
      console.log('No saved messages found');
      return null;
    }

    const messages = JSON.parse(savedData);
    if (!Array.isArray(messages)) {
      console.error('Invalid saved messages format');
      return null;
    }

    console.log('Successfully loaded messages:', messages);
    return messages;
  } catch (error) {
    console.error('Error loading messages:', error);
    return null;
  }
};

const App = () => {
  const [messages, setMessages] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved data when component mounts
  useEffect(() => {
    // Load messages
    const savedMessages = loadMessagesFromStorage();
    if (savedMessages && savedMessages.length > 0) {
      setMessages(savedMessages);
      setIsInitialized(true);
      console.log('Initialized with saved messages:', savedMessages);
    }

    // Load theme
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme !== null) {
      setDarkMode(savedTheme === "dark");
      console.log('Loaded theme:', savedTheme);
    }
  }, []);

  // Save messages whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      saveMessagesToStorage(messages);
    }
  }, [messages]);

  const handleSaveChat = (newMessages) => {
    if (!Array.isArray(newMessages)) {
      console.error('Invalid messages format in handleSaveChat');
      return;
    }
    
    setMessages(newMessages);
    console.log('Saving new messages:', newMessages);
  };

  const handleClearConversation = () => {
    setMessages([]);
    setIsInitialized(false);
    localStorage.removeItem(STORAGE_KEY);
    console.log('Cleared conversation');
  };

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem(THEME_KEY, newTheme ? "dark" : "light");
    console.log('Theme toggled:', newTheme ? "dark" : "light");
  };

  return (
    <motion.div 
      className={`app-wrapper ${darkMode ? 'dark' : 'light'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header className="top-header">
        <motion.button 
          className="menu-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? <FaTimes /> : <FaBars />}
        </motion.button>
        
        <motion.div 
          className="header-title"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <FaRobot className="logo-icon" />
          <span className="title-text">Jarvis</span>
          <motion.span 
            className="version-tag"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            Pro
          </motion.span>
        </motion.div>

        <div className="header-actions">
          <motion.button 
            className="theme-toggle"
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </motion.button>
          <motion.a
            href="https://github.com/yourusername/your-repo"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaGithub />
          </motion.a>
        </div>
      </header>

      <div className="main-container">
        <AnimatePresence>
          {showSidebar && (
            <motion.aside 
              className="sidebar"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="sidebar-content">
                <motion.button 
                  className="clear-chat-button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClearConversation}
                >
                  Clear conversations
                </motion.button>
                <div className="sidebar-info">
                  <h3>About Jarvis</h3>
                  <p>Your advanced AI assistant, ready to help with any task.</p>
                </div>
                <div className="sidebar-footer">
                  <p>© 2024 PW Security</p>
                  <p>Version 2.0.0</p>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <motion.main 
          className={`chat-area ${!showSidebar ? 'full-width' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Chat
            chatId="singleChat"
            messages={messages}
            darkMode={darkMode}
            onSaveChat={handleSaveChat}
            isInitialized={isInitialized}
          />
        </motion.main>
      </div>
    </motion.div>
  );
};

export default App;