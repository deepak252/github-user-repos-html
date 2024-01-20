const repoShimmer = `
<div class="shimmer" style="height:135px; width:100%">
    <div class="shimmer__animation"></div>
</div>`;

function generateError(message) {
  return `<p class='absolute-center'>${message}</p>`;
}

/**
 * Prepare user profile
 */
function generateUserDetails(user) {
  const { avatar_url, name, login, bio, location, blog, html_url } = user || {};
  return `
        <img id="user-avatar" src="${avatar_url}" alt="avatar" />
        <div class="user-info">
        <p id="user-name">${name || login || "User"}</p>
        ${bio ? `<p id="user-bio">${bio}</p>` : ""}
        ${location ? `
          <div class="icon-label">
            <img src="images/location.png" alt="location" />
            <p id="user-location">${location}</p>
          </div>
        ` : ""}
        ${blog ? `
          <div class="icon-label">
            <img src="images/link2.png" alt="blog" />
            <a id="user-blog"  href="${blog}" target="_blank">${blog}</a>
          </div>
        ` : ""}
        ${html_url ? `
          <div class="icon-label">
            <img src="images/link.png" style="height:22px;width:22px;" alt="link" />
            <a id="user-github" href="${html_url}" target="_blank">${html_url}</a>
          </div>
        ` : ""}
        </div>
    `;
}

/**
 * Prepare repository item
 */
function generateRepoDetails(repo) {
  let { name, description, topics = [] } = repo || {};
  const repoDiv = document.createElement("div");
  repoDiv.classList.add("repo");
  repoDiv.innerHTML = `
        <p class="repo__name overflow-ellipsis" >${name || "Repo"}</p>
        <p class="repo__description" >${description || "No Description"}</p>
        <div class="repo__topics" >
            ${topics.map((topic) => `<span>${topic}</span>`).join("")}
        </div>
    `;
  return repoDiv;
}

/**
 * Pagination: Set page size dropdown value 
 */
function setPageSize(value) {
  const pageSizeDropdown = document.getElementById("page-size-dropdown");
  if(value && pageSizeDropdown){
    pageSizeDropdown.value = value;
  }
}

/**
 * Pagination: Page counter logic
 */
function setPageCounter() {
  const pageCounterElement = document.getElementById("page-counter");
  const { currentPage, lastPage } = paginationData;
  // console.log(paginationData);
  if (currentPage && lastPage) {
    const indexes = []; // index-window
    for (let i = -3; i <= 3; i++) {
      if (currentPage + i >= 1 && currentPage + i <= lastPage) {
        indexes.push(currentPage + i);
      }
    }
    if (indexes[0] === 2) {
      indexes.splice(0, 0, 1);
    }
    if (indexes[indexes.length - 1] === lastPage - 1) {
      indexes.push(lastPage);
    }

    pageCounterElement.innerHTML = `
      ${
        currentPage > 1
          ? '<span  onclick=handlePageChange("prev")> < </span>'
          : `<span class='disabled'> < </span>`
      }
      ${
        !indexes.includes(1)
          ? "<span onclick=handlePageChange(1)>1</span>..."
          : ""
      }
      ${indexes
        .map(
          (i) =>
            `<span onclick='handlePageChange(${i})' class=${
              i === currentPage ? "selected" : ""
            }>${i}</span>`
        )
        .join("")}
      ${
        !indexes.includes(lastPage)
          ? `...<span onclick=handlePageChange(${lastPage})>${lastPage}</span>`
          : ""
      }
      ${
        currentPage < lastPage
          ? '<span onclick=handlePageChange("next")> > </span>'
          : `<span class='disabled'> > </span>`
      }
    `;
  }
}
