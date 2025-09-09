// script.js

// Salvar estado dos checkboxes no localStorage
function saveState() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const state = {};
  checkboxes.forEach(cb => {
    state[cb.id] = cb.checked;
  });
  localStorage.setItem("escalaTrabalho", JSON.stringify(state));
}

// Carregar estado salvo ao abrir a página
function loadState() {
  const savedState = JSON.parse(localStorage.getItem("escalaTrabalho"));
  if (savedState) {
    Object.keys(savedState).forEach(id => {
      const checkbox = document.getElementById(id);
      if (checkbox) {
        checkbox.checked = savedState[id];
      }
    });
  }
}

// Marcar todos de uma seção
function checkAll(sectionId) {
  const section = document.getElementById(sectionId);
  const checkboxes = section.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(cb => (cb.checked = true));
  saveState();
}

// Desmarcar todos de uma seção
function uncheckAll(sectionId) {
  const section = document.getElementById(sectionId);
  const checkboxes = section.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(cb => (cb.checked = false));
  saveState();
}

// Contar quantos estão marcados em cada seção
function updateCounters() {
  const sections = document.querySelectorAll(".day-section");
  sections.forEach(section => {
    const checkboxes = section.querySelectorAll('input[type="checkbox"]');
    const checked = section.querySelectorAll('input[type="checkbox"]:checked');
    let counter = section.querySelector(".counter");
    if (!counter) {
      counter = document.createElement("p");
      counter.className = "counter";
      counter.style.fontSize = "0.9rem";
      counter.style.fontWeight = "600";
      counter.style.marginTop = "10px";
      section.appendChild(counter);
    }
    counter.textContent = `Marcados: ${checked.length} / ${checkboxes.length}`;
  });
}

// Event listener para salvar e atualizar em cada clique
function initEvents() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(cb => {
    cb.addEventListener("change", () => {
      saveState();
      updateCounters();
    });
  });
}

// Inicialização
window.addEventListener("DOMContentLoaded", () => {
  loadState();
  initEvents();
  updateCounters();
});
