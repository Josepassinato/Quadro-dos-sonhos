import React, { useState, useCallback, useEffect } from 'react';
import { Board, Section, Item, User } from '../types';
import Header from './Header';
import SectionComponent from './Section';
import AddItemModal from './modals/AddItemModal';
import { PlusIcon } from './icons/PlusIcon';
import MotivationTips from './MotivationTips';
import { THEMES } from '../constants';

interface BoardEditorProps {
    initialBoard: Board;
    onLogout: () => void;
    currentUser: User;
}

const accentColors = ['rose', 'sky', 'teal', 'amber', 'violet', 'pink'];

const BoardEditor: React.FC<BoardEditorProps> = ({ initialBoard, onLogout, currentUser }) => {
    const [board, setBoard] = useState<Board>(initialBoard);
    const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
    const [newSectionName, setNewSectionName] = useState('');

    useEffect(() => {
        if (currentUser?.email) {
            try {
                const boardJSON = JSON.stringify(board);
                localStorage.setItem(`visionBoardData_${currentUser.email}`, boardJSON);
            } catch (error) {
                console.error("Falha ao salvar o quadro no localStorage", error);
            }
        }
    }, [board, currentUser]);

    const handleUpdateBoard = useCallback((updatedBoard: Board) => {
        setBoard(updatedBoard);
    }, []);

    const handleAddItem = useCallback((sectionId: string, item: Omit<Item, 'id'>) => {
        setBoard(prevBoard => {
            const newBoard = { ...prevBoard };
            const section = newBoard.sections.find(s => s.id === sectionId);
            if (section) {
                section.items.push({ ...item, id: crypto.randomUUID() });
            }
            return newBoard;
        });
        setEditingSectionId(null);
    }, []);

    const handleUpdateItem = useCallback((sectionId: string, itemId: string, updatedCaption: string) => {
        setBoard(prevBoard => {
            const newSections = prevBoard.sections.map(section => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        items: section.items.map(item =>
                            item.id === itemId ? { ...item, caption: updatedCaption } : item
                        ),
                    };
                }
                return section;
            });
            return { ...prevBoard, sections: newSections };
        });
    }, []);

    const handleRemoveItem = useCallback((sectionId: string, itemId: string) => {
        setBoard(prevBoard => {
            const newSections = prevBoard.sections.map(section => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        items: section.items.filter(item => item.id !== itemId),
                    };
                }
                return section;
            });
            return { ...prevBoard, sections: newSections };
        });
    }, []);

    const handleAddSection = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSectionName.trim()) {
            const newSection: Section = {
                id: crypto.randomUUID(),
                name: newSectionName.trim(),
                items: [],
            };
            setBoard(prevBoard => ({
                ...prevBoard,
                sections: [...prevBoard.sections, newSection],
            }));
            setNewSectionName('');
        }
    };
    
    const handleRemoveSection = useCallback((sectionId: string) => {
         if (window.confirm('Você tem certeza que deseja excluir esta seção inteira e todos os seus itens?')) {
            setBoard(prevBoard => ({
                ...prevBoard,
                sections: prevBoard.sections.filter(s => s.id !== sectionId)
            }));
         }
    }, []);

    const theme = THEMES.find(t => t.id === board.themeId) || THEMES[0];

    return (
        <div className={`min-h-screen bg-gradient-to-br ${theme.background} text-slate-800 dark:text-slate-200 transition-colors duration-500`}>
            <Header board={board} onUpdateBoard={handleUpdateBoard} onLogout={onLogout} currentUser={currentUser} />
            
            <main className="p-4 md:p-8 pt-24">
                <div className="space-y-8">
                    {board.sections.map((section, index) => (
                        <SectionComponent
                            key={section.id}
                            section={section}
                            accentColor={accentColors[index % accentColors.length]}
                            onAddItemClick={() => setEditingSectionId(section.id)}
                            onUpdateItem={handleUpdateItem}
                            onRemoveItem={handleRemoveItem}
                            onRemoveSection={handleRemoveSection}
                        />
                    ))}
                </div>
                
                <MotivationTips />

                 <div className="mt-8 p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg shadow-sm">
                    <form onSubmit={handleAddSection} className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            value={newSectionName}
                            onChange={(e) => setNewSectionName(e.target.value)}
                            placeholder="Adicione uma nova área da sua vida..."
                            className="flex-grow bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button 
                            type="submit"
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
                        >
                            <PlusIcon className="w-5 h-5" />
                            <span>Adicionar Seção</span>
                        </button>
                    </form>
                </div>
            </main>

            {editingSectionId && (
                <AddItemModal
                    onClose={() => setEditingSectionId(null)}
                    onAddItem={(item) => handleAddItem(editingSectionId, item)}
                />
            )}
        </div>
    );
};

export default BoardEditor;