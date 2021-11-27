const paginaQuizz = document.querySelector('.exibirQuizz');
const telaInicial = document.querySelector('.telaInicial');
const sectionQuizzesUsuario = document.querySelector(".quizzesUsuario")
const todosQuizzes = document.querySelector(".todosQuizzes")
const semQuizzes = document.querySelector(".telaInicial main div:first-child")
const comQuizzes = document.querySelector(".comQuizzes")
const sectionCarregando = document.querySelector('.telaCarregamento');
const criarQuizzInfo = document.querySelector('.Info.criandoQuizz');
const criarQuizzPerguntas = document.querySelector('.criandoQuizz.perguntas');
const criarQuizzNiveis = document.querySelector('.criandoQuizz.niveis');
const criandoQuizzFinal = document.querySelector('.criandoQuizz.geralQuizzDados');

let respondidoCorretamente = 0;
let quantidadePerguntasRespondidas = 0;
let quantidadePerguntas;
let niveis = [];
let idQuizzAberto;

let title = "";
let image = "";
let questions = [];
let levels = [];

let Qtdperguntas = 0;
let Qtdniveis = 0;

if (localStorage.length === 0) {localStorage.setItem("quizzesUsuario" , JSON.stringify({ids: [] , keys: []}))}

chamarQuizzes();

function trocarTela(sectionSumir, sectionAparecer){
    sectionSumir.classList.add('sumir');
    sectionAparecer.classList.remove('sumir');
    
    window.scrollTo(0, 0);
}

function comparador() { 
	return Math.random() - 0.5; 
}

function chamarQuizzes(){
    sectionCarregando.classList.remove('sumir');
    const promessa = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes');
    promessa.then(imprimirQuizzes);

    promessa.catch(()=>{
        chamarQuizzes();
    })
}                

function imprimirQuizzes(resposta){
    
    if (JSON.parse(localStorage.getItem("quizzesUsuario")).ids.length !== 0){
        comQuizzes.classList.remove("sumir")
        semQuizzes.classList.remove("semQuizzes")
        semQuizzes.classList.add("sumir")

        sectionQuizzesUsuario.innerHTML = "";
    }
    else {
        semQuizzes.classList.remove("sumir")
        semQuizzes.classList.add("semQuizzes")
        comQuizzes.classList.add("sumir")
    }

    for(let i = 0; i < resposta.data.length; i++){

        if (verficaQuizz(resposta.data[i].id)){

            sectionQuizzesUsuario.innerHTML += `
                <div class="quizz" 
                style="background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${resposta.data[i].image})"
                onclick="carregarQuizz(${resposta.data[i].id}); trocarTela( telaInicial, paginaQuizz)">
                <span>${resposta.data[i].title}</span>
                </div>`
        }
        else{

            todosQuizzes.innerHTML += `
                <div class="quizz" 
                style="background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${resposta.data[i].image})"
                onclick="carregarQuizz(${resposta.data[i].id}); trocarTela( telaInicial, paginaQuizz)">
                <span>${resposta.data[i].title}</span>
                </div>`
        }
    }
    sectionCarregando.classList.add('sumir');
}

function verficaQuizz(quizz){
    verificaQuizzesUsuario = JSON.parse(localStorage.getItem("quizzesUsuario"))
  
    for(let i = 0 ; i < verificaQuizzesUsuario.ids.length ; i++){
      if (verificaQuizzesUsuario.ids[i] == quizz) {return true}
    }
    return false;
}

function carregarQuizz(idQuizz){
    idQuizzAberto = idQuizz;

    const promessa = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${idQuizz}`);
    promessa.then(exibirQuizz);
}

function exibirQuizz(resposta){
    sectionCarregando.classList.remove('sumir');
    trocarTela( telaInicial, paginaQuizz)

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
    sectionCarregando.classList.add("sumir");
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
            Você acertou: ${porcentagemAcerto.toFixed(0)}% - ${desempenho.title}
        </div>

        <div class="imagem">
            <img src="${desempenho.image}" alt="">
            <span>${desempenho.text}</span>
        </div>

        <div class="botoes">
            <button class="reiniciar" onclick="carregarQuizz(${idQuizzAberto})">Reiniciar Quizz</button>
            <button class="voltarHome" onclick="trocarTela(paginaQuizz, telaInicial), chamarQuizzes()">Voltar para home</button>
        </div>
    </div>`

    respondidoCorretamente = 0;
    quantidadePerguntasRespondidas = 0;
    quantidadePerguntas = 0;
    niveis = [];
    idQuizzAberto = "";
}

