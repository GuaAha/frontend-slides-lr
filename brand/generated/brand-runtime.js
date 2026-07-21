/* GENERATED from brand/source.json. Do not edit. */
(() => {
  const CANVAS_WIDTH = 750;
  const CANVAS_HEIGHT = 1320;
  const BRAND_STATUS = "draft";
  const BRAND_NAME = "LR Internal";

  window.FRONTEND_SLIDES_BRAND = Object.freeze({
    name: BRAND_NAME,
    approvalStatus: BRAND_STATUS,
    canvas: Object.freeze({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT })
  });

  class BrandSlidePresentation {
    constructor(stage = document.getElementById('deckStage')) {
      this.stage = stage;
      this.slides = Array.from(document.querySelectorAll('.slide'));
      this.index = 0;
      if (!this.stage || !this.slides.length) return;
      this.fit = this.fit.bind(this);
      this.bind();
      this.show(0);
      this.fit();
    }

    bind() {
      window.addEventListener('resize', this.fit);
      document.addEventListener('keydown', (event) => {
        const target = event.target;
        if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
        if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') this.show(this.index + 1);
        else if (event.key === 'ArrowLeft' || event.key === 'PageUp') this.show(this.index - 1);
        else if (event.key === 'Home') this.show(0);
        else if (event.key === 'End') this.show(this.slides.length - 1);
      });
    }

    fit() {
      const scale = Math.min(window.innerWidth / CANVAS_WIDTH, window.innerHeight / CANVAS_HEIGHT);
      const x = (window.innerWidth - CANVAS_WIDTH * scale) / 2;
      const y = (window.innerHeight - CANVAS_HEIGHT * scale) / 2;
      this.stage.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    }

    show(index) {
      this.index = Math.max(0, Math.min(index, this.slides.length - 1));
      this.slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === this.index);
        slide.classList.toggle('visible', i === this.index);
      });
      document.dispatchEvent(new CustomEvent('brand-slide-change', { detail: { index: this.index, total: this.slides.length } }));
    }
  }

  window.BrandSlidePresentation = BrandSlidePresentation;
  const start = () => { window.presentation = new BrandSlidePresentation(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
