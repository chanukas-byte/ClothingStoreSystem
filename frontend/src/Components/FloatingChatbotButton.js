import React from "react";
import { useNavigate } from "react-router-dom";
import { FaComments } from "react-icons/fa";

export default function FloatingChatbotButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/finance-chatbot')}
      style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        zIndex: 9999,
        background: '#2563eb',
        color: '#fff',
        border: 'none',
        borderRadius: '50%',
        width: '56px',
        height: '56px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        cursor: 'pointer',
        transition: 'background 0.2s',
      }}
      title="Open Finance Chatbot"
    >
      <FaComments />
    </button>
  );
}