// Atualiza as tabelas, comparando preços verticalmente ou horizontalmente conforme o tipo
function atualizarTabela() {
  const tabelas = document.querySelectorAll("table");

  tabelas.forEach((tabela, tabelaIndex) => {
    const rows = tabela.querySelectorAll("tbody tr");
    const colCount = tabela.querySelectorAll("thead th").length;

    // Detecta se a tabela tem só uma coluna de preço (ex: flocão, milho)
    const isColunaUnicaPreco = colCount === 2;

    if (isColunaUnicaPreco) {
      // Comparação vertical na única coluna de preço
      let valores = [];

      rows.forEach((row, rowIndex) => {
        const input = row.querySelector('input[type="number"]');
        if (!input) return;

        // CORREÇÃO: Carregar dados do localStorage para tabelas de coluna única
        const key = `preco_${tabelaIndex}_${rowIndex}_0`;
        const savedValue = localStorage.getItem(key);
        if (savedValue !== null && input.value === "") {
          input.value = savedValue;
        }

        input.style.backgroundColor = "";
        row.querySelectorAll(".percent").forEach(span => span.remove());

        const val = parseFloat(input.value);
        valores.push({ input, val: isNaN(val) ? Infinity : val });
      });

      const menor = valores.reduce((min, curr) => curr.val < min.val ? curr : min, { val: Infinity });

      valores.forEach(({ input, val }) => {
        if (val === menor.val && val !== Infinity) {
          input.style.backgroundColor = "#449105ff"; // verde destaque
        } else if (isFinite(val) && menor.val !== Infinity) {
          const diff = ((val - menor.val) / menor.val) * 100;
          const span = document.createElement("span");
          span.className = "percent";
          span.textContent = `+${diff.toFixed(1)}%`;
          input.parentElement.appendChild(span);
        }
      });

    } else {
      // Comparação horizontal em cada linha (múltiplas colunas de preço)
      rows.forEach((row, rowIndex) => {
        const inputs = row.querySelectorAll('input[type="number"]');
        let valores = [];

        inputs.forEach((input, colIndex) => {
          const key = `preco_${tabelaIndex}_${rowIndex}_${colIndex}`;
          const savedValue = localStorage.getItem(key);
          if (savedValue !== null && input.value === "") {
            input.value = savedValue;
          }

          input.style.backgroundColor = "";
          input.parentElement.querySelectorAll(".percent").forEach(span => span.remove());

          const val = parseFloat(input.value);
          valores.push({ input, val: isNaN(val) ? Infinity : val });
        });

        const menor = valores.reduce((min, curr) => curr.val < min.val ? curr : min, { val: Infinity });

        valores.forEach(({ input, val }) => {
          if (val === menor.val && val !== Infinity) {
            input.style.backgroundColor = "#449105ff";
          } else if (isFinite(val) && menor.val !== Infinity) {
            const diff = ((val - menor.val) / menor.val) * 100;
            const span = document.createElement("span");
            span.className = "percent";
            span.textContent = `+${diff.toFixed(1)}%`;
            input.parentElement.appendChild(span);
          }
        });
      });
    }
  });
}

// Salva os valores dos inputs num localStorage
function salvarNoLocalStorage() {
  const tabelas = document.querySelectorAll("table");

  tabelas.forEach((tabela, tabelaIndex) => {
    const rows = tabela.querySelectorAll("tbody tr");
    const colCount = tabela.querySelectorAll("thead th").length;
    const isColunaUnicaPreco = colCount === 2;

    rows.forEach((row, rowIndex) => {
      if (isColunaUnicaPreco) {
        // CORREÇÃO: Salvar dados para tabelas de coluna única
        const input = row.querySelector('input[type="number"]');
        if (input) {
          const key = `preco_${tabelaIndex}_${rowIndex}_0`;
          if (input.value !== "") {
            localStorage.setItem(key, input.value);
          } else {
            localStorage.removeItem(key);
          }
        }
      } else {
        // Salvar dados para tabelas de múltiplas colunas
        const inputs = row.querySelectorAll('input[type="number"]');
        inputs.forEach((input, colIndex) => {
          const key = `preco_${tabelaIndex}_${rowIndex}_${colIndex}`;
          if (input.value !== "") {
            localStorage.setItem(key, input.value);
          } else {
            localStorage.removeItem(key);
          }
        });
      }
    });
  });
}

// Limpa os dados salvos no localStorage e atualiza a tabela
function limparLocalStorage() {
  localStorage.clear();
  document.querySelectorAll('input[type="number"]').forEach(input => input.value = "");
  atualizarTabela();
}

// Inicialização do script
document.addEventListener("DOMContentLoaded", () => {
  atualizarTabela();

  document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener("input", () => {
      salvarNoLocalStorage();
      atualizarTabela();
    });
  });

  // Se quiser usar botão para limpar:
  const botaoLimpar = document.getElementById("btnLimpar");
  if (botaoLimpar) {
    botaoLimpar.addEventListener("click", () => {
      limparLocalStorage();
    });
  }
});

