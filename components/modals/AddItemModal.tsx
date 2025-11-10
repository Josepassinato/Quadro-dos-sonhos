import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import Modal from './Modal';
import { Item } from '../../types';
import { UploadIcon } from '../icons/UploadIcon';
import { SparklesIcon } from '../icons/SparklesIcon';
import { AlertTriangleIcon } from '../icons/AlertTriangleIcon';

// Helper function to convert a file blob to a base64 string
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // result contains the data as a data URL, remove the prefix
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const LOADING_MESSAGES = [
    "Despertando a criatividade...",
    "Pintando pixels com magia...",
    "Consultando as musas da inspiração...",
    "Misturando cores na paleta digital...",
    "Aguarde, a mágica está acontecendo...",
];


interface AddItemModalProps {
  onClose: () => void;
  onAddItem: (item: Omit<Item, 'id'>) => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ onClose, onAddItem }) => {
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // AI State
  const [activeTab, setActiveTab] = useState<'upload' | 'ai'>('upload');
  const [aiPrompt, setAiPrompt] = useState('');
  const [baseImageFile, setBaseImageFile] = useState<File | null>(null);
  const [baseImagePreview, setBaseImagePreview] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);

  useEffect(() => {
    let interval: number;
    if (isGenerating) {
      interval = window.setInterval(() => {
        setLoadingMessage(prev => {
            const currentIndex = LOADING_MESSAGES.indexOf(prev);
            const nextIndex = (currentIndex + 1) % LOADING_MESSAGES.length;
            return LOADING_MESSAGES[nextIndex];
        });
      }, 2500);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isGenerating]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setImageUrl('');
    }
  };
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setImageUrl(e.target.value);
      if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
      setImageFile(null);
  }

  const handleBaseImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBaseImageFile(file);
      setGeneratedImage(null); // Clear previous generation
      if (baseImagePreview) {
          URL.revokeObjectURL(baseImagePreview);
      }
      setBaseImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGenerateImage = async () => {
      if (!aiPrompt) {
          setAiError("Por favor, escreva uma instrução para a IA.");
          return;
      }
      setIsGenerating(true);
      setAiError(null);
      setGeneratedImage(null);
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      try {
        // MODO DE EDIÇÃO: Se uma imagem base for fornecida
        if (baseImageFile) {
            const base64Data = await blobToBase64(baseImageFile);
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [
                        {
                            inlineData: {
                                data: base64Data,
                                mimeType: baseImageFile.type,
                            },
                        },
                        { text: aiPrompt },
                    ],
                },
                config: {
                    responseModalities: [Modality.IMAGE],
                },
            });
            
            const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
            if (imagePart?.inlineData) {
                const base64ImageBytes = imagePart.inlineData.data;
                const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${base64ImageBytes}`;
                setGeneratedImage(imageUrl);
            } else {
                 throw new Error("Não foi possível editar a imagem. A resposta da IA não continha dados de imagem.");
            }
        // MODO DE GERAÇÃO: Se apenas um prompt de texto for fornecido
        } else {
             const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: aiPrompt,
                config: {
                  numberOfImages: 1,
                  outputMimeType: 'image/png',
                },
            });

            if (response.generatedImages && response.generatedImages.length > 0) {
                const base64ImageBytes = response.generatedImages[0].image.imageBytes;
                const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
                setGeneratedImage(imageUrl);
            } else {
                throw new Error("Não foi possível gerar a imagem. A resposta da IA estava vazia.");
            }
        }

      } catch (error) {
          console.error("Error generating image:", error);
          const errorMessage = error instanceof Error ? "Tente ser mais descritivo ou verifique sua conexão." : "Por favor, tente novamente.";
          setAiError(`Ocorreu um erro ao gerar a imagem. ${errorMessage}`);
      } finally {
          setIsGenerating(false);
      }
  };

  const handleUseGeneratedImage = () => {
      if(generatedImage) {
          setPreviewUrl(generatedImage);
          setImageUrl('');
          setImageFile(null);
          setActiveTab('upload'); // Switch back to the main tab to set caption
      }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImageUrl = previewUrl || imageUrl;
    if (finalImageUrl && caption) {
      onAddItem({ imageUrl: finalImageUrl, caption });
    }
  };
  
  const Footer = () => (
      <div className="flex justify-end gap-3">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500 transition">Cancelar</button>
        <button type="submit" form="add-item-form" className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition" disabled={!(previewUrl || imageUrl) || !caption}>Adicionar Item</button>
      </div>
  );

  return (
    <Modal title="Adicionar Nova Meta" onClose={onClose} footer={<Footer/>}>
      <div className="border-b border-slate-200 dark:border-slate-700 mb-4">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
            <button
                onClick={() => setActiveTab('upload')}
                className={`${activeTab === 'upload' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
            >
                Link ou Upload
            </button>
            <button
                onClick={() => setActiveTab('ai')}
                className={`${activeTab === 'ai' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} flex items-center gap-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
            >
                Gerar com IA <SparklesIcon className="w-4 h-4 text-yellow-500" />
            </button>
        </nav>
      </div>

      <form id="add-item-form" onSubmit={handleSubmit} className="space-y-4">
        {activeTab === 'upload' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Imagem</label>
                 <div className="mt-1">
                   <input
                      type="text"
                      value={imageUrl}
                      onChange={handleUrlChange}
                      placeholder="Ou cole a URL de uma imagem"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700"
                    />
                </div>
                <div className="mt-2 text-center text-sm text-slate-500">ou</div>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {previewUrl ? 
                      <img src={previewUrl} alt="Preview" className="mx-auto h-24 w-auto rounded-md object-cover" /> :
                      <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
                    }
                    <div className="flex text-sm text-slate-600 dark:text-slate-400">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-slate-800 rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Envie um arquivo</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                      </label>
                      <p className="pl-1">ou arraste e solte</p>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-500">PNG, JPG, GIF até 10MB</p>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="caption" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Legenda</label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Ex: 'Conquistar a casa própria'"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700"
                    required
                  />
                </div>
              </div>
            </>
        )}

        {activeTab === 'ai' && (
            <div className="space-y-4">
                 <div>
                    <label htmlFor="base-image-upload" className="block text-sm font-medium text-slate-700 dark:text-slate-300">1. (Opcional) Envie uma foto para editar</label>
                    <div className="mt-1 flex items-center gap-4">
                         <input id="base-image-upload" name="base-image-upload" type="file" className="sr-only" onChange={handleBaseImageChange} accept="image/*" />
                         <label htmlFor="base-image-upload" className="cursor-pointer px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">
                            Escolher Foto...
                         </label>
                         {baseImageFile && <span className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-xs">{baseImageFile.name}</span>}
                    </div>
                 </div>
                 
                 <div>
                    <label htmlFor="ai-prompt" className="block text-sm font-medium text-slate-700 dark:text-slate-300">2. Descreva o que você quer criar ou modificar</label>
                     <textarea
                        id="ai-prompt"
                        rows={4}
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="Ex: 'Um carro esportivo vermelho em uma estrada na montanha' ou 'Mude o fundo para uma praia'"
                        className="mt-1 w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700"
                    />
                 </div>
                 
                 <button type="button" onClick={handleGenerateImage} disabled={isGenerating || !aiPrompt} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed">
                     {isGenerating ? (
                        <>
                           <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                           Gerando...
                        </>
                     ) : (
                         'Gerar Imagem Mágica ✨'
                     )}
                 </button>

                 {aiError && (
                    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 rounded-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <AlertTriangleIcon className="h-5 w-5 text-red-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700 dark:text-red-300">{aiError}</p>
                            </div>
                        </div>
                    </div>
                 )}
                 
                 <div className={`grid grid-cols-1 ${baseImageFile ? 'md:grid-cols-2' : ''} gap-4 items-start pt-2`}>
                     {baseImageFile && baseImagePreview && (
                         <div>
                            <p className="text-center text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Sua Foto</p>
                            <img src={baseImagePreview} alt="Base" className="w-full h-auto rounded-md object-cover shadow" />
                         </div>
                     )}
                     {(generatedImage || isGenerating || baseImageFile) && (
                         <div>
                             <p className="text-center text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">{baseImageFile ? 'Sua Meta' : 'Imagem Gerada'}</p>
                             {generatedImage ? (
                                <>
                                    <img src={generatedImage} alt="Generated" className="w-full h-auto rounded-md object-cover shadow" />
                                    <button type="button" onClick={handleUseGeneratedImage} className="mt-2 w-full px-4 py-2 text-sm rounded-md bg-green-600 text-white hover:bg-green-700 transition">Usar esta Imagem</button>
                                </>
                             ) : (
                                <div className="aspect-w-1 aspect-h-1 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-md p-4 text-center">
                                    {isGenerating ? (
                                        <>
                                            <svg className="animate-spin h-8 w-8 text-indigo-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">{loadingMessage}</p>
                                            <p className="text-slate-500 text-xs mt-1">Isso pode levar alguns segundos...</p>
                                        </>
                                    ) : (
                                        <p className="text-slate-500 text-sm">A imagem gerada aparecerá aqui</p>
                                    )}
                                </div>
                             )}
                         </div>
                     )}
                 </div>
            </div>
        )}
      </form>
    </Modal>
  );
};

export default AddItemModal;