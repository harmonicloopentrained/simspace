const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sourceDir = path.join(root, 'source-html', 'included');
const simDir = path.join(root, 'vault', 'sims');
const vendorDir = path.join(root, 'vault', 'vendor');
const threeDir = path.join(vendorDir, 'three');
const addonsDir = path.join(threeDir, 'addons');

const simulations = [
  {
    "id": "complexuniverse-2",
    "order": 1,
    "title": "Nested Dimensions",
    "file": "complexuniverse(2).html",
    "description": "Nested dimensional reality simulation with coherence, chaos, and time-flow controls.",
    "tags": [
      "three",
      "particles",
      "dimensions"
    ],
    "runtime": "local-html",
    "included": true
  },
  {
    "id": "9dvector",
    "order": 2,
    "title": "9D Fibonacci Vector",
    "file": "9Dvector.html",
    "description": "Canvas-based Genesis Engine / Fibonacci vector simulation with seed-amplitude controls.",
    "tags": [
      "canvas",
      "fibonacci",
      "vector"
    ],
    "runtime": "local-html",
    "included": true
  },
  {
    "id": "thebeginningofbeginnings",
    "order": 3,
    "title": "The Big Bang: Generative Narrative",
    "file": "thebeginningofbeginnings.html",
    "description": "Lattice/particle big-bang style simulation with narrative phases.",
    "tags": [
      "three",
      "lattice",
      "big-bang"
    ],
    "runtime": "local-html",
    "included": true
  },
  {
    "id": "polyphoniccosmos",
    "order": 4,
    "title": "Polyphonic Cosmos",
    "file": "polyphoniccosmos.html",
    "description": "Entangled harmonic spiral field with large particle structures.",
    "tags": [
      "three",
      "particles",
      "harmonics"
    ],
    "runtime": "local-html",
    "included": true
  },
  {
    "id": "zomegareality",
    "order": 5,
    "title": "The Omega Field",
    "file": "Zomegareality.html",
    "description": "State-based Omega Field simulation with mouse coherence interaction.",
    "tags": [
      "three",
      "omega",
      "field"
    ],
    "runtime": "local-html",
    "included": true
  },
  {
    "id": "super-highway",
    "order": 6,
    "title": "Super Highway",
    "file": "super_highway.html",
    "description": "Additional copy/branch of the Polyphonic Cosmos simulation kept as an original vault entry.",
    "tags": [
      "three",
      "particles",
      "branch"
    ],
    "runtime": "local-html",
    "included": true
  },
  {
    "id": "strings-and-dimensions",
    "order": 7,
    "title": "Strings & Dimensions",
    "file": "strings_and_dimensions.html",
    "description": "String/superstring phase simulation unfolding into higher-dimensional flow.",
    "tags": [
      "three",
      "strings",
      "dimensions"
    ],
    "runtime": "local-html",
    "included": true
  },
  {
    "id": "hyperdimensionalmultiverse",
    "order": 8,
    "title": "Hyper-Dimensional Multiverse",
    "file": "hyperdimensionalmultiverse.html",
    "description": "Hyper-dimensional emergent-reality simulation with coherence, chaos, and time controls.",
    "tags": [
      "three",
      "multiverse",
      "dimensions"
    ],
    "runtime": "local-html",
    "included": true
  },
  {
    "id": "multiverse",
    "order": 9,
    "title": "Emergent Multiverse",
    "file": "multiverse.html",
    "description": "Universe-bubble coherence cascade simulation.",
    "tags": [
      "three",
      "bubbles",
      "cascade"
    ],
    "runtime": "local-html",
    "included": true
  },
  {
    "id": "orderinthechaos",
    "order": 10,
    "title": "Order in the Chaos",
    "file": "ORDERINTHECHAOS.html",
    "description": "Coherent torus/field structure simulation with interactive coherence sliders.",
    "tags": [
      "three",
      "torus",
      "coherence"
    ],
    "runtime": "local-html",
    "included": true
  },
  {
    "id": "justamultidream",
    "order": 11,
    "title": "Just a Multidream",
    "file": "JUSTAMULTIDREAM.html",
    "description": "High-coherence multiverse simulation with many universe points and torus formation.",
    "tags": [
      "three",
      "multiverse",
      "high-coherence"
    ],
    "runtime": "local-html",
    "included": true
  },
  {
    "id": "justamemory",
    "order": 12,
    "title": "Just a Memory",
    "file": "JUSTAMEMORY.html",
    "description": "Cosmic web / engineered chaos simulation.",
    "tags": [
      "three",
      "cosmic-web",
      "memory"
    ],
    "runtime": "local-html",
    "included": true
  },
  {
    "id": "failedexperimentaluniverse",
    "order": 13,
    "title": "Failed Experimental Universe",
    "file": "failedexperimentaluniverse.html",
    "description": "Wild asymptotic-float / high-coherence multiverse branch preserved as an experimental sim.",
    "tags": [
      "three",
      "experimental",
      "float"
    ],
    "runtime": "local-html",
    "included": true
  },
  {
    "id": "big-bang",
    "order": 14,
    "title": "The Genesis Field",
    "file": "BIG_BANG.html",
    "description": "Large-particle Genesis Field simulation with baseline coherence and variance controls.",
    "tags": [
      "three",
      "genesis",
      "field"
    ],
    "runtime": "local-html",
    "included": true
  }
];

