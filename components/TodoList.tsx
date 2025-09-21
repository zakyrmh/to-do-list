// components/TodoList.tsx
import React from 'react';
import styled from '@emotion/styled';
import { Trash2, MoreVertical } from 'lucide-react';

interface Todo {
  id: string;
  text: string;
}

interface Props {
  todos: Todo[];
  onDelete: (id: string) => void;
  currentTheme: string;
}

const List = styled('ul')`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`;

const Item = styled('li')<{ themeMode: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1rem;
  border-radius: 10px;
  background: ${(p) => (p.themeMode === 'dark' ? '#07111a' : '#fff')};
  border: 1px solid ${(p) => (p.themeMode === 'dark' ? '#12202b' : 'rgba(16,24,40,0.06)')};
  box-shadow: 0 6px 18px rgba(11,22,40,0.03);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(11,22,40,0.08);
  }
`;

const Text = styled('span')<{ themeMode: string }>`
  flex: 1;
  margin-right: 1rem;
  word-break: break-word;
  color: ${(p) => (p.themeMode === 'dark' ? '#e6eef8' : '#0b1220')};
`;

const Actions = styled('div')`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const IconButton = styled('button')<{ danger?: boolean; themeMode: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${(p) => 
    p.danger 
      ? '#ef4444' 
      : p.themeMode === 'dark' 
        ? '#94a3b8' 
        : '#64748b'
  };
  transition: all 0.2s ease;
  
  &:hover {
    background: ${(p) => 
      p.themeMode === 'dark' 
        ? 'rgba(148, 163, 184, 0.1)' 
        : 'rgba(16,24,40,0.05)'
    };
  }
`;

const EmptyMessage = styled('p')<{ themeMode: string }>`
  color: ${(p) => (p.themeMode === 'dark' ? 'rgba(230, 238, 248, 0.5)' : 'rgba(11,22,40,0.5)')};
  text-align: center;
  margin: 2rem 0;
`;

const TodoList: React.FC<Props> = ({ todos, onDelete, currentTheme }) => {
  if (!todos.length) {
    return (
      <EmptyMessage themeMode={currentTheme}>
        No tasks yet — add your first one!
      </EmptyMessage>
    );
  }

  return (
    <List>
      {todos.map((todo) => (
        <Item key={todo.id} themeMode={currentTheme}>
          <Text themeMode={currentTheme}>{todo.text}</Text>
          <Actions>
            <IconButton 
              aria-label="more" 
              themeMode={currentTheme}
            >
              <MoreVertical size={16} />
            </IconButton>
            <IconButton 
              aria-label="delete" 
              danger 
              themeMode={currentTheme}
              onClick={() => onDelete(todo.id)}
            >
              <Trash2 size={16} />
            </IconButton>
          </Actions>
        </Item>
      ))}
    </List>
  );
};

export default TodoList;