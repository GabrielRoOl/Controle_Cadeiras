// Recupera o histórico do localStorage se existir
const entregas = JSON.parse(localStorage.getItem('historico')) || [];

// Atualiza o histórico na tela
atualizarHistorico();

document.getElementById('form-entrega').addEventListener('submit', function(e) {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const local = document.getElementById('local').value;

    // Adiciona nova entrega ao histórico
    entregas.push({
        nome,
        local,
        tipo: 'Entregue',
        dataHora: new Date().toLocaleString('pt-BR', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    });
    
    // Salva o histórico atualizado no localStorage
    localStorage.setItem('historico', JSON.stringify(entregas));
    
    atualizarHistorico();
    e.target.reset(); // Limpa o formulário após submissão
});

document.getElementById('form-devolucao').addEventListener('submit', function(e) {
    e.preventDefault();
    const nomeDevolucao = document.getElementById('nome-devolucao').value;

    // Adiciona nova devolução ao histórico
    entregas.push({ nome: nomeDevolucao, tipo: 'Devolvido' });
    
    // Salva o histórico atualizado no localStorage
    localStorage.setItem('historico', JSON.stringify(entregas));
    
    atualizarHistorico();
    e.target.reset(); // Limpa o formulário após submissão
});

// Função para atualizar o histórico na tela
function atualizarHistorico() {
    const historico = document.getElementById('historico');
    historico.innerHTML = ''; // Limpa a lista atual
    entregas.forEach(entrega => {
        const li = document.createElement('li');
        li.textContent = `${entrega.nome} ${entrega.local ? `- ${entrega.local}` : ''} (${entrega.tipo}) - ${entrega.dataHora}`;
        historico.appendChild(li);
    });
}

// Adiciona evento ao botão de limpar histórico
document.getElementById('limpar-historico').addEventListener('click', function() {
    // Limpa o array de entregas
    entregas.length = 0;

    // Limpa o localStorage
    localStorage.removeItem('historico');

    // Atualiza a lista na tela
    atualizarHistorico();
});
