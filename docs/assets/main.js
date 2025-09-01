var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const setScrollWidth = () => {
  document.documentElement.style.setProperty(
    "--scroll-width",
    `${getScrollbarWidth()}px`
  );
};
function getScrollbarWidth() {
  const outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.width = "100px";
  document.body.appendChild(outer);
  const widthNoScroll = outer.offsetWidth;
  outer.style.overflow = "scroll";
  const inner = document.createElement("div");
  inner.style.width = "100%";
  outer.appendChild(inner);
  const widthWithScroll = inner.offsetWidth;
  outer.parentNode && outer.parentNode.removeChild(outer);
  return widthNoScroll - widthWithScroll;
}
const iosChecker = () => {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  const iosDevices = [
    "iPad Simulator",
    "iPhone Simulator",
    "iPod Simulator",
    "iPad",
    "iPhone",
    "iPod"
  ];
  const isIosDevice = iosDevices.includes(platform) || userAgent.includes("Mac") && "ontouchend" in document;
  const isIpadMac = userAgent.includes("Mac") && navigator.maxTouchPoints > 1;
  return isIosDevice || isIpadMac;
};
const iosFixes = () => {
  var _a;
  if (!(!!window.MSInputMethodContext && !!document.documentMode)) {
    const isIos = iosChecker();
    if (!isIos) {
      return;
    }
    document.body.classList.add("ios");
    (_a = document.querySelector("[name=viewport]")) == null ? void 0 : _a.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1");
    document.documentElement.style.setProperty("--dvh", `${window.innerHeight * 0.01}px`);
    window.addEventListener(
      "resize",
      () => document.documentElement.style.setProperty(
        "--dvh",
        `${window.innerHeight * 0.01}px`
      )
    );
  }
};
/**
 * tua-body-scroll-lock v1.5.3
 * (c) 2024 Evinma, BuptStEve
 * @license MIT
 */
