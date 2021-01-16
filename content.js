document.addEventListener('DOMContentLoaded', () => {
        //alert(location.href);
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            const url = tabs[0].url;
            const code = document.querySelector("#code");
            // use `url` here inside the callback because it's asynchronous!

            fetch(`https://interclip.app/includes/api?url=${url}`).then(res => res.json()).then(r => code.innerHTML = r.result);
            
        });
});