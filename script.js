// script.js - VERSÃO FINAL E CORRIGIDA

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
                    perguntaInput.focus(); // Coloca o foco de volta
                    
                    // 9. Salvar o novo estado da conversa
                    salvarHistorico();
                });
            }, 1000); 
        });
    } else {
        // Se a pergunta estiver vazia, garante que o input esteja ativo e isTyping seja false.
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
    
    
    // Adiciona o ícone e o conteúdo na ordem correta
    if (remetente === "Você") {
        mensagemElement.appendChild(contentElement);
        mensagemElement.appendChild(avatar);
    } else {
        mensagemElement.appendChild(avatar);
        mensagemElement.appendChild(contentElement);
    }
    
    chatMessages.appendChild(mensagemElement);

    let index = 0;
    
    // O problema estava aqui: usamos textContent para garantir que o HTML (como <strong>) não cause problemas de contagem de caracteres durante a digitação.
    const textoCru = resposta.replace(/<\/?strong>/g, ''); // Remove tags <strong> para contagem
    const textoCompletoHTML = resposta; // Mantém o HTML para o innerHTML final

    function exibirProximoCaractere() {
        if (index < textoCru.length) {
            
            // Usamos textoCompletoHTML.substring para pegar o texto com formatação HTML até o índice atual
            // A substituição complexa abaixo garante que a tag <strong> abra e feche corretamente quando o caractere
            // sendo exibido está dentro dela, mantendo o efeito de digitação.
            let textoAtual = resposta.substring(0, resposta.indexOf(textoCru[index]) + 1);
            
            contentElement.innerHTML = textoAtual;
            index++;
            
            // Velocidade de digitação
            const delay = remetente === "Product Manager GPT" ? 35 : 15; 
            setTimeout(exibirProximoCaractere, delay);
        } else {
            // Fim da digitação
            
            // Garante que o texto final com todo o HTML (como <strong>) esteja correto
            contentElement.innerHTML = textoCompletoHTML;
            
            // Adiciona o carimbo de data/hora
            const timestamp = document.createElement('span');
            timestamp.className = 'timestamp';
            timestamp.textContent = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            mensagemElement.appendChild(timestamp);

            chatMessages.scrollTop = chatMessages.scrollHeight;
            callback(); // Chama o callback para seguir o fluxo (ex: responder a IA)
        }
    }

    exibirProximoCaractere();
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function mostrarIndicadorDigitacao(show) {
    const indicator = document.getElementById('typingIndicator');
    indicator.style.display = show ? 'flex' : 'none';
    const chatMessages = document.getElementById('chatMessages');
    // Rola para o fim para mostrar o indicador
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


// --- Funções de Histórico e Inicialização ---

function salvarHistorico() {
    const messages = [];
    const chatMessagesDiv = document.getElementById('chatMessages');
    
    // Percorre todos os elementos de mensagem (ignorando o indicador de digitação)
    Array.from(chatMessagesDiv.children).forEach(msgElement => {
        if (msgElement.classList.contains('chat-message')) {
            const remetente = msgElement.querySelector('.avatar-icon').classList.contains('fa-user-circle') ? "Você" : "Product Manager GPT";
            const texto = msgElement.querySelector('.message-content').innerHTML; 
            const classe = msgElement.classList.contains('user-message') ? 'user-message' : 'pmgpt-message';
            // Verifica se o timestamp existe antes de tentar ler
            const timestampElement = msgElement.querySelector('.timestamp');
            const timestamp = timestampElement ? timestampElement.textContent : new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

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
            contentElement.innerHTML = msg.texto; 

            // Carimbo de data/hora
            const timestamp = document.createElement('span');
            timestamp.className = 'timestamp';
            timestamp.textContent = msg.timestamp;
            
            // Reconstroi a ordem correta
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
        setTimeout(() => {
            adicionarMensagemComDigitacao("Product Manager GPT", "Bem-vindo, stakeholder! Pronto para ter suas perguntas respondidas com clareza e zero clichês? (Resposta: **Depende**).", 'pmgpt-message');
        }, 100);
    }
}


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


document.addEventListener('DOMContentLoaded', () => {
    // 1. Carrega o histórico (se existir)
    carregarHistorico();
    
    // 2. Inicializa o Modo Noturno
    const body = document.body;
    const toggleButton = document.getElementById('toggleNightMode');
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
    }
    toggleButton.onclick = alternarModoNoturno;
    
    // Coloca o foco no input
    document.getElementById('perguntaInput').focus();
});
