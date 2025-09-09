// script.js

function resetSection(sectionId) {
  const section = document.getElementById(sectionId);
  const checkboxes = section.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => checkbox.checked = false);
}

// Função para marcar todos os checkboxes (extra opcional)
function checkAll(sectionId) {
  const section = document.getElementById(sectionId);
  const checkboxes = section.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => checkbox.checked = true);
}