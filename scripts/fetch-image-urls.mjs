/**
 * Fetch accurate image URLs for all museum exhibits via Wikipedia API.
 * Wikipedia API supports CORS and returns proper CDN URLs for artworks.
 */

const WIKI_API = 'https://en.wikipedia.org/w/api.php';
const WIDTH = 1280; // High quality thumbnail

// All artwork filenames from Wikimedia Commons
const ARTWORKS = {
  // === 故宫博物院 ===
  'fc-cover': 'Beijing-Forbidden_City-from_Jingshan.jpg',
  'fc-h1': 'Along_the_River_During_the_Qingming_Festival_(Qing_Court_Version).jpg',
  'fc-h2': 'Wang_Ximeng._A_Thousand_Li_of_Rivers_and_Mountains._(Complete,_51.3x1191.5_cm)._1113._Palace_museum,_Beijing.jpg',
  'fc-h3': '金瓯永固杯.jpg',
  'fc-h4': 'Jade_Mountain_Illustrating_the_Taming_of_the_Waters_by_the_Great_Yu_01.jpg',
  'fc-h5': '各种釉彩大瓶.jpg',
  'fc-h6': 'Giuseppe_Castiglione_One_Hundred_Horses.jpg',
  'fc-h7': 'Forbidden_City_August_2012_32.JPG',
  'fc-h8': 'Nine-Dragon_Wall,_Forbidden_City,_Beijing.jpg',
  'fc-g1': 'Forbidden_City_-_Juanqin_Studio_01.jpg',
  'fc-g2': 'National_Palace_Museum,_Beijing_(10553879994).jpg',
  'fc-g3': 'Yanxi_Gong_-_Lingzhao_Xuan_(Crystal_Palace).jpg',
  'fc-g4': 'Corner_Tower_of_Forbidden_City_20210807.jpg',

  // === 乌菲齐美术馆 ===
  'uf-cover': 'Uffizi_Gallery,_Florence.jpg',
  'uf-h1': 'Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg',
  'uf-h2': 'Botticelli-primavera.jpg',
  'uf-h3': 'Leonardo_da_Vinci_-_Annunciazione_-_Google_Art_Project.jpg',
  'uf-h4': 'Tiziano_-_Venere_di_Urbino_-_Google_Art_Project.jpg',
  'uf-h5': 'Raffaello_Sanzio_-_Madonna_del_Cardellino_-_Google_Art_Project.jpg',
  'uf-h6': 'Medusa_by_Caravaggio.jpg',
  'uf-h7': 'Michelangelo_Buonarroti_-_Tondo_Doni_-_Google_Art_Project.jpg',
  'uf-h8': 'Self-portrait_at_the_Age_of_63,_Rembrandt.jpg',
  'uf-g1': 'Parmigianino_-_Madonna_dal_Collo_Lungo_-_Google_Art_Project.jpg',
  'uf-g2': 'Sacrifice_of_Isaac-Caravaggio_(Uffizi).jpg',
  'uf-g3': 'Ceiling_of_first_corridor_-_Uffizi.jpg',
  'uf-g4': 'Uffizi_terrace.jpg',

  // === 大英博物馆 ===
  'bm-cover': 'British_Museum_Great_Court_roof_2.jpg',
  'bm-h1': 'Rosetta_Stone.JPG',
  'bm-h2': 'Parthenon_Marbles_BM.jpg',
  'bm-h3': 'Ramesses_II_colossus_at_the_British_Museum.jpg',
  'bm-h4': 'Lewis_chessmen_board.jpg',
  'bm-h5': 'Sutton_Hoo_helmet_reconstruction.jpg',
  'bm-h6': 'Portland_Vase_BM_Gem2769.jpg',
  'bm-h7': 'Assyrian_lion_hunt_reliefs_at_the_British_Museum.jpg',
  'bm-h8': 'Egyptian_mummies_in_the_British_Museum.jpg',
  'bm-g1': 'Flood_Tablet,_Nineveh,_clay,_Neo-Assyrian,_700-600_BC,_British_Museum.jpg',
  'bm-g2': 'British_Museum_Great_Court.jpg',
  'bm-g3': 'Oxus_treasure_gold_chariot.jpg',
  'bm-g4': 'Hoa_Hakananai\'a.jpg',
};

async function fetchImageUrl(filename) {
  const params = new URLSearchParams({
    action: 'query',
    titles: `File:${filename}`,
    prop: 'imageinfo',
    iiprop: 'url',
    iiurlwidth: String(WIDTH),
    format: 'json',
    origin: '*',
  });

  try {
    const resp = await fetch(`${WIKI_API}?${params}`);
    const data = await resp.json();
    const pages = Object.values(data.query.pages);
    if (pages[0].imageinfo && pages[0].imageinfo[0]) {
      return pages[0].imageinfo[0].thumburl || pages[0].imageinfo[0].url;
    }
    return null;
  } catch (e) {
    console.error(`Failed to fetch ${filename}:`, e.message);
    return null;
  }
}

async function main() {
  console.log('Fetching image URLs from Wikipedia API...\n');
  const results = {};

  for (const [id, filename] of Object.entries(ARTWORKS)) {
    process.stdout.write(`  Fetching ${id} (${filename.substring(0, 40)})... `);
    const url = await fetchImageUrl(filename);
    if (url) {
      results[id] = url;
      console.log('✓');
    } else {
      console.log('✗ FAILED');
    }
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('\n=== RESULTS ===\n');
  for (const [id, url] of Object.entries(results)) {
    console.log(`${id}: '${url}',`);
  }

  // Output as JSON
  const fs = await import('fs');
  fs.writeFileSync('./scripts/image-urls.json', JSON.stringify(results, null, 2));
  console.log('\nSaved to scripts/image-urls.json');
}

main();
