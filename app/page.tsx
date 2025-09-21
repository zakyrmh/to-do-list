'use client';

import React, { useState, useEffect } from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

import TodoList from '@/components/TodoList';
import AddTodoForm from '@/components/AddTodoForm';

// Firebase v9 modular SDK
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';

// --- Emotion theme (simple) ---
const emotionTheme = {
  colors: {
    primary: '#0070f3',
    border: '#e6e6e6',
    bgLight: '#ffffff',
    bgDark: '#0f1724',
    cardLight: '#ffffff',
    cardDark: '#0b1220',
    textLight: '#0b1220',
    textDark: '#e6eef8',
  },
  radii: '8px',
};

// --- Styled components ---
const PageWrapper = styled('div')<{ themeMode: string }>`
  width: 100%;
  min-height: 100vh;
  background: ${(p) => (p.themeMode === 'dark' ? '#0f1724' : '#ffffff')};
  color: ${(p) => (p.themeMode === 'dark' ? '#e6eef8' : '#0b1220')};
  transition: background 0.3s ease, color 0.3s ease;
`;

const StyledContainer = styled(motion.div)`
  max-width: 72ch;
  margin: 3rem auto;
  padding: 2rem;
`;

const Header = styled('header')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Title = styled('h1')`
  margin: 0;
  font-size: 1.6rem;
`;

const Controls = styled('div')`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ThemeButton = styled('button')<{ themeMode: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  border: 1px solid ${(p) => (p.themeMode === 'dark' ? '#12202b' : 'rgba(0,0,0,0.08)')};
  background: ${(p) => (p.themeMode === 'dark' ? '#0b1220' : '#fff')};
  color: ${(p) => (p.themeMode === 'dark' ? '#e6eef8' : '#0b1220')};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(16,24,40,0.04);
  
  &:hover {
    background: ${(p) => (p.themeMode === 'dark' ? '#07111a' : '#f8f9fa')};
    box-shadow: 0 4px 12px rgba(16,24,40,0.08);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// --- Firebase config (gunakan env) ---
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (hindari double init)
if (!getApps().length) {
  initializeApp(firebaseConfig);
}
const db = getFirestore();
const todosRef = collection(db, 'todos');

// Component untuk mengatasi hydration issue
const ThemeAwareContent = () => {
  const [todos, setTodos] = useState<{ id: string; text: string }[]>([]);
  const { theme: currentTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(todosRef, (snapshot) => {
      const todosData = snapshot.docs.map((d) => ({
        id: d.id,
        text: (d.data() as { text?: string })?.text ?? '',
      }));
      setTodos(todosData);
    });

    return () => unsubscribe();
  }, []);

  const handleAddTodo = async (text: string) => {
    if (text.trim()) {
      await addDoc(todosRef, { text });
    }
  };

  const handleDeleteTodo = async (id: string) => {
    await deleteDoc(doc(db, 'todos', id));
  };

  // toggle theme
  const toggleTheme = () => {
    const next = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <PageWrapper themeMode="light">
        <StyledContainer>
          <div>Loading...</div>
        </StyledContainer>
      </PageWrapper>
    );
  }

  const themeMode = currentTheme || 'light';

  return (
    <PageWrapper themeMode={themeMode}>
      <EmotionThemeProvider theme={emotionTheme}>
        <StyledContainer
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0, y: -6 },
            show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
          }}
        >
          <Header>
            <Title>My To-Do List</Title>
            <Controls>
              <ThemeButton onClick={toggleTheme} themeMode={themeMode} aria-label="Toggle theme">
                {themeMode === 'dark' ? (
                  <>
                    <Sun size={16} />
                    Light
                  </>
                ) : (
                  <>
                    <Moon size={16} />
                    Dark
                  </>
                )}
              </ThemeButton>
            </Controls>
          </Header>

          <AddTodoForm onAdd={handleAddTodo} currentTheme={themeMode} />

          <TodoList
            todos={todos}
            onDelete={handleDeleteTodo}
            currentTheme={themeMode}
          />
        </StyledContainer>
      </EmotionThemeProvider>
    </PageWrapper>
  );
};

const HomePage: React.FC = () => {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light">
      <ThemeAwareContent />
    </NextThemesProvider>
  );
};

export default HomePage;