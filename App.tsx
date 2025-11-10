import React, { useState, useEffect } from 'react';
import BoardEditor from './components/BoardEditor';
import AuthPage from './components/AuthPage';
import { Board, User } from './types';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [board, setBoard] = useState<Board | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const savedUserJSON = localStorage.getItem('sessionUser');
            if (savedUserJSON) {
                const savedUser = JSON.parse(savedUserJSON) as User;
                setCurrentUser(savedUser);
            }
        } catch (error) {
            console.error("Falha ao carregar usuário da sessão", error);
            localStorage.removeItem('sessionUser');
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (currentUser) {
            const loadOrCreateBoard = () => {
                try {
                    const savedBoardJSON = localStorage.getItem(`visionBoardData_${currentUser.email}`);
                    if (savedBoardJSON) {
                        const savedBoard = JSON.parse(savedBoardJSON) as Board;
                        setBoard(savedBoard);
                        return; // Board found, exit.
                    }
                } catch (error) {
                    console.error("Falha ao carregar o quadro do localStorage", error);
                    // Continue to create a new board if parsing fails
                }

                // If no board is found or there was a parsing error, create and set a new default board.
                const newBoard: Board = {
                    id: crypto.randomUUID(),
                    title: 'Minha Realidade Futura',
                    isPublic: false,
                    shareSlug: crypto.randomUUID().slice(0, 8),
                    themeId: 'default',
                    sections: [
                        { id: crypto.randomUUID(), name: 'Crescimento Pessoal', items: [] },
                        { id: crypto.randomUUID(), name: 'Aventuras & Viagens', items: [] },
                        { id: crypto.randomUUID(), name: 'Vida Financeira', items: [] },
                        { id: crypto.randomUUID(), name: 'Criatividade & Hobbies', items: [] },
                    ],
                };
                setBoard(newBoard);
                try {
                    localStorage.setItem(`visionBoardData_${currentUser.email}`, JSON.stringify(newBoard));
                } catch (error) {
                     console.error("Falha ao salvar novo quadro no localStorage", error);
                }
            };
            loadOrCreateBoard();
        }
    }, [currentUser]);

    const handleLoginSuccess = (user: User) => {
        localStorage.setItem('sessionUser', JSON.stringify(user));
        setCurrentUser(user);
    };

    const handleLogout = () => {
        if (window.confirm('Tem certeza de que deseja sair?')) {
            localStorage.removeItem('sessionUser');
            setCurrentUser(null);
            setBoard(null);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <p className="text-slate-600 dark:text-slate-300 text-lg">Carregando...</p>
            </div>
        );
    }

    if (!currentUser) {
        return <AuthPage onLoginSuccess={handleLoginSuccess} />;
    }
    
    // While the board is being loaded or created for the logged-in user
    if (!board) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <p className="text-slate-600 dark:text-slate-300 text-lg">Carregando seu quadro...</p>
            </div>
        );
    }

    return <BoardEditor initialBoard={board} onLogout={handleLogout} currentUser={currentUser} />;
};

export default App;