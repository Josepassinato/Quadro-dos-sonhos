
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { ReminderSettings, User, Board } from '../../types';
import { BIBLE_VERSES } from '../../constants';

interface RemindersModalProps {
  onClose: () => void;
  currentUser: User;
  board: Board;
}

const RemindersModal: React.FC<RemindersModalProps> = ({ onClose, currentUser, board }) => {
    const [settings, setSettings] = useState<ReminderSettings>({
        email: currentUser.email,
        active: false,
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const savedSettingsJSON = localStorage.getItem(`reminders_${currentUser.email}`);
        if (savedSettingsJSON) {
            try {
                const savedSettings = JSON.parse(savedSettingsJSON) as ReminderSettings;
                setSettings(savedSettings);
            } catch (e) {
                console.error("Falha ao analisar as configurações de lembrete", e);
            }
        }
    }, [currentUser.email]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            localStorage.setItem(`reminders_${currentUser.email}`, JSON.stringify(settings));

            if (settings.active && settings.email) {
                const sectionsWithItems = board.sections.filter(s => s.items.length > 0);
                if (sectionsWithItems.length === 0) {
                    alert("Suas configurações de lembrete foram salvas! Adicione itens às suas seções para receber lembretes sobre eles.");
                    onClose();
                    return;
                }

                const randomSection = sectionsWithItems[Math.floor(Math.random() * sectionsWithItems.length)];
                const randomVerse = BIBLE_VERSES[Math.floor(Math.random() * BIBLE_VERSES.length)];

                const emailHtml = `
                <!DOCTYPE html>
                <html>
                <head>
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; line-height: 1.6; color: #333; background-color: #f4f4f7; }
                  .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #ffffff; }
                  .header { font-size: 24px; font-weight: bold; color: #4F46E5; text-align: center; }
                  .section { margin: 20px 0; padding: 15px; background-color: #f9fafb; border-left: 4px solid #4F46E5; }
                  .verse { margin: 20px 0; padding: 15px; background-color: #fefce8; border-left: 4px solid #f59e0b; }
                  .footer { text-align: center; font-size: 12px; color: #888; margin-top: 20px; }
                </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">Sua Inspiração Mensal para a Realidade Futura ✨</div>
                    <p>Olá!</p>
                    <p>Este é o seu lembrete mensal para focar na sua visão e continuar caminhando em direção aos seus sonhos.</p>
                    <div class="section">
                      <p>Este mês, que tal dedicar uma atenção especial à sua área de:</p>
                      <h2 style="font-size: 20px; margin-top: 5px;">🎯 <strong>${randomSection.name}</strong></h2>
                    </div>
                    <div class="verse">
                      <p>Que este versículo te inspire na sua jornada:</p>
                      <p><em>"${randomVerse.quote}"</em></p>
                      <p style="text-align: right;"><strong>- ${randomVerse.reference}</strong></p>
                    </div>
                    <p>Continue firme em seus propósitos!</p>
                    <div class="footer">
                      <p>Enviado de Realidade Futura</p>
                    </div>
                  </div>
                </body>
                </html>
                `;

                const response = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer re_QoqZMnLe_D2MQHEWUhAjfDqUjCPi1C6ek`
                    },
                    body: JSON.stringify({
                        from: 'Realidade Futura <onboarding@resend.dev>',
                        to: [settings.email],
                        subject: `Sua Inspiração Mensal para a Realidade Futura ✨`,
                        html: emailHtml,
                    }),
                });

                if (response.ok) {
                    alert(`Configurações salvas! Um e-mail de lembrete de teste foi enviado para "${settings.email}". Você receberá um lembrete inspirador uma vez por mês.`);
                } else {
                    const errorData = await response.json();
                    console.error("Falha ao enviar e-mail:", errorData);
                    alert("Suas configurações foram salvas, mas não foi possível enviar o e-mail de teste. Verifique o console para mais detalhes.");
                }

            } else if (!settings.active) {
                alert("Lembretes desativados. Suas configurações foram salvas.");
            } else {
                alert("Por favor, insira um e-mail válido para ativar os lembretes.");
            }
        } catch (error) {
            console.error("Erro ao salvar configurações ou enviar e-mail:", error);
            alert("Ocorreu um erro ao salvar suas configurações. Por favor, tente novamente.");
        } finally {
            setIsSaving(false);
            if (!isSaving) onClose();
        }
    };

    const Footer = () => (
      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 rounded-md bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500 transition">Cancelar</button>
        <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center min-w-[180px]">
            {isSaving ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Salvando...
                </>
            ) : (
                'Salvar Configurações'
            )}
        </button>
      </div>
    );

    return (
        <Modal title="Lembretes Mensais por E-mail" onClose={onClose} footer={<Footer/>}>
            <div className="space-y-6">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Receba uma vez por mês um e-mail inspirador com um versículo bíblico, focado em uma das áreas da sua Realidade Futura para manter você motivado.
                </p>

                <div className="flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Ativar Lembretes Mensais</span>
                    <label htmlFor="toggle" className="flex items-center cursor-pointer">
                        <div className="relative">
                            <input type="checkbox" id="toggle" className="sr-only" checked={settings.active} onChange={e => setSettings({...settings, active: e.target.checked})} />
                            <div className="block bg-slate-300 dark:bg-slate-600 w-14 h-8 rounded-full"></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${settings.active ? 'transform translate-x-full bg-indigo-500' : ''}`}></div>
                        </div>
                    </label>
                </div>
                
                <fieldset disabled={!settings.active} className="space-y-4">
                     <div>
                        <label htmlFor="email-reminder" className="text-sm font-medium text-slate-700 dark:text-slate-300">Seu E-mail</label>
                         <input
                            type="email"
                            id="email-reminder"
                            value={settings.email}
                            onChange={e => setSettings({ ...settings, email: e.target.value })}
                            placeholder="seu.email@exemplo.com"
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                            required
                        />
                    </div>
                </fieldset>
            </div>
        </Modal>
    );
};

export default RemindersModal;