function loadHTML(id, file, callback) {
  fetch(file)
    .then(function (response) { return response.text(); })
    .then(function (data) {
      document.getElementById(id).innerHTML = data;
      if (callback) callback();
    });
}

let loaded = 0;
function checkBothLoaded() {
  loaded++;
  if (loaded === 2) {
    // header.html + footer.html are now in the DOM.
    // Only now load main.js (the old template's library script) — it looks
    // for elements like #hamburger the moment it runs, so loading it any
    // earlier (e.g. via a plain <script defer> tag) crashes with
    // "Cannot read properties of null (reading 'addEventListener')"
    // because the header wouldn't exist yet at that point.
    var mainScript = document.createElement('script');
    mainScript.src = 'assets/ecomm/js/main.js';
    mainScript.onload = function () {
      document.dispatchEvent(new Event("headerFooterReady"));
    };
    mainScript.onerror = function () {
      // Even if main.js fails to load for some reason, still fire the
      // event so the rest of the site's interactivity (theme-animations.js)
      // still works.
      document.dispatchEvent(new Event("headerFooterReady"));
    };
    document.body.appendChild(mainScript);
  }
}

loadHTML("header-placeholder", "header.html", checkBothLoaded);
loadHTML("footer-placeholder", "footer.html", checkBothLoaded);