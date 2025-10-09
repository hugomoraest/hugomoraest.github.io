// script.js - VERSÃO FINAL (Contador de Modo Noturno, Limpeza por Comando, e Exportação CSV)

// Variável de controle para o estado de digitação
let isTyping = false;

// --- Funções de Limpeza e Histórico ---

function limparHistorico(callback) {
    // Remove o histórico salvo
    localStorage.removeItem('chatHistory');
    
    // Limpa a interface imediatamente
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';
    
    // Resposta de confirmação
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
            adicionarMensagemComDigitacao("Product Manager GPT", "Bem-vindo, stakeholder! Pronto para ter suas perguntas respondidas com clareza e zero clichês? (Resposta: **Depende**).", 'pmgpt-message');
        }, 100);
    }
}

// --- Funções de Exportação CSV ---

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


// --- Funções de Interação e Fluxo ---

function exibirMensagemModoNoturnoEspecial() {
    const mensagem = "Legal essa feature de modo noturno, não é? Fizemos isso depois de **11,5%** dos usuários implorarem por isso nas pesquisas de satisfação.";
    
    // Adiciona a mensagem, mas sem callback para não interromper o fluxo principal
    adicionarMensagemComDigitacao("Product Manager GPT", mensagem, 'pmgpt-message', () => {
        // Nada precisa acontecer
    });
}

function alternarModoNoturno() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    
    // --- LÓGICA DE CONTADOR ---
    let nightModeToggleCount = localStorage.getItem('nightModeToggleCount') || 0;
    
    nightModeToggleCount = parseInt(nightModeToggleCount) + 1;
    localStorage.setItem('nightModeToggleCount', nightModeToggleCount);

    // Salva a preferência de cor
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
    
    // DISPARADOR: Se o contador for igual a 2 (a segunda vez que o botão foi pressionado)
    if (nightModeToggleCount === 2) {
        setTimeout(exibirMensagemModoNoturnoEspecial, 1000); 
        
        // Zera o contador para que a mensagem não apareça novamente
        localStorage.setItem('nightModeToggleCount', 0);
    }
}

function enviarMensagem() {
    if (isTyping) return; 

    const perguntaInput = document.getElementById('perguntaInput');
    const sendButton = document.getElementById('sendButton');
    const pergunta = perguntaInput.value.trim();
    const perguntaLower = pergunta.toLowerCase();

    // Lógica para detectar comandos de limpeza
    const isClearCommand = 
        (perguntaLower.includes('limpar') || perguntaLower.includes('limpe') || perguntaLower.includes('apagar') || perguntaLower.includes('apague')) && 
        (perguntaLower.includes('histórico') || perguntaLower.includes('conversa'));

    if (pergunta !== '') {
        
        // FLUXO DE COMANDO DE LIMPEZA
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
        
        // INÍCIO DO FLUXO NORMAL DE CONVERSA
        
        isTyping = true;
        perguntaInput.disabled = true;
        sendButton.disabled = true;
        
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
