import { Board } from './types';

export const THEMES = [
    { id: 'default', name: 'Padrão', background: 'from-gray-50 to-blue-100 dark:from-slate-900 dark:to-slate-800', preview: 'bg-gradient-to-r from-gray-200 to-blue-200' },
    { id: 'sunrise', name: 'Amanhecer', background: 'from-rose-100 via-orange-100 to-yellow-100 dark:from-rose-900/80 dark:via-orange-900/80 dark:to-yellow-900/80', preview: 'bg-gradient-to-r from-rose-200 to-yellow-200' },
    { id: 'forest', name: 'Floresta', background: 'from-emerald-100 via-teal-100 to-green-200 dark:from-emerald-900/80 dark:via-teal-900/80 dark:to-green-900/80', preview: 'bg-gradient-to-r from-emerald-200 to-green-200' },
    { id: 'ocean', name: 'Oceano', background: 'from-cyan-100 via-sky-200 to-blue-200 dark:from-cyan-900/80 dark:via-sky-900/80 dark:to-blue-900/80', preview: 'bg-gradient-to-r from-cyan-200 to-blue-200' },
    { id: 'galaxy', name: 'Galáxia', background: 'from-indigo-200 via-purple-300 to-slate-400 dark:from-indigo-900 dark:via-purple-900 dark:to-slate-800', preview: 'bg-gradient-to-r from-indigo-300 to-purple-400' }
];

export const BIBLE_VERSES = [
    { quote: "Tudo posso naquele que me fortalece.", reference: "Filipenses 4:13" },
    { quote: "O Senhor é o meu pastor; de nada terei falta.", reference: "Salmos 23:1" },
    { quote: "Confie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento.", reference: "Provérbios 3:5" },
    { quote: "Porque sou eu que conheço os planos que tenho para vocês', diz o Senhor, 'planos de fazê-los prosperar e não de causar dano, planos de dar a vocês esperança e um futuro.", reference: "Jeremias 29:11" },
    { quote: "O que é impossível para os homens é possível para Deus.", reference: "Lucas 18:27" },
    { quote: "Pois Deus não nos deu espírito de covardia, mas de poder, de amor e de equilíbrio.", reference: "2 Timóteo 1:7" },
    { quote: "Sejam fortes e corajosos. Não tenham medo nem fiquem apavorados por causa delas, pois o Senhor, o seu Deus, vai com vocês; nunca os deixará, nunca os abandonará.", reference: "Deuteronômio 31:6" },
    { quote: "Pedi, e dar-se-vos-á; buscai, e encontrareis; batei, e abrir-se-vos-á.", reference: "Mateus 7:7" },
    { quote: "Deleite-se no Senhor, e ele atenderá aos desejos do seu coração.", reference: "Salmos 37:4" },
    { quote: "Mas os que esperam no Senhor renovarão as suas forças. Voarão alto como águias; correrão e não ficarão exaustos, andarão e não se cansarão.", reference: "Isaías 40:31" },
];

