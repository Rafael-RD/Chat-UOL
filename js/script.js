let intervalId;
let user={name: null};
let destinatario="Todos";
let msgPrivada=false;
let participantes=[];
const elementDest=document.querySelector('footer div span');
elementDest.innerHTML=`Enviando para ${destinatario}`
const principal=document.querySelector('main').querySelector('ul');

function mostrarMensagens(msg){
    principal.innerHTML='';
    for(let i=0;i<msg.length;i++){
        const tipo=msg[i].type;
        if(tipo==='status'){
            principal.innerHTML+=`
            <li data-test="message" class="${msg[i].type}"><span>(${msg[i].time}) </span> <span> ${msg[i].from} </span> ${msg[i].text}</li>
            `
        }else if(tipo==='message'){
            principal.innerHTML+=`
            <li data-test="message" class="${msg[i].type}"><span>(${msg[i].time}) </span> <span> ${msg[i].from} </span> para <span> ${msg[i].to} </span>:  ${msg[i].text}</li>
            `
        }else if(tipo==='private_message' && msg[i].to===user.name){
            principal.innerHTML+=`
            <li data-test="message" class="${msg[i].type}"><span>(${msg[i].time}) </span> <span> ${msg[i].from} </span> reservadamente para <span> ${msg[i].to} </span>: ${msg[i].text}</li>
            `
        }
        principal.querySelectorAll('li')[principal.querySelectorAll('li').length-1].scrollIntoView();
    } 
}



function revalidar(){
    const promessaManterLogIn=axios.post('https://mock-api.driven.com.br/api/v6/uol/status',user);
    promessaManterLogIn.then(resp=>{
        console.log('Sessão revalidada');
    });
    promessaManterLogIn.catch(resp=>{
        alert('Revalidação falhada');
        console.log(resp.response.status);
        clearInterval(intervalId);
        if(confirm('Relogar?')){
            esconderLogin(false);
        }
    })
}

function atualizarChat(){
    const chat=axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    chat.then(resp=>{
        console.log('chat recebido');
        mostrarMensagens(resp.data);
    });
    chat.catch(resp=>{
        console.log('erro ao receber msgs '+resp.response.status);
        console.log(resp.response);
    })
}



function atualizar(){
    revalidar();
    atualizarChat();
    atualizarParticipantes();
}
function esconderLogin(bool){
    const tela=document.querySelector('.login');
    if(bool){
        document.querySelector('header').classList.remove('hidden');
        document.querySelector('main').classList.remove('hidden');
        document.querySelector('footer').classList.remove('hidden');
        tela.classList.add('hidden');
    }else{
        tela.classList.remove('hidden');
        document.querySelector('header').classList.add('hidden');
        document.querySelector('main').classList.add('hidden');
        document.querySelector('footer').classList.add('hidden');
    }
}
function entrarNaSala(){
    document.querySelector('#user').value='';
    if(arguments[0]===undefined){
        user.name=prompt('nome: ');
        if(user.name===null) return;
    }else user.name=arguments[0];
    const promessaLogIn=axios.post('https://mock-api.driven.com.br/api/v6/uol/participants',user);
    console.log(promessaLogIn);
    promessaLogIn.then(resp=>{    
        console.log('Login Feito');
        console.log(resp.data);
        atualizar();
        intervalId=setInterval(atualizar, 3000);
        esconderLogin(true);
    });
    promessaLogIn.catch(resp=>{
        console.log('Erro login');
        console.log(resp.response.status);
        if(resp.response.status===400){
            alert('Usuario ja existe!');
            entrarNaSala();
        }
    });
}

function enviarMensagem(element){
    const msg = element.parentNode.querySelector('#mensagem').value;
    if(msg){
        const obj={from: user.name, to: destinatario, text: msg, type:""};
        if(msgPrivada===false){
            obj.type="message";
            console.log(obj);
        }else{
            obj.type= "private_message";
            console.log(obj);
        }
        const promMsg=axios.post('https://mock-api.driven.com.br/api/v6/uol/messages',obj);
        promMsg.then(resp=>{
            console.log('Msg enviada com sucesso');
            atualizar();
        });
        promMsg.catch(resp=>{
            console.log('Erro ao enviar msg'+resp.response.status);
        });
        element.parentNode.querySelector('#mensagem').value='';
    }
}


function atualizarParticipantes(){
    const promessaParticipantes=axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    promessaParticipantes.then(resp=>{
        console.log('Participantes recebidos');
        participantes=resp.data;
        const dest= document.querySelector('.destinatario');
        dest.innerHTML=`
            <li data-test="all" onclick="mudarDestinatario(this)">
                <ion-icon name="people"></ion-icon>
                <span>Todos</span>
                <ion-icon data-test="check" class="selectable hidden" name="checkbox"></ion-icon>
            </li>
        `
        resp.data.forEach((element,index)=>{
            dest.innerHTML+=`
            <li data-test="participant" onclick="mudarDestinatario(this)">
                <ion-icon name="person-circle"></ion-icon>
                <span>${element.name}</span>
                <ion-icon data-test="check" class="selectable hidden" name="checkbox"></ion-icon>
            </li>
            `
        });
        for(let i=0; i<dest.children.length;i++){
            if(dest.children[i].children[1].innerHTML===destinatario) {
                dest.children[i].children[2].classList.remove('hidden');
                break;
            }else if(i>=dest.children.length-1){
                alert('Destinatario não esta mais na sala');
            }
        }
    });
    promessaParticipantes.catch(resp=>{
        console.log('Erro ao receber participantes')
    })
}


function mudarDestinatario(element){
    document.querySelectorAll('.destinatario .selectable').forEach(temp=>{
        temp.classList.add('hidden');
    });
    element.children[2].classList.remove('hidden');
    destinatario=element.children[1].innerHTML;
    document.querySelector('.info').innerHTML=`
    Enviando para ${destinatario}
    `;
    if(msgPrivada===true){
        document.querySelector('.info').innerHTML+=`
        (reservadamente)
        `
    }else{
        document.querySelector('.info').innerHTML+=`
        (publicamente)
        `
    }
}

function mudarParaPrivado(bool){
    document.querySelector('.info').innerHTML=`
    Enviando para ${destinatario}
    `;
    if(bool){
        msgPrivada=true;
        document.querySelector('.privacidade').children[1].children[2].classList.remove('hidden');
        document.querySelector('.privacidade').children[0].children[2].classList.add('hidden');
        document.querySelector('.info').innerHTML+=`
        (reservadamente)
        `
    }else{
        msgPrivada=false;
        document.querySelector('.privacidade').children[1].children[2].classList.add('hidden');
        document.querySelector('.privacidade').children[0].children[2].classList.remove('hidden');
        document.querySelector('.info').innerHTML+=`
        (publicamente)
        `
    }
}

function mostrarSidebar(bool){
    if(bool){
        document.querySelector('.sidebar').classList.remove('hidden');
        document.querySelector('.fundo-sidebar').classList.remove('hidden');
    }else{
        document.querySelector('.sidebar').classList.add('hidden');
        document.querySelector('.fundo-sidebar').classList.add('hidden');
    }
}

