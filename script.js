// IDs válidos das cadeiras
const idsValidos = ['Cadeira 0A', 'Cadeira 1A', 'Cadeira 2A', 'Cadeira 0B', 'Cadeira 1B'];

// Recupera o histórico e o estado das cadeiras do localStorage se existir
const entregas = JSON.parse(localStorage.getItem('historico')) || [];
const cadeirasEstado = JSON.parse(localStorage.getItem('cadeirasEstado')) || {};

// Inicializa o estado das cadeiras se ainda não estiver no localStorage
idsValidos.forEach(id => {
    if (!cadeirasEstado[id]) {
        cadeirasEstado[id] = 'Disponível';
    }
});

// Atualiza o histórico e o estado das cadeiras na tela
atualizarHistorico();

document.getElementById('form-entrega').addEventListener('submit', function(e) {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const cadeira = document.getElementById('cadeira').value;
    const local = document.getElementById('local').value;

    // Checa se a cadeira é um ID válido e está disponível
    if (!idsValidos.includes(cadeira)) {
        alert('ID da cadeira inválido.');
        return;
    }

    if (cadeirasEstado[cadeira] !== 'Disponível') {
        alert('A cadeira selecionada não está disponível para entrega.');
        return;
    }

    // Adiciona nova entrega ao histórico
    entregas.push({
        nome,
        local,
        cadeira,
        tipo: 'Entregue',
        dataHora: new Date().toLocaleString('pt-BR', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    });

    // Atualiza o estado da cadeira
    cadeirasEstado[cadeira] = 'Entregue';
    
    // Salva o histórico e o estado das cadeiras no localStorage
    localStorage.setItem('historico', JSON.stringify(entregas));
    localStorage.setItem('cadeirasEstado', JSON.stringify(cadeirasEstado));
    
    atualizarHistorico();
    e.target.reset(); // Limpa o formulário após submissão
});

document.getElementById('form-devolucao').addEventListener('submit', function(e) {
    e.preventDefault();
    const cadeiraDevolucao = document.getElementById('cadeira-devolucao').value;

    // Checa se o ID da devolução é válido e corresponde a uma entrega
    const entregaIndex = entregas.findIndex(entrega => entrega.cadeira === cadeiraDevolucao && entrega.tipo === 'Entregue');
    
    if (idsValidos.includes(cadeiraDevolucao) && entregaIndex !== -1) {
        // Adiciona nova devolução ao histórico
        entregas.push({ 
            cadeira: cadeiraDevolucao,
            tipo: 'Devolvido',
            dataHora: new Date().toLocaleString('pt-BR', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
        });

        // Atualiza o estado da cadeira
        cadeirasEstado[cadeiraDevolucao] = 'Disponível';

        // Remove a entrega do histórico para evitar devoluções múltiplas
        entregas.splice(entregaIndex, 1);
        
        // Salva o histórico e o estado das cadeiras no localStorage
        localStorage.setItem('historico', JSON.stringify(entregas));
        localStorage.setItem('cadeirasEstado', JSON.stringify(cadeirasEstado));
        
        atualizarHistorico();
        e.target.reset(); // Limpa o formulário após submissão
    } else {
        alert('ID de devolução inválido ou a entrega já foi devolvida.');
    }
});

// Função para atualizar o histórico na tela
function atualizarHistorico() {
    const historico = document.getElementById('historico');
    historico.innerHTML = ''; // Limpa a lista atual
    entregas.forEach(entrega => {
        const li = document.createElement('li');
        li.textContent = `${entrega.nome ? entrega.nome : ''}  ${entrega.cadeira}  ${entrega.local ? entrega.local : ''} (${entrega.tipo}) - ${entrega.dataHora}`;
        historico.appendChild(li);
    });
}

// Adiciona evento ao botão de limpar histórico
document.getElementById('limpar-historico').addEventListener('click', function() {
    // Limpa o array de entregas e o estado das cadeiras
    entregas.length = 0;
    for (let id of idsValidos) {
        cadeirasEstado[id] = 'Disponível';
    }

    // Limpa o localStorage
    localStorage.removeItem('historico');
    localStorage.removeItem('cadeirasEstado');

    // Atualiza a lista na tela
    atualizarHistorico();
});