var isServer = function isServer2() {
  return typeof window === "undefined";
};
var detectOS = function detectOS2(ua) {
  ua = ua || navigator.userAgent;
  var ipad = /(iPad).*OS\s([\d_]+)/.test(ua);
  var iphone = !ipad && /(iPhone\sOS)\s([\d_]+)/.test(ua);
  var android = /(Android);?[\s/]+([\d.]+)?/.test(ua);
  var ios = iphone || ipad;
  return {
    ios,
    android
  };
};
function getEventListenerOptions(options) {
  if (isServer()) return false;
  if (!options) {
    throw new Error("options must be provided");
  }
  var isSupportOptions = false;
  var listenerOptions = {
    get passive() {
      isSupportOptions = true;
      return void 0;
    }
  };
  var noop = function noop2() {
  };
  var testEvent = "__TUA_BSL_TEST_PASSIVE__";
  window.addEventListener(testEvent, noop, listenerOptions);
  window.removeEventListener(testEvent, noop, listenerOptions);
  var capture = options.capture;
  return isSupportOptions ? options : typeof capture !== "undefined" ? capture : false;
}
function getPreventEventDefault() {
  if ("__BSL_PREVENT_DEFAULT__" in window) {
    return window.__BSL_PREVENT_DEFAULT__;
  }
  window.__BSL_PREVENT_DEFAULT__ = function(event) {
    if (!event.cancelable) return;
    event.preventDefault();
  };
  return window.__BSL_PREVENT_DEFAULT__;
}
function toArray(x) {
  if (!x) return [];
  return Array.isArray(x) ? x : [x];
}
var initialLockState = {
  lockedNum: 0,
  lockedElements: [],
  unLockCallback: null,
  documentListenerAdded: false,
  initialClientPos: {
    clientX: 0,
    clientY: 0
  }
};
function getLockState(options) {
  if (isServer()) return initialLockState;
  if (!(options === null || options === void 0 ? void 0 : options.useGlobalLockState)) return getLockState.lockState;
  var lockState = "__BSL_LOCK_STATE__" in window ? Object.assign(Object.assign({}, initialLockState), window.__BSL_LOCK_STATE__) : initialLockState;
  window.__BSL_LOCK_STATE__ = lockState;
  return lockState;
}
getLockState.lockState = initialLockState;
function handleScroll(event, targetElement, initialClientPos) {
  if (targetElement) {
    var scrollTop = targetElement.scrollTop, scrollLeft = targetElement.scrollLeft, scrollWidth = targetElement.scrollWidth, scrollHeight = targetElement.scrollHeight, clientWidth = targetElement.clientWidth, clientHeight = targetElement.clientHeight;
    var clientX = event.targetTouches[0].clientX - initialClientPos.clientX;
    var clientY = event.targetTouches[0].clientY - initialClientPos.clientY;
    var isVertical = Math.abs(clientY) > Math.abs(clientX);
    var isOnTop = clientY > 0 && scrollTop === 0;
    var isOnLeft = clientX > 0 && scrollLeft === 0;
    var isOnRight = clientX < 0 && scrollLeft + clientWidth + 1 >= scrollWidth;
    var isOnBottom = clientY < 0 && scrollTop + clientHeight + 1 >= scrollHeight;
    if (isVertical && (isOnTop || isOnBottom) || !isVertical && (isOnLeft || isOnRight)) {
      return getPreventEventDefault()(event);
    }
  }
  event.stopPropagation();
  return true;
}
function setOverflowHiddenPc() {
  var $html = document.documentElement;
  var htmlStyle = Object.assign({}, $html.style);
  var scrollBarWidth = window.innerWidth - $html.clientWidth;
  var previousPaddingRight = parseInt(window.getComputedStyle($html).paddingRight, 10);
  $html.style.overflow = "hidden";
  $html.style.boxSizing = "border-box";
  $html.style.paddingRight = "".concat(scrollBarWidth + previousPaddingRight, "px");
  return function() {
    ["overflow", "boxSizing", "paddingRight"].forEach(function(x) {
      $html.style[x] = htmlStyle[x] || "";
    });
  };
}
function setOverflowHiddenMobile(options) {
  var $html = document.documentElement;
  var $body = document.body;
  var scrollTop = $html.scrollTop || $body.scrollTop;
  var htmlStyle = Object.assign({}, $html.style);
  var bodyStyle = Object.assign({}, $body.style);
  $html.style.height = "100%";
  $html.style.overflow = "hidden";
  $body.style.top = "-".concat(scrollTop, "px");
  $body.style.width = "100%";
  $body.style.height = "auto";
  $body.style.position = "fixed";
  $body.style.overflow = "hidden";
  return function() {
    $html.style.height = htmlStyle.height || "";
    $html.style.overflow = htmlStyle.overflow || "";
    ["top", "width", "height", "overflow", "position"].forEach(function(x) {
      $body.style[x] = bodyStyle[x] || "";
    });
    var supportsNativeSmoothScroll = "scrollBehavior" in document.documentElement.style;
    if (supportsNativeSmoothScroll) {
      window.scrollTo({
        top: scrollTop,
        behavior: "instant"
      });
    } else {
      window.scrollTo(0, scrollTop);
    }
  };
}
function lock(targetElement, options) {
  if (isServer()) return;
  var detectRes = detectOS();
  var lockState = getLockState(options);
  if (detectRes.ios) {
    toArray(targetElement).filter(function(e) {
      return e && lockState.lockedElements.indexOf(e) === -1;
    }).forEach(function(element) {
      element.ontouchstart = function(event) {
        var _event$targetTouches$ = event.targetTouches[0], clientX = _event$targetTouches$.clientX, clientY = _event$targetTouches$.clientY;
        lockState.initialClientPos = {
          clientX,
          clientY
        };
      };
      element.ontouchmove = function(event) {
        handleScroll(event, element, lockState.initialClientPos);
      };
      lockState.lockedElements.push(element);
    });
    addTouchMoveListener(lockState);
  } else if (lockState.lockedNum <= 0) {
    lockState.unLockCallback = detectRes.android ? setOverflowHiddenMobile() : setOverflowHiddenPc();
  }
  lockState.lockedNum += 1;
}
function clearBodyLocks(options) {
  if (isServer()) return;
  var lockState = getLockState(options);
  lockState.lockedNum = 0;
  if (unlockByCallback(lockState)) return;
  if (lockState.lockedElements.length) {
    var element = lockState.lockedElements.pop();
    while (element) {
      element.ontouchmove = null;
      element.ontouchstart = null;
      element = lockState.lockedElements.pop();
    }
  }
  removeTouchMoveListener(lockState);
}
function unlockByCallback(lockState) {
  if (detectOS().ios) return false;
  if (typeof lockState.unLockCallback !== "function") return false;
  lockState.unLockCallback();
  return true;
}
function addTouchMoveListener(lockState) {
  if (!detectOS().ios) return;
  if (lockState.documentListenerAdded) return;
  document.addEventListener("touchmove", getPreventEventDefault(), getEventListenerOptions({
    passive: false
  }));
  lockState.documentListenerAdded = true;
}
function removeTouchMoveListener(lockState) {
  if (!lockState.documentListenerAdded) return;
  document.removeEventListener("touchmove", getPreventEventDefault(), getEventListenerOptions({
    passive: false
  }));
  lockState.documentListenerAdded = false;
}
var h = Object.defineProperty;
var u = (c, e, t) => e in c ? h(c, e, { enumerable: true, configurable: true, writable: true, value: t }) : c[e] = t;
var a = (c, e, t) => (u(c, typeof e != "symbol" ? e + "" : e, t), t);
class r {
  constructor(e) {
    a(this, "stopTrigger", false);
    a(this, "openedModals", []);
    a(this, "isBodyLocked", false);
    a(this, "isBusy", false);
    a(this, "config", {
      linkAttributeName: "data-hystmodal",
      closeOnEsc: true,
      closeOnOverlay: true,
      closeOnButton: true,
      catchFocus: true,
      isStacked: false,
      backscroll: true,
      waitTransitions: false,
      fixedSelectors: [
        "[data-hystfixed]"
      ]
    });
    a(this, "focusElements", [
      "a[href]",
      "area[href]",
      'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
      "select:not([disabled]):not([aria-hidden])",
      "textarea:not([disabled]):not([aria-hidden])",
      "button:not([disabled]):not([aria-hidden])",
      "iframe",
      "object",
      "embed",
      "[contenteditable]",
      '[tabindex]:not([tabindex^="-"])'
    ]);
    this.config = Object.assign(this.config, e), this.eventsFeeler();
  }
  /**
   * @deprecated since version 1.0.0
   */
  init() {
    return this;
  }
  eventsFeeler() {
    let e = false;
    document.addEventListener("click", (t) => {
      const s = t.target, i = s.closest(`[${this.config.linkAttributeName}]`);
      if (i && !this.isBusy) {
        this.isBusy = true, t.preventDefault();
        const o = this.config.linkAttributeName, d = o ? i.getAttribute(o) : null;
        d && this.open(d, i.hasAttribute("data-stacked"), i);
        return;
      }
      const n = s.closest("[data-hystclose]");
      if (this.config.closeOnButton && n && !this.isBusy) {
        this.isBusy = true, t.preventDefault();
        const o = s.closest(".hystmodal");
        o && this.close(o);
        return;
      }
      if ((s.classList.contains("hystmodal") || s.classList.contains("hystmodal__wrap")) && e && !this.isBusy) {
        this.isBusy = true, t.preventDefault();
        const o = s.closest(".hystmodal");
        o && this.close(o);
      }
    }), document.addEventListener("mousedown", ({ target: t }) => {
      e = false, !(!this.config.closeOnOverlay || !(t instanceof HTMLElement) || !(t.classList.contains("hystmodal") || t.classList.contains("hystmodal__wrap"))) && (e = true);
    }), window.addEventListener("keydown", (t) => {
      var s;
      if (this.config.closeOnEsc && t.key === "Escape" && this.openedModals.length && !this.isBusy) {
        t.preventDefault(), this.isBusy = true, this.close((s = this.openedModals[this.openedModals.length - 1]) == null ? void 0 : s.element);
        return;
      }
      this.config.catchFocus && t.key === "Tab" && this.openedModals.length && this.focusCatcher(t);
    });
  }
  async openObj(e, t = false) {
    if (this.config.beforeOpen && this.config.beforeOpen(e, this), this.stopTrigger) {
      this.stopTrigger = false;
      return;
    }
    if (this.config.isStacked || t) {
      const n = this.openedModals.filter((l) => l.element === e.element);
      await Promise.all(n.map(async (l) => {
        await this.closeObj(l, false, true, false);
      }));
    } else
      await this.closeAll(), this.openedModals = [];
    if (this.isBodyLocked || this.bodyScrollControl(e, "opening"), !e.element.querySelector(".hystmodal__window")) {
      console.error("Warning: selector .hystmodal__window not found in modal window"), this.isBusy = false;
      return;
    }
    this.openedModals.push(e), e.element.classList.add("hystmodal--animated"), e.element.classList.add("hystmodal--active"), e.element.style.zIndex = e.zIndex.toString(), e.element.setAttribute("aria-hidden", "false");
    const i = getComputedStyle(e.element).getPropertyValue("--hystmodal-speed");
    this.focusIn(e.element), setTimeout(() => {
      e.element.classList.remove("hystmodal--animated"), this.isBusy = false;
    }, r.cssParseSpeed(i));
  }
  /**
   * @argument selectorName CSS string of selector, ID recomended
   * @argument isStack Whether the modal window should open above the previous one and not close it
   * @argument starter Optional - Manually set the starter element of the modal
  * */
  async open(e, t = this.config.isStacked, s = null) {
    const i = this.getActiveModal(), n = e ? document.querySelector(e) : null;
    if (!n) {
      console.error("Warning: selector .hystmodal__window not found in modal window"), this.isBusy = false;
      return;
    }
    const l = getComputedStyle(n).getPropertyValue("--hystmodal-zindex"), o = {
      element: n,
      openedWindow: n,
      starter: s,
      zIndex: i ? i.zIndex + this.openedModals.length : parseInt(l, 10),
      config: this.config,
      isOpened: false
    };
    await this.openObj(o, t), this.isBusy = false;
  }
  closeObj(e, t = false, s = false, i = true) {
    return new Promise((n) => {
      if (!e)
        return;
      this.config.waitTransitions && !s && (e.element.classList.add("hystmodal--animated"), e.element.classList.add("hystmodal--moved")), e.element.classList.remove("hystmodal--active");
      const l = getComputedStyle(e.element).getPropertyValue("--hystmodal-speed");
      e.element.setAttribute("aria-hidden", "false"), this.openedModals = this.openedModals.filter((o) => o.element !== e.element), setTimeout(() => {
        e.element.classList.remove("hystmodal--animated"), e.element.classList.remove("hystmodal--moved"), e.element.style.zIndex = "", this.config.backscroll && !this.openedModals.length && t && (clearBodyLocks(), this.bodyScrollControl(e, "closing"), this.isBodyLocked = false), this.config.catchFocus && e.starter && i && e.starter.focus(), this.config.afterClose && this.config.afterClose(e, this), n(e);
      }, this.config.waitTransitions && !s ? r.cssParseSpeed(l) : 0);
    });
  }
  /**
   * @argument modalElem The CSS string of the modal element selector. If not passed,
   * all open modal windows will close.
  * */
  async close(e = null) {
    if (!e) {
      const s = await this.closeAll();
      return s.length ? s[s.length - 1] : null;
    }
    const t = this.openedModals.find((s) => s.element === e);
    return t ? (await this.closeObj(t, true), this.isBusy = false, t) : null;
  }
  async closeAll() {
    const e = [];
    return await Promise.all(this.openedModals.map(async (t) => {
      await this.closeObj(t, true), e.push(t);
    })), this.openedModals = [], this.isBusy = false, e;
  }
  focusIn(e) {
    if (!this.openedModals.length)
      return;
    const t = Array.from(e.querySelectorAll(this.focusElements.join(", ")));
    t.length && t[0].focus();
  }
  focusCatcher(e) {
    const t = this.openedModals[this.openedModals.length - 1], s = Array.from(t.element.querySelectorAll(this.focusElements.join(", ")));
    if (!t.element.contains(document.activeElement))
      s[0].focus(), e.preventDefault();
    else {
      if (!document.activeElement)
        return;
      const i = s.indexOf(document.activeElement);
      e.shiftKey && i === 0 && (s[s.length - 1].focus(), e.preventDefault()), !e.shiftKey && i === s.length - 1 && (s[0].focus(), e.preventDefault());
    }
  }
  static cssParseSpeed(e) {
    const t = parseFloat(e), s = e.match(/m?s/), i = s ? s[0] : null;
    let n = 0;
    switch (i) {
      case "s":
        n = t * 1e3;
        break;
      case "ms":
        n = t;
        break;
    }
    return n;
  }
  getActiveModal() {
    return this.openedModals.length ? this.openedModals[this.openedModals.length - 1] : null;
  }
  bodyScrollControl(e, t) {
    const s = Array.from(this.config.fixedSelectors ? document.querySelectorAll(this.config.fixedSelectors.join(", ")) : []);
    if (t === "closing") {
      if (this.openedModals.length)
        return;
      s.forEach((n) => {
        n.style.marginRight = "";
      }), document.documentElement.classList.remove("hystmodal__opened");
      return;
    }
    if (this.config.backscroll && !this.isBodyLocked) {
      const n = Array.from(e.element.querySelectorAll("[data-needscroll], .ss-list"));
      n.push(e.element), lock(n), this.isBodyLocked = true;
    }
    const i = parseFloat(document.body.style.paddingRight);
    i && s.forEach((n) => {
      n.style.marginRight = `${parseInt(getComputedStyle(n).marginRight, 10) + i}px`;
    }), document.documentElement.classList.add("hystmodal__opened");
  }
}
const initModals = () => {
  const modals = new r({
    linkAttributeName: "data-open-modal",
    waitTransitions: true
  });
  return modals;
};
const getStoredTheme = () => localStorage.getItem("theme");
const setTheme = (theme) => {
  if (theme === "auto") {
    document.documentElement.setAttribute("data-theme", window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
};
const getPreferredTheme = () => {
  const storedTheme = getStoredTheme();
  if (storedTheme) {
    return storedTheme;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};
const initTheme = () => {
  setTheme(getPreferredTheme());
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    const storedTheme = getStoredTheme();
    if (storedTheme !== "light" && storedTheme !== "dark") {
      setTheme(getPreferredTheme());
    }
  });
};
const calcHeaderHeight = () => {
  const doc = document.documentElement;
  const header = document.querySelector(".header");
  if (header)
    doc.style.setProperty("--header-height", `${header.offsetHeight}px`);
};
class initInputFile {
  constructor() {
    __publicField(this, "inputsFiles");
    __publicField(this, "fileTypes");
    this.inputsFiles = document.querySelectorAll(".default-file__input");
    if (!this.inputsFiles.length) return;
    this.init();
    this.fileTypes = [".jpg", ".jpeg", ".pdf", ".png"];
  }
  init() {
    this.inputsFiles.forEach((input) => input.addEventListener("change", (event) => {
      var _a, _b;
      const [file] = event.target.files;
      if (file.size / 1024 / 1024 < 5) {
        let fileType = file.name.match(/\.([^.]+)$|$/)[0];
        let itsImage = this.fileTypes.includes(fileType);
        if (itsImage) {
          const filePlaceholder = (_a = input.parentNode) == null ? void 0 : _a.querySelector(".default-file__placeholder");
          (_b = input.parentNode) == null ? void 0 : _b.classList.add("active");
          filePlaceholder.textContent = file.name;
        } else {
          input.value = null;
          alert(`Формат документа не соответствует возможному для загрузки 
 (${this.fileTypes})`);
        }
      } else {
        input.value = null;
        alert("Размер файла не может превышать 5 Мб");
      }
    }));
  }
}
var PipsMode;
(function(PipsMode2) {
  PipsMode2["Range"] = "range";
  PipsMode2["Steps"] = "steps";
  PipsMode2["Positions"] = "positions";
  PipsMode2["Count"] = "count";
  PipsMode2["Values"] = "values";
})(PipsMode || (PipsMode = {}));
var PipsType;
(function(PipsType2) {
  PipsType2[PipsType2["None"] = -1] = "None";
  PipsType2[PipsType2["NoValue"] = 0] = "NoValue";
  PipsType2[PipsType2["LargeValue"] = 1] = "LargeValue";
  PipsType2[PipsType2["SmallValue"] = 2] = "SmallValue";
})(PipsType || (PipsType = {}));
function isValidFormatter(entry) {
  return isValidPartialFormatter(entry) && typeof entry.from === "function";
}
function isValidPartialFormatter(entry) {
  return typeof entry === "object" && typeof entry.to === "function";
}
function removeElement(el) {
  el.parentElement.removeChild(el);
}
function isSet(value) {
  return value !== null && value !== void 0;
}
function preventDefault(e) {
  e.preventDefault();
}
function unique(array) {
  return array.filter(function(a2) {
    return !this[a2] ? this[a2] = true : false;
  }, {});
}
function closest(value, to) {
  return Math.round(value / to) * to;
}
function offset(elem, orientation) {
  var rect = elem.getBoundingClientRect();
  var doc = elem.ownerDocument;
  var docElem = doc.documentElement;
  var pageOffset = getPageOffset(doc);
  if (/webkit.*Chrome.*Mobile/i.test(navigator.userAgent)) {
    pageOffset.x = 0;
  }
  return orientation ? rect.top + pageOffset.y - docElem.clientTop : rect.left + pageOffset.x - docElem.clientLeft;
}
function isNumeric(a2) {
  return typeof a2 === "number" && !isNaN(a2) && isFinite(a2);
}
function addClassFor(element, className, duration) {
  if (duration > 0) {
    addClass(element, className);
    setTimeout(function() {
      removeClass(element, className);
    }, duration);
  }
}
function limit(a2) {
  return Math.max(Math.min(a2, 100), 0);
}
function asArray(a2) {
  return Array.isArray(a2) ? a2 : [a2];
}
function countDecimals(numStr) {
  numStr = String(numStr);
  var pieces = numStr.split(".");
  return pieces.length > 1 ? pieces[1].length : 0;
}
function addClass(el, className) {
  if (el.classList && !/\s/.test(className)) {
    el.classList.add(className);
  } else {
    el.className += " " + className;
  }
}
function removeClass(el, className) {
  if (el.classList && !/\s/.test(className)) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ");
  }
}
function hasClass(el, className) {
  return el.classList ? el.classList.contains(className) : new RegExp("\\b" + className + "\\b").test(el.className);
}
function getPageOffset(doc) {
  var supportPageOffset = window.pageXOffset !== void 0;
  var isCSS1Compat = (doc.compatMode || "") === "CSS1Compat";
  var x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? doc.documentElement.scrollLeft : doc.body.scrollLeft;
  var y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? doc.documentElement.scrollTop : doc.body.scrollTop;
  return {
    x,
    y
  };
}
function getActions() {
  return window.navigator.pointerEnabled ? {
    start: "pointerdown",
    move: "pointermove",
    end: "pointerup"
  } : window.navigator.msPointerEnabled ? {
    start: "MSPointerDown",
    move: "MSPointerMove",
    end: "MSPointerUp"
  } : {
    start: "mousedown touchstart",
    move: "mousemove touchmove",
    end: "mouseup touchend"
  };
}
function getSupportsPassive() {
  var supportsPassive = false;
  try {
    var opts = Object.defineProperty({}, "passive", {
      get: function() {
        supportsPassive = true;
      }
    });
    window.addEventListener("test", null, opts);
  } catch (e) {
  }
  return supportsPassive;
}
function getSupportsTouchActionNone() {
  return window.CSS && CSS.supports && CSS.supports("touch-action", "none");
}
function subRangeRatio(pa, pb) {
  return 100 / (pb - pa);
}
function fromPercentage(range, value, startRange) {
  return value * 100 / (range[startRange + 1] - range[startRange]);
}
function toPercentage(range, value) {
  return fromPercentage(range, range[0] < 0 ? value + Math.abs(range[0]) : value - range[0], 0);
}
function isPercentage(range, value) {
  return value * (range[1] - range[0]) / 100 + range[0];
}
function getJ(value, arr) {
  var j = 1;
  while (value >= arr[j]) {
    j += 1;
  }
  return j;
}
function toStepping(xVal, xPct, value) {
  if (value >= xVal.slice(-1)[0]) {
    return 100;
  }
  var j = getJ(value, xVal);
  var va = xVal[j - 1];
  var vb = xVal[j];
  var pa = xPct[j - 1];
  var pb = xPct[j];
  return pa + toPercentage([va, vb], value) / subRangeRatio(pa, pb);
}
function fromStepping(xVal, xPct, value) {
  if (value >= 100) {
    return xVal.slice(-1)[0];
  }
  var j = getJ(value, xPct);
  var va = xVal[j - 1];
  var vb = xVal[j];
  var pa = xPct[j - 1];
  var pb = xPct[j];
  return isPercentage([va, vb], (value - pa) * subRangeRatio(pa, pb));
}
function getStep(xPct, xSteps, snap, value) {
  if (value === 100) {
    return value;
  }
  var j = getJ(value, xPct);
  var a2 = xPct[j - 1];
  var b = xPct[j];
  if (snap) {
    if (value - a2 > (b - a2) / 2) {
      return b;
    }
    return a2;
  }
  if (!xSteps[j - 1]) {
    return value;
  }
  return xPct[j - 1] + closest(value - xPct[j - 1], xSteps[j - 1]);
}
var Spectrum = (
  /** @class */
  function() {
    function Spectrum2(entry, snap, singleStep) {
      this.xPct = [];
      this.xVal = [];
      this.xSteps = [];
      this.xNumSteps = [];
      this.xHighestCompleteStep = [];
      this.xSteps = [singleStep || false];
      this.xNumSteps = [false];
      this.snap = snap;
      var index;
      var ordered = [];
      Object.keys(entry).forEach(function(index2) {
        ordered.push([asArray(entry[index2]), index2]);
      });
      ordered.sort(function(a2, b) {
        return a2[0][0] - b[0][0];
      });
      for (index = 0; index < ordered.length; index++) {
        this.handleEntryPoint(ordered[index][1], ordered[index][0]);
      }
      this.xNumSteps = this.xSteps.slice(0);
      for (index = 0; index < this.xNumSteps.length; index++) {
        this.handleStepPoint(index, this.xNumSteps[index]);
      }
    }
    Spectrum2.prototype.getDistance = function(value) {
      var distances = [];
      for (var index = 0; index < this.xNumSteps.length - 1; index++) {
        distances[index] = fromPercentage(this.xVal, value, index);
      }
      return distances;
    };
    Spectrum2.prototype.getAbsoluteDistance = function(value, distances, direction) {
      var xPct_index = 0;
      if (value < this.xPct[this.xPct.length - 1]) {
        while (value > this.xPct[xPct_index + 1]) {
          xPct_index++;
        }
      } else if (value === this.xPct[this.xPct.length - 1]) {
        xPct_index = this.xPct.length - 2;
      }
      if (!direction && value === this.xPct[xPct_index + 1]) {
        xPct_index++;
      }
      if (distances === null) {
        distances = [];
      }
      var start_factor;
      var rest_factor = 1;
      var rest_rel_distance = distances[xPct_index];
      var range_pct = 0;
      var rel_range_distance = 0;
      var abs_distance_counter = 0;
      var range_counter = 0;
      if (direction) {
        start_factor = (value - this.xPct[xPct_index]) / (this.xPct[xPct_index + 1] - this.xPct[xPct_index]);
      } else {
        start_factor = (this.xPct[xPct_index + 1] - value) / (this.xPct[xPct_index + 1] - this.xPct[xPct_index]);
      }
      while (rest_rel_distance > 0) {
        range_pct = this.xPct[xPct_index + 1 + range_counter] - this.xPct[xPct_index + range_counter];
        if (distances[xPct_index + range_counter] * rest_factor + 100 - start_factor * 100 > 100) {
          rel_range_distance = range_pct * start_factor;
          rest_factor = (rest_rel_distance - 100 * start_factor) / distances[xPct_index + range_counter];
          start_factor = 1;
        } else {
          rel_range_distance = distances[xPct_index + range_counter] * range_pct / 100 * rest_factor;
          rest_factor = 0;
        }
        if (direction) {
          abs_distance_counter = abs_distance_counter - rel_range_distance;
          if (this.xPct.length + range_counter >= 1) {
            range_counter--;
          }
        } else {
          abs_distance_counter = abs_distance_counter + rel_range_distance;
          if (this.xPct.length - range_counter >= 1) {
            range_counter++;
          }
        }
        rest_rel_distance = distances[xPct_index + range_counter] * rest_factor;
      }
      return value + abs_distance_counter;
    };
    Spectrum2.prototype.toStepping = function(value) {
      value = toStepping(this.xVal, this.xPct, value);
      return value;
    };
    Spectrum2.prototype.fromStepping = function(value) {
      return fromStepping(this.xVal, this.xPct, value);
    };
    Spectrum2.prototype.getStep = function(value) {
      value = getStep(this.xPct, this.xSteps, this.snap, value);
      return value;
    };
    Spectrum2.prototype.getDefaultStep = function(value, isDown, size) {
      var j = getJ(value, this.xPct);
      if (value === 100 || isDown && value === this.xPct[j - 1]) {
        j = Math.max(j - 1, 1);
      }
      return (this.xVal[j] - this.xVal[j - 1]) / size;
    };
    Spectrum2.prototype.getNearbySteps = function(value) {
      var j = getJ(value, this.xPct);
      return {
        stepBefore: {
          startValue: this.xVal[j - 2],
          step: this.xNumSteps[j - 2],
          highestStep: this.xHighestCompleteStep[j - 2]
        },
        thisStep: {
          startValue: this.xVal[j - 1],
          step: this.xNumSteps[j - 1],
          highestStep: this.xHighestCompleteStep[j - 1]
        },
        stepAfter: {
          startValue: this.xVal[j],
          step: this.xNumSteps[j],
          highestStep: this.xHighestCompleteStep[j]
        }
      };
    };
    Spectrum2.prototype.countStepDecimals = function() {
      var stepDecimals = this.xNumSteps.map(countDecimals);
      return Math.max.apply(null, stepDecimals);
    };
    Spectrum2.prototype.hasNoSize = function() {
      return this.xVal[0] === this.xVal[this.xVal.length - 1];
    };
    Spectrum2.prototype.convert = function(value) {
      return this.getStep(this.toStepping(value));
    };
    Spectrum2.prototype.handleEntryPoint = function(index, value) {
      var percentage;
      if (index === "min") {
        percentage = 0;
      } else if (index === "max") {
        percentage = 100;
      } else {
        percentage = parseFloat(index);
      }
      if (!isNumeric(percentage) || !isNumeric(value[0])) {
        throw new Error("noUiSlider: 'range' value isn't numeric.");
      }
      this.xPct.push(percentage);
      this.xVal.push(value[0]);
      var value1 = Number(value[1]);
      if (!percentage) {
        if (!isNaN(value1)) {
          this.xSteps[0] = value1;
        }
      } else {
        this.xSteps.push(isNaN(value1) ? false : value1);
      }
      this.xHighestCompleteStep.push(0);
    };
    Spectrum2.prototype.handleStepPoint = function(i, n) {
      if (!n) {
        return;
      }
      if (this.xVal[i] === this.xVal[i + 1]) {
        this.xSteps[i] = this.xHighestCompleteStep[i] = this.xVal[i];
        return;
      }
      this.xSteps[i] = fromPercentage([this.xVal[i], this.xVal[i + 1]], n, 0) / subRangeRatio(this.xPct[i], this.xPct[i + 1]);
      var totalSteps = (this.xVal[i + 1] - this.xVal[i]) / this.xNumSteps[i];
      var highestStep = Math.ceil(Number(totalSteps.toFixed(3)) - 1);
      var step = this.xVal[i] + this.xNumSteps[i] * highestStep;
      this.xHighestCompleteStep[i] = step;
    };
    return Spectrum2;
  }()
);
var defaultFormatter = {
  to: function(value) {
    return value === void 0 ? "" : value.toFixed(2);
  },
  from: Number
};
var cssClasses = {
  target: "target",
  base: "base",
  origin: "origin",
  handle: "handle",
  handleLower: "handle-lower",
  handleUpper: "handle-upper",
  touchArea: "touch-area",
  horizontal: "horizontal",
  vertical: "vertical",
  background: "background",
  connect: "connect",
  connects: "connects",
  ltr: "ltr",
  rtl: "rtl",
  textDirectionLtr: "txt-dir-ltr",
  textDirectionRtl: "txt-dir-rtl",
  draggable: "draggable",
  drag: "state-drag",
  tap: "state-tap",
  active: "active",
  tooltip: "tooltip",
  pips: "pips",
  pipsHorizontal: "pips-horizontal",
  pipsVertical: "pips-vertical",
  marker: "marker",
  markerHorizontal: "marker-horizontal",
  markerVertical: "marker-vertical",
  markerNormal: "marker-normal",
  markerLarge: "marker-large",
  markerSub: "marker-sub",
  value: "value",
  valueHorizontal: "value-horizontal",
  valueVertical: "value-vertical",
  valueNormal: "value-normal",
  valueLarge: "value-large",
  valueSub: "value-sub"
};
var INTERNAL_EVENT_NS = {
  tooltips: ".__tooltips",
  aria: ".__aria"
};
function testStep(parsed, entry) {
  if (!isNumeric(entry)) {
    throw new Error("noUiSlider: 'step' is not numeric.");
  }
  parsed.singleStep = entry;
}
function testKeyboardPageMultiplier(parsed, entry) {
  if (!isNumeric(entry)) {
    throw new Error("noUiSlider: 'keyboardPageMultiplier' is not numeric.");
  }
  parsed.keyboardPageMultiplier = entry;
}
function testKeyboardMultiplier(parsed, entry) {
  if (!isNumeric(entry)) {
    throw new Error("noUiSlider: 'keyboardMultiplier' is not numeric.");
  }
  parsed.keyboardMultiplier = entry;
}
function testKeyboardDefaultStep(parsed, entry) {
  if (!isNumeric(entry)) {
    throw new Error("noUiSlider: 'keyboardDefaultStep' is not numeric.");
  }
  parsed.keyboardDefaultStep = entry;
}
function testRange(parsed, entry) {
  if (typeof entry !== "object" || Array.isArray(entry)) {
    throw new Error("noUiSlider: 'range' is not an object.");
  }
  if (entry.min === void 0 || entry.max === void 0) {
    throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.");
  }
  parsed.spectrum = new Spectrum(entry, parsed.snap || false, parsed.singleStep);
}
function testStart(parsed, entry) {
  entry = asArray(entry);
  if (!Array.isArray(entry) || !entry.length) {
    throw new Error("noUiSlider: 'start' option is incorrect.");
  }
  parsed.handles = entry.length;
  parsed.start = entry;
}
function testSnap(parsed, entry) {
  if (typeof entry !== "boolean") {
    throw new Error("noUiSlider: 'snap' option must be a boolean.");
  }
  parsed.snap = entry;
}
function testAnimate(parsed, entry) {
  if (typeof entry !== "boolean") {
    throw new Error("noUiSlider: 'animate' option must be a boolean.");
  }
  parsed.animate = entry;
}
function testAnimationDuration(parsed, entry) {
  if (typeof entry !== "number") {
    throw new Error("noUiSlider: 'animationDuration' option must be a number.");
  }
  parsed.animationDuration = entry;
}
function testConnect(parsed, entry) {
  var connect = [false];
  var i;
  if (entry === "lower") {
    entry = [true, false];
  } else if (entry === "upper") {
    entry = [false, true];
  }
  if (entry === true || entry === false) {
    for (i = 1; i < parsed.handles; i++) {
      connect.push(entry);
    }
    connect.push(false);
  } else if (!Array.isArray(entry) || !entry.length || entry.length !== parsed.handles + 1) {
    throw new Error("noUiSlider: 'connect' option doesn't match handle count.");
  } else {
    connect = entry;
  }
  parsed.connect = connect;
}
function testOrientation(parsed, entry) {
  switch (entry) {
    case "horizontal":
      parsed.ort = 0;
      break;
    case "vertical":
      parsed.ort = 1;
      break;
    default:
      throw new Error("noUiSlider: 'orientation' option is invalid.");
  }
}
function testMargin(parsed, entry) {
  if (!isNumeric(entry)) {
    throw new Error("noUiSlider: 'margin' option must be numeric.");
  }
  if (entry === 0) {
    return;
  }
  parsed.margin = parsed.spectrum.getDistance(entry);
}
function testLimit(parsed, entry) {
  if (!isNumeric(entry)) {
    throw new Error("noUiSlider: 'limit' option must be numeric.");
  }
  parsed.limit = parsed.spectrum.getDistance(entry);
  if (!parsed.limit || parsed.handles < 2) {
    throw new Error("noUiSlider: 'limit' option is only supported on linear sliders with 2 or more handles.");
  }
}
function testPadding(parsed, entry) {
  var index;
  if (!isNumeric(entry) && !Array.isArray(entry)) {
    throw new Error("noUiSlider: 'padding' option must be numeric or array of exactly 2 numbers.");
  }
  if (Array.isArray(entry) && !(entry.length === 2 || isNumeric(entry[0]) || isNumeric(entry[1]))) {
    throw new Error("noUiSlider: 'padding' option must be numeric or array of exactly 2 numbers.");
  }
  if (entry === 0) {
    return;
  }
  if (!Array.isArray(entry)) {
    entry = [entry, entry];
  }
  parsed.padding = [parsed.spectrum.getDistance(entry[0]), parsed.spectrum.getDistance(entry[1])];
  for (index = 0; index < parsed.spectrum.xNumSteps.length - 1; index++) {
    if (parsed.padding[0][index] < 0 || parsed.padding[1][index] < 0) {
      throw new Error("noUiSlider: 'padding' option must be a positive number(s).");
    }
  }
  var totalPadding = entry[0] + entry[1];
  var firstValue = parsed.spectrum.xVal[0];
  var lastValue = parsed.spectrum.xVal[parsed.spectrum.xVal.length - 1];
  if (totalPadding / (lastValue - firstValue) > 1) {
    throw new Error("noUiSlider: 'padding' option must not exceed 100% of the range.");
  }
}
function testDirection(parsed, entry) {
  switch (entry) {
    case "ltr":
      parsed.dir = 0;
      break;
    case "rtl":
      parsed.dir = 1;
      break;
    default:
      throw new Error("noUiSlider: 'direction' option was not recognized.");
  }
}
function testBehaviour(parsed, entry) {
  if (typeof entry !== "string") {
    throw new Error("noUiSlider: 'behaviour' must be a string containing options.");
  }
  var tap = entry.indexOf("tap") >= 0;
  var drag = entry.indexOf("drag") >= 0;
  var fixed = entry.indexOf("fixed") >= 0;
  var snap = entry.indexOf("snap") >= 0;
  var hover = entry.indexOf("hover") >= 0;
  var unconstrained = entry.indexOf("unconstrained") >= 0;
  var invertConnects = entry.indexOf("invert-connects") >= 0;
  var dragAll = entry.indexOf("drag-all") >= 0;
  var smoothSteps = entry.indexOf("smooth-steps") >= 0;
  if (fixed) {
    if (parsed.handles !== 2) {
      throw new Error("noUiSlider: 'fixed' behaviour must be used with 2 handles");
    }
    testMargin(parsed, parsed.start[1] - parsed.start[0]);
  }
  if (invertConnects && parsed.handles !== 2) {
    throw new Error("noUiSlider: 'invert-connects' behaviour must be used with 2 handles");
  }
  if (unconstrained && (parsed.margin || parsed.limit)) {
    throw new Error("noUiSlider: 'unconstrained' behaviour cannot be used with margin or limit");
  }
  parsed.events = {
    tap: tap || snap,
    drag,
    dragAll,
    smoothSteps,
    fixed,
    snap,
    hover,
    unconstrained,
    invertConnects
  };
}
function testTooltips(parsed, entry) {
  if (entry === false) {
    return;
  }
  if (entry === true || isValidPartialFormatter(entry)) {
    parsed.tooltips = [];
    for (var i = 0; i < parsed.handles; i++) {
      parsed.tooltips.push(entry);
    }
  } else {
    entry = asArray(entry);
    if (entry.length !== parsed.handles) {
      throw new Error("noUiSlider: must pass a formatter for all handles.");
    }
    entry.forEach(function(formatter) {
      if (typeof formatter !== "boolean" && !isValidPartialFormatter(formatter)) {
        throw new Error("noUiSlider: 'tooltips' must be passed a formatter or 'false'.");
      }
    });
    parsed.tooltips = entry;
  }
}
function testHandleAttributes(parsed, entry) {
  if (entry.length !== parsed.handles) {
    throw new Error("noUiSlider: must pass a attributes for all handles.");
  }
  parsed.handleAttributes = entry;
}
function testAriaFormat(parsed, entry) {
  if (!isValidPartialFormatter(entry)) {
    throw new Error("noUiSlider: 'ariaFormat' requires 'to' method.");
  }
  parsed.ariaFormat = entry;
}
function testFormat(parsed, entry) {
  if (!isValidFormatter(entry)) {
    throw new Error("noUiSlider: 'format' requires 'to' and 'from' methods.");
  }
  parsed.format = entry;
}
function testKeyboardSupport(parsed, entry) {
  if (typeof entry !== "boolean") {
    throw new Error("noUiSlider: 'keyboardSupport' option must be a boolean.");
  }
  parsed.keyboardSupport = entry;
}
function testDocumentElement(parsed, entry) {
  parsed.documentElement = entry;
}
function testCssPrefix(parsed, entry) {
  if (typeof entry !== "string" && entry !== false) {
    throw new Error("noUiSlider: 'cssPrefix' must be a string or `false`.");
  }
  parsed.cssPrefix = entry;
}
function testCssClasses(parsed, entry) {
  if (typeof entry !== "object") {
    throw new Error("noUiSlider: 'cssClasses' must be an object.");
  }
  if (typeof parsed.cssPrefix === "string") {
    parsed.cssClasses = {};
    Object.keys(entry).forEach(function(key) {
      parsed.cssClasses[key] = parsed.cssPrefix + entry[key];
    });
  } else {
    parsed.cssClasses = entry;
  }
}
function testOptions(options) {
  var parsed = {
    margin: null,
    limit: null,
    padding: null,
    animate: true,
    animationDuration: 300,
    ariaFormat: defaultFormatter,
    format: defaultFormatter
  };
  var tests = {
    step: { r: false, t: testStep },
    keyboardPageMultiplier: { r: false, t: testKeyboardPageMultiplier },
    keyboardMultiplier: { r: false, t: testKeyboardMultiplier },
    keyboardDefaultStep: { r: false, t: testKeyboardDefaultStep },
    start: { r: true, t: testStart },
    connect: { r: true, t: testConnect },
    direction: { r: true, t: testDirection },
    snap: { r: false, t: testSnap },
    animate: { r: false, t: testAnimate },
    animationDuration: { r: false, t: testAnimationDuration },
    range: { r: true, t: testRange },
    orientation: { r: false, t: testOrientation },
    margin: { r: false, t: testMargin },
    limit: { r: false, t: testLimit },
    padding: { r: false, t: testPadding },
    behaviour: { r: true, t: testBehaviour },
    ariaFormat: { r: false, t: testAriaFormat },
    format: { r: false, t: testFormat },
    tooltips: { r: false, t: testTooltips },
    keyboardSupport: { r: true, t: testKeyboardSupport },
    documentElement: { r: false, t: testDocumentElement },
    cssPrefix: { r: true, t: testCssPrefix },
    cssClasses: { r: true, t: testCssClasses },
    handleAttributes: { r: false, t: testHandleAttributes }
  };
  var defaults = {
    connect: false,
    direction: "ltr",
    behaviour: "tap",
    orientation: "horizontal",
    keyboardSupport: true,
    cssPrefix: "noUi-",
    cssClasses,
    keyboardPageMultiplier: 5,
    keyboardMultiplier: 1,
    keyboardDefaultStep: 10
  };
  if (options.format && !options.ariaFormat) {
    options.ariaFormat = options.format;
  }
  Object.keys(tests).forEach(function(name) {
    if (!isSet(options[name]) && defaults[name] === void 0) {
      if (tests[name].r) {
        throw new Error("noUiSlider: '" + name + "' is required.");
      }
      return;
    }
    tests[name].t(parsed, !isSet(options[name]) ? defaults[name] : options[name]);
  });
  parsed.pips = options.pips;
  var d = document.createElement("div");
  var msPrefix = d.style.msTransform !== void 0;
  var noPrefix = d.style.transform !== void 0;
  parsed.transformRule = noPrefix ? "transform" : msPrefix ? "msTransform" : "webkitTransform";
  var styles = [
    ["left", "top"],
    ["right", "bottom"]
  ];
  parsed.style = styles[parsed.dir][parsed.ort];
  return parsed;
}
function scope(target, options, originalOptions) {
  var actions = getActions();
  var supportsTouchActionNone = getSupportsTouchActionNone();
  var supportsPassive = supportsTouchActionNone && getSupportsPassive();
  var scope_Target = target;
  var scope_Base;
  var scope_ConnectBase;
  var scope_Handles;
  var scope_Connects;
  var scope_Pips;
  var scope_Tooltips;
  var scope_Spectrum = options.spectrum;
  var scope_Values = [];
  var scope_Locations = [];
  var scope_HandleNumbers = [];
  var scope_ActiveHandlesCount = 0;
  var scope_Events = {};
  var scope_ConnectsInverted = false;
  var scope_Document = target.ownerDocument;
  var scope_DocumentElement = options.documentElement || scope_Document.documentElement;
  var scope_Body = scope_Document.body;
  var scope_DirOffset = scope_Document.dir === "rtl" || options.ort === 1 ? 0 : 100;
  function addNodeTo(addTarget, className) {
    var div = scope_Document.createElement("div");
    if (className) {
      addClass(div, className);
    }
    addTarget.appendChild(div);
    return div;
  }
  function addOrigin(base, handleNumber) {
    var origin = addNodeTo(base, options.cssClasses.origin);
    var handle = addNodeTo(origin, options.cssClasses.handle);
    addNodeTo(handle, options.cssClasses.touchArea);
    handle.setAttribute("data-handle", String(handleNumber));
    if (options.keyboardSupport) {
      handle.setAttribute("tabindex", "0");
      handle.addEventListener("keydown", function(event) {
        return eventKeydown(event, handleNumber);
      });
    }
    if (options.handleAttributes !== void 0) {
      var attributes_1 = options.handleAttributes[handleNumber];
      Object.keys(attributes_1).forEach(function(attribute) {
        handle.setAttribute(attribute, attributes_1[attribute]);
      });
    }
    handle.setAttribute("role", "slider");
    handle.setAttribute("aria-orientation", options.ort ? "vertical" : "horizontal");
    if (handleNumber === 0) {
      addClass(handle, options.cssClasses.handleLower);
    } else if (handleNumber === options.handles - 1) {
      addClass(handle, options.cssClasses.handleUpper);
    }
    origin.handle = handle;
    return origin;
  }
  function addConnect(base, add) {
    if (!add) {
      return false;
    }
    return addNodeTo(base, options.cssClasses.connect);
  }
  function addElements(connectOptions, base) {
    scope_ConnectBase = addNodeTo(base, options.cssClasses.connects);
    scope_Handles = [];
    scope_Connects = [];
    scope_Connects.push(addConnect(scope_ConnectBase, connectOptions[0]));
    for (var i = 0; i < options.handles; i++) {
      scope_Handles.push(addOrigin(base, i));
      scope_HandleNumbers[i] = i;
      scope_Connects.push(addConnect(scope_ConnectBase, connectOptions[i + 1]));
    }
  }
  function addSlider(addTarget) {
    addClass(addTarget, options.cssClasses.target);
    if (options.dir === 0) {
      addClass(addTarget, options.cssClasses.ltr);
    } else {
      addClass(addTarget, options.cssClasses.rtl);
    }
    if (options.ort === 0) {
      addClass(addTarget, options.cssClasses.horizontal);
    } else {
      addClass(addTarget, options.cssClasses.vertical);
    }
    var textDirection = getComputedStyle(addTarget).direction;
    if (textDirection === "rtl") {
      addClass(addTarget, options.cssClasses.textDirectionRtl);
    } else {
      addClass(addTarget, options.cssClasses.textDirectionLtr);
    }
    return addNodeTo(addTarget, options.cssClasses.base);
  }
  function addTooltip(handle, handleNumber) {
    if (!options.tooltips || !options.tooltips[handleNumber]) {
      return false;
    }
    return addNodeTo(handle.firstChild, options.cssClasses.tooltip);
  }
  function isSliderDisabled() {
    return scope_Target.hasAttribute("disabled");
  }
  function isHandleDisabled(handleNumber) {
    var handleOrigin = scope_Handles[handleNumber];
    return handleOrigin.hasAttribute("disabled");
  }
  function disable(handleNumber) {
    if (handleNumber !== null && handleNumber !== void 0) {
      scope_Handles[handleNumber].setAttribute("disabled", "");
      scope_Handles[handleNumber].handle.removeAttribute("tabindex");
    } else {
      scope_Target.setAttribute("disabled", "");
      scope_Handles.forEach(function(handle) {
        handle.handle.removeAttribute("tabindex");
      });
    }
  }
  function enable(handleNumber) {
    if (handleNumber !== null && handleNumber !== void 0) {
      scope_Handles[handleNumber].removeAttribute("disabled");
      scope_Handles[handleNumber].handle.setAttribute("tabindex", "0");
    } else {
      scope_Target.removeAttribute("disabled");
      scope_Handles.forEach(function(handle) {
        handle.removeAttribute("disabled");
        handle.handle.setAttribute("tabindex", "0");
      });
    }
  }
  function removeTooltips() {
    if (scope_Tooltips) {
      removeEvent("update" + INTERNAL_EVENT_NS.tooltips);
      scope_Tooltips.forEach(function(tooltip) {
        if (tooltip) {
          removeElement(tooltip);
        }
      });
      scope_Tooltips = null;
    }
  }
  function tooltips() {
    removeTooltips();
    scope_Tooltips = scope_Handles.map(addTooltip);
    bindEvent("update" + INTERNAL_EVENT_NS.tooltips, function(values, handleNumber, unencoded) {
      if (!scope_Tooltips || !options.tooltips) {
        return;
      }
      if (scope_Tooltips[handleNumber] === false) {
        return;
      }
      var formattedValue = values[handleNumber];
      if (options.tooltips[handleNumber] !== true) {
        formattedValue = options.tooltips[handleNumber].to(unencoded[handleNumber]);
      }
      scope_Tooltips[handleNumber].innerHTML = formattedValue;
    });
  }
  function aria() {
    removeEvent("update" + INTERNAL_EVENT_NS.aria);
    bindEvent("update" + INTERNAL_EVENT_NS.aria, function(values, handleNumber, unencoded, tap, positions) {
      scope_HandleNumbers.forEach(function(index) {
        var handle = scope_Handles[index];
        var min = checkHandlePosition(scope_Locations, index, 0, true, true, true);
        var max = checkHandlePosition(scope_Locations, index, 100, true, true, true);
        var now = positions[index];
        var text = String(options.ariaFormat.to(unencoded[index]));
        min = scope_Spectrum.fromStepping(min).toFixed(1);
        max = scope_Spectrum.fromStepping(max).toFixed(1);
        now = scope_Spectrum.fromStepping(now).toFixed(1);
        handle.children[0].setAttribute("aria-valuemin", min);
        handle.children[0].setAttribute("aria-valuemax", max);
        handle.children[0].setAttribute("aria-valuenow", now);
        handle.children[0].setAttribute("aria-valuetext", text);
      });
    });
  }
  function getGroup(pips2) {
    if (pips2.mode === PipsMode.Range || pips2.mode === PipsMode.Steps) {
      return scope_Spectrum.xVal;
    }
    if (pips2.mode === PipsMode.Count) {
      if (pips2.values < 2) {
        throw new Error("noUiSlider: 'values' (>= 2) required for mode 'count'.");
      }
      var interval = pips2.values - 1;
      var spread = 100 / interval;
      var values = [];
      while (interval--) {
        values[interval] = interval * spread;
      }
      values.push(100);
      return mapToRange(values, pips2.stepped);
    }
    if (pips2.mode === PipsMode.Positions) {
      return mapToRange(pips2.values, pips2.stepped);
    }
    if (pips2.mode === PipsMode.Values) {
      if (pips2.stepped) {
        return pips2.values.map(function(value) {
          return scope_Spectrum.fromStepping(scope_Spectrum.getStep(scope_Spectrum.toStepping(value)));
        });
      }
      return pips2.values;
    }
    return [];
  }
  function mapToRange(values, stepped) {
    return values.map(function(value) {
      return scope_Spectrum.fromStepping(stepped ? scope_Spectrum.getStep(value) : value);
    });
  }
  function generateSpread(pips2) {
    function safeIncrement(value, increment) {
      return Number((value + increment).toFixed(7));
    }
    var group = getGroup(pips2);
    var indexes = {};
    var firstInRange = scope_Spectrum.xVal[0];
    var lastInRange = scope_Spectrum.xVal[scope_Spectrum.xVal.length - 1];
    var ignoreFirst = false;
    var ignoreLast = false;
    var prevPct = 0;
    group = unique(group.slice().sort(function(a2, b) {
      return a2 - b;
    }));
    if (group[0] !== firstInRange) {
      group.unshift(firstInRange);
      ignoreFirst = true;
    }
    if (group[group.length - 1] !== lastInRange) {
      group.push(lastInRange);
      ignoreLast = true;
    }
    group.forEach(function(current, index) {
      var step;
      var i;
      var q;
      var low = current;
      var high = group[index + 1];
      var newPct;
      var pctDifference;
      var pctPos;
      var type;
      var steps;
      var realSteps;
      var stepSize;
      var isSteps = pips2.mode === PipsMode.Steps;
      if (isSteps) {
        step = scope_Spectrum.xNumSteps[index];
      }
      if (!step) {
        step = high - low;
      }
      if (high === void 0) {
        high = low;
      }
      step = Math.max(step, 1e-7);
      for (i = low; i <= high; i = safeIncrement(i, step)) {
        newPct = scope_Spectrum.toStepping(i);
        pctDifference = newPct - prevPct;
        steps = pctDifference / (pips2.density || 1);
        realSteps = Math.round(steps);
        stepSize = pctDifference / realSteps;
        for (q = 1; q <= realSteps; q += 1) {
          pctPos = prevPct + q * stepSize;
          indexes[pctPos.toFixed(5)] = [scope_Spectrum.fromStepping(pctPos), 0];
        }
        type = group.indexOf(i) > -1 ? PipsType.LargeValue : isSteps ? PipsType.SmallValue : PipsType.NoValue;
        if (!index && ignoreFirst && i !== high) {
          type = 0;
        }
        if (!(i === high && ignoreLast)) {
          indexes[newPct.toFixed(5)] = [i, type];
        }
        prevPct = newPct;
      }
    });
    return indexes;
  }
  function addMarking(spread, filterFunc, formatter) {
    var _a, _b;
    var element = scope_Document.createElement("div");
    var valueSizeClasses = (_a = {}, _a[PipsType.None] = "", _a[PipsType.NoValue] = options.cssClasses.valueNormal, _a[PipsType.LargeValue] = options.cssClasses.valueLarge, _a[PipsType.SmallValue] = options.cssClasses.valueSub, _a);
    var markerSizeClasses = (_b = {}, _b[PipsType.None] = "", _b[PipsType.NoValue] = options.cssClasses.markerNormal, _b[PipsType.LargeValue] = options.cssClasses.markerLarge, _b[PipsType.SmallValue] = options.cssClasses.markerSub, _b);
    var valueOrientationClasses = [options.cssClasses.valueHorizontal, options.cssClasses.valueVertical];
    var markerOrientationClasses = [options.cssClasses.markerHorizontal, options.cssClasses.markerVertical];
    addClass(element, options.cssClasses.pips);
    addClass(element, options.ort === 0 ? options.cssClasses.pipsHorizontal : options.cssClasses.pipsVertical);
    function getClasses(type, source) {
      var a2 = source === options.cssClasses.value;
      var orientationClasses = a2 ? valueOrientationClasses : markerOrientationClasses;
      var sizeClasses = a2 ? valueSizeClasses : markerSizeClasses;
      return source + " " + orientationClasses[options.ort] + " " + sizeClasses[type];
    }
    function addSpread(offset2, value, type) {
      type = filterFunc ? filterFunc(value, type) : type;
      if (type === PipsType.None) {
        return;
      }
      var node = addNodeTo(element, false);
      node.className = getClasses(type, options.cssClasses.marker);
      node.style[options.style] = offset2 + "%";
      if (type > PipsType.NoValue) {
        node = addNodeTo(element, false);
        node.className = getClasses(type, options.cssClasses.value);
        node.setAttribute("data-value", String(value));
        node.style[options.style] = offset2 + "%";
        node.innerHTML = String(formatter.to(value));
      }
    }
    Object.keys(spread).forEach(function(offset2) {
      addSpread(offset2, spread[offset2][0], spread[offset2][1]);
    });
    return element;
  }
  function removePips() {
    if (scope_Pips) {
      removeElement(scope_Pips);
      scope_Pips = null;
    }
  }
  function pips(pips2) {
    removePips();
    var spread = generateSpread(pips2);
    var filter = pips2.filter;
    var format = pips2.format || {
      to: function(value) {
        return String(Math.round(value));
      }
    };
    scope_Pips = scope_Target.appendChild(addMarking(spread, filter, format));
    return scope_Pips;
  }
  function baseSize() {
    var rect = scope_Base.getBoundingClientRect();
    var alt = "offset" + ["Width", "Height"][options.ort];
    return options.ort === 0 ? rect.width || scope_Base[alt] : rect.height || scope_Base[alt];
  }
  function attachEvent(events, element, callback, data) {
    var method = function(event) {
      var e = fixEvent(event, data.pageOffset, data.target || element);
      if (!e) {
        return false;
      }
      if (isSliderDisabled() && !data.doNotReject) {
        return false;
      }
      if (hasClass(scope_Target, options.cssClasses.tap) && !data.doNotReject) {
        return false;
      }
      if (events === actions.start && e.buttons !== void 0 && e.buttons > 1) {
        return false;
      }
      if (data.hover && e.buttons) {
        return false;
      }
      if (!supportsPassive) {
        e.preventDefault();
      }
      e.calcPoint = e.points[options.ort];
      callback(e, data);
      return;
    };
    var methods = [];
    events.split(" ").forEach(function(eventName) {
      element.addEventListener(eventName, method, supportsPassive ? { passive: true } : false);
      methods.push([eventName, method]);
    });
    return methods;
  }
  function fixEvent(e, pageOffset, eventTarget) {
    var touch = e.type.indexOf("touch") === 0;
    var mouse = e.type.indexOf("mouse") === 0;
    var pointer = e.type.indexOf("pointer") === 0;
    var x = 0;
    var y = 0;
    if (e.type.indexOf("MSPointer") === 0) {
      pointer = true;
    }
    if (e.type === "mousedown" && !e.buttons && !e.touches) {
      return false;
    }
    if (touch) {
      var isTouchOnTarget = function(checkTouch) {
        var target2 = checkTouch.target;
        return target2 === eventTarget || eventTarget.contains(target2) || e.composed && e.composedPath().shift() === eventTarget;
      };
      if (e.type === "touchstart") {
        var targetTouches = Array.prototype.filter.call(e.touches, isTouchOnTarget);
        if (targetTouches.length > 1) {
          return false;
        }
        x = targetTouches[0].pageX;
        y = targetTouches[0].pageY;
      } else {
        var targetTouch = Array.prototype.find.call(e.changedTouches, isTouchOnTarget);
        if (!targetTouch) {
          return false;
        }
        x = targetTouch.pageX;
        y = targetTouch.pageY;
      }
    }
    pageOffset = pageOffset || getPageOffset(scope_Document);
    if (mouse || pointer) {
      x = e.clientX + pageOffset.x;
      y = e.clientY + pageOffset.y;
    }
    e.pageOffset = pageOffset;
    e.points = [x, y];
    e.cursor = mouse || pointer;
    return e;
  }
  function calcPointToPercentage(calcPoint) {
    var location = calcPoint - offset(scope_Base, options.ort);
    var proposal = location * 100 / baseSize();
    proposal = limit(proposal);
    return options.dir ? 100 - proposal : proposal;
  }
  function getClosestHandle(clickedPosition) {
    var smallestDifference = 100;
    var handleNumber = false;
    scope_Handles.forEach(function(handle, index) {
      if (isHandleDisabled(index)) {
        return;
      }
      var handlePosition = scope_Locations[index];
      var differenceWithThisHandle = Math.abs(handlePosition - clickedPosition);
      var clickAtEdge = differenceWithThisHandle === 100 && smallestDifference === 100;
      var isCloser = differenceWithThisHandle < smallestDifference;
      var isCloserAfter = differenceWithThisHandle <= smallestDifference && clickedPosition > handlePosition;
      if (isCloser || isCloserAfter || clickAtEdge) {
        handleNumber = index;
        smallestDifference = differenceWithThisHandle;
      }
    });
    return handleNumber;
  }
  function documentLeave(event, data) {
    if (event.type === "mouseout" && event.target.nodeName === "HTML" && event.relatedTarget === null) {
      eventEnd(event, data);
    }
  }
  function eventMove(event, data) {
    if (navigator.appVersion.indexOf("MSIE 9") === -1 && event.buttons === 0 && data.buttonsProperty !== 0) {
      return eventEnd(event, data);
    }
    var movement = (options.dir ? -1 : 1) * (event.calcPoint - data.startCalcPoint);
    var proposal = movement * 100 / data.baseSize;
    moveHandles(movement > 0, proposal, data.locations, data.handleNumbers, data.connect);
  }
  function eventEnd(event, data) {
    if (data.handle) {
      removeClass(data.handle, options.cssClasses.active);
      scope_ActiveHandlesCount -= 1;
    }
    data.listeners.forEach(function(c) {
      scope_DocumentElement.removeEventListener(c[0], c[1]);
    });
    if (scope_ActiveHandlesCount === 0) {
      removeClass(scope_Target, options.cssClasses.drag);
      setZindex();
      if (event.cursor) {
        scope_Body.style.cursor = "";
        scope_Body.removeEventListener("selectstart", preventDefault);
      }
    }
    if (options.events.smoothSteps) {
      data.handleNumbers.forEach(function(handleNumber) {
        setHandle(handleNumber, scope_Locations[handleNumber], true, true, false, false);
      });
      data.handleNumbers.forEach(function(handleNumber) {
        fireEvent("update", handleNumber);
      });
    }
    data.handleNumbers.forEach(function(handleNumber) {
      fireEvent("change", handleNumber);
      fireEvent("set", handleNumber);
      fireEvent("end", handleNumber);
    });
  }
  function eventStart(event, data) {
    if (data.handleNumbers.some(isHandleDisabled)) {
      return;
    }
    var handle;
    if (data.handleNumbers.length === 1) {
      var handleOrigin = scope_Handles[data.handleNumbers[0]];
      handle = handleOrigin.children[0];
      scope_ActiveHandlesCount += 1;
      addClass(handle, options.cssClasses.active);
    }
    event.stopPropagation();
    var listeners = [];
    var moveEvent = attachEvent(actions.move, scope_DocumentElement, eventMove, {
      // The event target has changed so we need to propagate the original one so that we keep
      // relying on it to extract target touches.
      target: event.target,
      handle,
      connect: data.connect,
      listeners,
      startCalcPoint: event.calcPoint,
      baseSize: baseSize(),
      pageOffset: event.pageOffset,
      handleNumbers: data.handleNumbers,
      buttonsProperty: event.buttons,
      locations: scope_Locations.slice()
    });
    var endEvent = attachEvent(actions.end, scope_DocumentElement, eventEnd, {
      target: event.target,
      handle,
      listeners,
      doNotReject: true,
      handleNumbers: data.handleNumbers
    });
    var outEvent = attachEvent("mouseout", scope_DocumentElement, documentLeave, {
      target: event.target,
      handle,
      listeners,
      doNotReject: true,
      handleNumbers: data.handleNumbers
    });
    listeners.push.apply(listeners, moveEvent.concat(endEvent, outEvent));
    if (event.cursor) {
      scope_Body.style.cursor = getComputedStyle(event.target).cursor;
      if (scope_Handles.length > 1) {
        addClass(scope_Target, options.cssClasses.drag);
      }
      scope_Body.addEventListener("selectstart", preventDefault, false);
    }
    data.handleNumbers.forEach(function(handleNumber) {
      fireEvent("start", handleNumber);
    });
  }
  function eventTap(event) {
    event.stopPropagation();
    var proposal = calcPointToPercentage(event.calcPoint);
    var handleNumber = getClosestHandle(proposal);
    if (handleNumber === false) {
      return;
    }
    if (!options.events.snap) {
      addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
    }
    setHandle(handleNumber, proposal, true, true);
    setZindex();
    fireEvent("slide", handleNumber, true);
    fireEvent("update", handleNumber, true);
    if (!options.events.snap) {
      fireEvent("change", handleNumber, true);
      fireEvent("set", handleNumber, true);
    } else {
      eventStart(event, { handleNumbers: [handleNumber] });
    }
  }
  function eventHover(event) {
    var proposal = calcPointToPercentage(event.calcPoint);
    var to = scope_Spectrum.getStep(proposal);
    var value = scope_Spectrum.fromStepping(to);
    Object.keys(scope_Events).forEach(function(targetEvent) {
      if ("hover" === targetEvent.split(".")[0]) {
        scope_Events[targetEvent].forEach(function(callback) {
          callback.call(scope_Self, value);
        });
      }
    });
  }
  function eventKeydown(event, handleNumber) {
    if (isSliderDisabled() || isHandleDisabled(handleNumber)) {
      return false;
    }
    var horizontalKeys = ["Left", "Right"];
    var verticalKeys = ["Down", "Up"];
    var largeStepKeys = ["PageDown", "PageUp"];
    var edgeKeys = ["Home", "End"];
    if (options.dir && !options.ort) {
      horizontalKeys.reverse();
    } else if (options.ort && !options.dir) {
      verticalKeys.reverse();
      largeStepKeys.reverse();
    }
    var key = event.key.replace("Arrow", "");
    var isLargeDown = key === largeStepKeys[0];
    var isLargeUp = key === largeStepKeys[1];
    var isDown = key === verticalKeys[0] || key === horizontalKeys[0] || isLargeDown;
    var isUp = key === verticalKeys[1] || key === horizontalKeys[1] || isLargeUp;
    var isMin = key === edgeKeys[0];
    var isMax = key === edgeKeys[1];
    if (!isDown && !isUp && !isMin && !isMax) {
      return true;
    }
    event.preventDefault();
    var to;
    if (isUp || isDown) {
      var direction = isDown ? 0 : 1;
      var steps = getNextStepsForHandle(handleNumber);
      var step = steps[direction];
      if (step === null) {
        return false;
      }
      if (step === false) {
        step = scope_Spectrum.getDefaultStep(scope_Locations[handleNumber], isDown, options.keyboardDefaultStep);
      }
      if (isLargeUp || isLargeDown) {
        step *= options.keyboardPageMultiplier;
      } else {
        step *= options.keyboardMultiplier;
      }
      step = Math.max(step, 1e-7);
      step = (isDown ? -1 : 1) * step;
      to = scope_Values[handleNumber] + step;
    } else if (isMax) {
      to = options.spectrum.xVal[options.spectrum.xVal.length - 1];
    } else {
      to = options.spectrum.xVal[0];
    }
    setHandle(handleNumber, scope_Spectrum.toStepping(to), true, true);
    fireEvent("slide", handleNumber);
    fireEvent("update", handleNumber);
    fireEvent("change", handleNumber);
    fireEvent("set", handleNumber);
    return false;
  }
  function bindSliderEvents(behaviour) {
    if (!behaviour.fixed) {
      scope_Handles.forEach(function(handle, index) {
        attachEvent(actions.start, handle.children[0], eventStart, {
          handleNumbers: [index]
        });
      });
    }
    if (behaviour.tap) {
      attachEvent(actions.start, scope_Base, eventTap, {});
    }
    if (behaviour.hover) {
      attachEvent(actions.move, scope_Base, eventHover, {
        hover: true
      });
    }
    if (behaviour.drag) {
      scope_Connects.forEach(function(connect, index) {
        if (connect === false || index === 0 || index === scope_Connects.length - 1) {
          return;
        }
        var handleBefore = scope_Handles[index - 1];
        var handleAfter = scope_Handles[index];
        var eventHolders = [connect];
        var handlesToDrag = [handleBefore, handleAfter];
        var handleNumbersToDrag = [index - 1, index];
        addClass(connect, options.cssClasses.draggable);
        if (behaviour.fixed) {
          eventHolders.push(handleBefore.children[0]);
          eventHolders.push(handleAfter.children[0]);
        }
        if (behaviour.dragAll) {
          handlesToDrag = scope_Handles;
          handleNumbersToDrag = scope_HandleNumbers;
        }
        eventHolders.forEach(function(eventHolder) {
          attachEvent(actions.start, eventHolder, eventStart, {
            handles: handlesToDrag,
            handleNumbers: handleNumbersToDrag,
            connect
          });
        });
      });
    }
  }
  function bindEvent(namespacedEvent, callback) {
    scope_Events[namespacedEvent] = scope_Events[namespacedEvent] || [];
    scope_Events[namespacedEvent].push(callback);
    if (namespacedEvent.split(".")[0] === "update") {
      scope_Handles.forEach(function(a2, index) {
        fireEvent("update", index);
      });
    }
  }
  function isInternalNamespace(namespace) {
    return namespace === INTERNAL_EVENT_NS.aria || namespace === INTERNAL_EVENT_NS.tooltips;
  }
  function removeEvent(namespacedEvent) {
    var event = namespacedEvent && namespacedEvent.split(".")[0];
    var namespace = event ? namespacedEvent.substring(event.length) : namespacedEvent;
    Object.keys(scope_Events).forEach(function(bind) {
      var tEvent = bind.split(".")[0];
      var tNamespace = bind.substring(tEvent.length);
      if ((!event || event === tEvent) && (!namespace || namespace === tNamespace)) {
        if (!isInternalNamespace(tNamespace) || namespace === tNamespace) {
          delete scope_Events[bind];
        }
      }
    });
  }
  function fireEvent(eventName, handleNumber, tap) {
    Object.keys(scope_Events).forEach(function(targetEvent) {
      var eventType = targetEvent.split(".")[0];
      if (eventName === eventType) {
        scope_Events[targetEvent].forEach(function(callback) {
          callback.call(
            // Use the slider public API as the scope ('this')
            scope_Self,
            // Return values as array, so arg_1[arg_2] is always valid.
            scope_Values.map(options.format.to),
            // Handle index, 0 or 1
            handleNumber,
            // Un-formatted slider values
            scope_Values.slice(),
            // Event is fired by tap, true or false
            tap || false,
            // Left offset of the handle, in relation to the slider
            scope_Locations.slice(),
            // add the slider public API to an accessible parameter when this is unavailable
            scope_Self
          );
        });
      }
    });
  }
  function checkHandlePosition(reference, handleNumber, to, lookBackward, lookForward, getValue, smoothSteps) {
    var distance;
    if (scope_Handles.length > 1 && !options.events.unconstrained) {
      if (lookBackward && handleNumber > 0) {
        distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber - 1], options.margin, false);
        to = Math.max(to, distance);
      }
      if (lookForward && handleNumber < scope_Handles.length - 1) {
        distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber + 1], options.margin, true);
        to = Math.min(to, distance);
      }
    }
    if (scope_Handles.length > 1 && options.limit) {
      if (lookBackward && handleNumber > 0) {
        distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber - 1], options.limit, false);
        to = Math.min(to, distance);
      }
      if (lookForward && handleNumber < scope_Handles.length - 1) {
        distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber + 1], options.limit, true);
        to = Math.max(to, distance);
      }
    }
    if (options.padding) {
      if (handleNumber === 0) {
        distance = scope_Spectrum.getAbsoluteDistance(0, options.padding[0], false);
        to = Math.max(to, distance);
      }
      if (handleNumber === scope_Handles.length - 1) {
        distance = scope_Spectrum.getAbsoluteDistance(100, options.padding[1], true);
        to = Math.min(to, distance);
      }
    }
    if (!smoothSteps) {
      to = scope_Spectrum.getStep(to);
    }
    to = limit(to);
    if (to === reference[handleNumber] && !getValue) {
      return false;
    }
    return to;
  }
  function inRuleOrder(v, a2) {
    var o = options.ort;
    return (o ? a2 : v) + ", " + (o ? v : a2);
  }
  function moveHandles(upward, proposal, locations, handleNumbers, connect) {
    var proposals = locations.slice();
    var firstHandle = handleNumbers[0];
    var smoothSteps = options.events.smoothSteps;
    var b = [!upward, upward];
    var f = [upward, !upward];
    handleNumbers = handleNumbers.slice();
    if (upward) {
      handleNumbers.reverse();
    }
    if (handleNumbers.length > 1) {
      handleNumbers.forEach(function(handleNumber, o) {
        var to = checkHandlePosition(proposals, handleNumber, proposals[handleNumber] + proposal, b[o], f[o], false, smoothSteps);
        if (to === false) {
          proposal = 0;
        } else {
          proposal = to - proposals[handleNumber];
          proposals[handleNumber] = to;
        }
      });
    } else {
      b = f = [true];
    }
    var state = false;
    handleNumbers.forEach(function(handleNumber, o) {
      state = setHandle(handleNumber, locations[handleNumber] + proposal, b[o], f[o], false, smoothSteps) || state;
    });
    if (state) {
      handleNumbers.forEach(function(handleNumber) {
        fireEvent("update", handleNumber);
        fireEvent("slide", handleNumber);
      });
      if (connect != void 0) {
        fireEvent("drag", firstHandle);
      }
    }
  }
  function transformDirection(a2, b) {
    return options.dir ? 100 - a2 - b : a2;
  }
  function updateHandlePosition(handleNumber, to) {
    scope_Locations[handleNumber] = to;
    scope_Values[handleNumber] = scope_Spectrum.fromStepping(to);
    var translation = transformDirection(to, 0) - scope_DirOffset;
    var translateRule = "translate(" + inRuleOrder(translation + "%", "0") + ")";
    scope_Handles[handleNumber].style[options.transformRule] = translateRule;
    if (options.events.invertConnects && scope_Locations.length > 1) {
      var handlesAreInOrder = scope_Locations.every(function(position, index, locations) {
        return index === 0 || position >= locations[index - 1];
      });
      if (scope_ConnectsInverted !== !handlesAreInOrder) {
        invertConnects();
        return;
      }
    }
    updateConnect(handleNumber);
    updateConnect(handleNumber + 1);
    if (scope_ConnectsInverted) {
      updateConnect(handleNumber - 1);
      updateConnect(handleNumber + 2);
    }
  }
  function setZindex() {
    scope_HandleNumbers.forEach(function(handleNumber) {
      var dir = scope_Locations[handleNumber] > 50 ? -1 : 1;
      var zIndex = 3 + (scope_Handles.length + dir * handleNumber);
      scope_Handles[handleNumber].style.zIndex = String(zIndex);
    });
  }
  function setHandle(handleNumber, to, lookBackward, lookForward, exactInput, smoothSteps) {
    if (!exactInput) {
      to = checkHandlePosition(scope_Locations, handleNumber, to, lookBackward, lookForward, false, smoothSteps);
    }
    if (to === false) {
      return false;
    }
    updateHandlePosition(handleNumber, to);
    return true;
  }
  function updateConnect(index) {
    if (!scope_Connects[index]) {
      return;
    }
    var locations = scope_Locations.slice();
    if (scope_ConnectsInverted) {
      locations.sort(function(a2, b) {
        return a2 - b;
      });
    }
    var l = 0;
    var h2 = 100;
    if (index !== 0) {
      l = locations[index - 1];
    }
    if (index !== scope_Connects.length - 1) {
      h2 = locations[index];
    }
    var connectWidth = h2 - l;
    var translateRule = "translate(" + inRuleOrder(transformDirection(l, connectWidth) + "%", "0") + ")";
    var scaleRule = "scale(" + inRuleOrder(connectWidth / 100, "1") + ")";
    scope_Connects[index].style[options.transformRule] = translateRule + " " + scaleRule;
  }
  function resolveToValue(to, handleNumber) {
    if (to === null || to === false || to === void 0) {
      return scope_Locations[handleNumber];
    }
    if (typeof to === "number") {
      to = String(to);
    }
    to = options.format.from(to);
    if (to !== false) {
      to = scope_Spectrum.toStepping(to);
    }
    if (to === false || isNaN(to)) {
      return scope_Locations[handleNumber];
    }
    return to;
  }
  function valueSet(input, fireSetEvent, exactInput) {
    var values = asArray(input);
    var isInit = scope_Locations[0] === void 0;
    fireSetEvent = fireSetEvent === void 0 ? true : fireSetEvent;
    if (options.animate && !isInit) {
      addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
    }
    scope_HandleNumbers.forEach(function(handleNumber) {
      setHandle(handleNumber, resolveToValue(values[handleNumber], handleNumber), true, false, exactInput);
    });
    var i = scope_HandleNumbers.length === 1 ? 0 : 1;
    if (isInit && scope_Spectrum.hasNoSize()) {
      exactInput = true;
      scope_Locations[0] = 0;
      if (scope_HandleNumbers.length > 1) {
        var space_1 = 100 / (scope_HandleNumbers.length - 1);
        scope_HandleNumbers.forEach(function(handleNumber) {
          scope_Locations[handleNumber] = handleNumber * space_1;
        });
      }
    }
    for (; i < scope_HandleNumbers.length; ++i) {
      scope_HandleNumbers.forEach(function(handleNumber) {
        setHandle(handleNumber, scope_Locations[handleNumber], true, true, exactInput);
      });
    }
    setZindex();
    scope_HandleNumbers.forEach(function(handleNumber) {
      fireEvent("update", handleNumber);
      if (values[handleNumber] !== null && fireSetEvent) {
        fireEvent("set", handleNumber);
      }
    });
  }
  function valueReset(fireSetEvent) {
    valueSet(options.start, fireSetEvent);
  }
  function valueSetHandle(handleNumber, value, fireSetEvent, exactInput) {
    handleNumber = Number(handleNumber);
    if (!(handleNumber >= 0 && handleNumber < scope_HandleNumbers.length)) {
      throw new Error("noUiSlider: invalid handle number, got: " + handleNumber);
    }
    setHandle(handleNumber, resolveToValue(value, handleNumber), true, true, exactInput);
    fireEvent("update", handleNumber);
    if (fireSetEvent) {
      fireEvent("set", handleNumber);
    }
  }
  function valueGet(unencoded) {
    if (unencoded === void 0) {
      unencoded = false;
    }
    if (unencoded) {
      return scope_Values.length === 1 ? scope_Values[0] : scope_Values.slice(0);
    }
    var values = scope_Values.map(options.format.to);
    if (values.length === 1) {
      return values[0];
    }
    return values;
  }
  function destroy() {
    removeEvent(INTERNAL_EVENT_NS.aria);
    removeEvent(INTERNAL_EVENT_NS.tooltips);
    Object.keys(options.cssClasses).forEach(function(key) {
      removeClass(scope_Target, options.cssClasses[key]);
    });
    while (scope_Target.firstChild) {
      scope_Target.removeChild(scope_Target.firstChild);
    }
    delete scope_Target.noUiSlider;
  }
  function getNextStepsForHandle(handleNumber) {
    var location = scope_Locations[handleNumber];
    var nearbySteps = scope_Spectrum.getNearbySteps(location);
    var value = scope_Values[handleNumber];
    var increment = nearbySteps.thisStep.step;
    var decrement = null;
    if (options.snap) {
      return [
        value - nearbySteps.stepBefore.startValue || null,
        nearbySteps.stepAfter.startValue - value || null
      ];
    }
    if (increment !== false) {
      if (value + increment > nearbySteps.stepAfter.startValue) {
        increment = nearbySteps.stepAfter.startValue - value;
      }
    }
    if (value > nearbySteps.thisStep.startValue) {
      decrement = nearbySteps.thisStep.step;
    } else if (nearbySteps.stepBefore.step === false) {
      decrement = false;
    } else {
      decrement = value - nearbySteps.stepBefore.highestStep;
    }
    if (location === 100) {
      increment = null;
    } else if (location === 0) {
      decrement = null;
    }
    var stepDecimals = scope_Spectrum.countStepDecimals();
    if (increment !== null && increment !== false) {
      increment = Number(increment.toFixed(stepDecimals));
    }
    if (decrement !== null && decrement !== false) {
      decrement = Number(decrement.toFixed(stepDecimals));
    }
    return [decrement, increment];
  }
  function getNextSteps() {
    return scope_HandleNumbers.map(getNextStepsForHandle);
  }
  function updateOptions(optionsToUpdate, fireSetEvent) {
    var v = valueGet();
    var updateAble = [
      "margin",
      "limit",
      "padding",
      "range",
      "animate",
      "snap",
      "step",
      "format",
      "pips",
      "tooltips",
      "connect"
    ];
    updateAble.forEach(function(name) {
      if (optionsToUpdate[name] !== void 0) {
        originalOptions[name] = optionsToUpdate[name];
      }
    });
    var newOptions = testOptions(originalOptions);
    updateAble.forEach(function(name) {
      if (optionsToUpdate[name] !== void 0) {
        options[name] = newOptions[name];
      }
    });
    scope_Spectrum = newOptions.spectrum;
    options.margin = newOptions.margin;
    options.limit = newOptions.limit;
    options.padding = newOptions.padding;
    if (options.pips) {
      pips(options.pips);
    } else {
      removePips();
    }
    if (options.tooltips) {
      tooltips();
    } else {
      removeTooltips();
    }
    scope_Locations = [];
    valueSet(isSet(optionsToUpdate.start) ? optionsToUpdate.start : v, fireSetEvent);
    if (optionsToUpdate.connect) {
      updateConnectOption();
    }
  }
  function updateConnectOption() {
    while (scope_ConnectBase.firstChild) {
      scope_ConnectBase.removeChild(scope_ConnectBase.firstChild);
    }
    for (var i = 0; i <= options.handles; i++) {
      scope_Connects[i] = addConnect(scope_ConnectBase, options.connect[i]);
      updateConnect(i);
    }
    bindSliderEvents({ drag: options.events.drag, fixed: true });
  }
  function invertConnects() {
    scope_ConnectsInverted = !scope_ConnectsInverted;
    testConnect(
      options,
      // inverse the connect boolean array
      options.connect.map(function(b) {
        return !b;
      })
    );
    updateConnectOption();
  }
  function setupSlider() {
    scope_Base = addSlider(scope_Target);
    addElements(options.connect, scope_Base);
    bindSliderEvents(options.events);
    valueSet(options.start);
    if (options.pips) {
      pips(options.pips);
    }
    if (options.tooltips) {
      tooltips();
    }
    aria();
  }
  setupSlider();
  var scope_Self = {
    destroy,
    steps: getNextSteps,
    on: bindEvent,
    off: removeEvent,
    get: valueGet,
    set: valueSet,
    setHandle: valueSetHandle,
    reset: valueReset,
    disable,
    enable,
    // Exposed for unit testing, don't use this in your application.
    __moveHandles: function(upward, proposal, handleNumbers) {
      moveHandles(upward, proposal, scope_Locations, handleNumbers);
    },
    options: originalOptions,
    updateOptions,
    target: scope_Target,
    removePips,
    removeTooltips,
    getPositions: function() {
      return scope_Locations.slice();
    },
    getTooltips: function() {
      return scope_Tooltips;
    },
    getOrigins: function() {
      return scope_Handles;
    },
    pips
    // Issue #594
  };
  return scope_Self;
}
function initialize(target, originalOptions) {
  if (!target || !target.nodeName) {
    throw new Error("noUiSlider: create requires a single element, got: " + target);
  }
  if (target.noUiSlider) {
    throw new Error("noUiSlider: Slider was already initialized.");
  }
  var options = testOptions(originalOptions);
  var api = scope(target, options, originalOptions);
  target.noUiSlider = api;
  return api;
}
const noUiSlider = {
  // Exposed for unit testing, don't use this in your application.
  __spectrum: Spectrum,
  // A reference to the default classes, allows global changes.
  // Use the cssClasses option for changes to one slider.
  cssClasses,
  create: initialize
};
function initNoUiSlider() {
  const rangeSliders = document.querySelectorAll(`.slider-range`);
  rangeSliders.forEach((rangeSlider) => {
    const sliderStart = rangeSlider.getAttribute("data-start");
    const sliderStep = Number(rangeSlider.getAttribute("data-step"));
    const sliderMin = Number(rangeSlider.getAttribute("data-min"));
    const sliderMax = Number(rangeSlider.getAttribute("data-max"));
    noUiSlider.create(rangeSlider, {
      start: [sliderStart],
      connect: "lower",
      step: sliderStep,
      range: {
        "min": [sliderMin],
        "max": [sliderMax]
      },
      format: {
        to: function(value) {
          return value + " %";
        },
        from: function(value) {
          return parseFloat(value);
        }
      }
    });
    changeInputValue(rangeSlider);
  });
  function changeInputValue(currentSlider) {
    const rangeInput = currentSlider.closest(".default-range").querySelector(".default-range__current");
    currentSlider.noUiSlider.on("update", function(values, handle) {
      rangeInput.textContent = values[handle];
    });
  }
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var slimselect = { exports: {} };
(function(module, exports) {
  (function(global2, factory) {
    module.exports = factory();
  })(commonjsGlobal, function() {
    class CssClasses {
      constructor(classes) {
        if (!classes) {
          classes = {};
        }
        this.main = classes.main || "ss-main";
        this.placeholder = classes.placeholder || "ss-placeholder";
        this.values = classes.values || "ss-values";
        this.single = classes.single || "ss-single";
        this.max = classes.max || "ss-max";
        this.value = classes.value || "ss-value";
        this.valueText = classes.valueText || "ss-value-text";
        this.valueDelete = classes.valueDelete || "ss-value-delete";
        this.valueOut = classes.valueOut || "ss-value-out";
        this.deselect = classes.deselect || "ss-deselect";
        this.deselectPath = classes.deselectPath || "M10,10 L90,90 M10,90 L90,10";
        this.arrow = classes.arrow || "ss-arrow";
        this.arrowClose = classes.arrowClose || "M10,30 L50,70 L90,30";
        this.arrowOpen = classes.arrowOpen || "M10,70 L50,30 L90,70";
        this.content = classes.content || "ss-content";
        this.openAbove = classes.openAbove || "ss-open-above";
        this.openBelow = classes.openBelow || "ss-open-below";
        this.search = classes.search || "ss-search";
        this.searchHighlighter = classes.searchHighlighter || "ss-search-highlight";
        this.searching = classes.searching || "ss-searching";
        this.addable = classes.addable || "ss-addable";
        this.addablePath = classes.addablePath || "M50,10 L50,90 M10,50 L90,50";
        this.list = classes.list || "ss-list";
        this.optgroup = classes.optgroup || "ss-optgroup";
        this.optgroupLabel = classes.optgroupLabel || "ss-optgroup-label";
        this.optgroupLabelText = classes.optgroupLabelText || "ss-optgroup-label-text";
        this.optgroupActions = classes.optgroupActions || "ss-optgroup-actions";
        this.optgroupSelectAll = classes.optgroupSelectAll || "ss-selectall";
        this.optgroupSelectAllBox = classes.optgroupSelectAllBox || "M60,10 L10,10 L10,90 L90,90 L90,50";
        this.optgroupSelectAllCheck = classes.optgroupSelectAllCheck || "M30,45 L50,70 L90,10";
        this.optgroupClosable = classes.optgroupClosable || "ss-closable";
        this.option = classes.option || "ss-option";
        this.optionDelete = classes.optionDelete || "M10,10 L90,90 M10,90 L90,10";
        this.highlighted = classes.highlighted || "ss-highlighted";
        this.open = classes.open || "ss-open";
        this.close = classes.close || "ss-close";
        this.selected = classes.selected || "ss-selected";
        this.error = classes.error || "ss-error";
        this.disabled = classes.disabled || "ss-disabled";
        this.hide = classes.hide || "ss-hide";
      }
    }
    function generateID() {
      return Math.random().toString(36).substring(2, 10);
    }
    function hasClassInTree(element, className) {
      function hasClass2(e, c) {
        if (c && e && e.classList && e.classList.contains(c)) {
          return e;
        }
        if (c && e && e.dataset && e.dataset.id && e.dataset.id === className) {
          return e;
        }
        return null;
      }
      function parentByClass(e, c) {
        if (!e || e === document) {
          return null;
        } else if (hasClass2(e, c)) {
          return e;
        } else {
          return parentByClass(e.parentNode, c);
        }
      }
      return hasClass2(element, className) || parentByClass(element, className);
    }
    function debounce(func, wait = 50, immediate = false) {
      let timeout;
      return function(...args) {
        const context = self;
        const later = () => {
          timeout = null;
          if (!immediate) {
            func.apply(context, args);
          }
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
          func.apply(context, args);
        }
      };
    }
    function isEqual(a2, b) {
      return JSON.stringify(a2) === JSON.stringify(b);
    }
    function kebabCase(str) {
      const result = str.replace(/[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g, (match) => "-" + match.toLowerCase());
      return str[0] === str[0].toUpperCase() ? result.substring(1) : result;
    }
    class Optgroup {
      constructor(optgroup) {
        this.id = !optgroup.id || optgroup.id === "" ? generateID() : optgroup.id;
        this.label = optgroup.label || "";
        this.selectAll = optgroup.selectAll === void 0 ? false : optgroup.selectAll;
        this.selectAllText = optgroup.selectAllText || "Select All";
        this.closable = optgroup.closable || "off";
        this.options = [];
        if (optgroup.options) {
          for (const o of optgroup.options) {
            this.options.push(new Option(o));
          }
        }
      }
    }
    class Option {
      constructor(option) {
        this.id = !option.id || option.id === "" ? generateID() : option.id;
        this.value = option.value === void 0 ? option.text : option.value;
        this.text = option.text || "";
        this.html = option.html || "";
        this.defaultSelected = option.defaultSelected !== void 0 ? option.defaultSelected : false;
        this.selected = option.selected !== void 0 ? option.selected : false;
        this.display = option.display !== void 0 ? option.display : true;
        this.disabled = option.disabled !== void 0 ? option.disabled : false;
        this.mandatory = option.mandatory !== void 0 ? option.mandatory : false;
        this.placeholder = option.placeholder !== void 0 ? option.placeholder : false;
        this.class = option.class || "";
        this.style = option.style || "";
        this.data = option.data || {};
      }
    }
    class Store {
      constructor(type, data) {
        this.selectType = "single";
        this.data = [];
        this.selectedOrder = [];
        this.selectType = type;
        this.setData(data);
      }
      validateDataArray(data) {
        if (!Array.isArray(data)) {
          return new Error("Data must be an array");
        }
        for (let dataObj of data) {
          if (dataObj instanceof Optgroup || "label" in dataObj) {
            if (!("label" in dataObj)) {
              return new Error("Optgroup must have a label");
            }
            if ("options" in dataObj && dataObj.options) {
              for (let option of dataObj.options) {
                const validationError = this.validateOption(option);
                if (validationError) {
                  return validationError;
                }
              }
            }
          } else if (dataObj instanceof Option || "text" in dataObj) {
            const validationError = this.validateOption(dataObj);
            if (validationError) {
              return validationError;
            }
          } else {
            return new Error("Data object must be a valid optgroup or option");
          }
        }
        return null;
      }
      validateOption(option) {
        if (!("text" in option)) {
          return new Error("Option must have a text");
        }
        return null;
      }
      partialToFullData(data) {
        let dataFinal = [];
        data.forEach((dataObj) => {
          if (dataObj instanceof Optgroup || "label" in dataObj) {
            let optOptions = [];
            if ("options" in dataObj && dataObj.options) {
              dataObj.options.forEach((option) => {
                optOptions.push(new Option(option));
              });
            }
            if (optOptions.length > 0) {
              dataFinal.push(new Optgroup(dataObj));
            }
          }
          if (dataObj instanceof Option || "text" in dataObj) {
            dataFinal.push(new Option(dataObj));
          }
        });
        return dataFinal;
      }
      setData(data) {
        this.data = this.partialToFullData(data);
        if (this.selectType === "single") {
          this.setSelectedBy("id", this.getSelected());
        }
      }
      getData() {
        return this.filter(null, true);
      }
      getDataOptions() {
        return this.filter(null, false);
      }
      addOption(option, addToStart = false) {
        if (addToStart) {
          let data = [new Option(option)];
          this.setData(data.concat(this.getData()));
        } else {
          this.setData(this.getData().concat(new Option(option)));
        }
      }
      setSelectedBy(selectedType, selectedValues) {
        let firstOption = null;
        let hasSelected = false;
        const selectedObjects = [];
        for (let dataObj of this.data) {
          if (dataObj instanceof Optgroup) {
            for (let option of dataObj.options) {
              if (!firstOption) {
                firstOption = option;
              }
              option.selected = hasSelected ? false : selectedValues.includes(option[selectedType]);
              if (option.selected) {
                selectedObjects.push(option);
                if (this.selectType === "single") {
                  hasSelected = true;
                }
              }
            }
          }
          if (dataObj instanceof Option) {
            if (!firstOption) {
              firstOption = dataObj;
            }
            dataObj.selected = hasSelected ? false : selectedValues.includes(dataObj[selectedType]);
            if (dataObj.selected) {
              selectedObjects.push(dataObj);
              if (this.selectType === "single") {
                hasSelected = true;
              }
            }
          }
        }
        if (this.selectType === "single" && firstOption && !hasSelected) {
          firstOption.selected = true;
          selectedObjects.push(firstOption);
        }
        const selectedIds = selectedValues.map((value) => {
          var _a;
          return ((_a = selectedObjects.find((option) => option[selectedType] === value)) === null || _a === void 0 ? void 0 : _a.id) || "";
        });
        this.selectedOrder = selectedIds;
      }
      getSelected() {
        return this.getSelectedOptions().map((option) => option.id);
      }
      getSelectedValues() {
        return this.getSelectedOptions().map((option) => option.value);
      }
      getSelectedOptions() {
        return this.filter((opt) => {
          return opt.selected;
        }, false);
      }
      getOptgroupByID(id) {
        for (let dataObj of this.data) {
          if (dataObj instanceof Optgroup && dataObj.id === id) {
            return dataObj;
          }
        }
        return null;
      }
      getOptionByID(id) {
        let options = this.filter((opt) => {
          return opt.id === id;
        }, false);
        return options.length ? options[0] : null;
      }
      getSelectType() {
        return this.selectType;
      }
      getFirstOption() {
        let option = null;
        for (let dataObj of this.data) {
          if (dataObj instanceof Optgroup) {
            option = dataObj.options[0];
          } else if (dataObj instanceof Option) {
            option = dataObj;
          }
          if (option) {
            break;
          }
        }
        return option;
      }
      search(search, searchFilter) {
        search = search.trim();
        if (search === "") {
          return this.getData();
        }
        return this.filter((opt) => {
          return searchFilter(opt, search);
        }, true);
      }
      filter(filter, includeOptgroup) {
        const dataSearch = [];
        this.data.forEach((dataObj) => {
          if (dataObj instanceof Optgroup) {
            let optOptions = [];
            dataObj.options.forEach((option) => {
              if (!filter || filter(option)) {
                if (!includeOptgroup) {
                  dataSearch.push(new Option(option));
                } else {
                  optOptions.push(new Option(option));
                }
              }
            });
            if (optOptions.length > 0) {
              let optgroup = new Optgroup(dataObj);
              optgroup.options = optOptions;
              dataSearch.push(optgroup);
            }
          }
          if (dataObj instanceof Option) {
            if (!filter || filter(dataObj)) {
              dataSearch.push(new Option(dataObj));
            }
          }
        });
        return dataSearch;
      }
      selectedOrderOptions(options) {
        const newOrder = [];
        this.selectedOrder.forEach((id) => {
          const option = options.find((opt) => opt.id === id);
          if (option) {
            newOrder.push(option);
          }
        });
        options.forEach((option) => {
          let isIn = false;
          newOrder.forEach((selectedOption) => {
            if (option.id === selectedOption.id) {
              isIn = true;
              return;
            }
          });
          if (!isIn) {
            newOrder.push(option);
          }
        });
        return newOrder;
      }
    }
    class Render {
      constructor(settings, classes, store, callbacks) {
        this.store = store;
        this.settings = settings;
        this.classes = classes;
        this.callbacks = callbacks;
        this.lastSelectedOption = null;
        this.main = this.mainDiv();
        this.content = this.contentDiv();
        this.updateClassStyles();
        this.updateAriaAttributes();
        if (this.settings.contentLocation) {
          this.settings.contentLocation.appendChild(this.content.main);
        }
      }
      enable() {
        this.main.main.classList.remove(this.classes.disabled);
        this.content.search.input.disabled = false;
      }
      disable() {
        this.main.main.classList.add(this.classes.disabled);
        this.content.search.input.disabled = true;
      }
      open() {
        this.main.arrow.path.setAttribute("d", this.classes.arrowOpen);
        this.main.main.classList.add(this.settings.openPosition === "up" ? this.classes.openAbove : this.classes.openBelow);
        this.main.main.setAttribute("aria-expanded", "true");
        this.moveContent();
        const selectedOptions = this.store.getSelectedOptions();
        if (selectedOptions.length) {
          const selectedId = selectedOptions[selectedOptions.length - 1].id;
          const selectedOption = this.content.list.querySelector('[data-id="' + selectedId + '"]');
          if (selectedOption) {
            this.ensureElementInView(this.content.list, selectedOption);
          }
        }
      }
      close() {
        this.main.main.classList.remove(this.classes.openAbove);
        this.main.main.classList.remove(this.classes.openBelow);
        this.main.main.setAttribute("aria-expanded", "false");
        this.content.main.classList.remove(this.classes.openAbove);
        this.content.main.classList.remove(this.classes.openBelow);
        this.main.arrow.path.setAttribute("d", this.classes.arrowClose);
      }
      updateClassStyles() {
        this.main.main.className = "";
        this.main.main.removeAttribute("style");
        this.content.main.className = "";
        this.content.main.removeAttribute("style");
        this.main.main.classList.add(this.classes.main);
        this.content.main.classList.add(this.classes.content);
        if (this.settings.style !== "") {
          this.main.main.style.cssText = this.settings.style;
          this.content.main.style.cssText = this.settings.style;
        }
        if (this.settings.class.length) {
          for (const c of this.settings.class) {
            if (c.trim() !== "") {
              this.main.main.classList.add(c.trim());
              this.content.main.classList.add(c.trim());
            }
          }
        }
        if (this.settings.contentPosition === "relative" || this.settings.contentPosition === "fixed") {
          this.content.main.classList.add("ss-" + this.settings.contentPosition);
        }
      }
      updateAriaAttributes() {
        var _a;
        this.main.main.role = "combobox";
        this.main.main.setAttribute("aria-haspopup", "listbox");
        this.main.main.setAttribute("aria-controls", (_a = this.content.main.dataset.id) !== null && _a !== void 0 ? _a : "");
        this.main.main.setAttribute("aria-expanded", "false");
        this.content.main.setAttribute("role", "listbox");
      }
      mainDiv() {
        var _a;
        const main = document.createElement("div");
        main.dataset.id = this.settings.id;
        main.setAttribute("aria-label", this.settings.ariaLabel);
        main.tabIndex = 0;
        main.onkeydown = (e) => {
          switch (e.key) {
            case "ArrowUp":
            case "ArrowDown":
              this.callbacks.open();
              e.key === "ArrowDown" ? this.highlight("down") : this.highlight("up");
              return false;
            case "Tab":
              this.callbacks.close();
              return true;
            case "Enter":
            case " ":
              this.callbacks.open();
              const highlighted = this.content.list.querySelector("." + this.classes.highlighted);
              if (highlighted) {
                highlighted.click();
              }
              return false;
            case "Escape":
              this.callbacks.close();
              return false;
          }
          if (e.key.length === 1) {
            this.callbacks.open();
          }
          return true;
        };
        main.onclick = (e) => {
          if (this.settings.disabled) {
            return;
          }
          this.settings.isOpen ? this.callbacks.close() : this.callbacks.open();
        };
        const values = document.createElement("div");
        values.classList.add(this.classes.values);
        main.appendChild(values);
        const deselect = document.createElement("div");
        deselect.classList.add(this.classes.deselect);
        const selectedOptions = (_a = this.store) === null || _a === void 0 ? void 0 : _a.getSelectedOptions();
        if (!this.settings.allowDeselect || this.settings.isMultiple && selectedOptions && selectedOptions.length <= 0) {
          deselect.classList.add(this.classes.hide);
        } else {
          deselect.classList.remove(this.classes.hide);
        }
        deselect.onclick = (e) => {
          e.stopPropagation();
          if (this.settings.disabled) {
            return;
          }
          let shouldDelete = true;
          const before = this.store.getSelectedOptions();
          const after = [];
          if (this.callbacks.beforeChange) {
            shouldDelete = this.callbacks.beforeChange(after, before) === true;
          }
          if (shouldDelete) {
            if (this.settings.isMultiple) {
              this.callbacks.setSelected([], false);
              this.updateDeselectAll();
            } else {
              const firstOption = this.store.getFirstOption();
              const id = firstOption ? firstOption.id : "";
              this.callbacks.setSelected(id, false);
            }
            if (this.settings.closeOnSelect) {
              this.callbacks.close();
            }
            if (this.callbacks.afterChange) {
              this.callbacks.afterChange(this.store.getSelectedOptions());
            }
          }
        };
        const deselectSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        deselectSvg.setAttribute("viewBox", "0 0 100 100");
        const deselectPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        deselectPath.setAttribute("d", this.classes.deselectPath);
        deselectSvg.appendChild(deselectPath);
        deselect.appendChild(deselectSvg);
        main.appendChild(deselect);
        const arrow = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        arrow.classList.add(this.classes.arrow);
        arrow.setAttribute("viewBox", "0 0 100 100");
        const arrowPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        arrowPath.setAttribute("d", this.classes.arrowClose);
        if (this.settings.alwaysOpen) {
          arrow.classList.add(this.classes.hide);
        }
        arrow.appendChild(arrowPath);
        main.appendChild(arrow);
        return {
          main,
          values,
          deselect: {
            main: deselect,
            svg: deselectSvg,
            path: deselectPath
          },
          arrow: {
            main: arrow,
            path: arrowPath
          }
        };
      }
      mainFocus(eventType) {
        if (eventType !== "click") {
          this.main.main.focus({ preventScroll: true });
        }
      }
      placeholder() {
        const placeholderOption = this.store.filter((o) => o.placeholder, false);
        let placeholderText = this.settings.placeholderText;
        if (placeholderOption.length) {
          if (placeholderOption[0].html !== "") {
            placeholderText = placeholderOption[0].html;
          } else if (placeholderOption[0].text !== "") {
            placeholderText = placeholderOption[0].text;
          }
        }
        const placeholder = document.createElement("div");
        placeholder.classList.add(this.classes.placeholder);
        placeholder.innerHTML = placeholderText;
        return placeholder;
      }
      renderValues() {
        if (!this.settings.isMultiple) {
          this.renderSingleValue();
          return;
        }
        this.renderMultipleValues();
        this.updateDeselectAll();
      }
      renderSingleValue() {
        const selected = this.store.filter((o) => {
          return o.selected && !o.placeholder;
        }, false);
        const selectedSingle = selected.length > 0 ? selected[0] : null;
        if (!selectedSingle) {
          this.main.values.innerHTML = this.placeholder().outerHTML;
        } else {
          const singleValue = document.createElement("div");
          singleValue.classList.add(this.classes.single);
          if (selectedSingle.html) {
            singleValue.innerHTML = selectedSingle.html;
          } else {
            singleValue.innerText = selectedSingle.text;
          }
          this.main.values.innerHTML = singleValue.outerHTML;
        }
        if (!this.settings.allowDeselect || !selected.length) {
          this.main.deselect.main.classList.add(this.classes.hide);
        } else {
          this.main.deselect.main.classList.remove(this.classes.hide);
        }
      }
      renderMultipleValues() {
        let currentNodes = this.main.values.childNodes;
        let selectedOptions = this.store.filter((opt) => {
          return opt.selected && opt.display;
        }, false);
        if (selectedOptions.length === 0) {
          this.main.values.innerHTML = this.placeholder().outerHTML;
          return;
        } else {
          const placeholder = this.main.values.querySelector("." + this.classes.placeholder);
          if (placeholder) {
            placeholder.remove();
          }
        }
        if (selectedOptions.length > this.settings.maxValuesShown) {
          const singleValue = document.createElement("div");
          singleValue.classList.add(this.classes.max);
          singleValue.textContent = this.settings.maxValuesMessage.replace("{number}", selectedOptions.length.toString());
          this.main.values.innerHTML = singleValue.outerHTML;
          return;
        } else {
          const maxValuesMessage = this.main.values.querySelector("." + this.classes.max);
          if (maxValuesMessage) {
            maxValuesMessage.remove();
          }
        }
        if (this.settings.keepOrder) {
          selectedOptions = this.store.selectedOrderOptions(selectedOptions);
        }
        let removeNodes = [];
        for (let i = 0; i < currentNodes.length; i++) {
          const node = currentNodes[i];
          const id = node.getAttribute("data-id");
          if (id) {
            const found = selectedOptions.filter((opt) => {
              return opt.id === id;
            }, false);
            if (!found.length) {
              removeNodes.push(node);
            }
          }
        }
        for (const n of removeNodes) {
          n.classList.add(this.classes.valueOut);
          setTimeout(() => {
            if (this.main.values.hasChildNodes() && this.main.values.contains(n)) {
              this.main.values.removeChild(n);
            }
          }, 100);
        }
        currentNodes = this.main.values.childNodes;
        for (let d = 0; d < selectedOptions.length; d++) {
          let shouldAdd = true;
          for (let i = 0; i < currentNodes.length; i++) {
            if (selectedOptions[d].id === String(currentNodes[i].dataset.id)) {
              shouldAdd = false;
            }
          }
          if (shouldAdd) {
            if (this.settings.keepOrder) {
              this.main.values.appendChild(this.multipleValue(selectedOptions[d]));
            } else {
              if (currentNodes.length === 0) {
                this.main.values.appendChild(this.multipleValue(selectedOptions[d]));
              } else if (d === 0) {
                this.main.values.insertBefore(this.multipleValue(selectedOptions[d]), currentNodes[d]);
              } else {
                currentNodes[d - 1].insertAdjacentElement("afterend", this.multipleValue(selectedOptions[d]));
              }
            }
          }
        }
      }
      multipleValue(option) {
        const value = document.createElement("div");
        value.classList.add(this.classes.value);
        value.dataset.id = option.id;
        const text = document.createElement("div");
        text.classList.add(this.classes.valueText);
        text.textContent = option.text;
        value.appendChild(text);
        if (!option.mandatory) {
          const deleteDiv = document.createElement("div");
          deleteDiv.classList.add(this.classes.valueDelete);
          deleteDiv.setAttribute("tabindex", "0");
          deleteDiv.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (this.settings.disabled) {
              return;
            }
            let shouldDelete = true;
            const before = this.store.getSelectedOptions();
            const after = before.filter((o) => {
              return o.selected && o.id !== option.id;
            }, true);
            if (this.settings.minSelected && after.length < this.settings.minSelected) {
              return;
            }
            if (this.callbacks.beforeChange) {
              shouldDelete = this.callbacks.beforeChange(after, before) === true;
            }
            if (shouldDelete) {
              let selectedIds = [];
              for (const o of after) {
                if (o instanceof Optgroup) {
                  for (const c of o.options) {
                    selectedIds.push(c.id);
                  }
                }
                if (o instanceof Option) {
                  selectedIds.push(o.id);
                }
              }
              this.callbacks.setSelected(selectedIds, false);
              if (this.settings.closeOnSelect) {
                this.callbacks.close();
              }
              if (this.callbacks.afterChange) {
                this.callbacks.afterChange(after);
              }
              this.updateDeselectAll();
            }
          };
          const deleteSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          deleteSvg.setAttribute("viewBox", "0 0 100 100");
          const deletePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
          deletePath.setAttribute("d", this.classes.optionDelete);
          deleteSvg.appendChild(deletePath);
          deleteDiv.appendChild(deleteSvg);
          value.appendChild(deleteDiv);
          deleteDiv.onkeydown = (e) => {
            if (e.key === "Enter") {
              deleteDiv.click();
            }
          };
        }
        return value;
      }
      contentDiv() {
        const main = document.createElement("div");
        main.dataset.id = this.settings.id;
        const search = this.searchDiv();
        main.appendChild(search.main);
        const list = this.listDiv();
        main.appendChild(list);
        return {
          main,
          search,
          list
        };
      }
      moveContent() {
        if (this.settings.contentPosition === "relative") {
          this.moveContentBelow();
          return;
        }
        if (this.settings.openPosition === "down") {
          this.moveContentBelow();
          return;
        } else if (this.settings.openPosition === "up") {
          this.moveContentAbove();
          return;
        }
        if (this.putContent() === "up") {
          this.moveContentAbove();
        } else {
          this.moveContentBelow();
        }
      }
      searchDiv() {
        const main = document.createElement("div");
        const input = document.createElement("input");
        const addable = document.createElement("div");
        main.classList.add(this.classes.search);
        const searchReturn = {
          main,
          input
        };
        if (!this.settings.showSearch) {
          main.classList.add(this.classes.hide);
          input.readOnly = true;
        }
        input.type = "search";
        input.placeholder = this.settings.searchPlaceholder;
        input.tabIndex = -1;
        input.setAttribute("aria-label", this.settings.searchPlaceholder);
        input.setAttribute("autocapitalize", "off");
        input.setAttribute("autocomplete", "off");
        input.setAttribute("autocorrect", "off");
        input.oninput = debounce((e) => {
          this.callbacks.search(e.target.value);
        }, 100);
        input.onkeydown = (e) => {
          switch (e.key) {
            case "ArrowUp":
            case "ArrowDown":
              e.key === "ArrowDown" ? this.highlight("down") : this.highlight("up");
              return false;
            case "Tab":
              this.callbacks.close();
              return true;
            case "Escape":
              this.callbacks.close();
              return false;
            case " ":
              const highlighted = this.content.list.querySelector("." + this.classes.highlighted);
              if (highlighted) {
                highlighted.click();
                return false;
              }
              return true;
            case "Enter":
              if (this.callbacks.addable) {
                addable.click();
                return false;
              } else {
                const highlighted2 = this.content.list.querySelector("." + this.classes.highlighted);
                if (highlighted2) {
                  highlighted2.click();
                  return false;
                }
              }
              return true;
          }
          return true;
        };
        main.appendChild(input);
        if (this.callbacks.addable) {
          addable.classList.add(this.classes.addable);
          const plus = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          plus.setAttribute("viewBox", "0 0 100 100");
          const plusPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
          plusPath.setAttribute("d", this.classes.addablePath);
          plus.appendChild(plusPath);
          addable.appendChild(plus);
          addable.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!this.callbacks.addable) {
              return;
            }
            const inputValue = this.content.search.input.value.trim();
            if (inputValue === "") {
              this.content.search.input.focus();
              return;
            }
            const runFinish = (oo) => {
              let newOption = new Option(oo);
              this.callbacks.addOption(newOption);
              if (this.settings.isMultiple) {
                let ids = this.store.getSelected();
                ids.push(newOption.id);
                this.callbacks.setSelected(ids, true);
              } else {
                this.callbacks.setSelected([newOption.id], true);
              }
              this.callbacks.search("");
              if (this.settings.closeOnSelect) {
                setTimeout(() => {
                  this.callbacks.close();
                }, 100);
              }
            };
            const addableValue = this.callbacks.addable(inputValue);
            if (addableValue === false || addableValue === void 0 || addableValue === null) {
              return;
            }
            if (addableValue instanceof Promise) {
              addableValue.then((value) => {
                if (typeof value === "string") {
                  runFinish({
                    text: value,
                    value
                  });
                } else if (addableValue instanceof Error) {
                  this.renderError(addableValue.message);
                } else {
                  runFinish(value);
                }
              });
            } else if (typeof addableValue === "string") {
              runFinish({
                text: addableValue,
                value: addableValue
              });
            } else if (addableValue instanceof Error) {
              this.renderError(addableValue.message);
            } else {
              runFinish(addableValue);
            }
            return;
          };
          main.appendChild(addable);
          searchReturn.addable = {
            main: addable,
            svg: plus,
            path: plusPath
          };
        }
        return searchReturn;
      }
      searchFocus() {
        this.content.search.input.focus();
      }
      getOptions(notPlaceholder = false, notDisabled = false, notHidden = false) {
        let query = "." + this.classes.option;
        if (notPlaceholder) {
          query += ":not(." + this.classes.placeholder + ")";
        }
        if (notDisabled) {
          query += ":not(." + this.classes.disabled + ")";
        }
        if (notHidden) {
          query += ":not(." + this.classes.hide + ")";
        }
        return Array.from(this.content.list.querySelectorAll(query));
      }
      highlight(dir) {
        const options = this.getOptions(true, true, true);
        if (options.length === 0) {
          return;
        }
        if (options.length === 1) {
          if (!options[0].classList.contains(this.classes.highlighted)) {
            options[0].classList.add(this.classes.highlighted);
            return;
          }
        }
        let highlighted = false;
        for (const o of options) {
          if (o.classList.contains(this.classes.highlighted)) {
            highlighted = true;
          }
        }
        if (!highlighted) {
          for (const o of options) {
            if (o.classList.contains(this.classes.selected)) {
              o.classList.add(this.classes.highlighted);
              break;
            }
          }
        }
        for (let i = 0; i < options.length; i++) {
          if (options[i].classList.contains(this.classes.highlighted)) {
            const prevOption = options[i];
            prevOption.classList.remove(this.classes.highlighted);
            const prevParent = prevOption.parentElement;
            if (prevParent && prevParent.classList.contains(this.classes.open)) {
              const optgroupLabel = prevParent.querySelector("." + this.classes.optgroupLabel);
              if (optgroupLabel) {
                optgroupLabel.click();
              }
            }
            let selectOption = options[dir === "down" ? i + 1 < options.length ? i + 1 : 0 : i - 1 >= 0 ? i - 1 : options.length - 1];
            selectOption.classList.add(this.classes.highlighted);
            this.ensureElementInView(this.content.list, selectOption);
            const selectParent = selectOption.parentElement;
            if (selectParent && selectParent.classList.contains(this.classes.close)) {
              const optgroupLabel = selectParent.querySelector("." + this.classes.optgroupLabel);
              if (optgroupLabel) {
                optgroupLabel.click();
              }
            }
            return;
          }
        }
        options[dir === "down" ? 0 : options.length - 1].classList.add(this.classes.highlighted);
        this.ensureElementInView(this.content.list, options[dir === "down" ? 0 : options.length - 1]);
      }
      listDiv() {
        const options = document.createElement("div");
        options.classList.add(this.classes.list);
        return options;
      }
      renderError(error) {
        this.content.list.innerHTML = "";
        const errorDiv = document.createElement("div");
        errorDiv.classList.add(this.classes.error);
        errorDiv.textContent = error;
        this.content.list.appendChild(errorDiv);
      }
      renderSearching() {
        this.content.list.innerHTML = "";
        const searchingDiv = document.createElement("div");
        searchingDiv.classList.add(this.classes.searching);
        searchingDiv.textContent = this.settings.searchingText;
        this.content.list.appendChild(searchingDiv);
      }
      renderOptions(data) {
        this.content.list.innerHTML = "";
        if (data.length === 0) {
          const noResults = document.createElement("div");
          noResults.classList.add(this.classes.search);
          if (this.callbacks.addable) {
            noResults.innerHTML = this.settings.addableText.replace("{value}", this.content.search.input.value);
          } else {
            noResults.innerHTML = this.settings.searchText;
          }
          this.content.list.appendChild(noResults);
          return;
        }
        if (this.settings.allowDeselect && !this.settings.isMultiple) {
          const placeholderOption = this.store.filter((o) => o.placeholder, false);
          if (!placeholderOption.length) {
            this.store.addOption(new Option({
              text: "",
              value: "",
              selected: false,
              placeholder: true
            }), true);
          }
        }
        const fragment = document.createDocumentFragment();
        for (const d of data) {
          if (d instanceof Optgroup) {
            const optgroupEl = document.createElement("div");
            optgroupEl.classList.add(this.classes.optgroup);
            const optgroupLabel = document.createElement("div");
            optgroupLabel.classList.add(this.classes.optgroupLabel);
            optgroupEl.appendChild(optgroupLabel);
            const optgroupLabelText = document.createElement("div");
            optgroupLabelText.classList.add(this.classes.optgroupLabelText);
            optgroupLabelText.textContent = d.label;
            optgroupLabel.appendChild(optgroupLabelText);
            const optgroupActions = document.createElement("div");
            optgroupActions.classList.add(this.classes.optgroupActions);
            optgroupLabel.appendChild(optgroupActions);
            if (this.settings.isMultiple && d.selectAll) {
              const selectAll = document.createElement("div");
              selectAll.classList.add(this.classes.optgroupSelectAll);
              let allSelected = true;
              for (const o of d.options) {
                if (!o.selected) {
                  allSelected = false;
                  break;
                }
              }
              if (allSelected) {
                selectAll.classList.add(this.classes.selected);
              }
              const selectAllText = document.createElement("span");
              selectAllText.textContent = d.selectAllText;
              selectAll.appendChild(selectAllText);
              const selectAllSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
              selectAllSvg.setAttribute("viewBox", "0 0 100 100");
              selectAll.appendChild(selectAllSvg);
              const selectAllBox = document.createElementNS("http://www.w3.org/2000/svg", "path");
              selectAllBox.setAttribute("d", this.classes.optgroupSelectAllBox);
              selectAllSvg.appendChild(selectAllBox);
              const selectAllCheck = document.createElementNS("http://www.w3.org/2000/svg", "path");
              selectAllCheck.setAttribute("d", this.classes.optgroupSelectAllCheck);
              selectAllSvg.appendChild(selectAllCheck);
              selectAll.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                const currentSelected = this.store.getSelected();
                if (allSelected) {
                  const newSelected = currentSelected.filter((s) => {
                    for (const o of d.options) {
                      if (s === o.id) {
                        return false;
                      }
                    }
                    return true;
                  });
                  this.callbacks.setSelected(newSelected, true);
                  return;
                } else {
                  const newSelected = currentSelected.concat(d.options.map((o) => o.id));
                  for (const o of d.options) {
                    if (!this.store.getOptionByID(o.id)) {
                      this.callbacks.addOption(o);
                    }
                  }
                  this.callbacks.setSelected(newSelected, true);
                  return;
                }
              });
              optgroupActions.appendChild(selectAll);
            }
            if (d.closable !== "off") {
              const optgroupClosable = document.createElement("div");
              optgroupClosable.classList.add(this.classes.optgroupClosable);
              const optgroupClosableSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
              optgroupClosableSvg.setAttribute("viewBox", "0 0 100 100");
              optgroupClosableSvg.classList.add(this.classes.arrow);
              optgroupClosable.appendChild(optgroupClosableSvg);
              const optgroupClosableArrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
              optgroupClosableSvg.appendChild(optgroupClosableArrow);
              if (d.options.some((o) => o.selected) || this.content.search.input.value.trim() !== "") {
                optgroupClosable.classList.add(this.classes.open);
                optgroupClosableArrow.setAttribute("d", this.classes.arrowOpen);
              } else if (d.closable === "open") {
                optgroupEl.classList.add(this.classes.open);
                optgroupClosableArrow.setAttribute("d", this.classes.arrowOpen);
              } else if (d.closable === "close") {
                optgroupEl.classList.add(this.classes.close);
                optgroupClosableArrow.setAttribute("d", this.classes.arrowClose);
              }
              optgroupLabel.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (optgroupEl.classList.contains(this.classes.close)) {
                  optgroupEl.classList.remove(this.classes.close);
                  optgroupEl.classList.add(this.classes.open);
                  optgroupClosableArrow.setAttribute("d", this.classes.arrowOpen);
                } else {
                  optgroupEl.classList.remove(this.classes.open);
                  optgroupEl.classList.add(this.classes.close);
                  optgroupClosableArrow.setAttribute("d", this.classes.arrowClose);
                }
              });
              optgroupActions.appendChild(optgroupClosable);
            }
            optgroupEl.appendChild(optgroupLabel);
            for (const o of d.options) {
              optgroupEl.appendChild(this.option(o));
              fragment.appendChild(optgroupEl);
            }
          }
          if (d instanceof Option) {
            fragment.appendChild(this.option(d));
          }
        }
        this.content.list.appendChild(fragment);
      }
      option(option) {
        if (option.placeholder) {
          const placeholder = document.createElement("div");
          placeholder.classList.add(this.classes.option);
          placeholder.classList.add(this.classes.hide);
          return placeholder;
        }
        const optionEl = document.createElement("div");
        optionEl.dataset.id = option.id;
        optionEl.classList.add(this.classes.option);
        optionEl.setAttribute("role", "option");
        if (option.class) {
          option.class.split(" ").forEach((dataClass) => {
            optionEl.classList.add(dataClass);
          });
        }
        if (option.style) {
          optionEl.style.cssText = option.style;
        }
        if (this.settings.searchHighlight && this.content.search.input.value.trim() !== "") {
          optionEl.innerHTML = this.highlightText(option.html !== "" ? option.html : option.text, this.content.search.input.value, this.classes.searchHighlighter);
        } else if (option.html !== "") {
          optionEl.innerHTML = option.html;
        } else {
          optionEl.textContent = option.text;
        }
        if (this.settings.showOptionTooltips && optionEl.textContent) {
          optionEl.setAttribute("title", optionEl.textContent);
        }
        if (!option.display) {
          optionEl.classList.add(this.classes.hide);
        }
        if (option.disabled) {
          optionEl.classList.add(this.classes.disabled);
        }
        if (option.selected && this.settings.hideSelected) {
          optionEl.classList.add(this.classes.hide);
        }
        if (option.selected) {
          optionEl.classList.add(this.classes.selected);
          optionEl.setAttribute("aria-selected", "true");
          this.main.main.setAttribute("aria-activedescendant", optionEl.id);
        } else {
          optionEl.classList.remove(this.classes.selected);
          optionEl.setAttribute("aria-selected", "false");
        }
        optionEl.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const selectedOptions = this.store.getSelected();
          const element = e.currentTarget;
          const elementID = String(element.dataset.id);
          if (option.disabled || option.selected && !this.settings.allowDeselect) {
            return;
          }
          if (this.settings.isMultiple && this.settings.maxSelected <= selectedOptions.length && !option.selected || this.settings.isMultiple && this.settings.minSelected >= selectedOptions.length && option.selected) {
            return;
          }
          let shouldUpdate = false;
          const before = this.store.getSelectedOptions();
          let after = [];
          if (this.settings.isMultiple) {
            if (option.selected) {
              after = before.filter((o) => o.id !== elementID);
            } else {
              after = before.concat(option);
              if (!this.settings.closeOnSelect) {
                if (e.shiftKey && this.lastSelectedOption) {
                  const options = this.store.getDataOptions();
                  let lastClickedOptionIndex = options.findIndex((o) => o.id === this.lastSelectedOption.id);
                  let currentOptionIndex = options.findIndex((o) => o.id === option.id);
                  if (lastClickedOptionIndex >= 0 && currentOptionIndex >= 0) {
                    const startIndex = Math.min(lastClickedOptionIndex, currentOptionIndex);
                    const endIndex = Math.max(lastClickedOptionIndex, currentOptionIndex);
                    const afterRange = options.slice(startIndex, endIndex + 1);
                    if (afterRange.length > 0 && afterRange.length < this.settings.maxSelected) {
                      after = before.concat(afterRange.filter((a2) => !before.find((b) => b.id === a2.id)));
                    }
                  }
                } else if (!option.selected) {
                  this.lastSelectedOption = option;
                }
              }
            }
          }
          if (!this.settings.isMultiple) {
            if (option.selected) {
              after = [];
            } else {
              after = [option];
            }
          }
          if (!this.callbacks.beforeChange) {
            shouldUpdate = true;
          }
          if (this.callbacks.beforeChange) {
            if (this.callbacks.beforeChange(after, before) === false) {
              shouldUpdate = false;
            } else {
              shouldUpdate = true;
            }
          }
          if (shouldUpdate) {
            if (!this.store.getOptionByID(elementID)) {
              this.callbacks.addOption(option);
            }
            this.callbacks.setSelected(after.map((o) => o.id), false);
            if (this.settings.closeOnSelect) {
              this.callbacks.close();
            }
            if (this.callbacks.afterChange) {
              this.callbacks.afterChange(after);
            }
          }
        });
        return optionEl;
      }
      destroy() {
        this.main.main.remove();
        this.content.main.remove();
      }
      highlightText(str, search, className) {
        let completedString = str;
        const regex = new RegExp("(?![^<]*>)(" + search.trim() + ")(?![^<]*>[^<>]*</)", "i");
        if (!str.match(regex)) {
          return str;
        }
        const matchStartPosition = str.match(regex).index;
        const matchEndPosition = matchStartPosition + str.match(regex)[0].toString().length;
        const originalTextFoundByRegex = str.substring(matchStartPosition, matchEndPosition);
        completedString = completedString.replace(regex, `<mark class="${className}">${originalTextFoundByRegex}</mark>`);
        return completedString;
      }
      moveContentAbove() {
        const mainHeight = this.main.main.offsetHeight;
        const contentHeight = this.content.main.offsetHeight;
        this.main.main.classList.remove(this.classes.openBelow);
        this.main.main.classList.add(this.classes.openAbove);
        this.content.main.classList.remove(this.classes.openBelow);
        this.content.main.classList.add(this.classes.openAbove);
        const containerRect = this.main.main.getBoundingClientRect();
        this.content.main.style.margin = "-" + (mainHeight + contentHeight - 1) + "px 0px 0px 0px";
        this.content.main.style.top = containerRect.top + containerRect.height + (this.settings.contentPosition === "fixed" ? 0 : window.scrollY) + "px";
        this.content.main.style.left = containerRect.left + (this.settings.contentPosition === "fixed" ? 0 : window.scrollX) + "px";
        this.content.main.style.width = containerRect.width + "px";
      }
      moveContentBelow() {
        this.main.main.classList.remove(this.classes.openAbove);
        this.main.main.classList.add(this.classes.openBelow);
        this.content.main.classList.remove(this.classes.openAbove);
        this.content.main.classList.add(this.classes.openBelow);
        const containerRect = this.main.main.getBoundingClientRect();
        this.content.main.style.margin = "-1px 0px 0px 0px";
        if (this.settings.contentPosition !== "relative") {
          this.content.main.style.top = containerRect.top + containerRect.height + (this.settings.contentPosition === "fixed" ? 0 : window.scrollY) + "px";
          this.content.main.style.left = containerRect.left + (this.settings.contentPosition === "fixed" ? 0 : window.scrollX) + "px";
          this.content.main.style.width = containerRect.width + "px";
        }
      }
      ensureElementInView(container, element) {
        const cTop = container.scrollTop + container.offsetTop;
        const cBottom = cTop + container.clientHeight;
        const eTop = element.offsetTop;
        const eBottom = eTop + element.clientHeight;
        if (eTop < cTop) {
          container.scrollTop -= cTop - eTop;
        } else if (eBottom > cBottom) {
          container.scrollTop += eBottom - cBottom;
        }
      }
      putContent() {
        const mainHeight = this.main.main.offsetHeight;
        const mainRect = this.main.main.getBoundingClientRect();
        const contentHeight = this.content.main.offsetHeight;
        const spaceBelow = window.innerHeight - (mainRect.top + mainHeight);
        if (spaceBelow <= contentHeight) {
          if (mainRect.top > contentHeight) {
            return "up";
          } else {
            return "down";
          }
        }
        return "down";
      }
      updateDeselectAll() {
        if (!this.store || !this.settings) {
          return;
        }
        const selected = this.store.getSelectedOptions();
        const hasSelectedItems = selected && selected.length > 0;
        const isMultiple = this.settings.isMultiple;
        const allowDeselect = this.settings.allowDeselect;
        const deselectButton = this.main.deselect.main;
        const hideClass = this.classes.hide;
        if (allowDeselect && !(isMultiple && !hasSelectedItems)) {
          deselectButton.classList.remove(hideClass);
        } else {
          deselectButton.classList.add(hideClass);
        }
      }
    }
    class Select {
      constructor(select) {
        this.listen = false;
        this.observer = null;
        this.select = select;
        this.valueChange = this.valueChange.bind(this);
        this.select.addEventListener("change", this.valueChange, {
          passive: true
        });
        this.observer = new MutationObserver(this.observeCall.bind(this));
        this.changeListen(true);
      }
      enable() {
        this.select.disabled = false;
      }
      disable() {
        this.select.disabled = true;
      }
      hideUI() {
        this.select.tabIndex = -1;
        this.select.style.display = "none";
        this.select.setAttribute("aria-hidden", "true");
      }
      showUI() {
        this.select.removeAttribute("tabindex");
        this.select.style.display = "";
        this.select.removeAttribute("aria-hidden");
      }
      changeListen(listen) {
        this.listen = listen;
        if (listen) {
          if (this.observer) {
            this.observer.observe(this.select, {
              subtree: true,
              childList: true,
              attributes: true
            });
          }
        }
        if (!listen) {
          if (this.observer) {
            this.observer.disconnect();
          }
        }
      }
      valueChange(ev) {
        if (this.listen && this.onValueChange) {
          this.onValueChange(this.getSelectedOptions());
        }
        return true;
      }
      observeCall(mutations) {
        if (!this.listen) {
          return;
        }
        let classChanged = false;
        let disabledChanged = false;
        let optgroupOptionChanged = false;
        for (const m of mutations) {
          if (m.target === this.select) {
            if (m.attributeName === "disabled") {
              disabledChanged = true;
            }
            if (m.attributeName === "class") {
              classChanged = true;
            }
            if (m.type === "childList") {
              for (const n of m.addedNodes) {
                if (n.nodeName === "OPTION" && n.value === this.select.value) {
                  this.select.dispatchEvent(new Event("change"));
                  break;
                }
              }
              optgroupOptionChanged = true;
            }
          }
          if (m.target.nodeName === "OPTGROUP" || m.target.nodeName === "OPTION") {
            optgroupOptionChanged = true;
          }
        }
        if (classChanged && this.onClassChange) {
          this.onClassChange(this.select.className.split(" "));
        }
        if (disabledChanged && this.onDisabledChange) {
          this.changeListen(false);
          this.onDisabledChange(this.select.disabled);
          this.changeListen(true);
        }
        if (optgroupOptionChanged && this.onOptionsChange) {
          this.changeListen(false);
          this.onOptionsChange(this.getData());
          this.changeListen(true);
        }
      }
      getData() {
        let data = [];
        const nodes = this.select.childNodes;
        for (const n of nodes) {
          if (n.nodeName === "OPTGROUP") {
            data.push(this.getDataFromOptgroup(n));
          }
          if (n.nodeName === "OPTION") {
            data.push(this.getDataFromOption(n));
          }
        }
        return data;
      }
      getDataFromOptgroup(optgroup) {
        let data = {
          id: optgroup.id,
          label: optgroup.label,
          selectAll: optgroup.dataset ? optgroup.dataset.selectall === "true" : false,
          selectAllText: optgroup.dataset ? optgroup.dataset.selectalltext : "Select all",
          closable: optgroup.dataset ? optgroup.dataset.closable : "off",
          options: []
        };
        const options = optgroup.childNodes;
        for (const o of options) {
          if (o.nodeName === "OPTION") {
            data.options.push(this.getDataFromOption(o));
          }
        }
        return data;
      }
      getDataFromOption(option) {
        return {
          id: option.id,
          value: option.value,
          text: option.text,
          html: option.dataset && option.dataset.html ? option.dataset.html : "",
          defaultSelected: option.defaultSelected,
          selected: option.selected,
          display: option.style.display !== "none",
          disabled: option.disabled,
          mandatory: option.dataset ? option.dataset.mandatory === "true" : false,
          placeholder: option.dataset.placeholder === "true",
          class: option.className,
          style: option.style.cssText,
          data: option.dataset
        };
      }
      getSelectedOptions() {
        let options = [];
        const opts = this.select.childNodes;
        for (const o of opts) {
          if (o.nodeName === "OPTGROUP") {
            const optgroupOptions = o.childNodes;
            for (const oo of optgroupOptions) {
              if (oo.nodeName === "OPTION") {
                const option = oo;
                if (option.selected) {
                  options.push(this.getDataFromOption(option));
                }
              }
            }
          }
          if (o.nodeName === "OPTION") {
            const option = o;
            if (option.selected) {
              options.push(this.getDataFromOption(option));
            }
          }
        }
        return options;
      }
      getSelectedValues() {
        return this.getSelectedOptions().map((option) => option.value);
      }
      setSelected(ids) {
        this.changeListen(false);
        const options = this.select.childNodes;
        for (const o of options) {
          if (o.nodeName === "OPTGROUP") {
            const optgroup = o;
            const optgroupOptions = optgroup.childNodes;
            for (const oo of optgroupOptions) {
              if (oo.nodeName === "OPTION") {
                const option = oo;
                option.selected = ids.includes(option.id);
              }
            }
          }
          if (o.nodeName === "OPTION") {
            const option = o;
            option.selected = ids.includes(option.id);
          }
        }
        this.changeListen(true);
      }
      setSelectedByValue(values) {
        this.changeListen(false);
        const options = this.select.childNodes;
        for (const o of options) {
          if (o.nodeName === "OPTGROUP") {
            const optgroup = o;
            const optgroupOptions = optgroup.childNodes;
            for (const oo of optgroupOptions) {
              if (oo.nodeName === "OPTION") {
                const option = oo;
                option.selected = values.includes(option.value);
              }
            }
          }
          if (o.nodeName === "OPTION") {
            const option = o;
            option.selected = values.includes(option.value);
          }
        }
        this.changeListen(true);
      }
      updateSelect(id, style, classes) {
        this.changeListen(false);
        if (id) {
          this.select.dataset.id = id;
        }
        if (style) {
          this.select.style.cssText = style;
        }
        if (classes) {
          this.select.className = "";
          classes.forEach((c) => {
            if (c.trim() !== "") {
              this.select.classList.add(c.trim());
            }
          });
        }
        this.changeListen(true);
      }
      updateOptions(data) {
        this.changeListen(false);
        this.select.innerHTML = "";
        for (const d of data) {
          if (d instanceof Optgroup) {
            this.select.appendChild(this.createOptgroup(d));
          }
          if (d instanceof Option) {
            this.select.appendChild(this.createOption(d));
          }
        }
        this.select.dispatchEvent(new Event("change", { bubbles: true }));
        this.changeListen(true);
      }
      createOptgroup(optgroup) {
        const optgroupEl = document.createElement("optgroup");
        optgroupEl.id = optgroup.id;
        optgroupEl.label = optgroup.label;
        if (optgroup.selectAll) {
          optgroupEl.dataset.selectAll = "true";
        }
        if (optgroup.closable !== "off") {
          optgroupEl.dataset.closable = optgroup.closable;
        }
        if (optgroup.options) {
          for (const o of optgroup.options) {
            optgroupEl.appendChild(this.createOption(o));
          }
        }
        return optgroupEl;
      }
      createOption(info) {
        const optionEl = document.createElement("option");
        optionEl.id = info.id;
        optionEl.value = info.value;
        optionEl.textContent = info.text;
        if (info.html !== "") {
          optionEl.setAttribute("data-html", info.html);
        }
        optionEl.defaultSelected = info.defaultSelected;
        optionEl.selected = info.selected;
        if (info.disabled) {
          optionEl.disabled = true;
        }
        if (!info.display) {
          optionEl.style.display = "none";
        }
        if (info.placeholder) {
          optionEl.setAttribute("data-placeholder", "true");
        }
        if (info.mandatory) {
          optionEl.setAttribute("data-mandatory", "true");
        }
        if (info.class) {
          info.class.split(" ").forEach((optionClass) => {
            optionEl.classList.add(optionClass);
          });
        }
        if (info.data && typeof info.data === "object") {
          Object.keys(info.data).forEach((key) => {
            optionEl.setAttribute("data-" + kebabCase(key), info.data[key]);
          });
        }
        return optionEl;
      }
      destroy() {
        this.changeListen(false);
        this.select.removeEventListener("change", this.valueChange);
        if (this.observer) {
          this.observer.disconnect();
          this.observer = null;
        }
        delete this.select.dataset.id;
        this.showUI();
      }
    }
    class Settings {
      constructor(settings) {
        this.id = "";
        this.style = "";
        this.class = [];
        this.isMultiple = false;
        this.isOpen = false;
        this.isFullOpen = false;
        this.intervalMove = null;
        if (!settings) {
          settings = {};
        }
        this.id = "ss-" + generateID();
        this.style = settings.style || "";
        this.class = settings.class || [];
        this.disabled = settings.disabled !== void 0 ? settings.disabled : false;
        this.alwaysOpen = settings.alwaysOpen !== void 0 ? settings.alwaysOpen : false;
        this.showSearch = settings.showSearch !== void 0 ? settings.showSearch : true;
        this.focusSearch = settings.focusSearch !== void 0 ? settings.focusSearch : true;
        this.ariaLabel = settings.ariaLabel || "Combobox";
        this.searchPlaceholder = settings.searchPlaceholder || "Search";
        this.searchText = settings.searchText || "No Results";
        this.searchingText = settings.searchingText || "Searching...";
        this.searchHighlight = settings.searchHighlight !== void 0 ? settings.searchHighlight : false;
        this.closeOnSelect = settings.closeOnSelect !== void 0 ? settings.closeOnSelect : true;
        this.contentLocation = settings.contentLocation || document.body;
        this.contentPosition = settings.contentPosition || "absolute";
        this.openPosition = settings.openPosition || "auto";
        this.placeholderText = settings.placeholderText !== void 0 ? settings.placeholderText : "Select Value";
        this.allowDeselect = settings.allowDeselect !== void 0 ? settings.allowDeselect : false;
        this.hideSelected = settings.hideSelected !== void 0 ? settings.hideSelected : false;
        this.keepOrder = settings.keepOrder !== void 0 ? settings.keepOrder : false;
        this.showOptionTooltips = settings.showOptionTooltips !== void 0 ? settings.showOptionTooltips : false;
        this.minSelected = settings.minSelected || 0;
        this.maxSelected = settings.maxSelected || 1e3;
        this.timeoutDelay = settings.timeoutDelay || 200;
        this.maxValuesShown = settings.maxValuesShown || 20;
        this.maxValuesMessage = settings.maxValuesMessage || "{number} selected";
        this.addableText = settings.addableText || 'Press "Enter" to add {value}';
      }
    }
    class SlimSelect2 {
      constructor(config) {
        var _a;
        this.events = {
          search: void 0,
          searchFilter: (opt, search) => {
            return opt.text.toLowerCase().indexOf(search.toLowerCase()) !== -1;
          },
          addable: void 0,
          beforeChange: void 0,
          afterChange: void 0,
          beforeOpen: void 0,
          afterOpen: void 0,
          beforeClose: void 0,
          afterClose: void 0
        };
        this.windowResize = debounce(() => {
          if (!this.settings.isOpen && !this.settings.isFullOpen) {
            return;
          }
          this.render.moveContent();
        });
        this.windowScroll = debounce(() => {
          if (!this.settings.isOpen && !this.settings.isFullOpen) {
            return;
          }
          this.render.moveContent();
        });
        this.documentClick = (e) => {
          if (!this.settings.isOpen) {
            return;
          }
          if (e.target && !hasClassInTree(e.target, this.settings.id)) {
            this.close(e.type);
          }
        };
        this.windowVisibilityChange = () => {
          if (document.hidden) {
            this.close();
          }
        };
        this.selectEl = typeof config.select === "string" ? document.querySelector(config.select) : config.select;
        if (!this.selectEl) {
          if (config.events && config.events.error) {
            config.events.error(new Error("Could not find select element"));
          }
          return;
        }
        if (this.selectEl.tagName !== "SELECT") {
          if (config.events && config.events.error) {
            config.events.error(new Error("Element isnt of type select"));
          }
          return;
        }
        if (this.selectEl.dataset.ssid) {
          this.destroy();
        }
        this.settings = new Settings(config.settings);
        this.cssClasses = new CssClasses(config.cssClasses);
        const debounceEvents = ["afterChange", "beforeOpen", "afterOpen", "beforeClose", "afterClose"];
        for (const key in config.events) {
          if (!config.events.hasOwnProperty(key)) {
            continue;
          }
          if (debounceEvents.indexOf(key) !== -1) {
            this.events[key] = debounce(config.events[key], 100);
          } else {
            this.events[key] = config.events[key];
          }
        }
        this.settings.disabled = ((_a = config.settings) === null || _a === void 0 ? void 0 : _a.disabled) ? config.settings.disabled : this.selectEl.disabled;
        this.settings.isMultiple = this.selectEl.multiple;
        this.settings.style = this.selectEl.style.cssText;
        this.settings.class = this.selectEl.className.split(" ");
        this.select = new Select(this.selectEl);
        this.select.updateSelect(this.settings.id, this.settings.style, this.settings.class);
        this.select.hideUI();
        this.select.onValueChange = (options) => {
          this.setSelected(options.map((option) => option.id));
        };
        this.select.onClassChange = (classes) => {
          this.settings.class = classes;
          this.render.updateClassStyles();
        };
        this.select.onDisabledChange = (disabled) => {
          if (disabled) {
            this.disable();
          } else {
            this.enable();
          }
        };
        this.select.onOptionsChange = (data) => {
          this.setData(data);
        };
        this.store = new Store(this.settings.isMultiple ? "multiple" : "single", config.data ? config.data : this.select.getData());
        if (config.data) {
          this.select.updateOptions(this.store.getData());
        }
        const renderCallbacks = {
          open: this.open.bind(this),
          close: this.close.bind(this),
          addable: this.events.addable ? this.events.addable : void 0,
          setSelected: this.setSelected.bind(this),
          addOption: this.addOption.bind(this),
          search: this.search.bind(this),
          beforeChange: this.events.beforeChange,
          afterChange: this.events.afterChange
        };
        this.render = new Render(this.settings, this.cssClasses, this.store, renderCallbacks);
        this.render.renderValues();
        this.render.renderOptions(this.store.getData());
        const selectAriaLabel = this.selectEl.getAttribute("aria-label");
        const selectAriaLabelledBy = this.selectEl.getAttribute("aria-labelledby");
        if (selectAriaLabel) {
          this.render.main.main.setAttribute("aria-label", selectAriaLabel);
        } else if (selectAriaLabelledBy) {
          this.render.main.main.setAttribute("aria-labelledby", selectAriaLabelledBy);
        }
        if (this.selectEl.parentNode) {
          this.selectEl.parentNode.insertBefore(this.render.main.main, this.selectEl.nextSibling);
        }
        window.addEventListener("resize", this.windowResize, false);
        if (this.settings.openPosition === "auto") {
          window.addEventListener("scroll", this.windowScroll, false);
        }
        document.addEventListener("visibilitychange", this.windowVisibilityChange);
        if (this.settings.disabled) {
          this.disable();
        }
        if (this.settings.alwaysOpen) {
          this.open();
        }
        this.selectEl.slim = this;
      }
      enable() {
        this.settings.disabled = false;
        this.select.enable();
        this.render.enable();
      }
      disable() {
        this.settings.disabled = true;
        this.select.disable();
        this.render.disable();
      }
      getData() {
        return this.store.getData();
      }
      setData(data) {
        const selected = this.store.getSelected();
        const err = this.store.validateDataArray(data);
        if (err) {
          if (this.events.error) {
            this.events.error(err);
          }
          return;
        }
        this.store.setData(data);
        const dataClean = this.store.getData();
        this.select.updateOptions(dataClean);
        this.render.renderValues();
        this.render.renderOptions(dataClean);
        if (this.events.afterChange && !isEqual(selected, this.store.getSelected())) {
          this.events.afterChange(this.store.getSelectedOptions());
        }
      }
      getSelected() {
        let options = this.store.getSelectedOptions();
        if (this.settings.keepOrder) {
          options = this.store.selectedOrderOptions(options);
        }
        return options.map((option) => option.value);
      }
      setSelected(values, runAfterChange = true) {
        const selected = this.store.getSelected();
        const options = this.store.getDataOptions();
        values = Array.isArray(values) ? values : [values];
        const ids = [];
        for (const value of values) {
          if (options.find((option) => option.id == value)) {
            ids.push(value);
            continue;
          }
          for (const option of options.filter((option2) => option2.value == value)) {
            ids.push(option.id);
          }
        }
        this.store.setSelectedBy("id", ids);
        const data = this.store.getData();
        this.select.updateOptions(data);
        this.render.renderValues();
        if (this.render.content.search.input.value !== "") {
          this.search(this.render.content.search.input.value);
        } else {
          this.render.renderOptions(data);
        }
        if (runAfterChange && this.events.afterChange && !isEqual(selected, this.store.getSelected())) {
          this.events.afterChange(this.store.getSelectedOptions());
        }
      }
      addOption(option) {
        const selected = this.store.getSelected();
        if (!this.store.getDataOptions().some((o) => {
          var _a;
          return o.value === ((_a = option.value) !== null && _a !== void 0 ? _a : option.text);
        })) {
          this.store.addOption(option);
        }
        const data = this.store.getData();
        this.select.updateOptions(data);
        this.render.renderValues();
        this.render.renderOptions(data);
        if (this.events.afterChange && !isEqual(selected, this.store.getSelected())) {
          this.events.afterChange(this.store.getSelectedOptions());
        }
      }
      open() {
        if (this.settings.disabled || this.settings.isOpen) {
          return;
        }
        if (this.events.beforeOpen) {
          this.events.beforeOpen();
        }
        this.render.open();
        if (this.settings.showSearch && this.settings.focusSearch) {
          this.render.searchFocus();
        }
        this.settings.isOpen = true;
        setTimeout(() => {
          if (this.events.afterOpen) {
            this.events.afterOpen();
          }
          if (this.settings.isOpen) {
            this.settings.isFullOpen = true;
          }
          document.addEventListener("click", this.documentClick);
        }, this.settings.timeoutDelay);
        if (this.settings.contentPosition === "absolute") {
          if (this.settings.intervalMove) {
            clearInterval(this.settings.intervalMove);
          }
          this.settings.intervalMove = setInterval(this.render.moveContent.bind(this.render), 500);
        }
      }
      close(eventType = null) {
        if (!this.settings.isOpen || this.settings.alwaysOpen) {
          return;
        }
        if (this.events.beforeClose) {
          this.events.beforeClose();
        }
        this.render.close();
        if (this.render.content.search.input.value !== "") {
          this.search("");
        }
        this.render.mainFocus(eventType);
        this.settings.isOpen = false;
        this.settings.isFullOpen = false;
        setTimeout(() => {
          if (this.events.afterClose) {
            this.events.afterClose();
          }
          document.removeEventListener("click", this.documentClick);
        }, this.settings.timeoutDelay);
        if (this.settings.intervalMove) {
          clearInterval(this.settings.intervalMove);
        }
      }
      search(value) {
        if (this.render.content.search.input.value !== value) {
          this.render.content.search.input.value = value;
        }
        if (!this.events.search) {
          this.render.renderOptions(value === "" ? this.store.getData() : this.store.search(value, this.events.searchFilter));
          return;
        }
        this.render.renderSearching();
        const searchResp = this.events.search(value, this.store.getSelectedOptions());
        if (searchResp instanceof Promise) {
          searchResp.then((data) => {
            this.render.renderOptions(this.store.partialToFullData(data));
          }).catch((err) => {
            this.render.renderError(typeof err === "string" ? err : err.message);
          });
          return;
        } else if (Array.isArray(searchResp)) {
          this.render.renderOptions(this.store.partialToFullData(searchResp));
        } else {
          this.render.renderError("Search event must return a promise or an array of data");
        }
      }
      destroy() {
        document.removeEventListener("click", this.documentClick);
        window.removeEventListener("resize", this.windowResize, false);
        if (this.settings.openPosition === "auto") {
          window.removeEventListener("scroll", this.windowScroll, false);
        }
        document.removeEventListener("visibilitychange", this.windowVisibilityChange);
        this.store.setData([]);
        this.render.destroy();
        this.select.destroy();
      }
    }
    return SlimSelect2;
  });
})(slimselect);
var slimselectExports = slimselect.exports;
const SlimSelect = /* @__PURE__ */ getDefaultExportFromCjs(slimselectExports);
const configSelect = {
  messages: {
    placeholder: "Выберите",
    searchText: "Ничего не найдено",
    searchPlaceholder: "Поиск"
  }
};
function initSlimSelect(parentSelector, selectSelector, clear) {
  const destroySelects = () => {
    var _a;
    if (!((_a = window.selects) == null ? void 0 : _a.length)) {
      window.selects = [];
    } else {
      window.selects.forEach((select) => select.destroy());
      window.selects = [];
    }
  };
  window.destroySelects = () => destroySelects();
  destroySelects();
  const selectList = document.querySelectorAll(parentSelector);
  selectList.forEach((selectItem) => {
    var _a;
    const select = selectItem.querySelector(selectSelector);
    if (!select) return;
    const placeholder = select.getAttribute("data-placeholder");
    const multiple = select.hasAttribute("multiple");
    const search = select.hasAttribute("data-search");
    const dropdown = selectItem.querySelector(`#slim-dropdown`);
    const isException = select.hasAttribute("data-select-exсept");
    const slimSelectInstance = new SlimSelect({
      select,
      settings: {
        showSearch: search,
        searchText: configSelect.messages.searchText,
        searchPlaceholder: configSelect.messages.searchPlaceholder,
        placeholderText: placeholder || configSelect.messages.placeholder,
        closeOnSelect: !multiple,
        allowDeselect: multiple,
        maxValuesMessage: "Выбрано: {number}",
        maxSelected: 5,
        openPosition: "down",
        contentLocation: dropdown || null,
        contentPosition: dropdown ? "relative" : "absolute"
      }
    });
    if (!isException) {
      (_a = window.selects) == null ? void 0 : _a.push(slimSelectInstance);
    }
  });
}
function initAnimations() {
  function animation(targets, options) {
    const animateTargets = document.querySelectorAll(`.${targets}`);
    const animateClass = options.animationClass || "animate";
    const treshold = options.treshold || 0.45;
    const isReturnable = options.isReturnable || false;
    const delayStart = Number.isNaN(options.delayStart) ? 0.25 : options.delayStart;
    const delayShift = Number.isNaN(options.delayShift) ? 0.1 : options.delayShift;
    const observeParams = {
      rootMargin: "0px",
      threshold: treshold
    };
    if (window.matchMedia("(max-width: 768px)").matches) {
      observeParams.threshold = +treshold - 0.1;
    }
    if (animateTargets) {
      const observerCallback = (entries) => {
        let delay = Number.isNaN(delayStart) ? 0.25 : delayStart;
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.classList.contains(targets)) {
            if (delayShift && delayShift !== 0) {
              entry.target.setAttribute(
                "style",
                `animation-delay: ${delay}s;`
              );
              delay += delayShift;
            }
            entry.target.classList.add(animateClass);
            entry.target.addEventListener(
              "animationend",
              (e) => {
                e.stopImmediatePropagation();
                entry.target.classList.remove(
                  targets,
                  animateClass
                );
                entry.target.removeAttribute("style");
              },
              { once: true }
            );
          } else if (isReturnable) {
            entry.target.classList.add(targets);
          }
        });
      };
      const animateObserver = new IntersectionObserver(
        observerCallback,
        observeParams
      );
      animateTargets.forEach((target) => {
        animateObserver.observe(target);
      });
    }
  }
  animation("fadeInUp", {
    animationClass: "js-visible"
  });
  animation("fadeInLeft", {
    animationClass: "js-visible"
  });
  animation("fadeInRight", {
    animationClass: "js-visible"
  });
  animation("fadeInBottom", {
    animationClass: "js-visible"
  });
}
window.addEventListener("DOMContentLoaded", () => {
  setScrollWidth();
  iosFixes();
  initTheme();
  calcHeaderHeight();
  new initInputFile();
  initNoUiSlider();
  initSlimSelect(".default-select", ".default-select__select");
  initAnimations();
});
window.addEventListener("load", () => {
  initModals();
});
//# sourceMappingURL=main.js.map
