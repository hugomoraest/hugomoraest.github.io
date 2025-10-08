// script.js

// script.js (APENAS A FUNÇÃO ENVIAR MENSAGEM FOI REVISADA E CORRIGIDA)

// Variável de controle para o estado de digitação
let isTyping = false;

// Função para enviar a mensagem (chamada por Enter ou pelo botão)
function enviarMensagem() {
    if (isTyping) return; // Não envia se a IA estiver digitando

    const perguntaInput = document.getElementById('perguntaInput');
    const pergunta = perguntaInput.value.trim();

    if (pergunta !== '') {
        // Desativa o input e o botão para evitar múltiplos envios
        perguntaInput.disabled = true;
        document.getElementById('sendButton').disabled = true;
        
        const resposta = obterResposta(pergunta);
        
        // 1. Adicionar e exibir a mensagem do usuário (com digitação)
        adicionarMensagemComDigitacao("Você", pergunta, 'user-message', () => {
            // Este é o CALLBACK executado APÓS a mensagem do usuário terminar de digitar.
            
            // Limpa o conteúdo do campo de entrada (agora que o envio foi validado)
            perguntaInput.value = '';

            // 2. Ligar o indicador e definir o estado de digitação
            mostrarIndicadorDigitacao(true);
            isTyping = true;

            // 3. Simular um atraso para a IA "pensar" (1 segundo)
            setTimeout(() => {
                
                // 4. Adicionar e exibir a resposta do PM GPT (com digitação)
                adicionarMensagemComDigitacao("Product Manager GPT", resposta, 'pmgpt-message', () => {
                    // Este é o CALLBACK executado APÓS a mensagem da IA terminar de digitar.
                    
                    // 5. Ocultar o indicador e reativar o input
                    mostrarIndicadorDigitacao(false);
                    perguntaInput.disabled = false;
                    document.getElementById('sendButton').disabled = false;
                    isTyping = false;
                    perguntaInput.focus(); // Coloca o foco de volta
                    
                    // 6. Salvar o novo estado da conversa
                    salvarHistorico();
                });
            }, 1000); 
        });

        // O input.value = ''; foi movido para DENTRO do callback do usuário para garantir a ordem correta
    }
}

function verificarTecla(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        enviarMensagem(); // Chama a função unificada
    }
}

// ... As outras funções (obterResposta, adicionarMensagemComDigitacao, etc.) seguem inalteradas


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

    // --- Feature: Respostas Específicas por Palavra-Chave (Easter Egg) ---
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
    
    // Icone
    const iconClass = remetente === "Você" ? "fas fa-user-circle" : "fas fa-robot";
    const avatar = `<i class="${iconClass} avatar-icon"></i>`;
    
    // Elemento do conteúdo da bolha
    const contentElement = document.createElement('div');
    contentElement.className = 'message-content';
    
    // Adiciona o ícone e o conteúdo
    mensagemElement.appendChild(remetente === "Você" ? contentElement : avatar);
    if (remetente === "Você") {
        mensagemElement.appendChild(avatar);
    } else {
        mensagemElement.appendChild(contentElement);
    }
    
    chatMessages.appendChild(mensagemElement);

    let index = 0;
    
    // Armazena a mensagem completa
    const textoCompleto = resposta;

    function exibirProximoCaractere() {
        if (index < textoCompleto.length) {
            // Adiciona o texto com a formatação (negrito, etc.)
            contentElement.innerHTML = textoCompleto.substring(0, index + 1);
            index++;
            // Ajusta a velocidade de digitação para a IA ser um pouco mais lenta
            const delay = remetente === "Product Manager GPT" ? 35 : 15; 
            setTimeout(exibirProximoCaractere, delay);
        } else {
            // Fim da digitação
            
            // Adiciona o carimbo de data/hora
            const timestamp = document.createElement('span');
            timestamp.className = 'timestamp';
            timestamp.textContent = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            mensagemElement.appendChild(timestamp);

            chatMessages.scrollTop = chatMessages.scrollHeight;
            callback(); // Chama o callback
        }
    }

    exibirProximoCaractere();
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// --- Feature: Histórico de Sessão (LocalStorage) ---

function salvarHistorico() {
    const messages = [];
    const chatMessagesDiv = document.getElementById('chatMessages');
    
    // Percorre todos os elementos de mensagem (ignorando o indicador de digitação)
    Array.from(chatMessagesDiv.children).forEach(msgElement => {
        if (msgElement.classList.contains('chat-message')) {
            const remetente = msgElement.querySelector('.avatar-icon').classList.contains('fa-user-circle') ? "Você" : "Product Manager GPT";
            const texto = msgElement.querySelector('.message-content').innerHTML;
            const classe = msgElement.classList.contains('user-message') ? 'user-message' : 'pmgpt-message';
            const timestamp = msgElement.querySelector('.timestamp').textContent;

            messages.push({ remetente, texto, classe, timestamp });
        }
    });
    localStorage.setItem('chatHistory', JSON.stringify(messages));
}

function carregarHistorico() {
    const history = localStorage.getItem('chatHistory');
    if (history) {
        const messages = JSON.parse(history);
        const chatMessages = document.getElementById('chatMessages');
        
        messages.forEach(msg => {
            const mensagemElement = document.createElement('div');
            mensagemElement.className = `chat-message ${msg.classe}`;
            
            // Icone
            const iconClass = msg.remetente === "Você" ? "fas fa-user-circle" : "fas fa-robot";
            const avatar = `<i class="${iconClass} avatar-icon"></i>`;
            
            // Conteúdo
            const contentElement = document.createElement('div');
            contentElement.className = 'message-content';
            contentElement.innerHTML = msg.texto; // Usa innerHTML para manter a formatação (negrito)

            // Carimbo de data/hora
            const timestamp = document.createElement('span');
            timestamp.className = 'timestamp';
            timestamp.textContent = msg.timestamp;
            
            if (msg.remetente === "Você") {
                mensagemElement.appendChild(contentElement);
                mensagemElement.appendChild(avatar);
            } else {
                mensagemElement.appendChild(avatar);
                mensagemElement.appendChild(contentElement);
            }
            mensagemElement.appendChild(timestamp);
            
            chatMessages.appendChild(mensagemElement);
        });
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } else {
        // Mensagem de boas-vindas na primeira sessão
        adicionarMensagemComDigitacao("Product Manager GPT", "Bem-vindo, stakeholder! Pronto para ter suas perguntas respondidas com clareza e zero clichês? (Resposta: **Depende**).", 'pmgpt-message');
    }
}

// --- Inicialização ---

document.addEventListener('DOMContentLoaded', () => {
    carregarHistorico();
    
    // Adiciona listener para o botão de enviar
    document.getElementById('sendButton').onclick = enviarMensagem;
    
    // Adiciona listener para o modo noturno
    const body = document.body;
    const toggleButton = document.getElementById('toggleNightMode');
    // Verifica se o modo noturno estava ativo
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
    }
    toggleButton.onclick = alternarModoNoturno;
});


function alternarModoNoturno() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    // Salva a preferência
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
}


// --- Indicador de Digitação ---

function mostrarIndicadorDigitacao(show) {
    const indicator = document.getElementById('typingIndicator');
    indicator.style.display = show ? 'flex' : 'none';
}
