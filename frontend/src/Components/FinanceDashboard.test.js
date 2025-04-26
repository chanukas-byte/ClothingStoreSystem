import React from 'react';
import { render, screen } from '@testing-library/react';
import FinanceDashboard from './FinanceDashboard';

// Mock the axios module
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] }))
}));

// Mock the Header and Footer components
jest.mock('./Header', () => {
  return function MockHeader() {
    return <div data-testid="mock-header">Header</div>;
  };
});

jest.mock('./Footer', () => {
  return function MockFooter() {
    return <div data-testid="mock-footer">Footer</div>;
  };
});

describe('FinanceDashboard Component', () => {
  test('renders loading state initially', () => {
    render(<FinanceDashboard />);
    const loadingElement = screen.getByText(/Loading financial data/i);
    expect(loadingElement).toBeInTheDocument();
  });
}); 