function limparInputs(){
    document.querySelector('.Info .tituloQuizz').value="";
    document.querySelector('.Info .URLQuizz').value="";
    document.querySelector('.Info .QtdPerguntasQuizz').value="";
    document.querySelector('.Info .QtdNiveisQuizz').value="";
}

function verificarInfosCriandoQuizz(){
    title = document.querySelector('.Info .tituloQuizz').value;
    image = document.querySelector('.Info .URLQuizz').value;
    Qtdperguntas = document.querySelector('.Info .QtdPerguntasQuizz').value;
    Qtdniveis = document.querySelector('.Info .QtdNiveisQuizz').value;

    trocarTela(criarQuizzInfo, criarQuizzPerguntas);
    carregarPaginaCriarPerguntas();
    limparInputs();
}

function carregarPaginaCriarPerguntas(){
    const conteudo = document.querySelector('.perguntas main');
    conteudo.innerHTML = `<span class="titulo">Crie suas perguntas</span>`;
    let classe;
    
    for(let i = 0; i < Qtdperguntas; i++){
        if(i === 0){
            classe = "editando";
        }else{
            classe = "";
        }
        conteudo.innerHTML += `
        <div class="caixas ${classe}">
                <span class="subTitulo">
                    Pergunta ${i+1} <img onclick="preenchendoDados(this, 'perguntas')" src="/imagens/editar.png" alt="">
                </span>

                <div class="conteudo">
                    <input class="textoPergunta" type="text" placeholder="Texto da pergunta">
                    <input class="CorPergunta" type="text" placeholder="Cor de fundo da pergunta">
                    <span class="subTitulo">Resposta correta</span>
                    <input class="respostaCorreta" type="text" placeholder="Resposta correta">
                    <input class="URLrespostaCorreta" type="text" placeholder="URL da imagem">
                    <span class="subTitulo">Repostas Incorretas</span>
                    <input class="respostaIncorreta1" type="text" placeholder="Resposta incorreta 1">
                    <input class="URLrespostaIncorreta1" type="text" placeholder="URL da imagem 1">
                    <br>
                    <input class="respostaIncorreta2" type="text" placeholder="Resposta incorreta 2">
                    <input class="URLrespostaIncorreta2" type="text" placeholder="URL da imagem 2">
                    <br>
                    <input class="respostaIncorreta3" type="text" placeholder="Resposta incorreta 3">
                    <input class="URLrespostaIncorreta3" type="text" placeholder="URL da imagem 3">
                </div>
            </div>`
    }
    conteudo.innerHTML += `<button onclick="validarDadosPerguntas()">Prosseguir pra criar níveis</button>` 
}

function validarDadosPerguntas(){
    const textoPerguntas = document.querySelectorAll('.perguntas .textoPergunta');
    const CorPerguntas = document.querySelectorAll('.perguntas .CorPergunta');

    const respostasCorretas = document.querySelectorAll('.perguntas .respostaCorreta');
    const imagensRespostasCorretas = document.querySelectorAll('.perguntas .URLrespostaCorreta');

    const respostasIncorretas1 = document.querySelectorAll('.perguntas .respostaIncorreta1');
    const imagensRespostasIncorretas1 = document.querySelectorAll('.perguntas .URLrespostaIncorreta1');

    const respostasIncorretas2 = document.querySelectorAll('.perguntas .respostaIncorreta2');
    const imagensRespostasIncorretas2 = document.querySelectorAll('.perguntas .URLrespostaIncorreta2');

    const respostasIncorretas3 = document.querySelectorAll('.perguntas .respostaIncorreta3');
    const imagensRespostasIncorretas3 = document.querySelectorAll('.perguntas .URLrespostaIncorreta3');

    questions = [];

    for (let i = 0; i < Qtdperguntas; i++){
        questions.push({ title: textoPerguntas[i].value, color: CorPerguntas[i].value, answers: [] });
        questions[i].answers.push({ text: respostasCorretas[i].value, image: imagensRespostasCorretas[i].value, isCorrectAnswer: true });

        if (respostasIncorretas1[i].value !== "")
            questions[i].answers.push({ text: respostasIncorretas1[i].value, image: imagensRespostasIncorretas1[i].value, isCorrectAnswer: false });

        if (respostasIncorretas2[i].value !== "")
            questions[i].answers.push({ text: respostasIncorretas2[i].value, image: imagensRespostasIncorretas2[i].value, isCorrectAnswer: false });

        if (respostasIncorretas3[i].value !== "")
            questions[i].answers.push({ text: respostasIncorretas3[i].value, image: imagensRespostasIncorretas3[i].value, isCorrectAnswer: false });
    }

    trocarTela(criarQuizzPerguntas, criarQuizzNiveis);
    carregarPaginaCriarNiveis();
}

