const handleUserSearch = () => {
  const searchForm = document.getElementById("user-search-form");
  const searchInput = document.getElementById("user-search-input");
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const query = searchInput.value;
    if (query && query.trim() != "") {
      window.location = `?username=${query}`;
      fetchUserProfile();
    }
  });
};
handleUserSearch();

function handleSelectPageSize() {
  const pageSizeDropdown = document.getElementById("page-size-dropdown");

  pageSizeDropdown.addEventListener("change", function () {
    const pageSize = pageSizeDropdown.value;
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete("page_size");
    currentUrl.searchParams.delete("page_number");
    currentUrl.searchParams.append("page_size", pageSize);
    history.pushState(null, null, currentUrl.toString());
    fetchRepositories();
  });
}
handleSelectPageSize();

function handlePageChange(page) {
  const currentUrl = new URL(window.location.href);
  const { currentPage } = paginationData;
  currentUrl.searchParams.delete("page_number");
  if (page === "next") {
    currentUrl.searchParams.append("page_number", currentPage + 1);
  } else if (page === "prev") {
    currentUrl.searchParams.append("page_number", currentPage - 1);
  } else {
    currentUrl.searchParams.append("page_number", page);
  }
  history.pushState(null, null, currentUrl.toString());
  fetchRepositories();
}
