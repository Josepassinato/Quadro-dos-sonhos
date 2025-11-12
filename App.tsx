import React, { useState, useEffect } from 'react';
import BoardEditor from './components/BoardEditor';
import AuthPage from './components/AuthPage';
import PublicBoardViewer from './components/PublicBoardViewer';
import { Board, User } from './types';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [board, setBoard] = useState<Board | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [publicBoard, setPublicBoard] = useState<Board | null>(null);

    useEffect(() => {
        const handleRouteChange = () => {
            setIsLoading(true);
            const hash = window.location.hash;

            if (hash.startsWith('#/public-board/')) {
                try {
                    const encodedData = hash.substring('#/public-board/'.length);
                    const decodedStr = decodeURIComponent(escape(atob(encodedData)));
                    const boardData = JSON.parse(decodedStr) as Board;
                    setPublicBoard(boardData);
                    setCurrentUser(null);
                    setBoard(null);
                } catch (error) {
                    console.error("Falha ao processar link compartilhado:", error);
                    window.location.hash = ''; // Limpa o hash inválido
                    setPublicBoard(null);
                }
            } else {
                setPublicBoard(null);
                try {
                    const savedUserJSON = localStorage.getItem('sessionUser');
                    if (savedUserJSON) {
                        setCurrentUser(JSON.parse(savedUserJSON) as User);
                    } else {
                        setCurrentUser(null);
                    }
                } catch (error) {
                    console.error("Falha ao carregar usuário da sessão", error);
                    localStorage.removeItem('sessionUser');
                    setCurrentUser(null);
                }
            }
            setIsLoading(false);
        };

        handleRouteChange();
        window.addEventListener('hashchange', handleRouteChange);
        return () => {
            window.removeEventListener('hashchange', handleRouteChange);
        };
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
        window.location.hash = ''; // Garante que qualquer hash público seja limpo ao fazer login
    };

    const handleLogout = () => {
        if (window.confirm('Tem certeza de que deseja sair?')) {
            localStorage.removeItem('sessionUser');
            setCurrentUser(null);
            setBoard(null);
        }
    };

    if (publicBoard) {
        return <PublicBoardViewer board={publicBoard} />;
    }

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