function carregarPaginaCriarNiveis(){
    const conteudo = document.querySelector('.niveis main');
    conteudo.innerHTML = `<span class="titulo">Agora, decida os níveis!</span>`;
    let classe;

    for(let i = 0; i < Qtdniveis; i++){
        if(i === 0){
            classe = "editando";
        }else{
            classe = "";
        }
        conteudo.innerHTML += `
        <div class="caixas ${classe}">
            <span class="subTitulo">
                Nível ${i+1}
                <img onclick="preenchendoDados(this, 'niveis')" src="/imagens/editar.png" alt="">
            </span>

            <div class="conteudo">
                <input class="tituloNivel" type="text" placeholder="Título do nível">
                <input class="PorcentagemAcertosNivel" type="text" placeholder="% de acerto mínima">
                <input class="URLnivel" type="text" placeholder="URL da imagem do nível">
                <input class="descricaoNivel" type="text" placeholder="Descrição do nível">
            </div>
        </div>`
    }
    conteudo.innerHTML += `<button onclick="validarDadosNiveis()">Finalizar Quizz</button>`
}

function validarDadosNiveis(){
    const tituloNivel = document.querySelectorAll('.niveis .tituloNivel');
    const PorcentagemAcertos = document.querySelectorAll('.niveis .PorcentagemAcertosNivel');
    const imagemNivel = document.querySelectorAll('.niveis .URLnivel');
    const descricaoNivel = document.querySelectorAll('.niveis .descricaoNivel');

    levels = [];

    for (let i = 0; i < Qtdniveis; i++) {
        levels.push({ title: tituloNivel[i].value, image: imagemNivel[i].value, text: descricaoNivel[i].value, minValue: parseInt(PorcentagemAcertos[i].value) });
    }

    enviarQuizzServidor();
}

function enviarQuizzServidor(){
    sectionCarregando.classList.remove('sumir');

    const quizzCriado = {title, image, questions, levels};
    const promessa = axios.post('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes', quizzCriado);

    promessa.then((resposta) => {
        trocarTela(criarQuizzNiveis, criandoQuizzFinal);
        sectionCarregando.classList.add('sumir');

        carregarPaginaQuizzCriado(resposta);

        let quizzesUsuario = JSON.parse(localStorage.getItem("quizzesUsuario"));

        quizzesUsuario.ids.push(resposta.data.id);
        quizzesUsuario.keys.push(resposta.data.key);

        quizzesUsuario = JSON.stringify(quizzesUsuario);
        localStorage.setItem("quizzesUsuario" , quizzesUsuario);
    });

    promessa.catch(() =>{
    sectionCarregando.classList.add('sumir');
    })
}

function carregarPaginaQuizzCriado(resposta){
    const titulo = document.querySelector('.geralQuizzDados .imagem span');
    const imagem = document.querySelector('.geralQuizzDados .imagem');
    const botaoIniciarQuizz = document.querySelector('.geralQuizzDados main .acessarQuizz');

    imagem.style = `background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${image})`
    titulo.innerHTML = title;

    botaoIniciarQuizz.setAttribute(`onclick`, `carregarQuizz(${resposta.data.id}); trocarTela( criandoQuizzFinal, paginaQuizz)`);
}

function preenchendoDados(elementoSelecionado, tipoElemento){
    let elementoEditando;
    if(tipoElemento === 'perguntas'){
        elementoEditando = document.querySelector('.perguntas .editando');
        elementoSelecionado = elementoSelecionado.parentNode.parentNode;
    }else if(tipoElemento === 'niveis'){
        elementoEditando = document.querySelector('.niveis .editando');
        elementoSelecionado = elementoSelecionado.parentNode.parentNode;
    }

    elementoEditando.classList.remove('editando');
    elementoSelecionado.classList.add('editando');
}
