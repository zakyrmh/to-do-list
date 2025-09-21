// components/AddTodoForm.tsx
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Plus } from 'lucide-react';

interface Props {
  onAdd: (text: string) => void;
  currentTheme: string;
}

const Form = styled('form')`
  display: flex;
  width: 100%;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
`;

const Input = styled('input')<{ themeMode: string }>`
  flex: 1;
  padding: 0.75rem 0.9rem;
  border-radius: 10px;
  border: 1px solid ${(p) => (p.themeMode === 'dark' ? '#12202b' : 'rgba(16,24,40,0.08)')};
  background: ${(p) => (p.themeMode === 'dark' ? '#07111a' : '#fff')};
  color: ${(p) => (p.themeMode === 'dark' ? '#e6eef8' : '#0b1220')};
  font-size: 1rem;
  outline: none;
  box-shadow: 0 2px 6px rgba(11,22,40,0.02);
  transition: all 0.2s ease;
  
  &::placeholder {
    color: ${(p) => (p.themeMode === 'dark' ? 'rgba(230, 238, 248, 0.5)' : 'rgba(11,22,40,0.5)')};
  }
  
  &:focus {
    box-shadow: 0 6px 18px rgba(3,102,214,0.08);
    border-color: rgba(3,102,214,0.35);
  }
`;

const AddButton = styled('button')`
  padding: 0.6rem 0.9rem;
  border-radius: 10px;
  border: none;
  background: #0070f3;
  color: #fff;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 6px 18px rgba(3,102,214,0.12);
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: #005ce6;
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(3,102,214,0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const AddTodoForm: React.FC<Props> = ({ onAdd, currentTheme }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const text = inputValue.trim();
    if (!text) return;
    onAdd(text);
    setInputValue('');
  };

  return (
    <Form onSubmit={handleSubmit} aria-label="add-todo-form">
      <Input
        aria-label="new todo"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Add a new task..."
        themeMode={currentTheme}
      />
      <AddButton type="submit" disabled={!inputValue.trim()}>
        <Plus size={14} />
        Add
      </AddButton>
    </Form>
  );
};

export default AddTodoForm;