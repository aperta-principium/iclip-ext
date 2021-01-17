document.addEventListener('DOMContentLoaded', () => {
        //alert(location.href);
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            const url = tabs[0].url;
            const code = document.querySelector("#code");
            const copy = document.querySelector("#copy");

            // use `url` here inside the callback because it's asynchronous!
            fetch(`https://interclip.app/includes/api`, { 
                method: 'POST',       
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }, 
                body: new URLSearchParams({
                    url: url,
                }), 
            }).then(res => res.json()).then(r => code.innerHTML = r.result).catch(e => alert(e));

            copy.onclick = () => {
                navigator.clipboard.writeText(code.innerText)
                .then(() => {
                    // Success!
                })
                .catch(err => {
                    alert(err);
                });
            };
        });
});