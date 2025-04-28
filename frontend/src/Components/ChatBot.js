import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hello! How can I help you today?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hello! How can I assist you today?';
    }
    else if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
      return 'We offer standard shipping (3-5 business days) and express shipping (1-2 business days). Shipping is free for orders over $50.';
    }
    else if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
      return 'You can return items within 30 days of delivery. Items must be unworn and in original condition with tags attached.';
    }
    else if (lowerMessage.includes('size') || lowerMessage.includes('sizing')) {
      return 'We provide detailed size charts for all our products. You can find them on each product page. If you need help finding your size, just let me know!';
    }
    else if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
      return 'We accept all major credit cards, PayPal, and Apple Pay. All transactions are secure and encrypted.';
    }
    else if (lowerMessage.includes('track') || lowerMessage.includes('order')) {
      return 'You can track your order using the tracking number sent to your email. You can also check your order status in your account dashboard.';
    }
    else if (lowerMessage.includes('contact') || lowerMessage.includes('support')) {
      return 'You can reach our customer support team at support@clothingstore.com or call us at 1-800-123-4567. We\'re available Monday to Friday, 9 AM to 5 PM EST.';
    }
    else {
      return 'I apologize, but I\'m not sure I understand. Could you please rephrase your question? You can ask me about shipping, returns, sizing, payments, order tracking, or contact information.';
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponse = {
        type: 'bot',
        content: getBotResponse(inputMessage),
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="chatbot-container">
      {!isOpen ? (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          <FaRobot />
        </button>
      ) : (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FaRobot className="chatbot-icon" />
              <h3>Customer Support</h3>
            </div>
            <button className="close-button" onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.type}`}>
                <div className="message-content">{message.content}</div>
                <div className="message-timestamp">{message.timestamp}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form className="chatbot-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              className="message-input"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit" className="send-button">
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot; 