export const PRESET_BOARDS: Board[] = [
    {
        id: 'template-1',
        title: 'Meu Próximo Ano Incrível',
        isPublic: false,
        shareSlug: 'proximo-ano-incrivel',
        themeId: 'default',
        sections: [
            { 
                id: 's1-1', 
                name: 'Corpo em Movimento', 
                items: [
                    { id: 'i1-1', imageUrl: 'https://picsum.photos/seed/fitness/400/300', caption: 'Energia para o dia a dia' },
                    { id: 'i1-2', imageUrl: 'https://picsum.photos/seed/healthyfood/400/300', caption: 'Alimentação consciente' }
                ] 
            },
            { 
                id: 's1-2', 
                name: 'Mente Serena', 
                items: [
                    { id: 'i1-3', imageUrl: 'https://picsum.photos/seed/meditation/400/300', caption: 'Momentos de paz' },
                    { id: 'i1-4', imageUrl: 'https://picsum.photos/seed/reading/400/300', caption: 'Ler 12 livros no ano' },
                ] 
            },
            { 
                id: 's1-3', 
                name: 'Aventuras Memoráveis', 
                items: [
                    { id: 'i1-5', imageUrl: 'https://picsum.photos/seed/travel/400/300', caption: 'Viajar para um lugar novo' },
                    { id: 'i1-6', imageUrl: 'https://picsum.photos/seed/hobby/400/300', caption: 'Aprender uma nova habilidade' }
                ] 
            },
        ],
    },
    {
        id: 'template-2',
        title: 'Carreira de Sucesso',
        isPublic: false,
        shareSlug: 'carreira-de-sucesso',
        themeId: 'ocean',
        sections: [
            { 
                id: 's2-1', 
                name: 'Desenvolvimento Profissional', 
                items: [
                    { id: 'i2-1', imageUrl: 'https://picsum.photos/seed/career-course/400/300', caption: 'Concluir certificação em Gerenciamento de Projetos' },
                    { id: 'i2-2', imageUrl: 'https://picsum.photos/seed/career-skills/400/300', caption: 'Aprimorar habilidades de liderança' }
                ] 
            },
            { 
                id: 's2-2', 
                name: 'Networking Estratégico', 
                items: [
                    { id: 'i2-3', imageUrl: 'https://picsum.photos/seed/career-networking/400/300', caption: 'Participar de 3 eventos da indústria' },
                    { id: 'i2-4', imageUrl: 'https://picsum.photos/seed/career-mentor/400/300', caption: 'Encontrar um mentor na minha área' },
                ] 
            },
            { 
                id: 's2-3', 
                name: 'Projetos de Impacto', 
                items: [
                    { id: 'i2-5', imageUrl: 'https://picsum.photos/seed/career-project/400/300', caption: 'Liderar o novo projeto de otimização' },
                    { id: 'i2-6', imageUrl: 'https://picsum.photos/seed/career-presentation/400/300', caption: 'Apresentar resultados para a diretoria' }
                ] 
            },
        ],
    },
    {
        id: 'template-3',
        title: 'Empreendedor Visionário',
        isPublic: false,
        shareSlug: 'empreendedor-visionario',
        themeId: 'galaxy',
        sections: [
            { 
                id: 's3-1', 
                name: 'Produto Inovador', 
                items: [
                    { id: 'i3-1', imageUrl: 'https://picsum.photos/seed/startup-mvp/400/300', caption: 'Lançar o MVP do nosso app' },
                    { id: 'i3-2', imageUrl: 'https://picsum.photos/seed/startup-feedback/400/300', caption: 'Coletar feedback dos primeiros 100 usuários' }
                ] 
            },
            { 
                id: 's3-2', 
                name: 'Crescimento & Marketing', 
                items: [
                    { id: 'i3-3', imageUrl: 'https://picsum.photos/seed/startup-growth/400/300', caption: 'Alcançar 1000 usuários ativos' },
                    { id: 'i3-4', imageUrl: 'https://picsum.photos/seed/startup-marketing/400/300', caption: 'Estruturar nossa estratégia de conteúdo' },
                ] 
            },
            { 
                id: 's3-3', 
                name: 'Equipe dos Sonhos', 
                items: [
                    { id: 'i3-5', imageUrl: 'https://picsum.photos/seed/startup-team/400/300', caption: 'Contratar nosso primeiro desenvolvedor' },
                    { id: 'i3-6', imageUrl: 'https://picsum.photos/seed/startup-investment/400/300', caption: 'Conseguir a primeira rodada de investimento anjo' }
                ] 
            },
        ],
    },
    {
        id: 'template-4',
        title: 'Jornada Criativa',
        isPublic: false,
        shareSlug: 'jornada-criativa',
        themeId: 'sunrise',
        sections: [
            { 
                id: 's4-1', 
                name: 'Projetos Pessoais', 
                items: [
                    { id: 'i4-1', imageUrl: 'https://picsum.photos/seed/creative-writing/400/300', caption: 'Escrever 50 páginas do meu livro' },
                    { id: 'i4-2', imageUrl: 'https://picsum.photos/seed/creative-art/400/300', caption: 'Finalizar a série de ilustrações para o portfólio' }
                ] 
            },
            { 
                id: 's4-2', 
                name: 'Fonte de Inspiração', 
                items: [
                    { id: 'i4-3', imageUrl: 'https://picsum.photos/seed/creative-museum/400/300', caption: 'Visitar museus e galerias mensalmente' },
                    { id: 'i4-4', imageUrl: 'https://picsum.photos/seed/creative-nature/400/300', caption: 'Fazer caminhadas na natureza para buscar ideias' },
                ] 
            },
            { 
                id: 's4-3', 
                name: 'Dominando a Técnica', 
                items: [
                    { id: 'i4-5', imageUrl: 'https://picsum.photos/seed/creative-drawing/400/300', caption: 'Praticar desenho de observação diariamente' },
                    { id: 'i4-6', imageUrl: 'https://picsum.photos/seed/creative-workshop/400/300', caption: 'Fazer um workshop de aquarela' }
                ] 
            },
        ],
    },
    {
        id: 'template-5',
        title: 'Santuário do Bem-Estar',
        isPublic: false,
        shareSlug: 'santuario-bem-estar',
        themeId: 'forest',
        sections: [
            { 
                id: 's5-1', 
                name: 'Saúde Física', 
                items: [
                    { id: 'i5-1', imageUrl: 'https://picsum.photos/seed/wellness-yoga/400/300', caption: 'Praticar ioga 3x por semana' },
                    { id: 'i5-2', imageUrl: 'https://picsum.photos/seed/wellness-sleep/400/300', caption: 'Garantir 8 horas de sono por noite' }
                ] 
            },
            { 
                id: 's5-2', 
                name: 'Clareza Mental', 
                items: [
                    { id: 'i5-3', imageUrl: 'https://picsum.photos/seed/wellness-meditate/400/300', caption: 'Meditação diária de 10 minutos' },
                    { id: 'i5-4', imageUrl: 'https://picsum.photos/seed/wellness-unplug/400/300', caption: 'Um dia por semana sem redes sociais' },
                ] 
            },
            { 
                id: 's5-3', 
                name: 'Equilíbrio Emocional', 
                items: [
                    { id: 'i5-5', imageUrl: 'https://picsum.photos/seed/wellness-journal/400/300', caption: 'Escrever no diário de gratidão' },
                    { id: 'i5-6', imageUrl: 'https://picsum.photos/seed/wellness-connect/400/300', caption: 'Conectar-se com pessoas queridas' }
                ] 
            },
        ],
    }
];
