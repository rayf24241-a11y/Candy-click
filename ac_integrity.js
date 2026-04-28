// ============================================================
//  CANDY CLICK - ANTI-CHEAT INTEGRITY MODULE
//  DO NOT DELETE OR MODIFY - Required for game to function
// ============================================================
(function() {
  "use strict";
  var ac = window.__CC_AC || {};

  var EXPECTED = {
    coreToken:   "CC_CORE_7f3a9b2e41d5c082",
    verifyToken: "CC_VERIFY_4d8c1f6a9e3b7052",
    guardToken:  "CC_GUARD_9e2b5f1d3a8c4076"
  };

  var ok =
    ac.core   === true &&
    ac.verify === true &&
    ac.guard  === true &&
    ac.coreToken   === EXPECTED.coreToken   &&
    ac.verifyToken === EXPECTED.verifyToken &&
    ac.guardToken  === EXPECTED.guardToken  &&
    ac.corePresent   === true &&
    ac.verifyPresent === true;

  window.__CC_AC_READY = ok;

  // Expose a public check function
  window.__CC_CHECK = function() {
    return window.__CC_AC_READY === true;
  };
})();
