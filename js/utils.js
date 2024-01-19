// async function asyncHandler(){

// }

function getUrlQueryParams(){
    const urlParams = new URLSearchParams(location.search);
    const username = urlParams.get('username');
    const pageNumber = urlParams.get('page_number');
    const pageSize = urlParams.get('page_size');
    return {username, pageSize, pageNumber};
}

function wait(){
    return new Promise((resolve)=>
    setTimeout(()=>{
        resolve();
    },2000));
}