document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('relatorio-form');
  const empresaSelect = document.getElementById('empresa');
  const fornecedorSelect = document.getElementById('fornecedor');
  const produtoSelect = document.getElementById('produto');
  const tipoEstoqueSelect = document.getElementById('tipoEstoque');
  const tabelasContainer = document.getElementById('tabelas-container');

  const fornecedoresPorEmpresa = {
    'Mineirão': ['Gameleira', 'Coringa', 'Bivolt', 'Arco Verde']
  };

  const produtosPorFornecedor = {
    'Gameleira': [
      'Fuba 500G',
      'Milho de pipoca 500G',
      'Canjica amarela 500G',
      'Alpiste paqueta 500G',
      'Flocão de milho 400G',
      'Creme de milho 500G',
      'Canjica braca 500G',
      'Bisc. coquinho 750 G',
      'Bisc. coquinho 2 KL',
      'Bisc. coquinho 400G',
      'Bisc. coquinho 200G',
      'Bisc. coquinho 1 KL',
      'Bisc. doce creme 200G',
      'Bisc. doce creme 2KL',
      'Bisc. doce creme 400G',
      'Bisc. doce creme 750G',
      'Bisc. doce creme 1 KL',
      'Bisc. rosquinha milho 300G',
      'Bisc. rosquinha coco 300G',
      'Bisc. rosquinha nata 300G',
      'Bisc. rosquinha Choc. 300G',
      'Bisc. rosquinha gameleira 300G',
      'Mac. Esp. Semola 400G',
      'Mac. Esp. Comum 400G',
      'Bisc. Mini Maisena Trad. 300G',
      'Bisc. Mini Maisena Choc. 300G',
      'Bisc. Maria Mini Trad. 300G',
      'Bisc. Maria Mini Choc. 300G',           
    ],

    'Coringa': [
      'Canjiquinha Milho 200g',
      'Cuscuz 500g',
      'Far. Láctea 210g',
      'Flocão Arroz 500g',
      'Flocão Milho 500g',
      'Leite Coco 200ml',
      'Leite Coco 500ml',
      'Ming. Corilan Arroz 230g',
      'Ming. Corilan Milho 230g',
      'Ming. Corilan Banana 230g',
      'Ming. Corilan Morango 230g',
      'Flocão Fibras Arroz 200g',
      'Flocão Fibras Milho 200g',
      'Fubá 500g'
    ],

    'Bivolt': [
      'Bivolt Citrus 2l',
      'Bivolt 2l',
      'Bivolt Melancia 2l',
      'Bivolt Tropical 2l',
      'Bivolt Maça Verde 2l',
      'Bivolt Citrus 270ml',
      'Bivolt Melancia 270ml',
      'Bivolt Maça Verde 270ml',
      'Bivolt Tropical 270ml',
      'Bivolt 270ml'
    ],

    'Arco Verde': [
      'Far. Mand. Arco Verde Ama 1kg',
      'Far. Mand. Arco Verde Bca 1kg',
      'Far. Mand. Boa D+ Ama 1kg',
      'Far. Mand. Boa D+ Bca 1kg',
      'Far. Mand. Da Roça Bca 1kg',
      'Far. Mand. Da Boa Bca 1kg',
      'Far. Mand. Nossa Farinha Bca 1kg'      
    ]
  };

  const storageKey = 'relatoriosEmpresas';

  const carregarStorage = () => JSON.parse(localStorage.getItem(storageKey)) || {};
  const salvarStorage = dados => localStorage.setItem(storageKey, JSON.stringify(dados));

  function atualizarFornecedores() {
    const empresa = empresaSelect.value;
    fornecedorSelect.innerHTML = '<option disabled selected>Escolha o fornecedor</option>';

    if (fornecedoresPorEmpresa[empresa]) {
      fornecedoresPorEmpresa[empresa].forEach(fornecedor => {
        const opt = document.createElement('option');
        opt.value = fornecedor;
        opt.textContent = fornecedor;
        fornecedorSelect.appendChild(opt);
      });
    }

    produtoSelect.innerHTML = '<option disabled selected>Escolha o produto</option>';
  }

  function atualizarProdutos() {
    const fornecedor = fornecedorSelect.value;
    produtoSelect.innerHTML = '<option disabled selected>Escolha o produto</option>';

    if (produtosPorFornecedor[fornecedor]) {
      produtosPorFornecedor[fornecedor].forEach(produto => {
        const opt = document.createElement('option');
        opt.value = produto;
        opt.textContent = produto;
        produtoSelect.appendChild(opt);
      });
    }
  }

  const formatarData = (dataStr) => {
    if (!dataStr) return '';
    const data = new Date(dataStr);
    return isNaN(data) ? '' : data.toLocaleDateString('pt-BR');
  };

  const formatarPreco = (valor) => {
    if (!valor) return '';
    const numero = parseFloat(valor.replace(',', '.'));
    return isNaN(numero) ? '' : numero.toFixed(2).replace('.', ',');
  };

  function validarFormulario() {
    const empresa = empresaSelect.value;
    const fornecedor = fornecedorSelect.value;
    const produto = produtoSelect.value;
    const estoque = document.getElementById('estoque').value;
    const validade = document.getElementById('validade').value;
    const preco = document.getElementById('preco').value;

    if (!empresa || !fornecedor || !produto || !estoque || !validade || !preco) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return false;
    }

    if (parseFloat(estoque) < 0) {
      alert('O estoque não pode ser negativo.');
      return false;
    }

    const precoRegex = /^\d+(,\d{1,2})?$/;
    if (!precoRegex.test(preco)) {
      alert('Por favor, insira um preço válido (ex: 2,99).');
      return false;
    }

    return true;
  }

