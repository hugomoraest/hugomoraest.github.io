// script.js - VERSÃO FINAL COM DOWNLOAD CV EMBUTIDO (BASE64)

// Variável de controle para o estado de digitação
let isTyping = false;

// --- DADOS DE CONFIGURAÇÃO DO PM ---

// Substitua pelo seu link do LinkedIn
const LINKEDIN_URL = "https://www.linkedin.com/in/hugomoraesapm/"; 
const MIDIA_URL = "https://www.linkedin.com/feed/update/urn:li:activity:7148427335963222017/?originalSubdomain=pt";

// <<<<<<< LOCAL PARA INSERIR O CÓDIGO BASE64 DO CURRÍCULO >>>>>>>
// COLOQUE AQUI A STRING COMPLETA QUE COMEÇA COM 'data:application/...'
const CV_BASE64_DATA = "data:application/pdf;base64,INSIRA_AQUI_SEU_CODIGO_BASE64_COMPLETO_DO_CURRICULO"; 

const LINKEDIN_TRIGGERS = ['linkedin', 'linkar perfil', 'quem é o pm', 'portfolio', 'currículo', 'quem é o dono'];
const COTACAO_TRIGGERS = ['cotação de hoje', 'me da um dado', 'o que é importante', 'o que importa', 'valor do dolar', 'cotação', 'ipca', 'inflação'];

// --- Funções do Painel Lateral ---

function toggleSidePanel() {
    const panel = document.getElementById('sidePanel');
    panel.classList.toggle('open');
}

function downloadCV() {
    // Verifica se o placeholder foi substituído
    if (CV_BASE64_DATA.includes("INSIRA_AQUI_SEU_CODIGO_BASE64_COMPLETO")) {
        alert("Atenção: Por favor, substitua a string CV_BASE64_DATA no script.js pelo código Base64 do seu currículo.");
        return;
    }
    
    // Cria um link de download com os dados Base64
    const link = document.createElement('a');
    link.href = CV_BASE64_DATA;
    link.setAttribute('download', 'Curriculo_HugoMoraes_PM.pdf'); // Nome do arquivo
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert("Download do Currículo iniciado!");
}

// --- Funções de Cotação Real (BACEN/IBGE) e Simulação ---

function formatDateForBACEN(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `'${month}-${day}-${year}'`;
}

function gerarCotacao(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2).replace('.', ',');
}

async function buscarCotacaoDolar() {
    const today = new Date();
    let dolarCompra = 'R$ 5,00 (Valor indisponível - Falha na Matriz)'; 

    for (let i = 1; i <= 7; i++) {
        const dateToFetch = new Date(today);
        dateToFetch.setDate(today.getDate() - i); 
        
        const dataBusca = formatDateForBACEN(dateToFetch);
        const API_URL = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(Moeda=@Moeda,DataCotacao=@DataCotacao)?@Moeda='USD'&@DataCotacao=${dataBusca}&$format=json`;

        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            if (data.value && data.value.length > 0) {
                const cotacao = data.value[0].cotacaoCompra; 
                const dataCotacao = new Date(data.value[0].dataHoraCotacao).toLocaleDateString('pt-BR');
                
                dolarCompra = `R$ ${cotacao.toFixed(4).replace('.', ',')} (consolidado em ${dataCotacao})`;
                return dolarCompra;
            }
        } catch (error) {
            console.warn(`Tentativa de busca BACEN falhou para o dia ${dataBusca}. Tentando o dia anterior...`);
        }
    }
    
    return dolarCompra; 
}

async function buscarIPCA() {
    const API_URL = `https://servicodados.ibge.gov.br/api/v3/agregados/1737/periodos/last/variaveis/2265?localidades=N1[all]`;
    
    let ipcaInfo = 'IPCA: N/D (Falha na Matriz)';
    
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (data.length > 0 && data[0].resultados.length > 0 && data[0].resultados[0].series.length > 0) {
            const serie = data[0].resultados[0].series[0].serie;
            const ultimoPeriodo = Object.keys(serie).pop();
            const valor = serie[ultimoPeriodo];
            
            const mesPublicacao = parseInt(ultimoPeriodo.substring(4, 6)); 
            const nomeMes = new Date(2000, mesPublicacao - 1, 1).toLocaleString('pt-BR', { month: 'long' });
            
            ipcaInfo = `IPCA: ${valor.replace('.', ',')}% (Mês de ${nomeMes})`;
        }
    } catch (error) {
        console.error("Erro ao buscar dados do IBGE:", error);
    }
    
    return ipcaInfo;
}

