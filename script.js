// script.js - VERSÃO DE DIAGNÓSTICO

// Função que o HTML chama quando uma tecla é pressionada
function verificarTecla(event) {
    // 1. Verifica se a tecla é o Enter
    if (event.key === "Enter") {
        event.preventDefault(); // Previne o comportamento padrão (ex: recarregar a página)
        
        // 2. Chama a função de envio
        enviarMensagem(); 
    }
}

// Função de envio simplificada para diagnóstico
function enviarMensagem() {
    const perguntaInput = document.getElementById('perguntaInput');
    const pergunta = perguntaInput.value.trim();

    // 3. Verifica se a pergunta está vazia
    if (pergunta !== '') {
        // 4. AÇÃO DE TESTE: SE FUNCIONAR, O ALERTA APARECERÁ.
        alert("Enter Funcionou! Pergunta: " + pergunta);
        
        // 5. Limpa a caixa de texto
        perguntaInput.value = '';
    }
}


// Funções de Inicialização VAZIAS (para não causar erro de referência no HTML)
function alternarModoNoturno() {
    // Apenas para evitar que o HTML dê erro no clique do botão
    alert("O Modo Noturno está temporariamente desativado para diagnóstico.");
}

document.addEventListener('DOMContentLoaded', () => {
    // Garante que o input tem foco
    document.getElementById('perguntaInput').focus();
});
