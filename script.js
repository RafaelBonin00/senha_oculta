function gerarSenha() {
    // Cria um array com números de 0 a 9
    const numeros = [...Array(10).keys()]; // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    
    // Embaralha os números
    for (let i = numeros.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numeros[i], numeros[j]] = [numeros[j], numeros[i]]; // Troca de lugar
    }

    // Pega os primeiros 6 números e junta em uma string
    const senha = numeros.slice(0, 5).join('');
    return senha;
}
const senha = gerarSenha();

let tentativas = 6; // Número de tentativas
let tentativaAtual = 1; // A primeira tentativa
const quantidade_index = 4; // Esse conta o "0" então para 4 são 5 "inputs"
const feedbackDiv = document.getElementById('feedback');
const submitButton = document.getElementById('submit-button');

function moveToNextField(currentField, attemptNumber, index) {
    const nextField = currentField.closest('.div_input').querySelector(`#input${index + 2}_${attemptNumber}`);
    if (nextField) {
        nextField.focus(); // Foca no próximo campo
    }
}

// Função para habilitar a tentativa
function habilitarCampos(tentativa) {
    const campos = document.querySelectorAll('.div_input input');
    campos.forEach(input => input.disabled = true); // Desabilita todos os inputs

    const camposTentativa = document.querySelectorAll(`#attempt${tentativa} input`);
    camposTentativa.forEach(input => input.disabled = false); // Habilita os inputs da tentativa atual
}

// Função para reiniciar o jogo
function reiniciarJogo() {
    location.reload();
}

// Adicionar o botão "Jogar novamente" após o fim do jogo
function mostrarBotaoReiniciar() {
    // Cria o botão "Jogar novamente"
    const button = document.createElement('button');
    button.textContent = 'Jogar Novamente';
    button.id = 'jogar-novamente-btn';
    button.addEventListener('click', reiniciarJogo);  // Vincula o evento para reiniciar o jogo

    // Adiciona o botão ao final da div de feedback
    feedbackDiv.appendChild(button);
}

// Função para processar a tentativa
function processarTentativa() {
    if (tentativas > 0) {
        const tentativa = Array.from(document.querySelectorAll(`#attempt${tentativaAtual} input`))
            .map(input => input.value)
            .join('');

        // Processamento da tentativa
        if (tentativa === senha) {  // Senha correta
            const inputs = document.querySelectorAll(`#attempt${tentativaAtual} input`);
            
            inputs.forEach((input, index) => {
                if (input.value === senha[index]) {
                    // Se o número e a posição estiverem corretos
                    input.classList.add("green");
                }
            });
            feedbackDiv.innerHTML = "Senha correta! Você venceu!";
            feedbackDiv.className = "green"; 
            document.querySelectorAll(`#attempt${tentativaAtual} input`).forEach(input => input.disabled = true); // Desabilita inputs
            mostrarBotaoReiniciar();  // Exibe o botão "Jogar novamente"
            return;
        } else {

            // Comparação da tentativa com a senha
            const inputs = document.querySelectorAll(`#attempt${tentativaAtual} input`);
            
            inputs.forEach((input, index) => {
                if (input.value === senha[index]) {
                    // Se o número e a posição estiverem corretos
                    input.classList.add("green");
                    input.classList.remove("yellow");
                } else if (senha.includes(input.value)) {
                    // Se o número existir na senha, mas na posição errada
                    input.classList.add("yellow");
                    input.classList.remove("green");
                } else {
                    // Se o número não existir na senha
                    input.classList.remove("green", "yellow");
                }
            });
        }

        // Decrementa o número de tentativas restantes
        tentativas--;

        // Vai para a próxima tentativa
        tentativaAtual++;

        // Se não houver mais tentativas
        if (tentativas === 0) {
            feedbackDiv.innerHTML = "Você perdeu! A senha era " + senha;
            feedbackDiv.className = "red";
            document.querySelectorAll(`#attempt${tentativaAtual - 1} input`).forEach(input => input.disabled = true); // Desabilita os inputs finais
            mostrarBotaoReiniciar();  // Exibe o botão "Jogar novamente"
        }

        // Habilita os campos da próxima tentativa
        habilitarCampos(tentativaAtual);
        if(tentativa >6){
            document.getElementById(`input1_${tentativaAtual}`).focus();

        }
    }
}

// Evento de clique no botão "Submit"
submitButton.addEventListener('click', function() {
    processarTentativa();
});

// Captura o "Enter" nos campos de input
document.querySelectorAll('.div_input').forEach((div, attemptIndex) => {
    // Seleciona todos os inputs dentro de cada div de tentativa
    div.querySelectorAll('.input-field').forEach((input, index) => {
        input.addEventListener('input', function () {
            if (this.value.length > 1) {
                this.value = this.value.slice(-1); // Permite apenas um dígito
            }
            // Atualiza a tentativa atual
            const currentAttempt = this.closest('.div_input'); // Pega a tentativa atual
            const attemptNumber = parseInt(currentAttempt.id.replace('attempt', ''));

            // Se não for o último campo da tentativa, move para o próximo
            if (index < quantidade_index) {  // 5 é o índice do último campo da tentativa
                moveToNextField(this, attemptNumber, index);
            }
        });

        input.addEventListener('keydown', function (event) {
            // Verifica se a tecla pressionada é "Enter"
            if (event.key === 'Enter') {
                event.preventDefault(); // Evita o comportamento padrão do "Enter"
                processarTentativa(); // Chama a função para processar a tentativa

                // Se for o último campo da tentativa, move para a próxima tentativa
                if (index === quantidade_index) {
                    moveToNextField(this, tentativaAtual, index);
                } else {
                    moveToNextField(this, tentativaAtual, index);
                }
            }
        });
    });
});


// Habilitar a primeira tentativa ao carregar a página
habilitarCampos(tentativaAtual);
