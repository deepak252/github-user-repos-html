const BASE_URL = "https://api.github.com";
let userData = { // Current user state
  username: null
}
let paginationData = { // Pagination state
  currentPage: 0,
  lastPage: 0,
};

/**
 * Call github user profile api
 */
async function fetchUserProfile() {
  const loaderMainElement = document.getElementById("loader-main");
  const userProfileElement = document.getElementById("user-profile");
  const reposListElement = document.getElementById("repos-list");
  const paginationElement = document.getElementById("pagination");

  try {
    let { username } = getUrlQueryParams();
    if (!username) {
      userProfileElement.innerHTML = '<h2 style="text-align: center;">Github User Repositories</h2>';
      return;
    }

    if(username!==userData?.username){
      const url = `${BASE_URL}/users/${username}`;

      loaderMainElement.style.display = "block";
      userProfileElement.innerHTML = "";
      reposListElement.innerHTML = "";
      paginationElement.style.display = "none";

      const response = await fetch(url);
      await wait(1000);
      if (!response.ok) {
        throw new Error(response.status === 404 ? `User not found!` : null);
      }
      const data = await response.json();
      if (!data) {
        throw new Error(`User not found!`);
      }
      userData.username = data?.login;
      userProfileElement.innerHTML = generateUserDetails(data);
    }
   
    fetchRepositories();
    paginationElement.style.display = "flex";
  } catch (e) {
    // Failed to fetch
    console.log(e);
    userProfileElement.innerHTML = generateError(
      e?.message && e.message != "null" ? e.message : "Something went wrong!"
    );
  } finally {
    loaderMainElement.style.display = "none";
  }
}

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

    setPageCounter();

    const url = `${BASE_URL}/users/${username}/repos?page=${pageNumber}&per_page=${pageSize}`;

    reposListElement.innerHTML = repoShimmer.repeat(6);

    const response = await fetch(url);
    await wait(1000);
    if (!response.ok) {
      throw new Error(response.status === 404 ? `No repository found!` : null);
    }
    const data = await response.json();
    if (!data) {
      throw new Error(`No repository found!`);
    }
    if (data?.length) {
      const lastPage = getLastPage(response.headers.get("Link"));

      paginationData.lastPage = lastPage
        ? Number(lastPage)
        : paginationData.currentPage;

      reposListElement.innerHTML = "";
      data.forEach((repo) => {
        reposListElement.appendChild(generateRepoDetails(repo));
      });
      // Update Page Size Dropdown
      setPageSize(pageSize);
      // Update Page Counter
      setPageCounter();
    } else {
      throw new Error(`No repository found!`);
    }
  } catch (e) {
    // Failed to fetch
    console.log(e);
    reposListElement.innerHTML = generateError(
      e?.message && e.message != "null" ? e.message : "Something went wrong!"
    );
  }
}

// fetchUserProfile();

(()=>{
  window.addEventListener("popstate", function (event) {
    fetchUserProfile();
  });
})();
