const mediaItems = [...document.querySelectorAll('.media-item')];
const filters = [...document.querySelectorAll('[data-filter]')];
const showMedia = document.querySelector('#show-media');
let mediaFilter = 'all';
let showAll = true;

function updateMedia() {
  const matching = mediaItems.filter(item => mediaFilter === 'all' || item.dataset.kind === mediaFilter);
  const visible = mediaFilter === 'all' && !showAll ? matching.slice(0, 8) : matching;
  mediaItems.forEach(item => { item.hidden = !visible.includes(item); });
  filters.forEach(button => {
    const active = button.dataset.filter === mediaFilter;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelector('#media-count').textContent = `${visible.length} of ${matching.length} appearances`;
  showMedia.hidden = mediaFilter !== 'all' || matching.length <= 8;
  showMedia.textContent = showAll ? 'Show fewer appearances ↑' : `Show all ${matching.length} appearances ↓`;
  showMedia.setAttribute('aria-expanded', String(showAll));
  showMedia.setAttribute('aria-controls', 'media-list');
}

if (mediaItems.length) {
  document.querySelector('.media-toolbar').hidden = false;
  filters.forEach(button => button.addEventListener('click', () => {
    mediaFilter = button.dataset.filter;
    updateMedia();
  }));
  showMedia.addEventListener('click', () => {
    showAll = !showAll;
    updateMedia();
    if (!showAll) document.querySelector('.media-toolbar').scrollIntoView({block: 'start'});
  });
  updateMedia();
}

const galleries = {
  rallypoint: [
    ['01-dashboard', 'Attack dashboard: kill chain status, campaign metrics, and the running operator log'],
    ['02-operator-note', 'Dashboard with an operator note open'],
    ['03-oms', 'Operations management'],
    ['04-threat-intel-dashboard', 'Threat intelligence dashboard'],
    ['05-threat-intel', 'Threat intelligence and emulation'],
    ['06-observations', 'Observations'],
    ['07-observation-details', 'Observation details'],
    ['08-assets-workstations', 'Assets: workstations'],
    ['09-asset-details', 'Asset details: workstation / server'],
    ['10-assets-domains', 'Assets: domains'],
    ['11-assets-social', 'Assets: social'],
    ['12-target-details', 'Target details: human target'],
  ],
  playbook: [
    ['01-home', 'Searchable library of offensive security reference sheets'],
    ['02-search', 'Ctrl/Cmd + K search with live cheatsheet preview'],
    ['03-cheatsheet', 'Code Execution cheatsheet rendered by the custom Markdown parser'],
    ['04-cards', 'Card layout with syntax-highlighted code blocks'],
  ],
};
const projectNames = { rallypoint: 'EC RallyPoint', playbook: 'EC Playbook' };

const imageDialog = document.querySelector('#image-dialog');
if (imageDialog && typeof imageDialog.showModal === 'function') {
  let gallery = 'rallypoint';
  let index = 0;
  const show = step => {
    const shots = galleries[gallery];
    index = (index + step + shots.length) % shots.length;
    const [file, caption] = shots[index];
    const image = document.querySelector('#dialog-image');
    image.src = `assets/${gallery}/${file}.png`;
    image.alt = `${projectNames[gallery]}: ${caption}`;
    document.querySelector('#image-caption').textContent = `${projectNames[gallery]} — ${caption}`;
    document.querySelector('#image-count').textContent = `${index + 1} / ${shots.length}`;
  };
  document.querySelectorAll('.screenshot-link').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    gallery = link.dataset.gallery;
    index = 0;
    show(0);
    imageDialog.showModal();
  }));
  imageDialog.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => show(Number(button.dataset.step))));
  imageDialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') show(1);
    if (event.key === 'ArrowLeft') show(-1);
  });
  imageDialog.querySelector('.dialog-close').addEventListener('click', () => imageDialog.close());
  imageDialog.addEventListener('click', event => { if (event.target === imageDialog) imageDialog.close(); });
}
