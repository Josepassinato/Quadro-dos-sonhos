import React, { useState } from 'react';
import { User } from '../types';
import { PRESET_BOARDS } from '../constants';

interface AuthPageProps {
    onLoginSuccess: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError("Por favor, preencha todos os campos.");
            return;
        }

        try {
            const usersJSON = localStorage.getItem('visionBoardUsers');
            const users = usersJSON ? JSON.parse(usersJSON) : {};

            if (isLoginMode) {
                // Handle Login
                if (users[email] && users[email].password === password) {
                    onLoginSuccess({ email });
                } else {
                    setError("E-mail ou senha inválidos.");
                }
            } else {
                // Handle Register
                if (users[email]) {
                    setError("Este e-mail já está cadastrado.");
                } else {
                    const newUsers = { ...users, [email]: { password } };
                    localStorage.setItem('visionBoardUsers', JSON.stringify(newUsers));
                    
                    // Create a default board for the new user
                    const defaultBoard = {
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
                    localStorage.setItem(`visionBoardData_${email}`, JSON.stringify(defaultBoard));
                    
                    onLoginSuccess({ email });
                }
            }
        } catch (err) {
            setError("Ocorreu um erro. Por favor, tente novamente.");
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-sky-100 dark:from-slate-900 dark:via-slate-800 dark:to-sky-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="mb-4">
                        <h1 className="font-logo text-6xl md:text-7xl font-bold text-slate-800 dark:text-white leading-none">
                            Emb<span className="text-orange-500">.</span>
                        </h1>
                        <p className="font-logo text-xl md:text-2xl font-bold text-slate-800 dark:text-white tracking-[0.25em] mt-1">
                            CHURCH
                        </p>
                    </div>
                    <p className="mt-4 text-slate-600 dark:text-slate-300">
                        {isLoginMode ? 'Acesse seu quadro para continuar sonhando.' : 'Crie sua conta para começar a visualizar.'}
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Endereço de e-mail
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-700"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password"className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Senha
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-700"
                                />
                            </div>
                        </div>
                        
                        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {isLoginMode ? 'Entrar' : 'Criar Conta'}
                            </button>
                        </div>
                    </form>
                    <div className="mt-6 text-center">
                        <button onClick={() => { setIsLoginMode(!isLoginMode); setError(null); }} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                            {isLoginMode ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;