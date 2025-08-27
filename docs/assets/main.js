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
window.addEventListener("DOMContentLoaded", () => {
  setScrollWidth();
  iosFixes();
  initTheme();
});
window.addEventListener("load", () => {
  initModals();
});
//# sourceMappingURL=main.js.map
