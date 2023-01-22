let contatoMarcado;
let visibilidadeMarcada;
let nomeUsuario;
let conteudoChat = document.querySelector('.conteudo');
let menuLateral =  document.querySelector('.menu');
let textoEmbaixoInput = document.querySelector('.enviando-para');


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

function atualizaListaParticipantes (){
    setInterval (obterListaParticipantes , 10000);
}

function adicionaInfosMenuLateralAntes (){
        menuLateral.innerHTML += `
        <div class="texto-negrito">
            <p>Escolha um contato<br> para enviar mensagem:</p> 
        </div>

        <div data-test="all" class="texto-menu contato" onclick="selecionaContato (this)">
            <div class="icones"><ion-icon name="people"></ion-icon></div>
            <div class="nome-contato" >Todos</div> 
            <div class="icone-check"></div>
        </div>
        `;
}

function adicionaInfosMenuLateralDepois (){
        menuLateral.innerHTML += `
        <div class="texto-negrito">
            <p>Escolha a visibilidade:</p>
        </div>

        <div data-test="public" class="texto-menu visibilidade" onclick="selecionaVisibilidade (this)">
            <div class="icones"><ion-icon name="lock-open"></ion-icon></ion-icon></div>
            <div class="visib" >Público</div>
            <div class="icone-check"></div> 
        </div>

        <div data-test="private" class="texto-menu visibilidade" onclick="selecionaVisibilidade (this)">
            <div class="icones"><ion-icon name="lock-closed"></ion-icon></ion-icon></div>
            <div class="visib" >Reservadamente</div>
            <div class="icone-check"></div>
        </div>
        `;
}

function processaListaParticipantes (resposta){
    if (menuLateral.innerHTML !== ''){
        menuLateral.innerHTML = '';
    }
    const listaParticipantes = resposta.data;
    adicionaInfosMenuLateralAntes ();
    for (let i = 0; i < listaParticipantes.length; i++){
        menuLateral.innerHTML += `
        <div data-test="participant" class="texto-menu contato" onclick="selecionaContato (this)">
            <div class="icones"><ion-icon name="person-circle"></ion-icon></div>
            <div class="nome-contato" >${listaParticipantes[i].name}</div>
            <div class="icone-check"></div>
        </div>
        `;
    }
    adicionaInfosMenuLateralDepois();
}

function obterListaParticipantes (){
    const promessa = axios.get ('https://mock-api.driven.com.br/api/v6/uol/participants');
    promessa.then (processaListaParticipantes);
}

function escondeMenuLateral (){
    const menuLateral = document.querySelector('.menu-lateral');
    menuLateral.classList.add ('escondido');
}

function mostraMenuLateral (){
    const menuLateral = document.querySelector('.menu-lateral');
    menuLateral.classList.remove ('escondido');
}

function mensagemEnviadaSucesso (){
    atualizaMensagens();
}

function mensagemNaoEnviada (){
    window.location.reload();
}

function enviaMensagens (){
    let mensagem = document.querySelector('.digita-mensagem').value;
    if (mensagem === ""){
        return;
    }
    const dado = {
        from: nomeUsuario,
        to: "Todos",
        text: mensagem,
        type: "message"
    }
    document.querySelector('.digita-mensagem').value = '';
    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', dado);
    promessa.then(mensagemEnviadaSucesso);
    promessa.catch (mensagemNaoEnviada);   
}

document.addEventListener("keypress", function (evento) {
    if (evento.key === "Enter"){
        const botao = document.querySelector('.icone-mandar-mensagem');
        botao.click();
    }
});

function atualizaMensagens (){
    if (conteudoChat.innerHTML !== ''){
        conteudoChat.innerHTML = '';
        buscaMensagens();
    }
}

setInterval (atualizaMensagens, 3000);

function processaMensagens (resposta){
    const arrayMensagens = resposta.data;
    console.log(arrayMensagens);
    
    for (let i = 0; i < arrayMensagens.length; i++){
        if (arrayMensagens[i].type === "status"){
            conteudoChat.innerHTML += `
            <div data-test="message" class="status">
                <span>(${arrayMensagens[i].time}) <span class="negrito">${arrayMensagens[i].from}</span> ${arrayMensagens[i].text}</span>
            </div>
            `;

        } if (arrayMensagens[i].type === "message"){
            conteudoChat.innerHTML += `
            <div data-test="message" class="normais">
                <span>(${arrayMensagens[i].time}) <span class="negrito">${arrayMensagens[i].from}</span> para <span class="negrito">${arrayMensagens[i].to}</span>: ${arrayMensagens[i].text}</span>
            </div>
            `;

        } if (arrayMensagens[i].type === "private_message"){
            if (nomeUsuario === arrayMensagens[i].to || nomeUsuario === arrayMensagens[i].from){
                conteudoChat.innerHTML += `
                <div data-test="message" class="reservadas">
                    <span>(${arrayMensagens[i].time}) <span class="negrito">${arrayMensagens[i].from}</span> reservadamente para <span class="negrito">${arrayMensagens[i].to}</span>: ${arrayMensagens[i].text}</span>
                </div>
                `;
            }
        
        } if (arrayMensagens[i] === arrayMensagens[arrayMensagens.length - 1]){
            conteudoChat.innerHTML += `
            <span class="ultima" ></span>
            `;
            const aparecerUltimaMensagem = document.querySelector('.ultima');
            aparecerUltimaMensagem.scrollIntoView();
        }
        
    }
}

function processaErroBuscaMensagens (resposta){
    console.log(resposta);
}

function buscaMensagens (){
    const promessa = axios.get ('https://mock-api.driven.com.br/api/v6/uol/messages');
    promessa.then (processaMensagens);
    promessa.catch (processaErroBuscaMensagens);
}

setInterval (avisaUsuarioOnline, 5000);

function avisaUsuarioOnline (){
    const dado = {
        name: `${nomeUsuario}`
    };
    const promessaRequisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', dado);
    console.log(nomeUsuario);
}

function nomeUsuarioOk (){
    buscaMensagens();
    obterListaParticipantes ();
    atualizaListaParticipantes();
}

function nomeUsuarioInvalido (){
    alert ("Esse nome de usuário já existe, escolha outro.");
    window.location.reload();
}

function checaNomeUsuario (nome){
    const dado = {
        name: `${nome}`
    };
    const promessaRequisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', dado);
    promessaRequisicao.then(nomeUsuarioOk);
    promessaRequisicao.catch(nomeUsuarioInvalido);
}

perguntaNomeUsuario();

function perguntaNomeUsuario () {
    nomeUsuario = prompt ("Digite um nome de usuário:");
    if (nomeUsuario === null){
        alert ("É necessário digitar um nome de usuário!");
        window.location.reload();
    }
    checaNomeUsuario (nomeUsuario);
}