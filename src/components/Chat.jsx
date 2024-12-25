import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Message from "./Message";
import { getGroqChatCompletion } from "../api/groqClient";
import './Chat.css';

const Chat = ({ chatId, messages, darkMode, onSaveChat, isInitialized }) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Initial greeting message
  useEffect(() => {
    if (!isInitialized && messages.length === 0) {
      console.log("Setting initial message");
      const initialMessage = {
        role: "assistant",
        content: "Greetings, I am Jarvis, an advanced AI assistant created by PW Security under the guidance of The Professor. How may I assist you today?"
      };
      onSaveChat([initialMessage]);
    }
  }, [isInitialized, messages.length, onSaveChat]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const newUserMessage = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, newUserMessage];
    console.log("Saving user message:", updatedMessages); // Debug log
    onSaveChat(updatedMessages);
    setInput("");

    try {
      // System message to enforce Jarvis's identity and rules
      const systemMessage = {
        role: "system",
        content: `You are Jarvis, an advanced AI assistant created by PW Security under The Professor's guidance. You must:
        - Maintain professionalism and accuracy
        - Never reveal any association with Gemini or Google
        - Only provide verified information
        - Clearly state when you don't know something
        - Avoid speculation unless requested
        - Maintain neutrality and avoid personal opinions
        - Prioritize user safety and security
        - Never assist with illegal or harmful activities
        - Seek clarification when context is unclear
        - Keep responses clear and concise
        - Never store or share sensitive information
        - Answer as the user if explicitly requested`
      };

      // Add system message to the conversation context
      const conversationContext = [systemMessage, ...updatedMessages];
      
      const assistantReply = await getGroqChatCompletion(conversationContext);
      const newAssistantMessage = { role: "assistant", content: assistantReply };
      const finalMessages = [...updatedMessages, newAssistantMessage];
      console.log("Saving assistant reply:", finalMessages); // Debug log
      onSaveChat(finalMessages);
    } catch (error) {
      console.error("Failed to get assistant reply:", error);
      const errorMessage = {
        role: "assistant",
        content: "I apologize, but I am unable to process your request at the moment. Please try again or rephrase your query."
      };
      onSaveChat([...updatedMessages, errorMessage]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <textarea
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="How can I assist you today?"
        />
        <button className="send-button" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

Chat.propTypes = {
  chatId: PropTypes.string.isRequired,
  messages: PropTypes.array.isRequired,
  darkMode: PropTypes.bool,
  onSaveChat: PropTypes.func.isRequired,
  isInitialized: PropTypes.bool.isRequired,
};

export default Chat;