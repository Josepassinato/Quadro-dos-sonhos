import React, { useState, useRef, useEffect } from 'react';
import { Board, User } from '../types';
import { THEMES } from '../constants';
import RemindersModal from './modals/RemindersModal';
import ShareModal from './modals/ShareModal';
import FullscreenModal from './modals/FullscreenModal';
import { BellIcon } from './icons/BellIcon';
import { ShareIcon } from './icons/ShareIcon';
import { EyeIcon } from './icons/EyeIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { SaveIcon } from './icons/SaveIcon';
import { CheckIcon } from './icons/CheckIcon';
import { ThemeIcon } from './icons/ThemeIcon';

interface HeaderProps {
    board: Board;
    onUpdateBoard: (board: Board) => void;
    onLogout: () => void;
    currentUser: User;
}

const Header: React.FC<HeaderProps> = ({ board, onUpdateBoard, onLogout, currentUser }) => {
    const [isRemindersModalOpen, setRemindersModalOpen] = useState(false);
    const [isShareModalOpen, setShareModalOpen] = useState(false);
    const [isFullscreenModalOpen, setFullscreenModalOpen] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [title, setTitle] = useState(board.title);
    const [isSaved, setIsSaved] = useState(false);
    const [isThemeMenuOpen, setThemeMenuOpen] = useState(false);
    const themeMenuRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
                setThemeMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleTitleSave = () => {
        onUpdateBoard({ ...board, title });
        setIsEditingTitle(false);
    };

    const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleTitleSave();
        }
        if (e.key === 'Escape') {
            setTitle(board.title);
            setIsEditingTitle(false);
        }
    };
    
    const handleSave = () => {
        if (isSaved) return;

        const jsonString = JSON.stringify(board, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${board.title.replace(/\s+/g, '_').toLowerCase()}_vision_board.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleThemeSelect = (themeId: string) => {
        onUpdateBoard({ ...board, themeId });
        setThemeMenuOpen(false);
    };


    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-md">
                <div className="container mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-4">
                        <button onClick={onLogout} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition" title="Sair">
                            <LogoutIcon className="w-6 h-6 text-indigo-600" />
                        </button>
                        {isEditingTitle ? (
                            <input
                                type="text"
                                value={title}
                                onChange={handleTitleChange}
                                onBlur={handleTitleSave}
                                onKeyDown={handleTitleKeyDown}
                                autoFocus
                                className="text-xl font-bold bg-transparent border-b-2 border-indigo-500 focus:outline-none w-40 sm:w-auto"
                            />
                        ) : (
                            <h1 onClick={() => setIsEditingTitle(true)} className="text-xl font-bold cursor-pointer truncate" title={board.title}>
                                {board.title}
                            </h1>
                        )}
                    </div>

                    <div className="flex items-center gap-1 md:gap-2">
                        <div className="relative" ref={themeMenuRef}>
                            <button onClick={() => setThemeMenuOpen(prev => !prev)} className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 text-sm font-medium rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition" title="Mudar Tema">
                                <ThemeIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                                <span className="hidden md:inline">Tema</span>
                            </button>
                            {isThemeMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg border dark:border-slate-700 z-50">
                                    <div className="p-2">
                                        {THEMES.map(theme => (
                                            <button 
                                                key={theme.id}
                                                onClick={() => handleThemeSelect(theme.id)}
                                                className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                                            >
                                                <span className={`w-4 h-4 rounded-full ${theme.preview}`}></span>
                                                <span>{theme.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                         <button onClick={() => setFullscreenModalOpen(true)} className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 text-sm font-medium rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition" title="Visão Geral">
                            <EyeIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                            <span className="hidden lg:inline">Visão Geral</span>
                        </button>
                        <button onClick={() => setRemindersModalOpen(true)} className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 text-sm font-medium rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition" title="Lembretes">
                            <BellIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                             <span className="hidden lg:inline">Lembretes</span>
                        </button>
                        <button onClick={() => setShareModalOpen(true)} className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 text-sm font-medium rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition" title="Compartilhar">
                            <ShareIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                             <span className="hidden lg:inline">Compartilhar</span>
                        </button>
                         <button 
                             onClick={handleSave} 
                             disabled={isSaved}
                             className={`flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white rounded-md transition-all duration-300 ${isSaved ? 'bg-green-500' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                         >
                             {isSaved ? (
                                <>
                                    <CheckIcon className="w-5 h-5" />
                                    <span className="hidden md:inline">Salvo!</span>
                                </>
                             ) : (
                                <>
                                    <SaveIcon className="w-5 h-5" />
                                    <span className="hidden md:inline">Exportar</span>
                                </>
                             )}
                        </button>
                    </div>
                </div>
            </header>

            {isRemindersModalOpen && <RemindersModal board={board} currentUser={currentUser} onClose={() => setRemindersModalOpen(false)} />}
            {isShareModalOpen && <ShareModal shareSlug={board.shareSlug} onClose={() => setShareModalOpen(false)} />}
            {isFullscreenModalOpen && <FullscreenModal board={board} onClose={() => setFullscreenModalOpen(false)} />}
        </>
    );
};

export default Header;