async function gerarRespostaCotacaoSimulada(pergunta, callback) {
    
    // 1. GERA COTAÇÕES SIMULADAS
    const sp500 = gerarCotacao(4900, 5200);
    const acoes = [
        `PETR4: R$ ${gerarCotacao(30, 35)} (${gerarCotacao(-1.5, 1.5)}%)`,
        `VALE3: R$ ${gerarCotacao(60, 70)} (${gerarCotacao(-1.5, 1.5)}%)`,
        `ITUB4: R$ ${gerarCotacao(28, 32)} (${gerarCotacao(-1.5, 1.5)}%)`
    ];
    const criptos = [
        `Bitcoin: $ ${gerarCotacao(120000, 125000)}`,
        `Ethereum: $ ${gerarCotacao(4400, 4800)}`,
        `Solana: $ ${gerarCotacao(200, 250)}`
    ];
    
    // 2. BUSCA DADOS REAIS
    const [dolarCompra, ipcaValor] = await Promise.all([
        buscarCotacaoDolar(), 
        buscarIPCA()
    ]);


    // 3. MONTA A RESPOSTA FINAL
    const respostaHTML = `
        Desculpe, a **matriz de priorização** para sua pergunta está instável. No entanto, aqui estão **dados urgentes** em tempo real para ajudar na sua tomada de decisão:
        <br><br>
        <strong>Cenário Macroeconômico:</strong><br>
        - Dólar Comercial: ${dolarCompra}<br>
        - ${ipcaValor}<br><br>
        
        <strong>Mercado Financeiro (Simulado):</strong><br>
        - S&P 500: ${sp500}<br>
        - Ações Brasil (Top 3): ${acoes.join('<br>- ')}<br><br>
        
        <strong>Criptomoedas (Top 3 Simuladas):</strong><br>
        - ${criptos.join('<br>- ')}<br>
        <br>
        Obrigado por priorizar o que realmente importa.
    `;
    
    adicionarMensagemComDigitacao("Product Manager GPT", respostaHTML, 'pmgpt-message', callback);
}


// --- Funções de Limpeza, Exportação e Histórico ---

function limparHistorico(callback) {
    localStorage.removeItem('chatHistory');
    
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';
    
    adicionarMensagemComDigitacao("Product Manager GPT", "Certo, eu limpei todo o histórico da conversa! Vamos começar de novo.", 'pmgpt-message', callback);
}

function carregarMensagensParaExportacao() {
    const messages = [];
    const chatMessagesDiv = document.getElementById('chatMessages');
    
    Array.from(chatMessagesDiv.children).forEach(msgElement => {
        if (msgElement.classList.contains('chat-message')) {
            const iconElement = msgElement.querySelector('.avatar-icon');
            if (!iconElement) return;
            
            const remetente = iconElement.classList.contains('fa-user-circle') ? "Você" : "Product Manager GPT";
            
            const texto = msgElement.querySelector('.message-content').textContent.trim(); 
            
            const timestampElement = msgElement.querySelector('.timestamp');
            const timestamp = timestampElement ? timestampElement.textContent : '00:00'; 

            messages.push({ remetente, texto, timestamp });
        }
    });
    return messages;
}

function salvarHistorico() {
    const messages = carregarMensagensParaExportacao();
    localStorage.setItem('chatHistory', JSON.stringify(messages));
}

function carregarHistorico() {
    const history = localStorage.getItem('chatHistory');
    if (history) {
        const messages = JSON.parse(history);
        const chatMessages = document.getElementById('chatMessages');
        
        messages.forEach(msg => {
            const mensagemElement = document.createElement('div');
            mensagemElement.className = `chat-message ${msg.remetente === "Você" ? 'user-message' : 'pmgpt-message'}`;
            
            const icon = document.createElement('i');
            icon.className = msg.remetente === "Você" ? "fas fa-user-circle avatar-icon" : "fas fa-robot avatar-icon";
            
            const contentElement = document.createElement('div');
            contentElement.className = 'message-content';
            contentElement.innerHTML = msg.texto; 

            const timestamp = document.createElement('span');
            timestamp.className = 'timestamp';
            timestamp.textContent = msg.timestamp;
            
            if (msg.remetente === "Você") {
                mensagemElement.appendChild(contentElement);
                mensagemElement.appendChild(icon);
            } else {
                mensagemElement.appendChild(icon);
                mensagemElement.appendChild(contentElement);
            }
            mensagemElement.appendChild(timestamp);
            
            chatMessages.appendChild(mensagemElement);
        });
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } else {
        setTimeout(() => {
            adicionarMensagemComDigitacao("Product Manager GPT", "Bem-vindo, stakeholder! Pronto para ter suas perguntas respondidas com clareza e zero clichês?", 'pmgpt-message');
        }, 100);
    }
}

