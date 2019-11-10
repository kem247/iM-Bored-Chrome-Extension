chrome.runtime.onMessage.addListener(request => {
  if (request.type === "rubored") {
    const modal = document.createElement("dialog");
    modal.setAttribute("style", "height:40%");
    modal.innerHTML = `<iframe id="boredCatcher" style="height:250px "></iframe>
            <div style="position:absolute; top:0px; left:3px;">  
                <button>x</button>
            </div>`;
    document.body.appendChild(modal);
    const dialog = document.querySelector("dialog");
    dialog.showModal();
    dialog.querySelector("button").addEventListener("click", () => {
      dialog.close();
    });
    const iframe = document.getElementById("boredCatcher");
    iframe.src = chrome.extension.getURL("index.html");
    iframe.frameBorder = 0;
  }
});
