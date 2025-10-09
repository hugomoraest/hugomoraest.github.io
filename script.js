// script.js - VERSÃO FINAL DE ESTABILIDADE E FLUXO

// Variável de controle para o estado de digitação
let isTyping = false;

// --- Funções de Envio e Controle ---

function enviarMensagem() {
    // 1. Bloqueia se a IA já estiver respondendo
    if (isTyping) return; 

    const perguntaInput = document.getElementById('perguntaInput');
    const sendButton = document.getElementById('sendButton');
    const pergunta = perguntaInput.value.trim();

    if (pergunta !== '') {
        
        // 2. Define o estado de digitação e desativa inputs
        isTyping = true;
        perguntaInput.disabled = true;
        sendButton.disabled = true;
        
        const resposta = obterResposta(pergunta);
        
        // 3. Adicionar e exibir a mensagem do usuário (com digitação)
        adicionarMensagemComDigitacao("Você", pergunta, 'user-message', () => {
            // CALLBACK executado APÓS a mensagem do usuário terminar de digitar.
            
            // Limpa o campo de entrada
            perguntaInput.value = '';

            // 4. Ligar o indicador
            mostrarIndicadorDigitacao(true);

            // 5. Simular um atraso para a IA "pensar" (1 segundo)
            setTimeout(() => {
                
                // 6. Adicionar e exibir a resposta do PM GPT
                adicionarMensagemComDigitacao("Product Manager GPT", resposta, 'pmgpt-message', () => {
                    // CALLBACK executado APÓS a mensagem da IA terminar de digitar.
                    
                    // 7. Ocultar o indicador
                    mostrarIndicadorDigitacao(false);
                    
                    // 8. Reativar o input, botão e zerar o estado
                    perguntaInput.disabled = false;
                    sendButton.disabled = false;
                    isTyping = false; 
                    perguntaInput.focus();
                    
                    // 9. Salvar o novo estado da conversa
                    salvarHistorico();
                });
            }, 1000); 
        });
    } else {
        // Se a pergunta estiver vazia
        perguntaInput.disabled = false;
        sendButton.disabled = false;
        isTyping = false;
    }
}

function verificarTecla(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        enviarMensagem(); // Chama a função unificada de envio
    }
}

// --- Funções Auxiliares (Resposta e Digitação) ---

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

    // --- Respostas Específicas por Palavra-Chave (Easter Egg) ---
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
    
    // Elemento do conteúdo da bolha
    const contentElement = document.createElement('div');
    contentElement.className = 'message-content';
    
    // Cria o elemento Icone de forma DOM nativa
    const icon = document.createElement('i');
    icon.className = remetente === "Você" ? "fas fa-user-circle avatar-icon" : "fas fa-robot avatar-icon";
    
    
    // Adiciona o ícone e o conteúdo na ordem correta (MUDANÇA CRÍTICA AQUI)
    if (remetente === "Você") {
        mensagemElement.appendChild(contentElement);
        mensagemElement.appendChild(icon); // Adiciona o ícone depois do conteúdo
    } else {
        mensagemElement.appendChild(icon); // Adiciona o ícone antes do conteúdo
        mensagemElement.appendChild(contentElement);
    }
    
    chatMessages.appendChild(mensagemElement);

    let index = 0;
    
    // Remove qualquer tag HTML para garantir que o contador e o texto sejam simples
    const textoPuro = resposta.replace(/<[^>]*>/g, ''); 
    const textoCompletoHTML = resposta;

    function exibirProximoCaractere() {
        if (index < textoPuro.length) {
            
            // Durante a digitação, usa apenas o texto puro
            contentElement.textContent = textoPuro.substring(0, index + 1);
            index++;
            
            const delay = remetente === "Product Manager GPT" ? 35 : 15; 
            setTimeout(exibirProximoCaractere, delay);
        } else {
            // Fim da digitação: restaura o HTML para a formatação (negrito)
            contentElement.innerHTML = textoCompletoHTML; 
            
            // Adiciona o carimbo de data/hora
            const timestamp = document.createElement('span');
            timestamp.className = 'timestamp';
            timestamp.textContent = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            mensagemElement.appendChild(timestamp);

            chatMessages.scrollTop = chatMessages.scrollHeight;
            callback(); // CHAMA O CALLBACK E PROSSEGUE PARA O PRÓXIMO PASSO DO FLUXO
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


// --- Funções de Histórico e Inicialização ---

function salvarHistorico() {
    const messages = [];
    const chatMessagesDiv = document.getElementById('chatMessages');
    
    Array.from(chatMessagesDiv.children).forEach(msgElement => {
        if (msgElement.classList.contains('chat-message')) {
            // Tentativa de ler o remetente pelo ícone
            const iconElement = msgElement.querySelector('.avatar-icon');
            if (!iconElement) return; // Se não tem ícone, pula (erro)
            
            const isUser = iconElement.classList.contains('fa-user-circle');
            const remetente = isUser ? "Você" : "Product Manager GPT";
            const texto = msgElement.querySelector('.message-content').innerHTML; 
            const classe = msgElement.classList.contains('user-message') ? 'user-message' : 'pmgpt-message';
            const timestampElement = msgElement.querySelector('.timestamp');
            const timestamp = timestampElement ? timestampElement.textContent : '00:00'; 

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
            
            // Cria o elemento Icone
            const icon = document.createElement('i');
            icon.className = msg.remetente === "Você" ? "fas fa-user-circle avatar-icon" : "fas fa-robot avatar-icon";
            
            // Conteúdo
            const contentElement = document.createElement('div');
            contentElement.className = 'message-content';
            contentElement.innerHTML = msg.texto; 

            // Carimbo de data/hora
            const timestamp = document.createElement('span');
            timestamp.className = 'timestamp';
            timestamp.textContent = msg.timestamp;
            
            // Reconstroi a ordem correta
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
        // Mensagem de boas-vindas na primeira sessão
        setTimeout(() => {
            adicionarMensagemComDigitacao("Product Manager GPT", "Bem-vindo, stakeholder! Pronto para ter suas perguntas respondidas com clareza e zero clichês? (Resposta: **Depende**).", 'pmgpt-message');
        }, 100);
    }
}


function alternarModoNoturno() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
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
