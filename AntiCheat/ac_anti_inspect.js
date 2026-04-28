// ============================================================
//  CANDY CLICK - ANTI-INSPECT MODULE
//  DO NOT DELETE OR MODIFY - Required for game to function
// ============================================================
(function() {
  "use strict";
  window.__CC_AC = window.__CC_AC || {};
  window.__CC_AC.antiInspect = true;
  window.__CC_AC.aiToken = "CC_AI_3f9d2e7a1b5c8042";

  // ---- Disable right-click context menu ----
  document.addEventListener("contextmenu", function(e) {
    e.preventDefault();
    return false;
  });

  // ---- Block devtools keyboard shortcuts ----
  document.addEventListener("keydown", function(e) {
    // F12
    if (e.key === "F12") { e.preventDefault(); return false; }
    // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C
    if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" ||
        e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c")) {
      e.preventDefault(); return false;
    }
    // Ctrl+U (view source)
    if (e.ctrlKey && (e.key === "U" || e.key === "u")) {
      e.preventDefault(); return false;
    }
    // Ctrl+S (save source)
    if (e.ctrlKey && (e.key === "S" || e.key === "s")) {
      e.preventDefault(); return false;
    }
  });

  // ---- DevTools size detection ----
  var _devOpen = false;
  function checkDevTools() {
    var threshold = 160;
    var widthDiff  = window.outerWidth  - window.innerWidth;
    var heightDiff = window.outerHeight - window.innerHeight;
    var open = widthDiff > threshold || heightDiff > threshold;
    if (open && !_devOpen) {
      _devOpen = true;
      triggerDevToolsWarning();
    } else if (!open) {
      _devOpen = false;
      clearDevToolsWarning();
    }
  }

  // ---- Console trap (fires when console is opened) ----
  var _consoleTrap = { get toString() { triggerDevToolsWarning(); return ""; } };
  setInterval(function() {
    try { console.log("%c", _consoleTrap); } catch(e) {}
  }, 2000);

  function triggerDevToolsWarning() {
    var overlay = document.getElementById("__cc_dt_overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "__cc_dt_overlay";
      overlay.style.cssText = [
        "position:fixed","inset:0","background:#060210","z-index:99999",
        "display:flex","align-items:center","justify-content:center",
        "flex-direction:column","gap:16px","text-align:center","padding:30px",
        "font-family:'Nunito',sans-serif"
      ].join(";");
      overlay.innerHTML = [
        '<div style="font-size:4em">🔒</div>',
        '<div style="font-family:\'Fredoka One\',cursive;font-size:1.8em;color:#ee3344;letter-spacing:1px">Developer Tools Detected</div>',
        '<div style="color:#887766;font-size:0.9em;max-width:380px;line-height:1.6">',
        'Please close DevTools to continue playing.<br>',
        'Inspecting or modifying game code is not allowed.',
        '</div>',
        '<div style="font-family:Consolas,monospace;font-size:0.75em;color:#443333;',
        'background:#0d0618;padding:10px 20px;border-radius:8px;border:1px solid #221010">',
        'AC_ANTI_INSPECT: devtools_open</div>'
      ].join("");
      document.body.appendChild(overlay);
    }
    overlay.style.display = "flex";
  }

  function clearDevToolsWarning() {
    var overlay = document.getElementById("__cc_dt_overlay");
    if (overlay) overlay.style.display = "none";
  }

  setInterval(checkDevTools, 800);
})();
