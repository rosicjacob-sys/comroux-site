(function () {
  var d = document;
  var CA = "3Mxg9sd7XrCHLMrvLYeKTjzY6cDJ8Bt9BaZ5LZedpump";

  var toast = d.getElementById("rx-toast");
  var tTimer = null;
  function notify(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(tTimer);
    tTimer = setTimeout(function () { toast.classList.remove("show"); }, 2500);
  }

  d.querySelectorAll("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-copy") || CA;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(v);
      }
      notify("CASERNE DISPATCH CA COPIED: " + v.slice(0, 6) + "..." + v.slice(-6));
      var orig = b.textContent;
      b.textContent = "COPIED ✓";
      setTimeout(function () { b.textContent = orig; }, 1600);
    });
  });

  var sImg = d.getElementById("rx-shield-img");
  var sTag = d.getElementById("rx-shield-tag");
  var tabs = d.querySelectorAll("[data-rx-img]");
  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      if (sImg) sImg.setAttribute("src", t.getAttribute("data-rx-img"));
      if (sTag) sTag.textContent = t.getAttribute("data-rx-label");
      tabs.forEach(function (x) { x.classList.toggle("active", x === t); });
    });
  });

  var ALARMS = [
    { min: 0, max: 24, code: "1-ALARM", unit: "VIEUX-PORT PATROL", status: "HARBOR WATCH READY", img: "assets/media/reference_lean.png" },
    { min: 25, max: 49, code: "2-ALARM", unit: "CHIEF SHADES ON", status: "ZERO SMOKE PANIC", img: "assets/media/shades.png" },
    { min: 50, max: 74, code: "3-ALARM", unit: "24K BRASS MEDALLION", status: "$COMROUX DEPLOYED", img: "assets/media/coin.png" },
    { min: 75, max: 89, code: "4-ALARM", unit: "THERMAL LASER", status: "FULL HEAT LOCKED", img: "assets/media/laser.png" },
    { min: 90, max: 100, code: "5-ALARM", unit: "ORBITAL BRIGADE", status: "MOON MISSION IGNITED", img: "assets/media/moon.png" }
  ];
  var aRange = d.getElementById("rx-alarm-range");
  var aCode = d.getElementById("rx-stat-c");
  var aUnit = d.getElementById("rx-stat-u");
  var aStat = d.getElementById("rx-stat-s");
  var aImg = d.getElementById("rx-alarm-img");
  if (aRange) {
    var upd = function () {
      var v = parseInt(aRange.value, 10) || 0;
      var a = ALARMS[0];
      for (var i = 0; i < ALARMS.length; i++) {
        if (v >= ALARMS[i].min && v <= ALARMS[i].max) { a = ALARMS[i]; break; }
      }
      if (aCode) aCode.textContent = a.code;
      if (aUnit) aUnit.textContent = a.unit;
      if (aStat) aStat.textContent = a.status;
      if (aImg && aImg.getAttribute("src") !== a.img) aImg.setAttribute("src", a.img);
    };
    aRange.addEventListener("input", upd);
    upd();
  }

  d.querySelectorAll(".rx-ba").forEach(function (ba) {
    var r = ba.querySelector(".rx-ba-range");
    if (!r) return;
    var up = function () { ba.style.setProperty("--pos", r.value + "%"); };
    r.addEventListener("input", up);
    up();
  });

  fetch("https://api.dexscreener.com/latest/dex/tokens/" + CA)
    .then(function (r) { return r.json(); })
    .then(function (j) {
      var p = (j && j.pairs && j.pairs[0]) || null;
      if (!p) return;
      var pr = d.getElementById("rx-price");
      var mc = d.getElementById("rx-mcap");
      if (pr && p.priceUsd) pr.textContent = "$" + p.priceUsd;
      if (mc && (p.marketCap || p.fdv)) mc.textContent = "$" + Number(p.marketCap || p.fdv).toLocaleString("en-US", { maximumFractionDigits: 0 });
    })
    .catch(function () {});
})();
