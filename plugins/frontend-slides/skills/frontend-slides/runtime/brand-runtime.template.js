/* SOURCE template for brand/generated/brand-runtime.js. Do not execute directly. */
(() => {
  'use strict';

  const CANVAS_WIDTH = 750;
  const KV_HEIGHT = 1320;
  const BRAND_STATUS = __BRAND_STATUS__;
  const BRAND_NAME = __BRAND_NAME__;
  const CONTROL_IDLE_MS = 1800;
  const AUTOSAVE_DELAY_MS = 300;

  window.FRONTEND_SLIDES_BRAND = Object.freeze({
    name: BRAND_NAME,
    approvalStatus: BRAND_STATUS,
    canvas: Object.freeze({ width: CANVAS_WIDTH, kvHeight: KV_HEIGHT, nonKvHeight: 'content' }),
    runtime: 'brand-runtime-v2'
  });

  class BrandSlidePresentation {
    constructor(stage = document.getElementById('deckStage') || document.querySelector('.deck-stage')) {
      this.stage = stage;
      this.slides = Array.from(document.querySelectorAll('.slide'));
      this.index = 0;
      this.editing = false;
      this.listeners = [];
      this.touchStart = null;
      this.controlTimer = null;
      this.autosaveTimer = null;
      this.deckId = this.readDeckId();
      this.storageKey = `fixed-brand-slides:${this.deckId}:edits:v1`;
      this.editables = Array.from(document.querySelectorAll('[data-editable="text"][data-edit-id]'));

      if (!this.stage || !this.slides.length) {
        console.warn('[brand-runtime] Missing .deck-stage or .slide elements.');
        return;
      }

      if (!this.stage.id) this.stage.id = 'deckStage';
      this.fit = this.fit.bind(this);
      this.syncSlideHeights();
      this.ensureControls();
      this.restoreEdits();
      this.bind();
      this.show(this.readHashIndex() ?? 0, { updateHash: false });
      this.fit();
    }

    readDeckId() {
      const meta = document.querySelector('meta[name="frontend-slides-deck-id"]');
      const explicit = meta?.content?.trim() || document.body?.dataset.deckId?.trim();
      if (explicit) return explicit;
      const fallback = (document.title || location.pathname.split('/').pop() || 'untitled-deck')
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fff_-]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'untitled-deck';
      console.warn('[brand-runtime] Add <meta name="frontend-slides-deck-id"> to isolate saved edits.');
      return fallback;
    }

    readHashIndex() {
      const match = location.hash.match(/^#slide-(\d+)$/);
      if (!match) return null;
      return Math.max(0, Math.min(Number(match[1]) - 1, this.slides.length - 1));
    }

    ensureControls() {
      this.controls = document.querySelector('.deck-controls');
      if (!this.controls) {
        this.controls = document.createElement('div');
        this.controls.className = 'deck-controls';
        this.controls.dataset.runtimeInjected = 'true';
        document.body.append(this.controls);
      }

      this.controls.setAttribute('role', 'toolbar');
      this.controls.setAttribute('aria-label', '演示控制');
      if (!this.controls.querySelector('[data-deck-action]')) {
        this.controls.innerHTML = `
          <button type="button" data-deck-action="previous" aria-label="上一页">←</button>
          <output class="deck-controls__counter" aria-live="polite">1 / ${this.slides.length}</output>
          <button type="button" data-deck-action="next" aria-label="下一页">→</button>
          <span class="deck-controls__divider" aria-hidden="true"></span>
          <button type="button" data-deck-action="edit" aria-pressed="false">编辑</button>
          <button type="button" data-deck-action="save">保存 HTML</button>
          <button type="button" data-deck-action="print">打印 / PDF</button>
        `;
      }
      this.counter = this.controls.querySelector('.deck-controls__counter');
      this.editButton = this.controls.querySelector('[data-deck-action="edit"]');
    }

    on(target, type, handler, options) {
      target.addEventListener(type, handler, options);
      this.listeners.push(() => target.removeEventListener(type, handler, options));
    }

    bind() {
      this.on(window, 'resize', this.fit);
      this.on(window, 'beforeprint', () => {
        this.flushEdits();
        this.syncPrintPageSizes();
      });
      this.on(window, 'beforeunload', () => this.flushEdits());
      this.on(document, 'visibilitychange', () => {
        if (document.visibilityState === 'hidden') this.flushEdits();
      });
      this.on(document, 'keydown', (event) => this.handleKeydown(event));
      this.on(document, 'pointermove', () => this.flashControls(), { passive: true });
      this.on(this.stage, 'click', (event) => this.handleStageClick(event));
      this.on(this.stage, 'touchstart', (event) => this.handleTouchStart(event), { passive: true });
      this.on(this.stage, 'touchend', (event) => this.handleTouchEnd(event), { passive: false });
      this.on(this.controls, 'click', (event) => this.handleControlClick(event));
      this.on(this.controls, 'focusin', () => this.flashControls());

      this.editables.forEach((element) => {
        this.on(element, 'input', () => this.scheduleAutosave());
        this.on(element, 'blur', () => this.flushEdits());
      });
    }

    handleKeydown(event) {
      const target = event.target;
      const isFormTarget = target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        this.saveFile();
        return;
      }
      if (isFormTarget) {
        if (event.key === 'Escape' && this.editing) this.toggleEdit(false);
        return;
      }

      let handled = true;
      if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') this.next();
      else if (event.key === 'ArrowLeft' || event.key === 'PageUp') this.previous();
      else if (event.key === 'Home') this.goTo(0);
      else if (event.key === 'End') this.goTo(this.slides.length - 1);
      else if (event.key.toLowerCase() === 'r') this.reset();
      else if (event.key.toLowerCase() === 'e') this.toggleEdit();
      else if (/^[1-9]$/.test(event.key)) this.goTo(Number(event.key) - 1);
      else handled = false;

      if (handled) {
        event.preventDefault();
        this.flashControls();
      }
    }

    handleControlClick(event) {
      const button = event.target.closest('[data-deck-action]');
      if (!button) return;
      const action = button.dataset.deckAction;
      if (action === 'previous') this.previous();
      else if (action === 'next') this.next();
      else if (action === 'edit') this.toggleEdit();
      else if (action === 'save') this.saveFile();
      else if (action === 'print') this.print();
      this.flashControls();
    }

    handleStageClick(event) {
      if (this.editing || event.target.closest('a, button, input, textarea, select, [contenteditable="true"]')) return;
      const bounds = this.stage.getBoundingClientRect();
      const localX = event.clientX - bounds.left;
      if (localX < bounds.width / 3) this.previous();
      else if (localX > bounds.width * 2 / 3) this.next();
    }

    handleTouchStart(event) {
      if (this.editing || event.touches.length !== 1) return;
      const touch = event.touches[0];
      this.touchStart = { x: touch.clientX, y: touch.clientY, time: performance.now() };
    }

    handleTouchEnd(event) {
      if (!this.touchStart || this.editing || !event.changedTouches.length) return;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - this.touchStart.x;
      const dy = touch.clientY - this.touchStart.y;
      const elapsed = performance.now() - this.touchStart.time;
      this.touchStart = null;

      if (Math.max(Math.abs(dx), Math.abs(dy)) >= 48) {
        event.preventDefault();
        if (Math.abs(dx) >= Math.abs(dy)) dx < 0 ? this.next() : this.previous();
        else dy < 0 ? this.next() : this.previous();
        this.flashControls();
      } else if (elapsed < 500) {
        const bounds = this.stage.getBoundingClientRect();
        const localX = touch.clientX - bounds.left;
        if (localX < bounds.width / 3) this.previous();
        else if (localX > bounds.width * 2 / 3) this.next();
      }
    }

    fit() {
      if (!this.stage) return;
      const height = this.activeSlideHeight();
      const scale = Math.min(window.innerWidth / CANVAS_WIDTH, window.innerHeight / height);
      const x = (window.innerWidth - CANVAS_WIDTH * scale) / 2;
      const y = (window.innerHeight - height * scale) / 2;
      this.stage.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    }

    slideHeight(slide) {
      if (!slide) return KV_HEIGHT;
      const declared = Number.parseInt(slide.dataset.slideHeight || '', 10);
      return Number.isInteger(declared) && declared > 0 ? declared : KV_HEIGHT;
    }

    activeSlideHeight() {
      return this.slideHeight(this.slides[this.index]);
    }

    syncSlideHeights() {
      this.slides.forEach((slide) => {
        const height = this.slideHeight(slide);
        slide.style.setProperty('--slide-height', `${height}px`);
        slide.style.height = `${height}px`;
      });
    }

    syncStageHeight() {
      if (!this.stage) return;
      const height = this.activeSlideHeight();
      this.stage.style.setProperty('--active-slide-height', `${height}px`);
      this.stage.style.height = `${height}px`;
    }

    syncPrintPageSizes() {
      let style = document.getElementById('brand-print-page-sizes');
      if (!style) {
        style = document.createElement('style');
        style.id = 'brand-print-page-sizes';
        document.head.append(style);
      }
      style.textContent = this.slides.map((slide, index) => {
        const pageName = `brand-slide-${index + 1}`;
        const height = this.slideHeight(slide);
        slide.dataset.printPage = pageName;
        return `@page ${pageName} { size: ${CANVAS_WIDTH}px ${height}px; margin: 0; }\n`
          + `.slide[data-print-page="${pageName}"] { page: ${pageName}; }`;
      }).join('\n');
    }

    goTo(index, options) {
      this.show(index, options);
    }

    next() {
      this.show(this.index + 1);
    }

    previous() {
      this.show(this.index - 1);
    }

    show(index, { updateHash = true } = {}) {
      if (!this.slides.length) return;
      this.index = Math.max(0, Math.min(Number(index) || 0, this.slides.length - 1));
      this.slides.forEach((slide, slideIndex) => {
        const current = slideIndex === this.index;
        slide.classList.toggle('active', current);
        slide.classList.toggle('visible', current);
        slide.setAttribute('aria-hidden', String(!current));
        slide.inert = !current;
      });
      this.syncStageHeight();
      this.fit();
      if (this.counter) this.counter.textContent = `${this.index + 1} / ${this.slides.length}`;
      if (updateHash && history.replaceState) history.replaceState(null, '', `#slide-${this.index + 1}`);
      document.dispatchEvent(new CustomEvent('brand-slide-change', {
        detail: {
          index: this.index,
          page: this.index + 1,
          total: this.slides.length,
          height: this.activeSlideHeight(),
          deckId: this.deckId
        }
      }));
    }

    reset() {
      const slide = this.slides[this.index];
      if (!slide) return;
      slide.classList.remove('active', 'visible');
      void slide.offsetWidth;
      slide.classList.add('active', 'visible');
      document.dispatchEvent(new CustomEvent('brand-slide-reset', {
        detail: { index: this.index, page: this.index + 1, deckId: this.deckId }
      }));
    }

    toggleEdit(force) {
      this.editing = typeof force === 'boolean' ? force : !this.editing;
      document.body.classList.toggle('is-editing', this.editing);
      this.editables.forEach((element) => {
        element.contentEditable = this.editing ? 'true' : 'false';
        element.spellcheck = false;
      });
      if (this.editButton) {
        this.editButton.setAttribute('aria-pressed', String(this.editing));
        this.editButton.textContent = this.editing ? '完成编辑' : '编辑';
      }
      if (!this.editing) this.flushEdits();
      document.dispatchEvent(new CustomEvent('brand-edit-mode-change', {
        detail: { editing: this.editing, deckId: this.deckId }
      }));
      this.flashControls();
      return this.editing;
    }

    collectEdits() {
      const edits = {};
      this.editables.forEach((element) => {
        edits[element.dataset.editId] = element.textContent;
      });
      return edits;
    }

    restoreEdits() {
      let saved;
      try {
        saved = JSON.parse(localStorage.getItem(this.storageKey) || 'null');
      } catch (error) {
        console.warn('[brand-runtime] Saved edits could not be read.', error);
        return;
      }
      if (!saved || saved.version !== 1 || !saved.edits) return;
      this.editables.forEach((element) => {
        if (Object.prototype.hasOwnProperty.call(saved.edits, element.dataset.editId)) {
          element.textContent = saved.edits[element.dataset.editId];
        }
      });
    }

    scheduleAutosave() {
      clearTimeout(this.autosaveTimer);
      this.autosaveTimer = setTimeout(() => this.flushEdits(), AUTOSAVE_DELAY_MS);
    }

    flushEdits() {
      clearTimeout(this.autosaveTimer);
      if (!this.editables.length) return false;
      const payload = { version: 1, updatedAt: new Date().toISOString(), edits: this.collectEdits() };
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(payload));
        document.dispatchEvent(new CustomEvent('brand-edits-saved', {
          detail: { deckId: this.deckId, count: Object.keys(payload.edits).length }
        }));
        return true;
      } catch (error) {
        console.warn('[brand-runtime] Edits could not be saved.', error);
        return false;
      }
    }

    saveFile() {
      this.flushEdits();
      const clone = document.documentElement.cloneNode(true);
      clone.querySelector('body')?.classList.remove('is-editing');
      clone.querySelector('.deck-stage')?.style.removeProperty('transform');
      clone.querySelectorAll('[contenteditable], [spellcheck]').forEach((element) => {
        element.removeAttribute('contenteditable');
        element.removeAttribute('spellcheck');
      });
      clone.querySelectorAll('.slide').forEach((slide) => {
        slide.removeAttribute('aria-hidden');
        slide.removeAttribute('inert');
      });
      const clonedControls = clone.querySelector('.deck-controls');
      if (clonedControls) clonedControls.replaceChildren();

      const source = `<!doctype html>\n${clone.outerHTML}`;
      const blob = new Blob([source], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const requested = document.body.dataset.exportFilename || `${this.deckId}.html`;
      link.download = requested.replace(/[\\/:*?"<>|]+/g, '-');
      link.href = url;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      document.dispatchEvent(new CustomEvent('brand-file-saved', {
        detail: { deckId: this.deckId, filename: link.download }
      }));
    }

    print() {
      this.flushEdits();
      this.syncPrintPageSizes();
      window.print();
    }

    flashControls() {
      if (!this.controls) return;
      this.controls.classList.add('is-visible');
      clearTimeout(this.controlTimer);
      this.controlTimer = setTimeout(() => {
        if (!this.editing && !this.controls.matches(':focus-within')) this.controls.classList.remove('is-visible');
      }, CONTROL_IDLE_MS);
    }

    destroy() {
      this.flushEdits();
      clearTimeout(this.controlTimer);
      clearTimeout(this.autosaveTimer);
      this.listeners.splice(0).forEach((remove) => remove());
      this.editables.forEach((element) => element.removeAttribute('contenteditable'));
      if (this.controls?.dataset.runtimeInjected === 'true') this.controls.remove();
    }
  }

  window.BrandSlidePresentation = BrandSlidePresentation;
  const start = () => {
    if (window.presentation?.destroy) window.presentation.destroy();
    window.presentation = new BrandSlidePresentation();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
