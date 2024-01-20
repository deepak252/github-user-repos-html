let paginationData = {
  pageSize: 0,
  currentPage: 0,
  lastPage: 0,
};

const BASE_URL = "https://api.github.com";
const repoShimmer = `
<div class="shimmer" style="height:135px; width:100%">
    <div class="shimmer__animation"></div>
</div>`;

function generateError(message) {
  return `<p class='absolute-center'>${message}</p>`;
}

function generateUserDetails(user) {
  const { avatar_url, name, login, bio, location, blog } = user || {};
  return `
        <img id="user-avatar" src="${avatar_url}" alt="avatar" />
        <div class="user-info">
        <p id="user-name">${name || login || "User"}</p>
        ${bio ? `<p id="user-bio">${bio}</p>` : ""}
        ${location ? `<p id="user-location">${location}</p>` : ""}
        ${blog ? `<p id="user-blog">${blog}</p>` : ""}
        </div>
    `;
}

function generateRepoDetails(repo) {
  let { name, description, topics = [], created_at } = repo || {};
  const repoDiv = document.createElement("div");
  repoDiv.classList.add("repo");
  repoDiv.innerHTML = `
        <p class="repo__name" >${name || "Repo"}</p>
        <p class="repo__description" >${description || "No Description"}</p>
        <div class="repo__topics" >
            ${topics.map((topic) => `<span>${topic}</span>`).join("")}
        </div>
    `;
  return repoDiv;
}

/**
 * Call github user profile api
 */
async function fetchUser() {
  const loaderMainElement = document.getElementById("loader-main");
  const userProfileElement = document.getElementById("user-profile");
  const reposListElement = document.getElementById("repos-list");
  const paginationElement = document.getElementById("pagination");

  try {
    let { username } = getUrlQueryParams();
    if (!username) {
      return;
    }

    const url = `${BASE_URL}/users/${username}`;

    loaderMainElement.style.display = "block";
    userProfileElement.innerHTML = "";
    reposListElement.innerHTML = "";
    paginationElement.style.display="none";

    const response = await fetch(url);
    // await wait(1000);
    if (!response.ok) {
      throw new Error(response.status === 404 ? `User not found!` : null);
    }
    const data = await response.json();
    if (!data) {
      throw new Error(`User not found!`);
    }
    userProfileElement.innerHTML = generateUserDetails(data);
    fetchRepositories();
    paginationElement.style.display="flex";
  } catch (e) {
    // Failed to fetch
    console.log(e);
    userProfileElement.innerHTML = generateError(
      e?.message && e.message!='null' ? e.message : "Something went wrong!"
    );
  } finally {
    loaderMainElement.style.display = "none";
  }
}
fetchUser();

/**
 * Call github user repos api
 */
async function fetchRepositories() {
  const reposListElement = document.getElementById("repos-list");
  try {
    let { username, pageNumber, pageSize } = getUrlQueryParams();
    if (!username) {
      return;
    }
    paginationData.currentPage = pageNumber;
    paginationData.pageSize = pageSize;
    renderPageCounter();

    const url = `${BASE_URL}/users/${username}/repos?page=${pageNumber}&per_page=${pageSize}`;

    reposListElement.innerHTML = repoShimmer.repeat(6);

    const response = await fetch(url);
    // await wait(1000);
    if (!response.ok) {
      throw new Error(response.status === 404 ? `No repository found!` : null);
    }

    const data = await response.json();
    if (!data) {
      throw new Error(`No repository found!`);
    }
    if (data?.length) {
      const lastPage = getLastPage(response.headers.get("Link"));
      
      paginationData.lastPage = lastPage ? Number(lastPage) : paginationData.currentPage;

      reposListElement.innerHTML = "";
      data.forEach((repo) => {
        reposListElement.appendChild(generateRepoDetails(repo));
      });
      renderPageCounter();
    } else {
      throw new Error(`No repository found!`);
    }
  } catch (e) {
    // Failed to fetch
    console.log(e);
    reposListElement.innerHTML = generateError(
      e?.message && e.message!='null' ? e.message : "Something went wrong!"
    );
  }
}

const handleUserSearch = () => {
  const searchForm = document.getElementById("user-search-form");
  const searchInput = document.getElementById("user-search-input");
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const query = searchInput.value;
    if (query && query.trim() != "") {
      history.pushState(null, null, `?username=${query}`);
      fetchUser();
    }
  });
};
handleUserSearch();

function handleSelectPageSize(){
  const pageSizeDropdown = document.getElementById(
      "page-size-dropdown"
  );

  pageSizeDropdown.addEventListener("change", function () {
      const pageSize = pageSizeDropdown.value;
      paginationData.pageSize = Number(pageSize);
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete('page_size');
      currentUrl.searchParams.delete('page_number');
      currentUrl.searchParams.append('page_size', pageSize);
      history.pushState(null, null, currentUrl.toString());
      fetchRepositories();
  });
};
handleSelectPageSize();

function handleSelectPage(page){
  const currentUrl = new URL(window.location.href);
  const {currentPage} = paginationData;
  currentUrl.searchParams.delete('page_number');
  if(page==='next'){
    currentUrl.searchParams.append('page_number', currentPage+1);
  }else if(page==='prev'){
    currentUrl.searchParams.append('page_number', currentPage-1);
  }else{
    currentUrl.searchParams.append('page_number', page);
  }
  history.pushState(null, null, currentUrl.toString());
  fetchRepositories();
}

function renderPageCounter() {
  const pageCounterElement = document.getElementById("page-counter");
  const {currentPage, lastPage} = paginationData;
  // console.log(paginationData);
  if (currentPage && lastPage) {
    const indexes = []; // index-window
    for(let i=-3; i<=3;i++){
      if(currentPage+i>=1 && currentPage+i<=lastPage){
        indexes.push(currentPage+i);
      }
    }
    if(indexes[0]===2){
      indexes.splice(0,0,1);
    }
    if(indexes[indexes.length-1]===lastPage-1){
      indexes.push(lastPage);
    }

    pageCounterElement.innerHTML = `
      ${
        currentPage>1 
        ? '<span  onclick=handleSelectPage("prev")> < </span>' 
        : `<span class='disabled'> < </span>`
      }
      ${
        !indexes.includes(1) ?
        '<span onclick=handleSelectPage(1)>1</span>...' : ''
      }
      ${indexes.map((i) => `<span onclick='handleSelectPage(${i})' class=${i===currentPage ? 'selected' : ''}>${i}</span>`).join("")}
      ${
        !indexes.includes(lastPage) 
        ? `...<span onclick=handleSelectPage(${lastPage})>${lastPage}</span>` 
        : ''
      }
      ${
        currentPage<lastPage 
        ? '<span onclick=handleSelectPage("next")> > </span>' 
        : `<span class='disabled'> > </span>`
      }
    `
  }
}

