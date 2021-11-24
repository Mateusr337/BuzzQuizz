const paginaQuizz = document.querySelector('.exibirQuizz');
const telaInicial = document.querySelector('.telaInicial');

let respondidoCorretamente = 0;
let quantidadePerguntasRespondidas = 0;
let quantidadePerguntas;
let niveis = [];
let idQuizzAberto;
chamarQuizzes();

function comparador() { 
	return Math.random() - 0.5; 
}

function chamarQuizzes(){
    const promessa = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes');
    promessa.then(imprimirQuizzes);
}                

function imprimirQuizzes(resposta){
    const todosQuizzes = document.querySelector('.telaInicial .todosQuizzes');
    todosQuizzes.innerHTML = "";

    for(let i = 0; i < resposta.data.length; i++){
        todosQuizzes.innerHTML += `
        <div class="quizz" 
        style="background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${resposta.data[i].image})"
        onclick="carregarQuizz(${resposta.data[i].id})">
        <span>${resposta.data[i].title}</span>`
    }
}

function carregarQuizz(idQuizz){
    idQuizzAberto = idQuizz;

    const promessa = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${idQuizz}`);
    promessa.then(exibirQuizz);
}

function exibirQuizz(resposta){
    telaInicial.classList.add('sumir');
    paginaQuizz.classList.remove('sumir');

    quantidadePerguntas = resposta.data.questions.length;
    niveis = resposta.data.levels;
    
    paginaQuizz.innerHTML = `
    <div class="imagemQuizz" style="background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url('${resposta.data.image}')">
    <span>${resposta.data.title}</span>
    </div>
    <main></main>`
    
    const conteudoQuizz = document.querySelector('.exibirQuizz main');

    for(let i = 0; i < resposta.data.questions.length; i++){
        conteudoQuizz.innerHTML += `
        <div class="pergunta">
            <div class="texto" 
            style="background-color: ${resposta.data.questions[i].color};">
                ${resposta.data.questions[i].title}
            </div>
        </div>`
        let divPergunta = document.querySelector('.exibirQuizz .pergunta:last-child');
        perguntas = [];

        for(let j = 0; j < resposta.data.questions[i].answers.length; j++){
            perguntas.push(`
            <div class="alternativa
            ${resposta.data.questions[i].answers[j].isCorrectAnswer}"
            onclick="selecionandoResposta(this)">
                <div class="imagem"> 
                    <img src="${resposta.data.questions[i].answers[j].image}" alt=""> 
                </div>
                <span>${resposta.data.questions[i].answers[j].text}</span>
            </div>`)

        }
        perguntas.sort(comparador);

        for(j = 0; j < perguntas.length; j++){
            divPergunta.innerHTML += perguntas[j];
        }

    }
    const imagemTopo = document.querySelector('.exibirQuizz .imagemQuizz');
    imagemTopo.scrollIntoView();
}

function selecionandoResposta(alternativaSelecionada){
    if(alternativaSelecionada.classList.contains('correta') || alternativaSelecionada.classList.contains('naoCorreta')){
        return;
    }
    const alternativas = alternativaSelecionada.parentNode.children;
    
    quantidadePerguntasRespondidas++;
    if(alternativaSelecionada.classList.contains('true')){
        respondidoCorretamente++;
    }
    
    for(let i = 0; i < alternativas.length; i++){

        if( alternativas[i].classList.contains('false') ){
            alternativas[i].classList.add('naoCorreta');
        }else{
            alternativas[i].classList.add('correta');
        }

        if(alternativaSelecionada === alternativas[i]){
            continue;
        }else{
            alternativas[i].classList.add('naoSelecionada')
        }
    }
    if(quantidadePerguntas === quantidadePerguntasRespondidas){
        verificarQuizzRespondido();
    }
}

function verificarQuizzRespondido(){
    const porcentagemAcerto = (respondidoCorretamente / quantidadePerguntas) * 100;
    let desempenho;

    for(let i = 0; i < niveis.length; i++){
        if(porcentagemAcerto >= niveis[i].minValue){
            desempenho = niveis[i];
        }
    }

    const conteudoQuizz = document.querySelector('.exibirQuizz main');

    conteudoQuizz.innerHTML += `
    <div class="pergunta final">
        <div class="texto">
            Você acertou: ${porcentagemAcerto.toFixed(2)}% - ${desempenho.title}
        </div>

        <div class="imagem"><img src="${desempenho.image}" alt=""></div>
        <span>${desempenho.text}</span>

        <div class="botoes">
            <button class="reiniciar" onclick="carregarQuizz(${idQuizzAberto})">Reiniciar Quizz</button>
            <button class="voltarHome" onclick="voltarHome()">Voltar para home</button>
        </div>
    </div>`

    respondidoCorretamente = 0;
    quantidadePerguntasRespondidas = 0;
    quantidadePerguntas = 0;
    niveis = [];
    idQuizzAberto = "";
}

function voltarHome(telaSaida){
    paginaQuizz.classList.add('sumir');
    telaInicial.classList.remove('sumir');

    chamarQuizzes();
}