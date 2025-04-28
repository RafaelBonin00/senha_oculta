

fetch('/header/header.html').then(response => response.text()).then(data => {
    document.getElementById('meu-header').innerHTML = data;
}).catch(error => console.error('Erro ao carregar o header:', error));
