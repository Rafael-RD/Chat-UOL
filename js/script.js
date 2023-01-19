let intervalId;

function depois(resp){
    console.log('deu bom');
    console.log(resp.data);
}

function pegar(resp){
    console.log('deu ruim');
    console.log(resp.response.status);
    if(resp.response.status===400){
        entrarNaSala();
    }
}

function manterLogIn(user){
    const promessaManterLogIn=axios.post('https://mock-api.driven.com.br/api/v6/uol/status',user);
    promessaManterLogIn.then(resp=>{
        console.log('Sessão revalidada');
        console.log(resp.data);
    });
    promessaManterLogIn.catch()

}

function entrarNaSala(nome){
    const user={name: nome};
    const promessaLogIn=axios.post('https://mock-api.driven.com.br/api/v6/uol/participants',user);
    console.log(promessaLogIn);
    promessaLogIn.then(depois);
    promessaLogIn.catch(pegar);
    intervalId=setInterval(manterLogIn, 4000, user);
}

let nome=prompt('Nome:');
if(nome!==null) entrarNaSala(nome);