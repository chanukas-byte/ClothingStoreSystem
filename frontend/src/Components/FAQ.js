import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const toggleAccordion = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setActiveIndex(null); // Close any open accordion when changing categories
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setActiveIndex(null); // Close any open accordion when searching
  };

  const faqData = [
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. For international customers, we also accept various local payment methods depending on your region.",
      category: "Payment & Pricing"
    },
    {
      question: "How long does shipping take?",
      answer: "Domestic shipping typically takes 3-5 business days. International shipping can take 7-14 business days depending on the destination country. Express shipping options are available at checkout for faster delivery.",
      category: "Shipping & Delivery"
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Products must be unworn, in original condition, and include all tags and packaging. Return shipping costs are the responsibility of the customer unless the item was received damaged or incorrect.",
      category: "Returns & Exchanges"
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. You can view shipping options and estimated delivery times during checkout.",
      category: "Shipping & Delivery"
    },
    {
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a confirmation email with tracking information. You can also track your order by logging into your account and viewing your order history.",
      category: "Shipping & Delivery"
    },
    {
      question: "Are your products ethically sourced?",
      answer: "We are committed to ethical sourcing and sustainable practices. All our suppliers must adhere to our strict ethical guidelines, which include fair labor practices, safe working conditions, and environmental responsibility.",
      category: "Product Information"
    },
    {
      question: "Do you offer gift wrapping?",
      answer: "Yes, we offer gift wrapping services for an additional fee. You can select this option during checkout, and we'll wrap your items in our elegant gift packaging with a personalized message if desired.",
      category: "Product Information"
    },
    {
      question: "What sizes do you offer?",
      answer: "We offer a wide range of sizes from XS to XXL for most clothing items. Each product page includes detailed size charts to help you find the perfect fit. If you're unsure, we recommend ordering your usual size.",
      category: "Product Information"
    }
  ];

  // Filter FAQ items based on category and search term
  const filteredFaqData = faqData.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['all', 'Shipping & Delivery', 'Returns & Exchanges', 'Payment & Pricing', 'Product Information'];

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
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      
      <div className="faq-categories">
        {categories.map((category) => (
          <button 
            key={category}
            className={`faq-category ${activeCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category === 'all' ? 'All Questions' : category}
          </button>
        ))}
      </div>
      
      <div className="faq-accordion">
        {filteredFaqData.length > 0 ? (
          filteredFaqData.map((item, index) => (
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
          ))
        ) : (
          <div className="no-results">
            <p>No questions found matching your criteria.</p>
          </div>
        )}
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