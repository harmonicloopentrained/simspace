const grid = document.getElementById('grid');
const count = document.getElementById('count');
const search = document.getElementById('search');
const reload = document.getElementById('reload');
const template = document.getElementById('card-template');

let manifest = [];

function matches(sim, query) {
  if (!query) return true;
  const haystack = [sim.title, sim.file, sim.description, ...(sim.tags || [])].join(' ').toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function render() {
  const query = search.value.trim();
  const sims = manifest.filter((sim) => matches(sim, query));
  grid.textContent = '';
  count.textContent = String(manifest.length);

  if (!sims.length) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'No matching simulations found.';
    grid.appendChild(empty);
    return;
  }

  sims.forEach((sim) => {
    const node = template.content.cloneNode(true);
    node.querySelector('.sim-number').textContent = `#${String(sim.order).padStart(2, '0')}`;
    node.querySelector('h2').textContent = sim.title;
    node.querySelector('.description').textContent = sim.description;
    node.querySelector('.filename').textContent = sim.file;
    const tagBox = node.querySelector('.tags');
    (sim.tags || []).forEach((tag) => {
      const el = document.createElement('span');
      el.className = 'tag';
      el.textContent = tag;
      tagBox.appendChild(el);
    });
    node.querySelector('.launch').addEventListener('click', () => {
      window.chrysalisVault.launchSimulation(sim.id);
    });
    grid.appendChild(node);
  });
}

async function load() {
  const data = await window.chrysalisVault.getManifest();
  manifest = (data.simulations || []).slice().sort((a, b) => a.order - b.order);
  render();
}

search.addEventListener('input', render);
reload.addEventListener('click', load);
load().catch((error) => {
  grid.innerHTML = `<div class="empty">Vault manifest failed to load: ${error.message}</div>`;
});
