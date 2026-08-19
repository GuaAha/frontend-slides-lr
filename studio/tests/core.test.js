import assert from 'node:assert/strict';
import test from 'node:test';
import { assertDeckSpec, clone, coerceSlots, createDeck, createDeckFromIntake, LAYOUTS, outlineFromText, PROPOSALS, splitSlide } from '../src/core.js';

test('registers exactly ten fixed-canvas layouts', () => {
  assert.equal(Object.keys(LAYOUTS).length, 10);
  assert.deepEqual(Object.keys(LAYOUTS), [
    'cover', 'statement', 'image-hero', 'image-left', 'image-right',
    'three-points', 'comparison', 'metric', 'timeline', 'closing',
  ]);
});

test('all three real proposals produce valid DeckSpec documents', () => {
  assert.equal(PROPOSALS.length, 3);
  for (const proposal of PROPOSALS) {
    const deck = createDeck(proposal.id);
    assert.deepEqual(deck.canvas, { width: 750, height: 1320 });
    assert.equal(deck.proposalId, proposal.id);
    assert.equal(deck.slides.length, proposal.sequence.length);
    assert.deepEqual(assertDeckSpec(deck), []);
  }
});

test('layout switching preserves semantic content and registered slots', () => {
  const deck = createDeck();
  const slide = clone(deck.slides[0]);
  const title = slide.slots.title.text;
  coerceSlots(slide, 'comparison');
  assert.equal(slide.layoutId, 'comparison');
  assert.equal(slide.slots.title.text, title);
  assert.deepEqual(Object.keys(slide.slots), Object.keys(LAYOUTS.comparison.slots));
});

test('page splitting keeps content without truncation', () => {
  const deck = createDeck();
  const original = '第一句用于说明背景。第二句用于说明问题。第三句用于说明结论。第四句用于说明行动。';
  deck.slides[0].slots.body.text = original.repeat(3);
  const created = splitSlide(deck, 0, 'body');
  assert.ok(created);
  assert.equal(deck.slides.length, 6);
  assert.equal(deck.slides[0].slots.body.text + created.slots.body.text, original.repeat(3));
});

test('rejects alternate canvas and unregistered layout', () => {
  const deck = createDeck();
  deck.canvas.height = 1333;
  deck.slides[0].layoutId = 'freeform';
  const errors = assertDeckSpec(deck);
  assert.ok(errors.some((item) => item.includes('750 × 1320')));
  assert.ok(errors.some((item) => item.includes('未注册布局')));
});

test('rejects external and unsupported image sources before export', () => {
  const deck = createDeck();
  deck.slides[0].slots.hero.src = 'https://example.com/untrusted.heic';
  const errors = assertDeckSpec(deck);
  assert.ok(errors.some((item) => item.includes('内嵌 PNG、JPEG 或 WebP')));
});

test('builds a real outline and applies it across all three proposals', () => {
  const content = '# 第一页\n真实开场内容。\n\n# 第二页\n真实证据内容。\n\n# 第三页\n真实结论内容。';
  const outline = outlineFromText(content);
  assert.deepEqual(outline.map((item) => item.title), ['第一页', '第二页', '第三页']);
  for (const proposal of PROPOSALS) {
    const deck = createDeckFromIntake(proposal.id, { content, outline, purpose: 'proposal', density: 'speaker-led' });
    assert.equal(deck.slides.length, 3);
    assert.equal(deck.slides[0].slots.title.text, '第一页');
    assert.equal(deck.slides[1].slots.title.text, '第二页');
    assert.deepEqual(assertDeckSpec(deck), []);
  }
});
