let intervalId;
let user={name: ''};
let destinatario="Todos";
const elementDest=document.querySelector('footer div span');
elementDest.innerHTML=`Enviando para ${destinatario}`
const principal=document.querySelector('main').querySelector('ul');

function mostrarMensagens(msg){
    principal.innerHTML='';
    for(let i=0;i<msg.length;i++){
        const tipo=msg[i].type;
        if(tipo==='status'){
            principal.innerHTML+=`
            <li class="${msg[i].type}"><span>(${msg[i].time}) </span> <span> ${msg[i].from} </span> ${msg[i].text}</li>
            `
        }else if(tipo==='message'){
            principal.innerHTML+=`
            <li class="${msg[i].type}"><span>(${msg[i].time}) </span> <span> ${msg[i].from} </span> para <span> ${msg[i].to} </span>:  ${msg[i].text}</li>
            `
        }else if(tipo==='private_message' && msg[i].to===user.name){
            principal.innerHTML+=`
            <li class="${msg[i].type}"><span>(${msg[i].time}) </span> <span> ${msg[i].from} </span> reservadamente para <span> ${msg[i].to} </span>: ${msg[i].text}</li>
            `
        }
        principal.querySelectorAll('li')[principal.querySelectorAll('li').length-1].scrollIntoView();
    } 
}
function atualizar(){
    const promessaManterLogIn=axios.post('https://mock-api.driven.com.br/api/v6/uol/status',user);
    promessaManterLogIn.then(resp=>{
        console.log('Sessão revalidada');
    });
    promessaManterLogIn.catch(resp=>{
        alert('Revalidação falhada');
        console.log(resp.response.status);
        clearInterval(intervalId);
    })
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

function entrarNaSala(){
    user.name=prompt('nome: ');
    const promessaLogIn=axios.post('https://mock-api.driven.com.br/api/v6/uol/participants',user);
    console.log(promessaLogIn);
    promessaLogIn.then(resp=>{    
        console.log('Login Feito');
        console.log(resp.data);
        atualizar(user);
        intervalId=setInterval(atualizar, 3000, user);
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
        if(destinatario==="Todos"){
            obj.type="message";
            console.log(obj);
        }else{
            obj.type= "message_private";
            console.log(obj);
        }
        console.log(obj);
        const promMsg=axios.post('https://mock-api.driven.com.br/api/v6/uol/messages',obj);
        promMsg.then(resp=>{
            console.log('Msg enviada com sucesso');
        });
        promMsg.catch(resp=>{
            console.log('Erro ao enviar msg'+resp.response.status);
        });
        element.parentNode.querySelector('#mensagem').value='';
    }
}
    
entrarNaSala();


// user.name=prompt('Nome:');
// if(user.name!==null) entrarNaSala();
// const msgs=axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
//  msgs.then(resp=>{
//      console.log(resp);
//      mostrarMensagens(resp.data);
//  });