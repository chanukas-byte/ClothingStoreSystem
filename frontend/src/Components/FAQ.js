import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  const faqData = [
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. For international customers, we also accept various local payment methods depending on your region."
    },
    {
      question: "How long does shipping take?",
      answer: "Domestic shipping typically takes 3-5 business days. International shipping can take 7-14 business days depending on the destination country. Express shipping options are available at checkout for faster delivery."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Products must be unworn, in original condition, and include all tags and packaging. Return shipping costs are the responsibility of the customer unless the item was received damaged or incorrect."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. You can view shipping options and estimated delivery times during checkout."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a confirmation email with tracking information. You can also track your order by logging into your account and viewing your order history."
    },
    {
      question: "Are your products ethically sourced?",
      answer: "We are committed to ethical sourcing and sustainable practices. All our suppliers must adhere to our strict ethical guidelines, which include fair labor practices, safe working conditions, and environmental responsibility."
    },
    {
      question: "Do you offer gift wrapping?",
      answer: "Yes, we offer gift wrapping services for an additional fee. You can select this option during checkout, and we'll wrap your items in our elegant gift packaging with a personalized message if desired."
    },
    {
      question: "What sizes do you offer?",
      answer: "We offer a wide range of sizes from XS to XXL for most clothing items. Each product page includes detailed size charts to help you find the perfect fit. If you're unsure, we recommend ordering your usual size."
    }
  ];

  return (
    <div className="faq-container">
      <div className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about our products, shipping, returns, and more.</p>
      </div>
      
      <div className="faq-search">
        <input 
          type="text" 
          placeholder="Search for a question..." 
          className="faq-search-input"
        />
      </div>
      
      <div className="faq-categories">
        <button className="faq-category active">All Questions</button>
        <button className="faq-category">Shipping & Delivery</button>
        <button className="faq-category">Returns & Exchanges</button>
        <button className="faq-category">Payment & Pricing</button>
        <button className="faq-category">Product Information</button>
      </div>
      
      <div className="faq-accordion">
        {faqData.map((item, index) => (
          <div 
            key={index} 
            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
          >
            <div 
              className="faq-question"
              onClick={() => toggleAccordion(index)}
            >
              <h3>{item.question}</h3>
              <span className="faq-icon">
                {activeIndex === index ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>
            <div className="faq-answer">
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="faq-contact">
        <h2>Still have questions?</h2>
        <p>Our customer service team is here to help you with any questions you may have.</p>
        <Link to="/contact">
          <button className="contact-button">Contact Us</button>
        </Link>
      </div>
    </div>
  );
};

export default FAQ; 