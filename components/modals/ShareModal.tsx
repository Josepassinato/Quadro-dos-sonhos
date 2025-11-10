
import React, { useState } from 'react';
import Modal from './Modal';
import { CopyIcon } from '../icons/CopyIcon';
import { CheckIcon } from '../icons/CheckIcon';

interface ShareModalProps {
  shareSlug: string;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ shareSlug, onClose }) => {
    const [copied, setCopied] = useState(false);
    const shareUrl = `${window.location.origin}/public/${shareSlug}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <Modal title="Compartilhar Seu Quadro" onClose={onClose}>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Qualquer pessoa com este link poderá ver uma versão somente leitura da sua realidade futura.
            </p>
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 rounded-md"
                />
                <button
                    onClick={handleCopy}
                    className="flex-shrink-0 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2 transition-all"
                >
                    {copied ? <CheckIcon className="w-5 h-5"/> : <CopyIcon className="w-5 h-5"/>}
                    {copied ? 'Copiado!' : 'Copiar'}
                </button>
            </div>
        </Modal>
    );
};

export default ShareModal;