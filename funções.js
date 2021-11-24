const paginaQuizz = document.querySelector('.exibirQuizz');
const telaInicial = document.querySelector('.telaInicial');

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
    const promessa = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${idQuizz}`);
    promessa.then(exibirQuizz);
}

function exibirQuizz(resposta){
    telaInicial.classList.add('sumir');
    paginaQuizz.classList.remove('sumir');
    
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
    
    for(let i = 0; i < alternativas.length; i++){

        if( alternativas[i].classList.contains('false') ){
            alternativas[i].classList.add('naoCorreta');
        }else if( alternativas[i].classList.contains('true') ){
            alternativas[i].classList.add('correta');
        }

        if(alternativaSelecionada === alternativas[i]){
            continue;
        }else{
            alternativas[i].classList.add('naoSelecionada')
        }
    }
}