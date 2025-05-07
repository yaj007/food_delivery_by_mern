import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaRobot, FaUser, FaPaperPlane, FaTimes } from 'react-icons/fa';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I'm your TastyTracks assistant. How can I help you today?", 
      sender: 'bot' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.post('http://localhost:3001/chatbot', {
        message: input
      }, { headers });
      
      // Add bot response after a small delay to simulate typing
      setTimeout(() => {
        setMessages(prev => [...prev, { text: response.data.response, sender: 'bot' }]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      
      // Add error message
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: "Sorry, I'm having trouble connecting right now. Please try again later.", 
          sender: 'bot' 
        }]);
        setIsTyping(false);
      }, 1000);
    }
  };

  return (
    <>
      {/* Chatbot toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-full shadow-lg z-50"
      >
        {isOpen ? <FaTimes /> : <FaRobot />}
      </button>
      
      {/* Chatbot window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 md:w-96 bg-gray-800 dark:bg-white rounded-lg shadow-xl z-50 flex flex-col max-h-[500px]">
          {/* Header */}
          <div className="bg-teal-600 text-white p-4 rounded-t-lg flex items-center">
            <FaRobot className="mr-2" />
            <h3 className="font-medium">TastyTracks Assistant</h3>
          </div>
          
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto max-h-[350px]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-teal-600 text-white rounded-tr-none'
                      : 'bg-gray-700 dark:bg-gray-200 text-white dark:text-gray-800 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start mb-3">
                <div className="bg-gray-700 dark:bg-gray-200 text-white dark:text-gray-800 p-3 rounded-lg rounded-tl-none max-w-[80%]">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 dark:border-gray-300">
            <div className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 bg-gray-700 dark:bg-gray-200 text-white dark:text-gray-800 rounded-l-lg focus:outline-none"
              />
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-r-lg"
              >
                <FaPaperPlane />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default Chatbot;
