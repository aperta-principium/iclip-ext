document.addEventListener('DOMContentLoaded', () => {
        const environment = chrome || browser;
        //alert(location.href);
        environment.tabs.query({active: true, currentWindow: true}, tabs => {
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
            }).then(res => res.json()).then(r => {
                code.innerHTML = r.result;
                const qrCode = new QRCodeStyling({
                    width: 150,
                    height: 150,
                    data: `https://interclip.app/${r.result}`,
                    image: "https://raw.githubusercontent.com/aperta-principium/Interclip/main/img/interclip_logo.png",
                    dotsOptions: {
                        color: "#ff9800",
                        type: "square"
                    },
                    backgroundOptions: {
                        color: "#ffffff",
                    }
                  });    qrCode.append(document.getElementById("qr"));
            }).catch(e => alert(e));

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