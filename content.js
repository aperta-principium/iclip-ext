document.addEventListener("DOMContentLoaded", () => {
  const environment = chrome || browser;
  const theme =
    window.matchMedia("(prefers-color-scheme: dark)").matches === true
      ? "dark"
      : "light";

  environment.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url;
    const code = document.querySelector("#code");
    const copy = document.querySelector("#copy");

    // use `url` here inside the callback because it's asynchronous!
    fetch(`https://interclip.app/api/set`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        url,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return null;
        }
      })
      .then((r) => {
        if (r) {
          code.innerText = r.result;
          const qrCode = new QRCodeStyling({
            width: 150,
            height: 150,
            data: `https://interclip.app/${r.result}`,
            image:
              "https://raw.githubusercontent.com/aperta-principium/Interclip/main/img/interclip_logo.png",
            dotsOptions: {
              color: theme === "light" ? "#ff9800" : "#ffffff",
              type: "square",
            },
            backgroundOptions: {
              color: theme === "light" ? "#ffffff" : "#444444",
            },
          });
          qrCode.append(document.getElementById("qr"));
        } else {
          code.innerText = "Request failed";
        }
      })
      .catch((e) => alert(e));

    copy.onclick = () => {
      navigator.clipboard.writeText(code.innerText).catch((err) => {
        alert(err);
      });
    };
  });
});

let enabledFetchCurrent = true;

document
  .getElementById("buttonChange")
  .addEventListener("click", handleActionType);

document.getElementById("buttonConfirm").addEventListener("click", checkCode);

document.onkeyup = (e) => {
  if (e.key === "Enter") {
    if (document.activeElement.tagName === "INPUT") {
      checkCode();
    }
  }
};

function handleActionType() {
  console.log("Handling action");
  if (!enabledFetchCurrent) {
    document.getElementById("currentPage").style = "";
    document.getElementById("getCode").style = "display: none;";
    document.getElementById("buttonChange").innerHTML = "Recieve a clip";
  } else {
    document.getElementById("currentPage").style = "display: none;";
    document.getElementById("getCode").style = "";
    document.getElementById("buttonChange").innerHTML = "Create a clip";
  }
  enabledFetchCurrent = !enabledFetchCurrent;
}

async function checkCode() {
  const code = document.getElementById("codeInput").value;
  if (!code) {
    document.getElementById("codeData").innerHTML = "No code provided";
  }
  document.getElementById("codeData").innerHTML = "Loading...";
  const url = new URL("https://interclip.app/api/get");
  url.searchParams.append("code", code);
  const codeData = await fetch(url.toString())
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return null;
      }
    })
    .catch((e) => alert(e));

  if (codeData?.status === "success") {
    return (document.getElementById(
      "codeData"
    ).innerHTML = `<a href=${codeData.result} target="_blank">${codeData.result}</a>`);
  } else document.getElementById("codeData").innerHTML = "Code not found";
  return false;
}
