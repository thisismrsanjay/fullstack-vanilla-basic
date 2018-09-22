console.log('hello world');

const form  = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const mewsElement = document.querySelector('.mews');
console.log(window.location.hostname);
//const API_URL = window.location.hostname === '127.0.0.1' ? 'http://localhost:5000/mews' :'https://sanjay-meower-api.now.sh/';
const API_URL ='http://localhost:5000/mews';
//const API_URL = 'https://sanjay-meower-api.now.sh/'
loadingElement.style.display = '';


listAllMews();

form.addEventListener('submit',(event)=>{
    event.preventDefault();
    const formData = new FormData(form);

    const name = formData.get('name');
    const content = formData.get('content');

    const mew = {
        name,
        content
    }
    // console.log(mew);
    form.style.display='none';
    loadingElement.style.display = '';

    fetch(API_URL,{
        method:'POST',
        body:JSON.stringify(mew),
        headers:{
            'content-type':'application/json'
        }
    }).then(response => response.json())
    .then(createdMew=> {
        console.log( createdMew);
        form.reset();

        setTimeout(()=>{
            form.style.display='';
        },3000);
        form.style.display = '';
        listAllMews();// after submitting the form shows the tweets
        loadingElement.style.display =   'none';
       
    })


    
})

function listAllMews(){
    fetch(API_URL)
        .then(response=>response.json())
        .then(mews=>{
            console.log( mews);
            mews.reverse();
            mews.forEach(mew=>{
                const div = document.createElement('div');
                const header = document.createElement('h3');
                header.textContent = mew.name; //inner html renders html while text content sets the text ie for security
                const contents = document.createElement('p');
                contents.textContent = mew.content;
                const date = document.createElement('small');
                contents.textContent = new Date(mew.created);

                div.appendChild(header);
                div.appendChild(contents);
                div.appendChild(date);

                mewsElement.appendChild(div);
            })
            loadingElement.style.display ='none';
        })
}