const THREE_MODULE_CDN = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
const THREE_ADDONS_CDN = 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/';

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(source, target) {
  ensureDir(path.dirname(target));
  fs.copyFileSync(source, target);
}

function copyDir(source, target) {
  ensureDir(target);
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const src = path.join(source, entry.name);
    const dst = path.join(target, entry.name);
    if (entry.isDirectory()) copyDir(src, dst);
    else if (entry.isFile()) copyFile(src, dst);
  }
}

function patchHtml(html) {
  return html
    .replaceAll(THREE_MODULE_CDN, '../vendor/three/three.module.js')
    .replaceAll(THREE_ADDONS_CDN, '../vendor/three/addons/')
    .replace(/\s*<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">/g, '')
    .replace(/\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>/g, '')
    .replace(/\s*<link href="https:\/\/fonts\.googleapis\.com\/css2\?[^\"]+" rel="stylesheet">/g, '')
    .replace('<script src="https://cdn.tailwindcss.com"></script>', '<link rel="stylesheet" href="../vendor/tailwind-lite.css">');
}

function writeTailwindLite() {
  const css = `
/* Small offline subset for the legacy Tailwind-authored 9Dvector page. */
.bg-gray-900{background-color:#111827}.text-white{color:#fff}.text-gray-300{color:#d1d5db}.text-sm{font-size:.875rem}.text-2xl{font-size:1.5rem;line-height:2rem}.font-bold{font-weight:700}.font-medium{font-weight:500}.block{display:block}.flex{display:flex}.items-center{align-items:center}.space-x-4>:not([hidden])~:not([hidden]){margin-left:1rem}.space-x-2>:not([hidden])~:not([hidden]){margin-left:.5rem}.mb-2{margin-bottom:.5rem}.mb-4{margin-bottom:1rem}.mt-4{margin-top:1rem}.w-full{width:100%}.px-4{padding-left:1rem;padding-right:1rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.rounded-lg{border-radius:.5rem}.text-center{text-align:center}.hidden{display:none}.btn{border:0;color:#fff;border-radius:.5rem;padding:.5rem 1rem;font-weight:700;cursor:pointer}.btn:disabled{opacity:.55;cursor:not-allowed}
`;
  fs.writeFileSync(path.join(vendorDir, 'tailwind-lite.css'), css.trim() + '\n');
}

function findPackageRoot(packageName) {
  // Do not resolve `${packageName}/package.json`: modern packages can block
  // that subpath via package.json "exports" under Node 24+. Resolve the
  // public module entry, then walk upward until the package root is found.
  const entry = require.resolve(packageName);
  let dir = path.dirname(entry);
  while (dir && dir !== path.dirname(dir)) {
    const packageJson = path.join(dir, 'package.json');
    if (fs.existsSync(packageJson)) return dir;
    dir = path.dirname(dir);
  }
  throw new Error(`Could not locate installed package root for ${packageName} from ${entry}`);
}

function prepareVendor() {
  const threePackageRoot = findPackageRoot('three');
  copyFile(path.join(threePackageRoot, 'build', 'three.module.js'), path.join(threeDir, 'three.module.js'));
  copyDir(path.join(threePackageRoot, 'examples', 'jsm'), addonsDir);
  writeTailwindLite();
}

function prepareSimulations() {
  ensureDir(simDir);
  for (const sim of simulations) {
    const source = path.join(sourceDir, sim.file);
    const target = path.join(simDir, sim.file);
    if (!fs.existsSync(source)) throw new Error(`Missing source simulation: ${source}`);
    const html = fs.readFileSync(source, 'utf8');
    fs.writeFileSync(target, patchHtml(html));
  }
  fs.writeFileSync(path.join(root, 'vault', 'manifest.json'), JSON.stringify({
    name: 'Chrysalis Simulation Vault',
    version: '0.1.0',
    simulations
  }, null, 2));
}

prepareVendor();
prepareSimulations();
console.log(`Prepared ${simulations.length} simulations for offline packaging.`);
