
import React from 'react';
import { Section, Item } from '../types';
import ItemCard from './ItemCard';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface SectionProps {
    section: Section;
    accentColor: string;
    onAddItemClick: () => void;
    onUpdateItem: (sectionId: string, itemId: string, updatedCaption: string) => void;
    onRemoveItem: (sectionId: string, itemId: string) => void;
    onRemoveSection: (sectionId: string) => void;
    onViewItem: (item: Item) => void;
}

const SectionComponent: React.FC<SectionProps> = ({ section, accentColor, onAddItemClick, onUpdateItem, onRemoveItem, onRemoveSection, onViewItem }) => {
    
    const colorVariants = {
        rose: 'border-rose-400',
        sky: 'border-sky-400',
        teal: 'border-teal-400',
        amber: 'border-amber-400',
        violet: 'border-violet-400',
        pink: 'border-pink-400',
    };

    const borderColorClass = colorVariants[accentColor as keyof typeof colorVariants] || 'border-gray-400';

    return (
        <section className={`bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl shadow-lg border-t-4 ${borderColorClass}`}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{section.name}</h2>
                 <button 
                    onClick={() => onRemoveSection(section.id)} 
                    className="p-2 rounded-full text-slate-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/50 transition-colors"
                    aria-label="Remover seção"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {section.items.map(item => (
                    <ItemCard 
                        key={item.id} 
                        item={item} 
                        onUpdate={(caption) => onUpdateItem(section.id, item.id, caption)} 
                        onRemove={() => onRemoveItem(section.id, item.id)} 
                        onView={() => onViewItem(item)}
                    />
                ))}
                {section.items.length < 3 && (
                    <button
                        onClick={onAddItemClick}
                        className="aspect-w-1 aspect-h-1 group flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                    >
                        <PlusIcon className="w-10 h-10 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors" />
                        <span className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-indigo-500">Adicionar Item</span>
                    </button>
                )}
            </div>
        </section>
    );
};

export default SectionComponent;