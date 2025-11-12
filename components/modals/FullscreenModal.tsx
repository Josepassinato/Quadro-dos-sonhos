import React, { useState } from 'react';
import { Board, Item } from '../../types';

interface FullscreenModalProps {
  board: Board;
  onClose: () => void;
}

const FRAMES = [
    { id: 'none', name: 'Nenhuma', className: 'rounded-lg', imgClassName: '' },
    { id: 'simple', name: 'Simples', className: 'p-2 bg-black rounded-lg', imgClassName: 'rounded-sm' },
    { id: 'wood', name: 'Madeira', className: 'p-3 bg-[#6b4226] border-4 border-[#3a2416] rounded-lg shadow-inner', imgClassName: 'rounded-sm' },
    { id: 'polaroid', name: 'Polaroid', className: 'p-3 pb-12 bg-white rounded', imgClassName: '' },
];

const FullscreenModal: React.FC<FullscreenModalProps> = ({ board, onClose }) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedFrame, setSelectedFrame] = useState(FRAMES[0]);

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
        onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white z-[60]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <div className="w-full h-full p-4 md:p-8 pb-24 overflow-y-auto" onClick={e => e.stopPropagation()}>
         <h1 className="text-3xl md:text-5xl font-bold text-white text-center my-8">{board.title}: Visão Geral</h1>
         
         <div className="space-y-12">
            {board.sections.map(section => (
                section.items.length > 0 && (
                    <div key={section.id}>
                        <h2 className="text-2xl md:text-3xl font-semibold text-white/90 mb-4 pb-2 border-b-2 border-white/20">{section.name}</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {section.items.map(item => (
                                <div 
                                    key={item.id} 
                                    className="aspect-w-1 aspect-h-1"
                                    onClick={() => setSelectedItem(item)}
                                >
                                    <div 
                                        className={`relative group w-full h-full overflow-hidden shadow-lg cursor-pointer transition-all duration-300 ${selectedFrame.className}`}
                                    >
                                        <img src={item.imageUrl} alt={item.caption} className={`w-full h-full object-cover ${selectedFrame.imgClassName}`}/>
                                        
                                        {selectedFrame.id === 'polaroid' ? (
                                            <div className="absolute bottom-2 left-3 right-3">
                                                <p className="text-center text-black font-semibold text-base truncate">{item.caption}</p>
                                            </div>
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                                                <p className="p-3 text-white font-semibold text-base truncate">{item.caption}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            ))}
         </div>

        {board.sections.every(s => s.items.length === 0) && (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <p className="text-white text-2xl">Seu quadro está vazio. Adicione alguns itens para vê-los aqui!</p>
            </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-[60] bg-black/50 backdrop-blur-sm p-4 flex items-center justify-center gap-2 flex-wrap">
          <span className="text-white mr-4 font-medium hidden sm:inline">Moldura:</span>
          {FRAMES.map(frame => (
              <button 
                  key={frame.id}
                  onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFrame(frame);
                  }}
                  className={`px-3 py-1 text-sm rounded-md transition ${selectedFrame.id === frame.id ? 'bg-indigo-600 text-white' : 'bg-white/20 text-white/80 hover:bg-white/30'}`}
              >
                  {frame.name}
              </button>
          ))}
      </div>


      {selectedItem && (
        <div 
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80"
            onClick={() => setSelectedItem(null)}
        >
            <div className="relative max-w-3xl max-h-[90vh] p-4" onClick={e => e.stopPropagation()}>
                <img src={selectedItem.imageUrl} alt={selectedItem.caption} className="w-full h-auto max-h-[calc(90vh-100px)] object-contain rounded-lg shadow-2xl"/>
                <p className="mt-4 text-center text-white text-lg font-medium">{selectedItem.caption}</p>
            </div>
            <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 text-white/70 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
      )}
    </div>
  );
};

export default FullscreenModal;