// ============================================================
//  CANDY CLICK - ANTI-HACK MODULE
//  DO NOT DELETE OR MODIFY - Required for game to function
// ============================================================
(function() {
  "use strict";
  window.__CC_AC = window.__CC_AC || {};
  window.__CC_AC.antiHack = true;
  window.__CC_AC.ahToken = "CC_AH_8b4f1e6d2a9c3075";

  // ---- XOR cipher key (changes encoding of save data) ----
  var CIPHER_KEY = "CandyClickAntiHack2026!@#$";

  function xorEncode(str) {
    var out = "";
    for (var i = 0; i < str.length; i++) {
      out += String.fromCharCode(str.charCodeAt(i) ^ CIPHER_KEY.charCodeAt(i % CIPHER_KEY.length));
    }
    try { return btoa(out); } catch(e) { return btoa(unescape(encodeURIComponent(out))); }
  }

  function xorDecode(encoded) {
    try {
      var raw;
      try { raw = atob(encoded); } catch(e) { raw = decodeURIComponent(escape(atob(encoded))); }
      var out = "";
      for (var i = 0; i < raw.length; i++) {
        out += String.fromCharCode(raw.charCodeAt(i) ^ CIPHER_KEY.charCodeAt(i % CIPHER_KEY.length));
      }
      return out;
    } catch(e) { return null; }
  }

  // ---- Simple hash/checksum ----
  function hashString(str) {
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h * 0x01000193) >>> 0;
    }
    return h.toString(16);
  }

  // ---- Sanity check save values ----
  function isSaveValid(data) {
    if (typeof data !== "object" || data === null) return false;
    // Candy shouldn't be impossibly high for the session
    if (data.candy < 0) return false;
    if (data.candyPerClick < 1) return false;
    // Buildings owned count sanity
    if (data.buildings) {
      for (var i = 0; i < data.buildings.length; i++) {
        if (data.buildings[i] < 0 || data.buildings[i] > 99999) return false;
      }
    }
    return true;
  }

  // ---- Expose secure save/load functions ----
  window.__CC_SAVE = function(key, data) {
    try {
      var json     = JSON.stringify(data);
      var checksum = hashString(json);
      var payload  = JSON.stringify({ d: json, c: checksum });
      var encoded  = xorEncode(payload);
      localStorage.setItem(key, encoded);
      return true;
    } catch(e) { return false; }
  };

  window.__CC_LOAD = function(key) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return null;

      // Try new encoded format first
      var decoded = xorDecode(raw);
      if (decoded) {
        var payload = JSON.parse(decoded);
        if (payload && payload.d && payload.c) {
          var checksum = hashString(payload.d);
          if (checksum !== payload.c) {
            // Checksum mismatch — data was tampered with
            console.warn("CC: Save data checksum mismatch. Resetting.");
            localStorage.removeItem(key);
            showTamperWarning();
            return null;
          }
          var data = JSON.parse(payload.d);
          if (!isSaveValid(data)) {
            console.warn("CC: Save data failed sanity check. Resetting.");
            localStorage.removeItem(key);
            showTamperWarning();
            return null;
          }
          return data;
        }
      }

      // Fallback: try plain JSON (old saves) — migrate them
      try {
        var plain = JSON.parse(raw);
        if (plain && typeof plain === "object") {
          // Migrate to secure format
          window.__CC_SAVE(key, plain);
          return plain;
        }
      } catch(e2) {}

      return null;
    } catch(e) { return null; }
  };

  function showTamperWarning() {
    var overlay = document.getElementById("__cc_tamper_overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "__cc_tamper_overlay";
      overlay.style.cssText = [
        "position:fixed","inset:0","background:#060210","z-index:99999",
        "display:flex","align-items:center","justify-content:center",
        "flex-direction:column","gap:16px","text-align:center","padding:30px",
        "font-family:'Nunito',sans-serif"
      ].join(";");
      overlay.innerHTML = [
        '<div style="font-size:4em">⚠️</div>',
        '<div style="font-family:\'Fredoka One\',cursive;font-size:1.8em;color:#ffaa00;letter-spacing:1px">Save Data Tampered</div>',
        '<div style="color:#887766;font-size:0.9em;max-width:380px;line-height:1.6">',
        'Your save data has been modified outside the game.<br>',
        'The corrupted save has been reset to protect integrity.',
        '</div>',
        '<div style="font-family:Consolas,monospace;font-size:0.75em;color:#443333;',
        'background:#0d0618;padding:10px 20px;border-radius:8px;border:1px solid #221010">',
        'AC_ANTI_HACK: checksum_mismatch</div>',
        '<button onclick="document.getElementById(\'__cc_tamper_overlay\').style.display=\'none\'" ',
        'style="padding:12px 28px;background:linear-gradient(135deg,#ff9933,#ff6600);border:none;',
        'border-radius:10px;color:#fff;font-weight:800;font-family:Nunito,sans-serif;',
        'font-size:1em;cursor:pointer;">Continue with Fresh Save</button>'
      ].join("");
      document.body.appendChild(overlay);
    }
    overlay.style.display = "flex";
  }

  window.__CC_TAMPER_WARNING = showTamperWarning;
})();