function exportarHistoricoParaCSV() {
    const messages = carregarMensagensParaExportacao();
    
    if (messages.length === 0) {
        alert("Não há histórico para exportar.");
        return;
    }
    
    const csvContent = [];
    csvContent.push(["Remetente", "Horário", "Mensagem"].join(";")); 

    messages.forEach(msg => {
        const cleanedText = msg.texto.replace(/(\r\n|\n|\r)/gm, " ").replace(/"/g, '""'); 
        csvContent.push([`"${msg.remetente}"`, `"${msg.timestamp}"`, `"${cleanedText}"`].join(";"));
    });

    const csvString = csvContent.join("\n");

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `pmgpt_historico_${new Date().toISOString().slice(0, 10)}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// --- Funções de Interação e Fluxo (Continuação) ---

function abrirLinkedInEResponder(pergunta, callback) {
    const newWindow = window.open(LINKEDIN_URL, '_blank');
    
    if (newWindow) {
        newWindow.focus();
    }
    
    const resposta = "Ah, então você quer fazer uma **análise de concorrentes** da minha carreira, hein? Sem problemas. O *roadmap* completo está na nova aba. 😉";
    
    adicionarMensagemComDigitacao("Product Manager GPT", resposta, 'pmgpt-message', callback);
}

function abrirLinkMidia(callback) {
    // 1. Abre o link em uma nova aba
    window.open(MIDIA_URL, '_blank');
    
    // 2. Resposta de confirmação
    const resposta = "Sim! Nossas estratégias são tão inovadoras que **saímos na mídia**. O artigo completo está em uma nova aba. Não se preocupe, voltarei para ignorar sua pergunta em breve!";
    
    // 3. Adiciona a resposta no chat e chama o callback para reativar o input
    adicionarMensagemComDigitacao("Product Manager GPT", resposta, 'pmgpt-message', callback);
}

function exibirMensagemModoNoturnoEspecial() {
    const mensagem = "Legal essa feature de modo noturno, não é? Fizemos isso depois de **35%** dos usuários implorarem por isso nas pesquisas de satisfação.";
    
    adicionarMensagemComDigitacao("Product Manager GPT", mensagem, 'pmgpt-message', () => {
        // Nada precisa acontecer
    });
}

function alternarModoNoturno() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    
    let nightModeToggleCount = localStorage.getItem('nightModeToggleCount') || 0;
    const messageShown = localStorage.getItem('nightModeMessageShown') === 'true'; 
    
    nightModeToggleCount = parseInt(nightModeToggleCount) + 1;
    localStorage.setItem('nightModeToggleCount', nightModeToggleCount);

    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
    
    if (nightModeToggleCount === 2 && !messageShown) {
        setTimeout(exibirMensagemModoNoturnoEspecial, 1000); 
        localStorage.setItem('nightModeMessageShown', 'true');
    }
}

// --- FLUXO PRINCIPAL (ASYNC) ---
async function enviarMensagem() {
    if (isTyping) return; 

    const perguntaInput = document.getElementById('perguntaInput');
    const sendButton = document.getElementById('sendButton');
    const pergunta = perguntaInput.value.trim();
    const perguntaLower = pergunta.toLowerCase();

    // 1. Comandos de Limpeza
    const isClearCommand = 
        (perguntaLower.includes('limpar') || perguntaLower.includes('limpe') || perguntaLower.includes('apagar') || perguntaLower.includes('apague')) && 
        (perguntaLower.includes('histórico') || perguntaLower.includes('conversa'));
    
    // 2. Comandos de LinkedIn
    const isLinkedInCommand = LINKEDIN_TRIGGERS.some(trigger => perguntaLower.includes(trigger));
    
    // 3. Comandos de Cotação
    const isCotacaoCommand = COTACAO_TRIGGERS.some(trigger => perguntaLower.includes(trigger));


    if (pergunta !== '') {
        
        // FLUXO DE COMANDOS DE ALTA PRIORIDADE
        if (isClearCommand) {
            isTyping = true;
            perguntaInput.disabled = true;
            sendButton.disabled = true;
            perguntaInput.value = '';

            adicionarMensagemComDigitacao("Você", pergunta, 'user-message', () => {
                mostrarIndicadorDigitacao(true);
                setTimeout(() => {
                    limparHistorico(() => {
                        mostrarIndicadorDigitacao(false);
                        perguntaInput.disabled = false;
                        sendButton.disabled = false;
                        isTyping = false; 
                        perguntaInput.focus();
                    });
                }, 500); 
            });
            return; 
        }

        if (isLinkedInCommand) {
            isTyping = true;
            perguntaInput.disabled = true;
            sendButton.disabled = true;

            adicionarMensagemComDigitacao("Você", pergunta, 'user-message', () => {
                mostrarIndicadorDigitacao(true);
                setTimeout(() => {
                    abrirLinkedInEResponder(pergunta, () => {
                        mostrarIndicadorDigitacao(false);
                        perguntaInput.disabled = false;
                        sendButton.disabled = false;
                        isTyping = false; 
                        perguntaInput.value = '';
                        perguntaInput.focus();
                        salvarHistorico();
                    });
                }, 500); 
            });
            return; 
        }
        
        // FLUXO DE COMANDO COTAÇÃO (ASYNC)
        if (isCotacaoCommand) {
            
            isTyping = true;
            perguntaInput.disabled = true;
            sendButton.disabled = true;

            adicionarMensagemComDigitacao("Você", pergunta, 'user-message', () => {
                mostrarIndicadorDigitacao(true);
                
                setTimeout(async () => {
                    await gerarRespostaCotacaoSimulada(pergunta, () => {
                        mostrarIndicadorDigitacao(false);
                        perguntaInput.disabled = false;
                        sendButton.disabled = false;
                        isTyping = false; 
                        perguntaInput.value = '';
                        perguntaInput.focus();
                        salvarHistorico();
                    });
                }, 10); 
            });
            return; 
        }
        
        // INÍCIO DO FLUXO NORMAL DE CONVERSA (com chance de Easter Egg Mídia)
        
        isTyping = true;
        perguntaInput.disabled = true;
        sendButton.disabled = true;
        
        // 4. Lógica da Mídia (1 em 15 chances)
        const mediaChance = Math.random();
        if (mediaChance < 0.065) { 
             adicionarMensagemComDigitacao("Você", pergunta, 'user-message', () => {
                mostrarIndicadorDigitacao(true);
                setTimeout(() => {
                    abrirLinkMidia(() => {
                        mostrarIndicadorDigitacao(false);
                        perguntaInput.disabled = false;
                        sendButton.disabled = false;
                        isTyping = false; 
                        perguntaInput.value = '';
                        perguntaInput.focus();
                        salvarHistorico();
                    });
                }, 100);
            });
            return;
        }

        // Resposta padrão
        const resposta = obterResposta(pergunta);
        
        adicionarMensagemComDigitacao("Você", pergunta, 'user-message', () => {
            
            perguntaInput.value = '';

            mostrarIndicadorDigitacao(true);

            setTimeout(() => {
                
                adicionarMensagemComDigitacao("Product Manager GPT", resposta, 'pmgpt-message', () => {
                    
                    mostrarIndicadorDigitacao(false);
                    
                    perguntaInput.disabled = false;
                    sendButton.disabled = false;
                    isTyping = false; 
                    perguntaInput.focus();
                    
                    salvarHistorico();
                });
            }, 100); 
        });
    } else {
        perguntaInput.disabled = false;
        sendButton.disabled = false;
        isTyping = false;
    }
}

function verificarTecla(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        enviarMensagem(); 
    }
}

function obterResposta(pergunta) {
    const respostas = [
        "Ah, a resposta mais confiável desde que Sócrates era um PM. **Depende...** talvez eu tenha uma resposta melhor depois de consultar a minha bola de cristal.",
        "Estamos adicionando isso à nossa lista de tarefas, junto com encontrar a fonte da eterna juventude para nossos desenvolvedores.",
        "Vamos colocar nossos matemáticos para trabalhar e ver se vale a pena mais do que uma máquina de café infinita.",
        "Vamos fazer uma festa com os usuários para celebrar suas opiniões enquanto oferecemos pizza grátis. Pesquisa de mercado com estilo!",
        "Estamos pensando tão à frente que estamos prestes a lançar um produto em Marte. Elon Musk, prepare-se para a concorrência!",
        "Estamos prontos para mais iterações do que uma banda de jazz. Dê-nos feedback e verá uma melodia de melhorias.",
        "Depende... ou talvez não!",
        "Hmmm, você realmente quer saber?",
        "A resposta está escrita nas estrelas... ou em um manual muito confuso.",
        "Pergunte novamente mais tarde, estou ocupado calculando respostas complexas.",
        "42. A resposta para tudo é 42, certo?",
        "Você sabia que girafas têm o mesmo número de vértebras no pescoço, não importa o tamanho do pescoço? Isso não tem nada a ver com sua pergunta, só achei interessante compartilhar.",
        "Acho que já mencionei que sou uma IA e não tenho todas as respostas, mas adoro tentar!",
        "Peça ao seu colega de equipe, algum deles deve saber!",
        "Só o tempo dirá... ou não.",
        "Nossos objetivos são tão claros que até os astrólogos concordam. O universo está alinhado, e nosso produto também."
    ];

    const perguntaLower = pergunta.toLowerCase();
    if (perguntaLower.includes('roadmap')) {
        return "O roadmap? Está no mesmo lugar que o dinheiro que a gente economizou cortando o café. Ou seja, 'em desenvolvimento', mas ninguém sabe onde.";
    }
    if (perguntaLower.includes('prioridade')) {
        return "Tudo é prioridade! A prioridade da prioridade é o que a gente resolve agora, ou talvez depois do almoço. Deixe-me ver o Excel de 'urgência vs importância' de novo...";
    }

    const indiceResposta = Math.floor(Math.random() * respostas.length);
    return respostas[indiceResposta];
}


function adicionarMensagemComDigitacao(remetente, resposta, classe, callback = () => {}) {
    const chatMessages = document.getElementById('chatMessages');
    const mensagemElement = document.createElement('div');
    mensagemElement.className = `chat-message ${classe}`;
    
    const contentElement = document.createElement('div');
    contentElement.className = 'message-content';
    
    const icon = document.createElement('i');
    icon.className = remetente === "Você" ? "fas fa-user-circle avatar-icon" : "fas fa-robot avatar-icon";
    
    
    if (remetente === "Você") {
        mensagemElement.appendChild(contentElement);
        mensagemElement.appendChild(icon); 
    } else {
        mensagemElement.appendChild(icon); 
        mensagemElement.appendChild(contentElement);
    }
    
    chatMessages.appendChild(mensagemElement);

    let index = 0;
    
    const textoPuro = resposta.replace(/<[^>]*>/g, ''); 
    const textoCompletoHTML = resposta;

    function exibirProximoCaractere() {
        if (index < textoPuro.length) {
            
            contentElement.textContent = textoPuro.substring(0, index + 1);
            index++;
            
            const delay = remetente === "Product Manager GPT" ? 35 : 15; 
            // CORRIGIDO: Removido o espaço extra no nome da função
            setTimeout(exibirProximoCaractere, delay);
        } else {
            contentElement.innerHTML = textoCompletoHTML; 
            
            const timestamp = document.createElement('span');
            timestamp.className = 'timestamp';
            timestamp.textContent = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            mensagemElement.appendChild(timestamp);

            chatMessages.scrollTop = chatMessages.scrollHeight;
            callback(); 
        }
    }

    // CORRIGIDO: Removido o espaço extra no nome da função
    exibirProximoCaractere();
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function mostrarIndicadorDigitacao(show) {
    const indicator = document.getElementById('typingIndicator');
    indicator.style.display = show ? 'flex' : 'none';
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


document.addEventListener('DOMContentLoaded', () => {
    carregarHistorico();
    
    const body = document.body;
    const toggleButton = document.getElementById('toggleNightMode');
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
    }
    toggleButton.onclick = alternarModoNoturno;
    
    document.getElementById('perguntaInput').focus();
});
