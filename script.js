// CONFIGURAÇÃO
const API_URL = "http://127.0.0.1:8000";
let authToken = null;
let currentUserId = null;

// --- FUNÇÕES DE AUTENTICAÇÃO ---

async function fazerLogin() {
    const userIdInput = document.getElementById('login-user-id');
    const userId = userIdInput.value;
    const errorDiv = document.getElementById('login-error');
    errorDiv.innerText = "";

    if (!userId) {
        errorDiv.innerText = "Por favor, insira um ID.";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: parseInt(userId) })
        });

        if (!response.ok) throw new Error("Erro no login. Verifique o ID.");

        const data = await response.json();
        authToken = data.access_token;
        currentUserId = userId;

        // Alternar visualização
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('dashboard-section').classList.remove('hidden');
        document.getElementById('display-user-id').innerText = userId;

    } catch (err) {
        errorDiv.innerText = err.message;
    }
}

function fazerLogout() {
    authToken = null;
    currentUserId = null;
    document.getElementById('login-section').classList.remove('hidden');
    document.getElementById('dashboard-section').classList.add('hidden');
    document.getElementById('login-user-id').value = "";
    document.getElementById('accounts-list').innerHTML = "<p>Carregue no botão para ver as contas.</p>";
    document.getElementById('transactions-list').innerHTML = "";
    document.getElementById('tx-result').innerText = "";
}

// --- FUNÇÕES DE CONTA ---

async function carregarContas() {
    const listDiv = document.getElementById('accounts-list');
    listDiv.innerHTML = "Carregando...";

    try {
        const response = await fetch(`${API_URL}/accounts/?limit=10&skip=0`, {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error("Falha ao buscar contas.");

        const contas = await response.json();
        
        if (contas.length === 0) {
            listDiv.innerHTML = "<p>Nenhuma conta encontrada.</p>";
            return;
        }

        let html = "<table><tr><th>ID</th><th>Detalhes</th></tr>";
        contas.forEach(c => {
            html += `<tr><td>${c.id}</td><td>Conta ID: ${c.id}</td></tr>`;
        });
        html += "</table>";
        listDiv.innerHTML = html;

    } catch (err) {
        listDiv.innerText = "Erro: " + err.message;
    }
}

// --- FUNÇÕES DE TRANSAÇÃO ---

async function criarTransacao() {
    const accId = document.getElementById('tx-account-id').value;
    const amount = document.getElementById('tx-amount').value;
    // const type = document.getElementById('tx-type').value; 
    const resultDiv = document.getElementById('tx-result');

    if(!accId || !amount) {
        resultDiv.innerText = "Preencha o ID da conta e o valor.";
        resultDiv.style.color = "red";
        return;
    }

    try {
        const bodyData = {
            account_id: parseInt(accId),
            amount: parseFloat(amount)
        };

        const response = await fetch(`${API_URL}/transactions/`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Erro na transação");
        }

        // const result = await response.json();
        resultDiv.innerText = "Sucesso! Transação criada.";
        resultDiv.style.color = "green";

    } catch (err) {
        resultDiv.innerText = "Erro: " + err.message;
        resultDiv.style.color = "red";
    }
}

async function verExtrato() {
    const accId = document.getElementById('extract-account-id').value;
    const listDiv = document.getElementById('transactions-list');
    
    if(!accId) {
        listDiv.innerText = "Insira o ID da conta.";
        return;
    }

    listDiv.innerHTML = "Carregando...";

    try {
        const response = await fetch(`${API_URL}/accounts/${accId}/transactions?limit=10&skip=0`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (!response.ok) throw new Error("Erro ao ver extrato (verifique se a conta existe).");
        
        const transactions = await response.json();
        
        if (transactions.length === 0) {
            listDiv.innerHTML = "<p>Sem transações recentes.</p>";
            return;
        }

        let html = "<ul>";
        transactions.forEach(t => {
            html += `<li><strong>ID:</strong> ${t.id} | <strong>Valor:</strong> ${t.amount}</li>`;
        });
        html += "</ul>";
        listDiv.innerHTML = html;

    } catch (err) {
        listDiv.innerText = "Erro: " + err.message;
    }
}