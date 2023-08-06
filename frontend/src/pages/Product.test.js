import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axiosMock from 'axios-mock-adapter';
import Products from './Products';
const mockAxios = new axiosMock();

test('renders product list', async () => {
  const mockedResponse = [
    { id: 1, name: 'Coke', price: 10, quantity: 5 },
    { id: 2, name: 'Chips', price: 100, quantity: 10 },
    { id: 3, name: 'Toy', price: 1200, quantity: 90 },
    { id: 4, name: 'Car', price: 1000, quantity: 10 },
  ];

  mockAxios.onGet('http://localhost:8080/products').reply(200, mockedResponse);

  render(<Products />);

  await waitFor(() => {
    const cokeElement = screen.getByText('Coke');
    const chipsElement = screen.getByText('Chips');
    const toyElement = screen.getByText('Toy');
    const carElement = screen.getByText('Car');

    expect(cokeElement).toBeInTheDocument();
    expect(chipsElement).toBeInTheDocument();
    expect(toyElement).toBeInTheDocument();
    expect(carElement).toBeInTheDocument();
  });
});

test('handles coin insertion and purchase', async () => {
  const mockedResponse = [
    { id: 1, name: 'Coke', price: 10, quantity: 5 },
    { id: 2, name: 'Chips', price: 100, quantity: 10 },
    { id: 3, name: 'Toy', price: 1200, quantity: 90 },
    { id: 4, name: 'Car', price: 1000, quantity: 10 },
  ];

  mockAxios.onGet('http://localhost:8080/products').reply(200, mockedResponse);

  render(<Products />);

  await waitFor(() => {
    const cokeElement = screen.getByText('Coke');
    const chipsElement = screen.getByText('Chips');
    const toyElement = screen.getByText('Toy');
    const carElement = screen.getByText('Car');

    expect(cokeElement).toBeInTheDocument();
    expect(chipsElement).toBeInTheDocument();
    expect(toyElement).toBeInTheDocument();
    expect(carElement).toBeInTheDocument();
  });

  const coin1Button = screen.getByText('1');
  const coin10Button = screen.getByText('10');

  fireEvent.click(coin1Button);
  fireEvent.click(coin10Button);

  const balanceElement = screen.getByText('Balance: 11 bath');
  expect(balanceElement).toBeInTheDocument();

  const buyButton = screen.getByText('Buy');
  fireEvent.click(buyButton);

  const modalText = await screen.findByText('Thank you');
  expect(modalText).toBeInTheDocument();

  const updatedBalanceElement = screen.getByText('Balance: 1 bath');
  expect(updatedBalanceElement).toBeInTheDocument();
});
