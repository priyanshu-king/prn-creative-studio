/**
 * PRN Template Catalog — Canonical source for all templates
 * Shared by EditorPage, WorkbenchPanel, and TemplatesPage
 */

export const TEMPLATE_CATALOG = [
  {
    id: 't-ig-post', name: 'Bold Social Post', category: 'Social', emoji: '📸',
    bg: '#1a1a2e', w: 1080, h: 1080,
    objects: [
      { type: 'rect', left: 0, top: 0, width: 1080, height: 1080, fill: '#c8f135', selectable: false },
      { type: 'i-text', text: 'YOUR STORY', left: 540, top: 440, originX: 'center', originY: 'center', fontSize: 110, fontWeight: '900', fontFamily: 'Inter', fill: '#0d0e14', textAlign: 'center' },
      { type: 'i-text', text: 'PRN Creative Studio', left: 540, top: 580, originX: 'center', originY: 'center', fontSize: 32, fontWeight: '500', fontFamily: 'Inter', fill: '#1a1a2e', textAlign: 'center' },
      { type: 'rect', left: 380, top: 620, width: 320, height: 4, fill: '#0d0e14' },
    ],
  },
  {
    id: 't-yt-thumb', name: 'YouTube Thumbnail', category: 'YouTube', emoji: '▶',
    bg: '#0f0f0f', w: 1280, h: 720,
    objects: [
      { type: 'rect', left: 0, top: 0, width: 1280, height: 720, fill: '#0f0f0f', selectable: false },
      { type: 'rect', left: 0, top: 500, width: 1280, height: 220, fill: '#ff5f41' },
      { type: 'i-text', text: 'CLICK-WORTHY TITLE', left: 640, top: 580, originX: 'center', originY: 'center', fontSize: 64, fontWeight: '900', fontFamily: 'Inter', fill: '#ffffff', textAlign: 'center' },
      { type: 'i-text', text: 'Your Channel Name', left: 640, top: 300, originX: 'center', originY: 'center', fontSize: 48, fontWeight: '700', fontFamily: 'Inter', fill: '#c8f135', textAlign: 'center' },
    ],
  },
  {
    id: 't-presentation', name: 'Pitch Deck Slide', category: 'Presentation', emoji: '📊',
    bg: '#0d0e14', w: 1920, h: 1080,
    objects: [
      { type: 'rect', left: 0, top: 0, width: 1920, height: 1080, fill: '#0d0e14', selectable: false },
      { type: 'rect', left: 0, top: 0, width: 8, height: 1080, fill: '#c8f135' },
      { type: 'i-text', text: 'HEADLINE GOES HERE', left: 960, top: 400, originX: 'center', originY: 'center', fontSize: 96, fontWeight: '900', fontFamily: 'Inter', fill: '#f5f2eb', textAlign: 'center' },
      { type: 'i-text', text: 'Supporting statement that explains the value clearly', left: 960, top: 540, originX: 'center', originY: 'center', fontSize: 38, fontWeight: '400', fontFamily: 'Inter', fill: '#7a7a9a', textAlign: 'center' },
      { type: 'i-text', text: '01', left: 100, top: 980, originX: 'left', originY: 'bottom', fontSize: 22, fontWeight: '700', fontFamily: 'Inter', fill: '#3f3f58' },
    ],
  },
  {
    id: 't-ig-story', name: 'Instagram Story', category: 'Social', emoji: '✨',
    bg: '#9b8ef4', w: 1080, h: 1920,
    objects: [
      { type: 'rect', left: 0, top: 0, width: 1080, height: 1920, fill: '#9b8ef4', selectable: false },
      { type: 'rect', left: 0, top: 0, width: 1080, height: 1920, fill: 'rgba(13,14,20,0.3)', selectable: false },
      { type: 'i-text', text: 'SWIPE UP', left: 540, top: 900, originX: 'center', originY: 'center', fontSize: 120, fontWeight: '900', fontFamily: 'Inter', fill: '#c8f135', textAlign: 'center' },
      { type: 'i-text', text: 'Your story starts here.\nMake it unforgettable.', left: 540, top: 1060, originX: 'center', originY: 'center', fontSize: 40, fontWeight: '400', fontFamily: 'Inter', fill: '#f5f2eb', textAlign: 'center' },
    ],
  },
  {
    id: 't-resume', name: 'Resume Basic', category: 'Document', emoji: '📄',
    bg: '#ffffff', w: 794, h: 1123,
    objects: [
      { type: 'rect', left: 0, top: 0, width: 794, height: 200, fill: '#0d0e14', selectable: false },
      { type: 'i-text', text: 'YOUR NAME', left: 40, top: 70, originX: 'left', originY: 'center', fontSize: 52, fontWeight: '900', fontFamily: 'Inter', fill: '#c8f135' },
      { type: 'i-text', text: 'Product Designer & Creative Strategist', left: 40, top: 130, originX: 'left', originY: 'center', fontSize: 20, fontWeight: '400', fontFamily: 'Inter', fill: '#9b8ef4' },
      { type: 'i-text', text: 'Experience', left: 40, top: 240, originX: 'left', originY: 'center', fontSize: 22, fontWeight: '800', fontFamily: 'Inter', fill: '#0d0e14' },
      { type: 'rect', left: 40, top: 260, width: 80, height: 3, fill: '#c8f135' },
      { type: 'i-text', text: 'Add your experience here\nCompany · Year – Year', left: 40, top: 300, originX: 'left', originY: 'center', fontSize: 16, fontWeight: '400', fontFamily: 'Inter', fill: '#3f3f58' },
    ],
  },
  {
    id: 't-flyer', name: 'Event Flyer', category: 'Print', emoji: '🎉',
    bg: '#ff5f41', w: 1080, h: 1527,
    objects: [
      { type: 'rect', left: 0, top: 0, width: 1080, height: 1527, fill: '#ff5f41', selectable: false },
      { type: 'rect', left: 0, top: 0, width: 1080, height: 1527, fill: 'rgba(13,14,20,0.08)', selectable: false },
      { type: 'i-text', text: 'EVENT\nNAME', left: 540, top: 500, originX: 'center', originY: 'center', fontSize: 140, fontWeight: '900', fontFamily: 'Inter', fill: '#f5f2eb', textAlign: 'center', lineHeight: 0.9 },
      { type: 'i-text', text: 'Date · Venue · Time', left: 540, top: 750, originX: 'center', originY: 'center', fontSize: 42, fontWeight: '400', fontFamily: 'Inter', fill: '#0d0e14', textAlign: 'center' },
      { type: 'i-text', text: 'TICKETS AVAILABLE AT PRN.DESIGN', left: 540, top: 1400, originX: 'center', originY: 'center', fontSize: 22, fontWeight: '700', fontFamily: 'Inter', fill: '#0d0e14', textAlign: 'center' },
    ],
  },
  {
    id: 't-bizcard', name: 'Business Card', category: 'Print', emoji: '💼',
    bg: '#0d0e14', w: 1050, h: 600,
    objects: [
      { type: 'rect', left: 0, top: 0, width: 1050, height: 600, fill: '#0d0e14', selectable: false },
      { type: 'rect', left: 0, top: 0, width: 1050, height: 8, fill: '#c8f135' },
      { type: 'i-text', text: 'First Last', left: 80, top: 250, originX: 'left', originY: 'center', fontSize: 64, fontWeight: '800', fontFamily: 'Inter', fill: '#f5f2eb' },
      { type: 'i-text', text: 'Creative Director', left: 80, top: 320, originX: 'left', originY: 'center', fontSize: 26, fontWeight: '400', fontFamily: 'Inter', fill: '#9b8ef4' },
      { type: 'i-text', text: 'hello@example.com  ·  +1 234 567 8900', left: 80, top: 530, originX: 'left', originY: 'center', fontSize: 18, fontWeight: '400', fontFamily: 'Inter', fill: '#5a5a7a' },
    ],
  },
  {
    id: 't-logo', name: 'Logo Starter', category: 'Branding', emoji: '🎨',
    bg: '#f5f2eb', w: 800, h: 800,
    objects: [
      { type: 'rect', left: 0, top: 0, width: 800, height: 800, fill: '#f5f2eb', selectable: false },
      { type: 'circle', left: 400, top: 380, originX: 'center', originY: 'center', radius: 160, fill: '#0d0e14' },
      { type: 'i-text', text: 'PRN', left: 400, top: 380, originX: 'center', originY: 'center', fontSize: 88, fontWeight: '900', fontFamily: 'Inter', fill: '#c8f135', textAlign: 'center' },
      { type: 'i-text', text: 'YOUR BRAND', left: 400, top: 600, originX: 'center', originY: 'center', fontSize: 30, fontWeight: '700', fontFamily: 'Inter', fill: '#0d0e14', textAlign: 'center', charSpacing: 250 },
    ],
  },
  {
    id: 't-linkedin', name: 'LinkedIn Banner', category: 'Social', emoji: '💼',
    bg: '#0d0e14', w: 1584, h: 396,
    objects: [
      { type: 'rect', left: 0, top: 0, width: 1584, height: 396, fill: '#0d0e14', selectable: false },
      { type: 'rect', left: 0, top: 0, width: 8, height: 396, fill: '#9b8ef4' },
      { type: 'i-text', text: 'Your Professional Tagline', left: 100, top: 170, originX: 'left', originY: 'center', fontSize: 64, fontWeight: '800', fontFamily: 'Inter', fill: '#f5f2eb' },
      { type: 'i-text', text: 'Job Title  ·  Industry  ·  Location', left: 100, top: 260, originX: 'left', originY: 'center', fontSize: 28, fontWeight: '400', fontFamily: 'Inter', fill: '#7a7a9a' },
    ],
  },
  {
    id: 't-twitter', name: 'Twitter/X Post', category: 'Social', emoji: '🐦',
    bg: '#000000', w: 1200, h: 675,
    objects: [
      { type: 'rect', left: 0, top: 0, width: 1200, height: 675, fill: '#000', selectable: false },
      { type: 'i-text', text: 'YOUR TAKE.', left: 600, top: 280, originX: 'center', originY: 'center', fontSize: 100, fontWeight: '900', fontFamily: 'Inter', fill: '#c8f135', textAlign: 'center' },
      { type: 'i-text', text: '@yourhandle', left: 600, top: 420, originX: 'center', originY: 'center', fontSize: 36, fontWeight: '400', fontFamily: 'Inter', fill: '#555', textAlign: 'center' },
    ],
  },
];