function renderizarTabelas() {
  tabelasContainer.innerHTML = '';
  const dados = carregarStorage();

  function parseDataBR(dataStr) {
    const [dia, mes, ano] = dataStr.split('/');
    return new Date(`${ano}-${mes}-${dia}T00:00:00`);
  }

  for (const empresa in dados) {
    for (const fornecedor in dados[empresa]) {
      const lista = dados[empresa][fornecedor];
      if (lista.length === 0) continue;

      lista.sort((a, b) => {
        const dataA = parseDataBR(a.validade);
        const dataB = parseDataBR(b.validade);
        return dataB - dataA;
      });
    }
  }
    for (const empresa in dados) {
      for (const fornecedor in dados[empresa]) {
        const lista = dados[empresa][fornecedor];
        if (lista.length === 0) continue;

        const wrapper = document.createElement('div');
        wrapper.classList.add('empresa-tabela', 'active');

        const logosDiv = document.createElement('div');
        logosDiv.className = 'top-logos';
        logosDiv.innerHTML = `
          <img src="img/mineirao.png" alt="Mineirão Atacarejo" onerror="this.style.display='none'" />
          <img src="img/Captura.png" alt="Apoiar Serviços" onerror="this.style.display='none'" />
        `;
        wrapper.appendChild(logosDiv);

        const titulo = document.createElement('h2');
        titulo.className = 'empresa-titulo';
        titulo.textContent = `${empresa} - ${fornecedor}`;
        wrapper.appendChild(titulo);

        const tabela = document.createElement('table');
        tabela.innerHTML = `
          <thead>
            <tr>
              <th>Produto</th>
              <th>Estq</th>
              <th>Val</th>
              <th>Preço</th>
              <th>Ações</th>
            </tr>
          </thead>
        `;

        const tbody = document.createElement('tbody');

        lista.forEach((item, index) => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td title="${item.produto}">${item.produto}</td>
            <td>${item.estoque} ${item.tipoEstoque}</td>
            <td>${formatarData(item.validade)}</td>
            <td>${formatarPreco(item.preco)}</td>
            <td>
              <button class="editar" data-index="${index}" data-empresa="${empresa}" data-fornecedor="${fornecedor}" title="Editar">✏️</button>
              <button class="excluir" data-index="${index}" data-empresa="${empresa}" data-fornecedor="${fornecedor}" title="Excluir">🗑️</button>
            </td>
          `;
          tbody.appendChild(tr);
        });

        tabela.appendChild(tbody);
        wrapper.appendChild(tabela);
        tabelasContainer.appendChild(wrapper);
      }
    }

    document.querySelectorAll('.excluir').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (confirm('Tem certeza que deseja excluir este item?')) {
          const index = parseInt(e.target.dataset.index);
          const empresa = e.target.dataset.empresa;
          const fornecedor = e.target.dataset.fornecedor;

          const dados = carregarStorage();
          dados[empresa][fornecedor].splice(index, 1);

          if (dados[empresa][fornecedor].length === 0) {
            delete dados[empresa][fornecedor];
          }

          if (Object.keys(dados[empresa]).length === 0) {
            delete dados[empresa];
          }

          salvarStorage(dados);
          renderizarTabelas();
        }
      });
    });

    document.querySelectorAll('.editar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        const empresa = e.target.dataset.empresa;
        const fornecedor = e.target.dataset.fornecedor;
        const dados = carregarStorage();
        const item = dados[empresa][fornecedor][index];

        empresaSelect.value = empresa;
        atualizarFornecedores();

        setTimeout(() => {
          fornecedorSelect.value = fornecedor;
          atualizarProdutos();

          setTimeout(() => {
            produtoSelect.value = item.produto;
            document.getElementById('estoque').value = item.estoque;
            tipoEstoqueSelect.value = item.tipoEstoque;
            document.getElementById('validade').value = item.validade;
            document.getElementById('preco').value = item.preco;
          }, 100);
        }, 100);

        dados[empresa][fornecedor].splice(index, 1);
        salvarStorage(dados);
        renderizarTabelas();

        form.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    const empresa = empresaSelect.value;
    const fornecedor = fornecedorSelect.value;
    const produto = produtoSelect.value;
    const estoque = document.getElementById('estoque').value;
    const tipoEstoque = tipoEstoqueSelect.value;
    const validade = document.getElementById('validade').value;
    const preco = document.getElementById('preco').value;

    const dados = carregarStorage();
    if (!dados[empresa]) dados[empresa] = {};
    if (!dados[empresa][fornecedor]) dados[empresa][fornecedor] = [];

    dados[empresa][fornecedor].push({ 
      produto, 
      estoque: parseInt(estoque), 
      tipoEstoque, 
      validade, 
      preco 
    });

    salvarStorage(dados);
    renderizarTabelas();
    form.reset();
    atualizarFornecedores();
    atualizarProdutos();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Adicionado!';
    submitBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.style.background = 'linear-gradient(135deg, #000000, #fdd835, #000000)';
    }, 1500);
  });

  empresaSelect.addEventListener('change', atualizarFornecedores);
  fornecedorSelect.addEventListener('change', atualizarProdutos);

  atualizarFornecedores();
  renderizarTabelas();
});
