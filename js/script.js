let intervalId;
let user={name: ''};
const principal=document.querySelector('main').querySelector('ul');

function mostrarMensagens(msg){
    principal.innerHTML='';
    for(let i=0;i<msg.length-1;i++){
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


function abc(){
    for(let i=0;i<arguments.length;i++){
        console.log(arguments[i]);
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