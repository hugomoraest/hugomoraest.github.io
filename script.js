// script.js

function alternarModoNoturno() {
    const body = document.body;
    body.classList.toggle('dark-mode');
}

function verificarTecla(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        const perguntaInput = document.getElementById('perguntaInput');
        const pergunta = perguntaInput.value.trim();

        if (pergunta !== '') {
            const resposta = obterRespostaAleatoria();
            adicionarMensagemComDigitacao("Você", pergunta);
            adicionarMensagemComDigitacao("Product Manager GPT", resposta);

             // Limpar o conteúdo do campo de entrada após pressionar Enter
        perguntaInput.value = '';
        }
    }
}
function obterRespostaAleatoria() {
    const respostas = [
       "Ah, a resposta mais confiável desde que Sócrates era um PM. Depende... talvez eu tenha uma resposta melhor depois de consultar a minha bola de cristal.",
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

 const indiceResposta = Math.floor(Math.random() * respostas.length);
    return respostas[indiceResposta];
}

function adicionarMensagemComDigitacao(remetente, resposta) {
    const chatMessages = document.getElementById('chatMessages');
    const mensagemElement = document.createElement('div');
    mensagemElement.className = 'chat-message';
    chatMessages.appendChild(mensagemElement);

    let index = 0;

    function exibirProximoCaractere() {
        if (index < resposta.length) {
            mensagemElement.innerHTML = `<strong>${remetente}:</strong> ${resposta.substring(0, index + 1)}`;
            index++;
            setTimeout(exibirProximoCaractere, 30);
        }
    }

    exibirProximoCaractere();
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
