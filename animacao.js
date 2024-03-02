var AnimacaoPerfil = function () {
    'use strict';
  
    class _0x2e36ed {
      constructor(_0x403203, _0x529016 = {}) {
        if (!(_0x403203 instanceof Node)) {
          throw "Can't initialize AnimacaoPerfil because " + _0x403203 + " is not a Node.";
        }
        this.width = null;
        this.height = null;
        this.clientWidth = null;
        this.clientHeight = null;
        this.left = null;
        this.top = null;
        this.gammazero = null;
        this.betazero = null;
        this.lastgammazero = null;
        this.lastbetazero = null;
        this.transitionTimeout = null;
        this.updateCall = null;
        this.event = null;
        this.updateBind = this.update.bind(this);
        this.resetBind = this.reset.bind(this);
        this.element = _0x403203;
        this.settings = this.extendSettings(_0x529016);
        this.reverse = this.settings.reverse ? -1 : 1;
        this.resetToStart = _0x2e36ed.isSettingTrue(this.settings["reset-to-start"]);
        this.glare = _0x2e36ed.isSettingTrue(this.settings.glare);
        this.glarePrerender = _0x2e36ed.isSettingTrue(this.settings["glare-prerender"]);
        this.fullPageListening = _0x2e36ed.isSettingTrue(this.settings["full-page-listening"]);
        this.gyroscope = _0x2e36ed.isSettingTrue(this.settings.gyroscope);
        this.gyroscopeSamples = this.settings.gyroscopeSamples;
        this.elementListener = this.getElementListener();
        if (this.glare) {
          this.prepareGlare();
        }
        if (this.fullPageListening) {
          this.updateClientSize();
        }
        this.addEventListeners();
        this.reset();
        if (this.resetToStart === false) {
          this.settings.startX = 0;
          this.settings.startY = 0;
        }
      }
      static isSettingTrue(_0x3b73eb) {
        return _0x3b73eb === "" || _0x3b73eb === true || _0x3b73eb === 1;
      }
      getElementListener() {
        if (this.fullPageListening) {
          return window.document;
        }
        if (typeof this.settings["mouse-event-element"] === "string") {
          const _0x50cf4d = document.querySelector(this.settings["mouse-event-element"]);
          if (_0x50cf4d) {
            return _0x50cf4d;
          }
        }
        if (this.settings["mouse-event-element"] instanceof Node) {
          return this.settings["mouse-event-element"];
        }
        return this.element;
      }
      addEventListeners() {
        this.onMouseEnterBind = this.onMouseEnter.bind(this);
        this.onMouseMoveBind = this.onMouseMove.bind(this);
        this.onMouseLeaveBind = this.onMouseLeave.bind(this);
        this.onWindowResizeBind = this.onWindowResize.bind(this);
        this.onDeviceOrientationBind = this.onDeviceOrientation.bind(this);
        this.elementListener.addEventListener("mouseenter", this.onMouseEnterBind);
        this.elementListener.addEventListener("mouseleave", this.onMouseLeaveBind);
        this.elementListener.addEventListener("mousemove", this.onMouseMoveBind);
        if (this.glare || this.fullPageListening) {
          window.addEventListener("resize", this.onWindowResizeBind);
        }
        if (this.gyroscope) {
          window.addEventListener("deviceorientation", this.onDeviceOrientationBind);
        }
      }
      removeEventListeners() {
        this.elementListener.removeEventListener("mouseenter", this.onMouseEnterBind);
        this.elementListener.removeEventListener("mouseleave", this.onMouseLeaveBind);
        this.elementListener.removeEventListener("mousemove", this.onMouseMoveBind);
        if (this.gyroscope) {
          window.removeEventListener("deviceorientation", this.onDeviceOrientationBind);
        }
        if (this.glare || this.fullPageListening) {
          window.removeEventListener("resize", this.onWindowResizeBind);
        }
      }
      destroy() {
        clearTimeout(this.transitionTimeout);
        if (this.updateCall !== null) {
          cancelAnimationFrame(this.updateCall);
        }
        this.element.style.willChange = "";
        this.element.style.transition = "";
        this.element.style.transform = "";
        this.resetGlare();
        this.removeEventListeners();
        this.element.AnimacaoPerfil = null;
        delete this.element.AnimacaoPerfil;
        this.element = null;
      }
      onDeviceOrientation(_0x1f8d70) {
        if (_0x1f8d70.gamma === null || _0x1f8d70.beta === null) {
          return;
        }
        this.updateElementPosition();
        if (this.gyroscopeSamples > 0) {
          this.lastgammazero = this.gammazero;
          this.lastbetazero = this.betazero;
          if (this.gammazero === null) {
            this.gammazero = _0x1f8d70.gamma;
            this.betazero = _0x1f8d70.beta;
          } else {
            this.gammazero = (_0x1f8d70.gamma + this.lastgammazero) / 2;
            this.betazero = (_0x1f8d70.beta + this.lastbetazero) / 2;
          }
          this.gyroscopeSamples -= 1;
        }
        const _0x164dcf = this.settings.gyroscopeMaxAngleX - this.settings.gyroscopeMinAngleX;
        const _0xaa6fcf = this.settings.gyroscopeMaxAngleY - this.settings.gyroscopeMinAngleY;
        const _0x16f0ea = _0x164dcf / this.width;
        const _0x5970dd = _0xaa6fcf / this.height;
        const _0x290d55 = _0x1f8d70.gamma - (this.settings.gyroscopeMinAngleX + this.gammazero);
        const _0x536628 = _0x1f8d70.beta - (this.settings.gyroscopeMinAngleY + this.betazero);
        const _0x295d0c = _0x290d55 / _0x16f0ea;
        const _0x24d7c9 = _0x536628 / _0x5970dd;
        if (this.updateCall !== null) {
          cancelAnimationFrame(this.updateCall);
        }
        this.event = {
          clientX: _0x295d0c + this.left,
          clientY: _0x24d7c9 + this.top
        };
        this.updateCall = requestAnimationFrame(this.updateBind);
      }
      onMouseEnter() {
        this.updateElementPosition();
        this.element.style.willChange = "transform";
        this.setTransition();
      }
      onMouseMove(_0x2dfe69) {
        if (this.updateCall !== null) {
          cancelAnimationFrame(this.updateCall);
        }
        this.event = _0x2dfe69;
        this.updateCall = requestAnimationFrame(this.updateBind);
      }
      onMouseLeave() {
        this.setTransition();
        if (this.settings.reset) {
          requestAnimationFrame(this.resetBind);
        }
      }
      reset() {
        this.onMouseEnter();
        if (this.fullPageListening) {
          this.event = {
            clientX: (this.settings.startX + this.settings.max) / (this.settings.max * 2) * this.clientWidth,
            clientY: (this.settings.startY + this.settings.max) / (this.settings.max * 2) * this.clientHeight
          };
        } else {
          this.event = {
            clientX: this.left + (this.settings.startX + this.settings.max) / (this.settings.max * 2) * this.width,
            clientY: this.top + (this.settings.startY + this.settings.max) / (this.settings.max * 2) * this.height
          };
        }
        let _0x1f4e71 = this.settings.scale;
        this.settings.scale = 1;
        this.update();
        this.settings.scale = _0x1f4e71;
        this.resetGlare();
      }
      resetGlare() {
        if (this.glare) {
          this.glareElement.style.transform = "rotate(180deg) translate(-50%, -50%)";
          this.glareElement.style.opacity = "0";
        }
      }
      getValues() {
        let _0x3badec;
        let _0x5d0284;
        if (this.fullPageListening) {
          _0x3badec = this.event.clientX / this.clientWidth;
          _0x5d0284 = this.event.clientY / this.clientHeight;
        } else {
          _0x3badec = (this.event.clientX - this.left) / this.width;
          _0x5d0284 = (this.event.clientY - this.top) / this.height;
        }
        _0x3badec = Math.min(Math.max(_0x3badec, 0), 1);
        _0x5d0284 = Math.min(Math.max(_0x5d0284, 0), 1);
        let _0x8e4223 = (this.reverse * (this.settings.max - _0x3badec * this.settings.max * 2)).toFixed(2);
        let _0x5f3dfc = (this.reverse * (_0x5d0284 * this.settings.max * 2 - this.settings.max)).toFixed(2);
        let _0x533d69 = Math.atan2(this.event.clientX - (this.left + this.width / 2), -(this.event.clientY - (this.top + this.height / 2))) * (180 / Math.PI);
        return {
          tiltX: _0x8e4223,
          tiltY: _0x5f3dfc,
          percentageX: _0x3badec * 100,
          percentageY: _0x5d0284 * 100,
          angle: _0x533d69
        };
      }
      updateElementPosition() {
        let _0x3e9cba = this.element.getBoundingClientRect();
        this.width = this.element.offsetWidth;
        this.height = this.element.offsetHeight;
        this.left = _0x3e9cba.left;
        this.top = _0x3e9cba.top;
      }
      update() {
        let _0x4f0a1f = this.getValues();
        this.element.style.transform = "perspective(" + this.settings.perspective + "px) rotateX(" + (this.settings.axis === "x" ? 0 : _0x4f0a1f.tiltY) + "deg) rotateY(" + (this.settings.axis === "y" ? 0 : _0x4f0a1f.tiltX) + "deg) scale3d(" + this.settings.scale + ", " + this.settings.scale + ", " + this.settings.scale + ")";
        if (this.glare) {
          this.glareElement.style.transform = "rotate(" + _0x4f0a1f.angle + "deg) translate(-50%, -50%)";
          this.glareElement.style.opacity = "" + _0x4f0a1f.percentageY * this.settings["max-glare"] / 100;
        }
        this.element.dispatchEvent(new CustomEvent("tiltChange", {
          detail: _0x4f0a1f
        }));
        this.updateCall = null;
      }
      prepareGlare() {
        if (!this.glarePrerender) {
          const _0x15908b = document.createElement("div");
          _0x15908b.classList.add("js-tilt-glare");
          const _0x2c6ed5 = document.createElement("div");
          _0x2c6ed5.classList.add("js-tilt-glare-inner");
          _0x15908b.appendChild(_0x2c6ed5);
          this.element.appendChild(_0x15908b);
        }
        this.glareElementWrapper = this.element.querySelector(".js-tilt-glare");
        this.glareElement = this.element.querySelector(".js-tilt-glare-inner");
        if (this.glarePrerender) {
          return;
        }
        Object.assign(this.glareElementWrapper.style, {
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          "pointer-events": "none",
          "border-radius": "inherit"
        });
        Object.assign(this.glareElement.style, {
          position: "absolute",
          top: "50%",
          left: "50%",
          "pointer-events": "none",
          "background-image": "linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
          transform: "rotate(180deg) translate(-50%, -50%)",
          "transform-origin": "0% 0%",
          opacity: "0"
        });
        this.updateGlareSize();
      }
      updateGlareSize() {
        if (this.glare) {
          const _0x236892 = (this.element.offsetWidth > this.element.offsetHeight ? this.element.offsetWidth : this.element.offsetHeight) * 2;
          Object.assign(this.glareElement.style, {
            width: _0x236892 + "px",
            height: _0x236892 + "px"
          });
        }
      }
      updateClientSize() {
        this.clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        this.clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      }
      onWindowResize() {
        this.updateGlareSize();
        this.updateClientSize();
      }
      setTransition() {
        clearTimeout(this.transitionTimeout);
        this.element.style.transition = this.settings.speed + "ms " + this.settings.easing;
        if (this.glare) {
          this.glareElement.style.transition = "opacity " + this.settings.speed + "ms " + this.settings.easing;
        }
        this.transitionTimeout = setTimeout(() => {
          this.element.style.transition = "";
          if (this.glare) {
            this.glareElement.style.transition = "";
          }
        }, this.settings.speed);
      }
      extendSettings(_0x22dbc4) {
        let _0x246c38 = {
          reverse: false,
          max: 15,
          startX: 0,
          startY: 0,
          perspective: 1000,
          easing: "cubic-bezier(.03,.98,.52,.99)",
          scale: 1,
          speed: 300,
          transition: true,
          axis: null,
          glare: false,
          "max-glare": 1,
          "glare-prerender": false,
          "full-page-listening": false,
          "mouse-event-element": null,
          reset: true,
          "reset-to-start": true,
          gyroscope: true,
          gyroscopeMinAngleX: -45,
          gyroscopeMaxAngleX: 45,
          gyroscopeMinAngleY: -45,
          gyroscopeMaxAngleY: 45,
          gyroscopeSamples: 10
        };
        let _0x52563b = {};
        for (var _0x262bcd in _0x246c38) {
          if (_0x262bcd in _0x22dbc4) {
            _0x52563b[_0x262bcd] = _0x22dbc4[_0x262bcd];
          } else if (this.element.hasAttribute("data-tilt-" + _0x262bcd)) {
            let _0x4a2547 = this.element.getAttribute("data-tilt-" + _0x262bcd);
            try {
              _0x52563b[_0x262bcd] = JSON.parse(_0x4a2547);
            } catch (_0x19dadb) {
              _0x52563b[_0x262bcd] = _0x4a2547;
            }
          } else {
            _0x52563b[_0x262bcd] = _0x246c38[_0x262bcd];
          }
        }
        return _0x52563b;
      }
      static init(_0x3a17e0, _0x133513) {
        if (_0x3a17e0 instanceof Node) {
          _0x3a17e0 = [_0x3a17e0];
        }
        if (_0x3a17e0 instanceof NodeList) {
          _0x3a17e0 = [].slice.call(_0x3a17e0);
        }
        if (!(_0x3a17e0 instanceof Array)) {
          return;
        }
        _0x3a17e0.forEach(_0x4afae0 => {
          if (!("AnimacaoPerfil" in _0x4afae0)) {
            _0x4afae0.AnimacaoPerfil = new _0x2e36ed(_0x4afae0, _0x133513);
          }
        });
      }
    }
    if (typeof document !== "undefined") {
      window.AnimacaoPerfil = _0x2e36ed;
      _0x2e36ed.init(document.querySelectorAll("[data-tilt]"));
    }
    return _0x2e36ed;
  }();