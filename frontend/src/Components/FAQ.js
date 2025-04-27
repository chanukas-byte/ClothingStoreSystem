import React, { useState } from 'react';
import './FAQ.css';
import { FaChevronDown, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const faqData = [
        {
            category: 'orders',
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely through our encrypted payment system."
        },
        {
            category: 'returns',
            question: "What is your return policy?",
            answer: "We offer a 30-day return policy for all unused items in their original packaging. Items must be in their original condition with all tags attached. Shipping costs for returns are the responsibility of the customer unless the item was received damaged or incorrect."
        },
        {
            category: 'shipping',
            question: "How long does shipping take?",
            answer: "Standard shipping typically takes 3-5 business days within the continental US. Express shipping (1-2 business days) is available at checkout for an additional fee. International shipping may take 7-14 business days depending on the destination."
        },
        {
            category: 'shipping',
            question: "Do you offer international shipping?",
            answer: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. You can check the shipping rates for your country during checkout."
        },
        {
            category: 'orders',
            question: "How can I track my order?",
            answer: "Once your order is shipped, you'll receive a tracking number via email. You can use this number to track your package on our website or the courier's website."
        },
        {
            category: 'products',
            question: "Are your products authentic?",
            answer: "Yes, all our products are 100% authentic and sourced directly from authorized manufacturers. We never sell counterfeit or replica items."
        },
        {
            category: 'returns',
            question: "Do you offer size exchanges?",
            answer: "Yes, we offer free size exchanges within 30 days of purchase. Simply contact our customer service team to initiate the exchange process."
        },
        {
            category: 'returns',
            question: "What if I receive a damaged item?",
            answer: "If you receive a damaged item, please take photos of the damage and contact our customer service team immediately. We'll arrange for a replacement or refund at no additional cost to you."
        }
    ];

    const categories = [
        { id: 'all', name: 'All Questions' },
        { id: 'orders', name: 'Orders & Payment' },
        { id: 'shipping', name: 'Shipping' },
        { id: 'returns', name: 'Returns & Exchanges' },
        { id: 'products', name: 'Products' }
    ];

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const filteredFAQs = faqData.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="faq-container">
            <div className="faq-header">
                <h1>Frequently Asked Questions</h1>
                <p>Find answers to common questions about our products, services, and policies</p>
            </div>

            <div className="faq-search">
                <div className="search-container">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search for questions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            <div className="faq-categories">
                {categories.map(category => (
                    <button
                        key={category.id}
                        className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category.id)}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            <div className="faq-list">
                {filteredFAQs.length > 0 ? (
                    filteredFAQs.map((faq, index) => (
                        <div key={index} className="faq-item">
                            <div 
                                className={`faq-question ${activeIndex === index ? 'active' : ''}`}
                                onClick={() => toggleFAQ(index)}
                            >
                                <h3>{faq.question}</h3>
                                <FaChevronDown className={`faq-icon ${activeIndex === index ? 'active' : ''}`} />
                            </div>
                            <div className={`faq-answer ${activeIndex === index ? 'active' : ''}`}>
                                <p>{faq.answer}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-results">
                        <p>No questions found matching your search.</p>
                        <p>Try adjusting your search terms or browse all categories.</p>
                    </div>
                )}
            </div>

            <div className="faq-contact">
                <h2>Still have questions?</h2>
                <p>Can't find the answer you're looking for? Please chat with our friendly team.</p>
                <Link to="/contact" className="contact-button">Contact Us</Link>
            </div>
        </div>
    );
};

export default FAQ; 