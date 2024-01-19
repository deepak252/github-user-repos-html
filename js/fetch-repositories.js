let currentUser = {};

async function fetchUser(){
    const loaderMainElement = document.getElementById('loader-main');
    const userProfileElement = document.getElementById('user-profile');

    try{
        let {username} = getUrlQueryParams();
        // console.log({username, pageNumber, pageSize});
        if(!username){
            return;
        }

        const url = `https://api.github.com/users/${username}`;

        loaderMainElement.style.display = 'block';
        userProfileElement.innerHTML = '';

        // main?.innerHTML = '<div id="loader-main" class="loader absolute-center"></div>';
        const response = await fetch(url);
        await wait();
        if(!response.ok){
            throw new Error(response.status===404 ? `User not found!` : null);
        }
        const data = await response.json();
        if(!data){
            throw new Error(`User not found!`);
        }
        userProfileElement.innerHTML = userDetailsContainer(data);
        
    }catch(e){
        // Failed to fetch
        console.log({e});
        userProfileElement.innerHTML = errorMessageContainer(e?.message || 'Something went wrong!');
    }finally{
        loaderMainElement.style.display = 'none';
    }
}

// fetchUser();

async function fetchRepositories(){
    // const loaderMainElement = document.getElementById('loader-main');
    const repositoriesListElement = document.getElementById('repositories-list');

    try{
        let {username,pageNumber=1, pageSize=10} = getUrlQueryParams();
        // console.log({username, pageNumber, pageSize});
        if(!username){
            return;
        }

        const url = `https://api.github.com/users/${username}/repos`;

        loaderMainElement.style.display = 'block';
        userProfileElement.innerHTML = '';

        // main?.innerHTML = '<div id="loader-main" class="loader absolute-center"></div>';
        const response = await fetch(url);
        await wait();
        if(!response.ok){
            throw new Error(response.status===404 ? `User not found!` : null);
        }
        const data = await response.json();
        if(!data){
            throw new Error(`User not found!`);
        }
        userProfileElement.innerHTML = userDetailsContainer(data);
        
    }catch(e){
        // Failed to fetch
        console.log({e});
        userProfileElement.innerHTML = errorMessageContainer(e?.message || 'Something went wrong!');
    }finally{
        loaderMainElement.style.display = 'none';
    }

    // let {username, pageNumber, pageSize} = getUrlQueryParams();
    // console.log({username, pageNumber, pageSize});
    // if(!username){
    //     return;
    // }

    // const url = `https://api.github.com/users/${username}/repos`;
    // let main = document.querySelector('main');
    // let reqpositoriesContainer = document.getElementById('repositories-container');

    // // console.log(main.innerHTML);

    // if(currentUser.username !== username){
    //     main.innerHTML='<div id="loader-main" class="loader absolute-center"></div>';
    // }else{
    //     reqpositoriesContainer.innerHTML = '<div class="loader absolute-center"></div>';
    // }

    // // let userE = document.getElementById('user');
    // // console.log(userE);

    // fetch(url).then((response)=>{
    //     if (!response.ok) {
    //         throw new Error(`Something went wrong!`);
    //     }
    //     return response.json();
    // }).then((data)=>{
    //     console.log({data});
    //     // main.innerHTML=data

    //     setTimeout(()=>{
    //         main.innerHTML=data
    //     },2000)
    // }).catch((err)=>{
    //     console.log(err);
    //     main.innerHTML='Error'
    // });
}

// fetchRepositories();


const handleUserSearch = () => {
    const searchForm = document.getElementById("user-search-form");
    const searchInput = document.getElementById("user-search-input");
    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const query = searchInput.value;
        if(query && query.trim()!=''){
            // location = `?user=${query}`
            history.pushState(null, null, `?username=${query}`);
            fetchUser();
        }
    });
};

handleUserSearch();


function userDetailsContainer(user){
    const { avatar_url, name, login, bio, location, blog } = user || {};
    return `
    <img id="user-avatar" src="${avatar_url}" alt="avatar" />
    <div class="user-info">
      <p id="user-name">${name || login || 'User'}</p>
      ${ bio? `<p id="user-bio">${bio}</p>` : ''}
      ${ location? `<p id="user-location">${location}</p>` : ''}
      ${ blog? `<p id="user-blog">${blog}</p>` : ''}
    </div>
    `
}

function errorMessageContainer(message){
    return `<p class='absolute-center'>${message}</p>`;
}
