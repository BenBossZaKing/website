document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const passwordModal = document.getElementById("passwordModal");
  const passwordInput = document.getElementById("passwordInput");
  const passwordSubmit = document.getElementById("passwordSubmit");
  const passwordError = document.getElementById("passwordError");
  const adminNotice = document.getElementById("adminNotice");
  const versionModal = document.getElementById("versionModal");
  const introModal = document.getElementById("introModal");
  const introTextEl = document.getElementById("introText");
  const note = document.getElementById("note");
  const envelope = document.getElementById("envelope");
  const flap = document.getElementById("flap");
  const back = document.getElementById("back");
  const foil = document.getElementById("foil");
  const foil2 = document.getElementById("foil2");
  const jumpscare = document.getElementById("jumpscare");
  const pdfContainer = document.getElementById("pdfContainer");
  const pdfViewer = document.getElementById("pdfViewer");
  const pdfClose = document.getElementById("pdfClose");
  const replyButton = document.getElementById("replyButton");
  const shareButton = document.getElementById("shareButton");
  const responseModal = document.getElementById("responseModal");
  const closeResponseModal = document.getElementById("closeResponseModal");
  const responseButtons = responseModal.querySelectorAll(".response-buttons button");
  const floaty = document.querySelector(".floaty");

  let selectedVersion = "";
  const correctPassword = "poker15";
  const correctABBYPassword = "4Abby";
  const correctCjPassword = "8hrs";
  let stage = 0;

  // On load, show Abby notice if she accessed
  const abbyTime = localStorage.getItem("abbyAccessedTime");
  if (abbyTime) {
    adminNotice.textContent = `Abby accessed site at ${new Date(abbyTime).toLocaleString()}`;
  }

  // PDF.js render
  function renderAllPages(path) {
    pdfViewer.innerHTML = "";
    return pdfjsLib.getDocument(path).promise.then(pdf => {
      const renders = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        renders.push(pdf.getPage(i).then(page => {
          const vp = page.getViewport({ scale: 1.2 });
          const cnv = document.createElement("canvas");
          cnv.width = vp.width; cnv.height = vp.height;
          pdfViewer.appendChild(cnv);
          return page.render({ canvasContext: cnv.getContext("2d"), viewport: vp }).promise;
        }));
      }
      return Promise.all(renders);
    });
  }

  // 1) Password unlock
  passwordSubmit.onclick = () => {
    const val = passwordInput.value;

    if (val === correctPassword) {
      passwordModal.style.display = "none";
      versionModal.style.display = "flex";

    } else if (val === correctABBYPassword) {
      passwordModal.style.display = "none";
      versionModal.style.display = "flex";
      const now = new Date().toISOString();
      localStorage.setItem("abbyAccessedTime", now);
      adminNotice.textContent = `Abby accessed site at ${new Date(now).toLocaleString()}`;
      fetch('/logAbbyAccess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessedAt: now })
      });

    } else if (val === correctCjPassword) {
      passwordModal.style.display = "none";
      const now = new Date().toISOString();
      localStorage.setItem("cjAccessedTime", now);
      fetch('/logCJopen', { method: 'POST' });

      // Skip version and go straight to intro
      selectedVersion = "cj"; // Custom keyword for CJ
      document.querySelector(".envelope-name").textContent = "CJ";
      adminNotice.style.display = "none";

      introTextEl.innerHTML = "You beat me. And if you're reading this, I still want you.<br/><br/>Now open it.";
      note.textContent = "";
      introModal.style.display = "flex";
    }
 else {
      passwordError.style.display = "block";
    }
  };

  passwordInput.onkeydown = e => { if (e.key === "Enter") passwordSubmit.click(); };

  // 2) Version choice
  document.querySelectorAll(".version-button").forEach(btn => {
    btn.onclick = () => {
      selectedVersion = btn.dataset.version;
      versionModal.style.display = "none";
      if (selectedVersion === "to") {
        introTextEl.textContent = "UHMMMMMMMMM… couple days back, I got a notif…";
        note.textContent = "…your letter content…";
        introModal.style.display = "flex";
      } else {
        introTextEl.innerHTML =
          "Sorry I've been holding onto this for so long I just got back from my cabin trip —<br/>" +
          "I really wanted to do something cool to end this off and couldn't leave the pre-trip version as my final shot.<br/><br/>Now open it.";
        note.textContent = "";
        introModal.style.display = "flex";
      }
    };
  });

  // 3) Intro continue
  document.getElementById("introOk").onclick = () => { introModal.style.display = "none"; };

  // 4) Envelope animation
  envelope.onclick = () => {
    stage++;
    if (stage === 1) {
      envelope.classList.add("paused", "restart-float");
      setTimeout(() => envelope.classList.add("opened"), 10);
      setTimeout(() => back.classList.add("opened"), 300);
      setTimeout(() => foil.classList.add("opened"), 150);
      setTimeout(() => foil2.classList.add("opened"), 150);
    } else if (stage === 2) {
      flap.classList.add("openedflip");
      setTimeout(() => flap.classList.add("openedflipshow"), 150);
      setTimeout(() => flap.classList.add("openedflipmoveback"), 300);
      setTimeout(() => note.classList.add("visible"), 400);
    } else if (stage === 3) {
      envelope.classList.add("shudder");
      //jumpscare.classList.add("show");
      setTimeout(() => {
        jumpscare.classList.remove("show");
        note.classList.add("out");
        setTimeout(() => {
          floaty.style.display = "none";
          let pdfPath = "";
          if (selectedVersion === "to") {
            pdfPath = "/DearAbby_verFINAL.pdf";
          } else if (selectedVersion === "cj") {
            pdfPath = "/Cj.pdf";
          } else {
            pdfPath = "/AbbyCabin.pdf";
          }

          renderAllPages(pdfPath).then(() => { pdfContainer.style.display = "flex"; });
        }, 600);
      }, 50);
    }
  };

  // 5) Close PDF resets state and refreshes
  pdfClose.onclick = () => {
    pdfContainer.style.display = "none";
    floaty.style.display = "flex";
    // Instead of manual reset, reload entire page
    window.location.reload();
  };

  // 6) Reply modal
  replyButton.onclick = () => {
    pdfContainer.style.display = "none";
    floaty.style.display = "none";
    responseModal.style.display = "flex";
  };

  // 7) Copy link
  shareButton.onclick = async () => {
    const url = `${location.origin + location.pathname}#letter=${selectedVersion}`;
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied!");
    } catch {
      prompt("Copy this link:", url);
    }
  };

  // 8) Close response without action
  closeResponseModal.onclick = () => {
    responseModal.style.display = "none";
    localStorage.setItem("abbyResponse", "none");
    versionModal.style.display = "flex";
  };

  // 9) Deep-link channels
  const CHANNELS = {
    text: { uri: "sms:+12163760382?body=Hey%20Ben...", fallback: null },
    snapchat: { uri: "snapchat://add/ben.widowski", fallback: "https://snapchat.com/add/ben.widowski" },
    instagram: { uri: "instagram://user?username=ben.widowski", fallback: "https://instagram.com/ben.widowski" },
    discord: { uri: "https://discord.com/users/benbosszaking", fallback: null }
  };

  responseButtons.forEach(btn => {
    btn.onclick = () => {
      const method = btn.dataset.method;
      localStorage.setItem("abbyResponse", method);
      localStorage.setItem("abbyResponseTime", new Date().toISOString());
      const { uri, fallback } = CHANNELS[method];
      window.location.href = uri;
      if (fallback) setTimeout(() => window.open(fallback, "_blank"), 500);
      responseModal.style.display = "none";
      versionModal.style.display = "flex";
    };
  });
});