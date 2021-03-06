document.addEventListener('DOMContentLoaded', () => {
        const environment = chrome || browser;
        const theme = window.matchMedia("(prefers-color-scheme: dark)").matches === true ? "dark" : "light";

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
            }).then(res => {
                if(res.ok) {
                    return res.json();
                } else {
                    return null;
                }
            }).then(r => {
                if (r) {
                    code.innerText = r.result;
                    const qrCode = new QRCodeStyling({
                        width: 150,
                        height: 150,
                        data: `https://interclip.app/${r.result}`,
                        image: "https://raw.githubusercontent.com/aperta-principium/Interclip/main/img/interclip_logo.png",
                        dotsOptions: {
                            color: theme === "light" ? "#ff9800" : "#ffffff",
                            type: "square"
                        },
                        backgroundOptions: {
                            color: theme === "light" ? "#ffffff" : "#444444",
                        }
                    });    qrCode.append(document.getElementById("qr"));
                } else {
                    code.innerText = "Request failed";
                }
            }).catch(e => alert(e));

            copy.onclick = () => {
                navigator.clipboard.writeText(code.innerText)
                .catch(err => {
                    alert(err);
                });
            };
        });
});