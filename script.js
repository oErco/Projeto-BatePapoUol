let contatoMarcado;
let visibilidadeMarcada;
let nomeUsuario;


function selecionaContato (opcao){
    console.log(contatoMarcado);
    
    if (contatoMarcado === undefined){
        const divIconeCheckVerde = opcao.querySelector('.contato .icone-check');
        contatoMarcado = opcao;
        divIconeCheckVerde.innerHTML += `<ion-icon data-test="check" name="checkmark-outline"></ion-icon>`;
        
    } else {
        const primeiroContatoMarcado = contatoMarcado.querySelector('.contato .icone-check');
        primeiroContatoMarcado.innerHTML = '';
        contatoMarcado = opcao;
        const divIconeCheckVerde = opcao.querySelector('.contato .icone-check');
        divIconeCheckVerde.innerHTML += `<ion-icon data-test="check" name="checkmark-outline"></ion-icon>`;
    }
}

function selecionaVisibilidade (opcao){
    console.log(contatoMarcado);
    
    if (visibilidadeMarcada === undefined){
        const divIconeCheckVerde = opcao.querySelector('.visibilidade .icone-check');
        visibilidadeMarcada = opcao;
        divIconeCheckVerde.innerHTML += `<ion-icon name="checkmark-outline"></ion-icon>`;
        
    } else {
        const primeiraVisibilidadeMarcada = visibilidadeMarcada.querySelector('.visibilidade .icone-check');
        primeiraVisibilidadeMarcada.innerHTML = '';
        visibilidadeMarcada = opcao;
        const divIconeCheckVerde = opcao.querySelector('.visibilidade .icone-check');
        divIconeCheckVerde.innerHTML += `<ion-icon name="checkmark-outline"></ion-icon>`;
    }
}

function escondeMenuLateral (){
    const menuLateral = document.querySelector('.menu-lateral');
    menuLateral.classList.add ('escondido');
}

function mostraMenuLateral (){
    const menuLateral = document.querySelector('.menu-lateral');
    menuLateral.classList.remove ('escondido');
}



function sucessoRequisicao (resposta){
    console.log(resposta);
    alert("Nome de usuário válido. Aproveite o chat!");
}

function erroRequisicao (resposta){
    console.log (resposta.status);
    alert ("Esse nome de usuário já existe, escolha outro.");
    window.location.reload();
}

function sucesso (resposta){
    console.log(resposta);
}

function erro (resposta){
    console.log(resposta);
}

function avisaUsuarioOnline (){
    const dado = {
        name: `${nomeUsuario}`
    };
    const promessaRequisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', dado);
    console.log(nomeUsuario);
    promessaRequisicao.then(sucesso);
    promessaRequisicao.catch(erro)
}

setInterval (avisaUsuarioOnline, 5000);

function checaNomeUsuario (nome){
    const dado = {
        name: `${nome}`
    };
    const promessaRequisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', dado);
    promessaRequisicao.then(sucessoRequisicao);
    promessaRequisicao.catch(erroRequisicao);
}

function perguntaNomeUsuario () {
    nomeUsuario = prompt ("Digite um nome de usuário:");
    if (nomeUsuario === ''){
        alert ("É necessário digitar um nome de usuário!");
        window.location.reload();
    }
    checaNomeUsuario (nomeUsuario);
}

perguntaNomeUsuario();