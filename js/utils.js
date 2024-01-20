function getUrlQueryParams(){
    const urlParams = new URLSearchParams(location.search);
    const username = urlParams.get('username');
    const pageNumber = validatePageNumber(urlParams.get('page_number'));
    const pageSize = validatePageSize(urlParams.get('page_size'));
    return {username, pageSize, pageNumber};
}

function validatePageNumber(value){
    if(!value || isNaN(value) || value<1){
        value = 1;
    }
    return Math.floor(value);
}

function validatePageSize(value){
    if(!value || isNaN(value)){
        value = 10;
    }
    if([10,20,50,100].includes(Number(value))){
        return value;
    }
    return 10;
}

/**
 * Get last page index from github api header 'link'
 */
function getLastPage(linkStr){
    try{
        if(!linkStr){
            return;
        }
        let link = linkStr.split(', ').find(link=>link.includes('rel="last"'));
        if(link){
            let [url] = link.split('; ');
            url =  url.slice(1, -1);
            let page = new URLSearchParams(url.split('?')[1]);
            return page?.get('page');
        }
    }catch(e){
        console.log(e);
    }
}

function wait(ms=2000){
    return new Promise((resolve)=>
    setTimeout(()=>{
        resolve();
    },ms));
}