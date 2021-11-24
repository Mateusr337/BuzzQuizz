

chamarQuizzes();
setInterval(chamarQuizzes, 5000);

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
