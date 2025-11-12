import React from 'react';
import { Board } from '../types';
import { THEMES } from '../constants';
import { HomeIcon } from './icons/HomeIcon';

interface PublicBoardViewerProps {
  board: Board;
}

const PublicBoardViewer: React.FC<PublicBoardViewerProps> = ({ board }) => {
    const theme = THEMES.find(t => t.id === board.themeId) || THEMES[0];

    return (
        <div className={`min-h-screen bg-gradient-to-br ${theme.background} text-slate-800 dark:text-slate-200 transition-colors duration-500`}>
            <header className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between flex-wrap gap-4">
                <div className="text-left">
                    <h1 className="text-3xl md:text-4xl font-bold font-logo">{board.title}</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">Um quadro de visualização compartilhado.</p>
                </div>
                <a href="/" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition" title="Criar seu próprio quadro">
                    <HomeIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Criar o Seu</span>
                </a>
            </header>
            
            <main className="p-4 md:p-8">
                <div className="space-y-8">
                    {board.sections.map((section) => (
                         section.items.length > 0 && (
                            <section key={section.id} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-4 md:p-6 rounded-xl shadow-lg">
                                <h2 className="text-2xl font-bold mb-4">{section.name}</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {section.items.map(item => (
                                        <div key={item.id} className="group relative aspect-w-1 aspect-h-1 rounded-lg overflow-hidden shadow-lg">
                                            <img src={item.imageUrl} alt={item.caption} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end">
                                                <p className="p-2 text-white text-sm font-medium truncate">{item.caption}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                         )
                    ))}
                    {board.sections.every(s => s.items.length === 0) && (
                        <div className="text-center py-16">
                            <p className="text-xl text-slate-600 dark:text-slate-400">Este quadro de visualização está vazio.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default PublicBoardViewer;
