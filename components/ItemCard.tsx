import React, { useState } from 'react';
import { Item } from '../types';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';
import { CheckIcon } from './icons/CheckIcon';

interface ItemCardProps {
    item: Item;
    onUpdate: (caption: string) => void;
    onRemove: () => void;
    onView: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onUpdate, onRemove, onView }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [caption, setCaption] = useState(item.caption);
    const [isHovered, setIsHovered] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    const handleSave = () => {
        onUpdate(caption);
        setIsEditing(false);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 1500);
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSave();
        }
        if (e.key === 'Escape') {
            setCaption(item.caption);
            setIsEditing(false);
        }
    }

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsConfirmingDelete(true);
    };

    const confirmDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemove();
      setIsConfirmingDelete(false);
    }

    const cancelDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsConfirmingDelete(false);
    }

    return (
        <div 
            className={`group relative aspect-w-1 aspect-h-1 rounded-lg overflow-hidden shadow-lg transition-all duration-300 ${!isEditing ? 'cursor-pointer' : ''} ${isSaved ? 'ring-2 ring-offset-2 ring-green-500 dark:ring-offset-slate-800' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={isEditing ? undefined : onView}
        >
            {isConfirmingDelete && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 p-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <p className="text-white font-semibold mb-3">Excluir item?</p>
                    <div className="flex gap-2">
                         <button 
                            onClick={confirmDelete} 
                            className="px-4 py-1 bg-red-600 text-white rounded-md hover:bg-red-500 text-sm font-medium"
                        >
                            Sim
                        </button>
                        <button 
                            onClick={cancelDelete} 
                            className="px-4 py-1 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 text-sm font-medium"
                        >
                            Não
                        </button>
                    </div>
                </div>
            )}
            
            <img src={item.imageUrl} alt={item.caption} className="w-full h-full object-cover" />
            
            <div className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isHovered || isEditing ? 'opacity-100' : 'opacity-0'}`}></div>

            <div className="absolute bottom-0 left-0 right-0 p-2 text-white z-10" onClick={isEditing ? (e) => e.stopPropagation() : undefined}>
                {isEditing ? (
                    <div className="flex items-center gap-1">
                        <input
                            type="text"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            className="w-full bg-transparent border-b-2 border-white/70 text-sm focus:outline-none"
                        />
                        <button onClick={(e) => { e.stopPropagation(); handleSave(); }} className="p-1 rounded-full bg-white/20 hover:bg-white/40">
                            <CheckIcon className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <p className="text-sm font-medium truncate">{item.caption}</p>
                )}
            </div>

            <div className={`absolute top-2 right-2 flex gap-2 transition-opacity duration-300 z-10 ${isHovered && !isEditing ? 'opacity-100' : 'opacity-0'}`}>
                <button onClick={handleEditClick} className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white">
                    <EditIcon className="w-4 h-4" />
                </button>
                <button onClick={handleDeleteClick} className="p-2 rounded-full bg-black/50 hover:bg-red-500 text-white">
                    <TrashIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default ItemCard;