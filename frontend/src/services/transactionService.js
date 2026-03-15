import api from './api';

export const deposit = async (accountNumber, amount) => {
  const response = await api.post('/transactions/deposit', { accountNumber, amount });
  return response.data;
};

export const withdraw = async (accountNumber, amount) => {
  const response = await api.post('/transactions/withdraw', { accountNumber, amount });
  return response.data;
};

export const transfer = async (fromAccount, toAccount, amount) => {
  const response = await api.post('/transactions/transfer', { fromAccount, toAccount, amount });
  return response.data;
};
