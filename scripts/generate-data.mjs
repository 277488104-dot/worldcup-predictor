#!/usr/bin/env node
/**
 * Generates all 7 JSON data files for the 2026 World Cup predictor.
 * Run: node scripts/generate-data.mjs
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'public', 'data');

mkdirSync(DATA_DIR, { recursive: true });

function write(filename, data) {
  const path = join(DATA_DIR, filename);
  writeFileSync(path, JSON.stringify(data, null, 2));
  console.log(`Wrote ${filename}`);
}

// ===== 1. TOURNAMENTS =====
const tournaments = {
  id: "wc2026",
  name: "2026 FIFA World Cup",
  startDate: "2026-06-11",
  endDate: "2026-07-19",
  hostNations: ["United States", "Canada", "Mexico"]
};
write('tournaments.json', tournaments);

// ===== 2. GROUPS =====
const groups = [
  { id: "A", name: "A", teamIds: ["mex", "rsa", "kor", "cze"] },
  { id: "B", name: "B", teamIds: ["can", "bih", "qat", "sui"] },
  { id: "C", name: "C", teamIds: ["bra", "mar", "hai", "sco"] },
  { id: "D", name: "D", teamIds: ["usa", "par", "aus", "tur"] },
  { id: "E", name: "E", teamIds: ["ger", "cuw", "civ", "ecu"] },
  { id: "F", name: "F", teamIds: ["ned", "jpn", "swe", "tun"] },
  { id: "G", name: "G", teamIds: ["bel", "egy", "irn", "nzl"] },
  { id: "H", name: "H", teamIds: ["esp", "cpv", "ksa", "uru"] },
  { id: "I", name: "I", teamIds: ["fra", "sen", "irq", "nor"] },
  { id: "J", name: "J", teamIds: ["arg", "alg", "aut", "jor"] },
  { id: "K", name: "K", teamIds: ["por", "cod", "uzb", "col"] },
  { id: "L", name: "L", teamIds: ["eng", "cro", "gha", "pan"] },
];
write('groups.json', groups);

// ===== 3. VENUES =====
const venues = [
  { id: "metlife-stadium", name: "MetLife Stadium", city: "East Rutherford", country: "United States", capacity: 82500, lat: 40.8136, lng: -74.0746, altitude: 1, climate: "Humid subtropical", timezone: "America/New_York", imageUrl: "/images/venues/metlife-stadium.png", description: "Home of the NFL's New York Giants and Jets. Will host the 2026 World Cup Final." },
  { id: "att-stadium", name: "AT&T Stadium", city: "Arlington", country: "United States", capacity: 94000, lat: 32.7473, lng: -97.0945, altitude: 180, climate: "Humid subtropical", timezone: "America/Chicago", imageUrl: "/images/venues/att-stadium.png", description: "Home of the Dallas Cowboys. One of the largest venues, hosting 9 matches including a semi-final." },
  { id: "arrowhead-stadium", name: "Arrowhead Stadium", city: "Kansas City", country: "United States", capacity: 76500, lat: 39.0489, lng: -94.4839, altitude: 277, climate: "Humid continental", timezone: "America/Chicago", imageUrl: "/images/venues/arrowhead-stadium.png", description: "Home of the Kansas City Chiefs. Known for being one of the loudest outdoor stadiums." },
  { id: "mercedes-benz-stadium", name: "Mercedes-Benz Stadium", city: "Atlanta", country: "United States", capacity: 75000, lat: 33.7555, lng: -84.4010, altitude: 320, climate: "Humid subtropical", timezone: "America/New_York", imageUrl: "/images/venues/mercedes-benz-stadium.png", description: "Home of Atlanta United FC and the NFL's Atlanta Falcons. Features a retractable roof." },
  { id: "sofi-stadium", name: "SoFi Stadium", city: "Inglewood", country: "United States", capacity: 70000, lat: 33.9535, lng: -118.3390, altitude: 38, climate: "Mediterranean", timezone: "America/Los_Angeles", imageUrl: "/images/venues/sofi-stadium.png", description: "State-of-the-art stadium opened in 2020. Home of the NFL's LA Rams and Chargers." },
  { id: "levis-stadium", name: "Levi's Stadium", city: "Santa Clara", country: "United States", capacity: 71000, lat: 37.4030, lng: -121.9698, altitude: 4, climate: "Mediterranean", timezone: "America/Los_Angeles", imageUrl: "/images/venues/levis-stadium.png", description: "Home of the San Francisco 49ers, located in Silicon Valley." },
  { id: "nrg-stadium", name: "NRG Stadium", city: "Houston", country: "United States", capacity: 72000, lat: 29.6847, lng: -95.4108, altitude: 14, climate: "Humid subtropical", timezone: "America/Chicago", imageUrl: "/images/venues/nrg-stadium.png", description: "Home of the Houston Texans. Features the first retractable roof in the NFL." },
  { id: "gillette-stadium", name: "Gillette Stadium", city: "Foxborough", country: "United States", capacity: 65000, lat: 42.0909, lng: -71.2643, altitude: 91, climate: "Humid continental", timezone: "America/New_York", imageUrl: "/images/venues/gillette-stadium.png", description: "Home of the New England Revolution and New England Patriots." },
  { id: "lincoln-financial-field", name: "Lincoln Financial Field", city: "Philadelphia", country: "United States", capacity: 69000, lat: 39.9008, lng: -75.1675, altitude: 12, climate: "Humid subtropical", timezone: "America/New_York", imageUrl: "/images/venues/lincoln-financial-field.png", description: "Home of the Philadelphia Eagles and the USMNT's frequent fortress." },
  { id: "lumen-field", name: "Lumen Field", city: "Seattle", country: "United States", capacity: 69000, lat: 47.5952, lng: -122.3316, altitude: 5, climate: "Oceanic", timezone: "America/Los_Angeles", imageUrl: "/images/venues/lumen-field.png", description: "Home of Seattle Sounders FC. Known for its vibrant soccer atmosphere." },
  { id: "hard-rock-stadium", name: "Hard Rock Stadium", city: "Miami Gardens", country: "United States", capacity: 65000, lat: 25.9580, lng: -80.2389, altitude: 3, climate: "Tropical monsoon", timezone: "America/New_York", imageUrl: "/images/venues/hard-rock-stadium.png", description: "Home of the Miami Dolphins. Hosts major international soccer events." },
  { id: "estadio-azteca", name: "Estadio Azteca", city: "Mexico City", country: "Mexico", capacity: 87500, lat: 19.3029, lng: -99.1504, altitude: 2240, climate: "Subtropical highland", timezone: "America/Mexico_City", imageUrl: "/images/venues/estadio-azteca.png", description: "Iconic stadium that becomes the first to host matches in three World Cups (1970, 1986, 2026)." },
  { id: "estadio-bbva", name: "Estadio BBVA", city: "Monterrey", country: "Mexico", capacity: 53500, lat: 25.6692, lng: -100.2439, altitude: 540, climate: "Semi-arid", timezone: "America/Monterrey", imageUrl: "/images/venues/estadio-bbva.png", description: "Modern stadium nicknamed 'El Gigante de Acero' (The Steel Giant). Home of CF Monterrey." },
  { id: "estadio-akron", name: "Estadio Akron", city: "Guadalajara", country: "Mexico", capacity: 48000, lat: 20.6817, lng: -103.4627, altitude: 1566, climate: "Subtropical highland", timezone: "America/Mexico_City", imageUrl: "/images/venues/estadio-akron.png", description: "Home of Chivas de Guadalajara, one of Mexico's most popular clubs." },
  { id: "bmo-field", name: "BMO Field", city: "Toronto", country: "Canada", capacity: 45000, lat: 43.6329, lng: -79.4186, altitude: 76, climate: "Humid continental", timezone: "America/Toronto", imageUrl: "/images/venues/bmo-field.png", description: "Home of Toronto FC. First Canadian stadium to host a World Cup match." },
  { id: "bc-place", name: "BC Place", city: "Vancouver", country: "Canada", capacity: 54000, lat: 49.2767, lng: -123.1120, altitude: 2, climate: "Oceanic", timezone: "America/Vancouver", imageUrl: "/images/venues/bc-place.png", description: "Home of Vancouver Whitecaps FC. Features a distinctive retractable roof." },
];
write('venues.json', venues);

// ===== TEAM DEFINITIONS =====
// All 48 teams with real data
const teamDefs = [
  // Group A
  { id: "mex", name: "Mexico", nameCn: "墨西哥", fifaCode: "MEX", flagUrl: "🇲🇽", fifaRank: 15, confederation: "CONCACAF", coach: "Javier Aguirre", groupId: "A",
    stats: { attack: 72, defense: 65, possession: 58, fitness: 75, experience: 78, recentForm: 68 } },
  { id: "rsa", name: "South Africa", nameCn: "南非", fifaCode: "RSA", flagUrl: "🇿🇦", fifaRank: 60, confederation: "CAF", coach: "Hugo Broos", groupId: "A",
    stats: { attack: 55, defense: 58, possession: 48, fitness: 72, experience: 52, recentForm: 55 } },
  { id: "kor", name: "South Korea", nameCn: "韩国", fifaCode: "KOR", flagUrl: "🇰🇷", fifaRank: 25, confederation: "AFC", coach: "Hong Myung-bo", groupId: "A",
    stats: { attack: 75, defense: 62, possession: 55, fitness: 82, experience: 70, recentForm: 72 } },
  { id: "cze", name: "Czechia", nameCn: "捷克", fifaCode: "CZE", flagUrl: "🇨🇿", fifaRank: 41, confederation: "UEFA", coach: "Miroslav Koubek", groupId: "A",
    stats: { attack: 60, defense: 64, possession: 52, fitness: 70, experience: 58, recentForm: 60 } },

  // Group B
  { id: "can", name: "Canada", nameCn: "加拿大", fifaCode: "CAN", flagUrl: "🇨🇦", fifaRank: 30, confederation: "CONCACAF", coach: "Jesse Marsch", groupId: "B",
    stats: { attack: 68, defense: 58, possession: 50, fitness: 74, experience: 42, recentForm: 62 } },
  { id: "bih", name: "Bosnia and Herzegovina", nameCn: "波黑", fifaCode: "BIH", flagUrl: "🇧🇦", fifaRank: 64, confederation: "UEFA", coach: "Sergej Barbarez", groupId: "B",
    stats: { attack: 55, defense: 52, possession: 48, fitness: 65, experience: 45, recentForm: 50 } },
  { id: "qat", name: "Qatar", nameCn: "卡塔尔", fifaCode: "QAT", flagUrl: "🇶🇦", fifaRank: 55, confederation: "AFC", coach: "Julen Lopetegui", groupId: "B",
    stats: { attack: 52, defense: 50, possession: 46, fitness: 68, experience: 40, recentForm: 48 } },
  { id: "sui", name: "Switzerland", nameCn: "瑞士", fifaCode: "SUI", flagUrl: "🇨🇭", fifaRank: 19, confederation: "UEFA", coach: "Murat Yakin", groupId: "B",
    stats: { attack: 65, defense: 72, possession: 55, fitness: 73, experience: 65, recentForm: 68 } },

  // Group C
  { id: "bra", name: "Brazil", nameCn: "巴西", fifaCode: "BRA", flagUrl: "🇧🇷", fifaRank: 6, confederation: "CONMEBOL", coach: "Carlo Ancelotti", groupId: "C",
    stats: { attack: 92, defense: 78, possession: 75, fitness: 82, experience: 88, recentForm: 85 } },
  { id: "mar", name: "Morocco", nameCn: "摩洛哥", fifaCode: "MAR", flagUrl: "🇲🇦", fifaRank: 7, confederation: "CAF", coach: "Mohamed Ouahbi", groupId: "C",
    stats: { attack: 76, defense: 82, possession: 52, fitness: 78, experience: 72, recentForm: 80 } },
  { id: "hai", name: "Haiti", nameCn: "海地", fifaCode: "HAI", flagUrl: "🇭🇹", fifaRank: 82, confederation: "CONCACAF", coach: "Sebastien Migne", groupId: "C",
    stats: { attack: 48, defense: 42, possession: 40, fitness: 65, experience: 30, recentForm: 42 } },
  { id: "sco", name: "Scotland", nameCn: "苏格兰", fifaCode: "SCO", flagUrl: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", fifaRank: 43, confederation: "UEFA", coach: "Steve Clarke", groupId: "C",
    stats: { attack: 62, defense: 60, possession: 48, fitness: 72, experience: 50, recentForm: 58 } },

  // Group D
  { id: "usa", name: "United States", nameCn: "美国", fifaCode: "USA", flagUrl: "🇺🇸", fifaRank: 16, confederation: "CONCACAF", coach: "Mauricio Pochettino", groupId: "D",
    stats: { attack: 74, defense: 66, possession: 55, fitness: 80, experience: 60, recentForm: 72 } },
  { id: "par", name: "Paraguay", nameCn: "巴拉圭", fifaCode: "PAR", flagUrl: "🇵🇾", fifaRank: 40, confederation: "CONMEBOL", coach: "Gustavo Alfaro", groupId: "D",
    stats: { attack: 55, defense: 62, possession: 45, fitness: 70, experience: 55, recentForm: 52 } },
  { id: "aus", name: "Australia", nameCn: "澳大利亚", fifaCode: "AUS", flagUrl: "🇦🇺", fifaRank: 27, confederation: "AFC", coach: "Tony Popovic", groupId: "D",
    stats: { attack: 62, defense: 60, possession: 48, fitness: 78, experience: 55, recentForm: 65 } },
  { id: "tur", name: "Turkey", nameCn: "土耳其", fifaCode: "TUR", flagUrl: "🇹🇷", fifaRank: 22, confederation: "UEFA", coach: "Vincenzo Montella", groupId: "D",
    stats: { attack: 70, defense: 64, possession: 55, fitness: 74, experience: 58, recentForm: 70 } },

  // Group E
  { id: "ger", name: "Germany", nameCn: "德国", fifaCode: "GER", flagUrl: "🇩🇪", fifaRank: 10, confederation: "UEFA", coach: "Julian Nagelsmann", groupId: "E",
    stats: { attack: 88, defense: 80, possession: 72, fitness: 85, experience: 90, recentForm: 80 } },
  { id: "cuw", name: "Curacao", nameCn: "库拉索", fifaCode: "CUW", flagUrl: "🇨🇼", fifaRank: 83, confederation: "CONCACAF", coach: "Dick Advocaat", groupId: "E",
    stats: { attack: 42, defense: 40, possession: 38, fitness: 60, experience: 25, recentForm: 38 } },
  { id: "civ", name: "Ivory Coast", nameCn: "科特迪瓦", fifaCode: "CIV", flagUrl: "🇨🇮", fifaRank: 34, confederation: "CAF", coach: "Emerse Fae", groupId: "E",
    stats: { attack: 68, defense: 60, possession: 50, fitness: 76, experience: 55, recentForm: 62 } },
  { id: "ecu", name: "Ecuador", nameCn: "厄瓜多尔", fifaCode: "ECU", flagUrl: "🇪🇨", fifaRank: 24, confederation: "CONMEBOL", coach: "Sebastian Beccacece", groupId: "E",
    stats: { attack: 65, defense: 62, possession: 50, fitness: 74, experience: 52, recentForm: 65 } },

  // Group F
  { id: "ned", name: "Netherlands", nameCn: "荷兰", fifaCode: "NED", flagUrl: "🇳🇱", fifaRank: 8, confederation: "UEFA", coach: "Ronald Koeman", groupId: "F",
    stats: { attack: 85, defense: 82, possession: 65, fitness: 78, experience: 82, recentForm: 80 } },
  { id: "jpn", name: "Japan", nameCn: "日本", fifaCode: "JPN", flagUrl: "🇯🇵", fifaRank: 18, confederation: "AFC", coach: "Hajime Moriyasu", groupId: "F",
    stats: { attack: 78, defense: 70, possession: 60, fitness: 85, experience: 75, recentForm: 78 } },
  { id: "swe", name: "Sweden", nameCn: "瑞典", fifaCode: "SWE", flagUrl: "🇸🇪", fifaRank: 38, confederation: "UEFA", coach: "Graham Potter", groupId: "F",
    stats: { attack: 65, defense: 68, possession: 50, fitness: 76, experience: 60, recentForm: 62 } },
  { id: "tun", name: "Tunisia", nameCn: "突尼斯", fifaCode: "TUN", flagUrl: "🇹🇳", fifaRank: 46, confederation: "CAF", coach: "Sabri Lamouchi", groupId: "F",
    stats: { attack: 58, defense: 60, possession: 45, fitness: 70, experience: 55, recentForm: 55 } },

  // Group G
  { id: "bel", name: "Belgium", nameCn: "比利时", fifaCode: "BEL", flagUrl: "🇧🇪", fifaRank: 9, confederation: "UEFA", coach: "Rudi Garcia", groupId: "G",
    stats: { attack: 82, defense: 75, possession: 68, fitness: 76, experience: 80, recentForm: 72 } },
  { id: "egy", name: "Egypt", nameCn: "埃及", fifaCode: "EGY", flagUrl: "🇪🇬", fifaRank: 29, confederation: "CAF", coach: "Hossam Hassan", groupId: "G",
    stats: { attack: 65, defense: 62, possession: 48, fitness: 70, experience: 58, recentForm: 60 } },
  { id: "irn", name: "Iran", nameCn: "伊朗", fifaCode: "IRN", flagUrl: "🇮🇷", fifaRank: 21, confederation: "AFC", coach: "Amir Ghalenoei", groupId: "G",
    stats: { attack: 62, defense: 70, possession: 45, fitness: 74, experience: 65, recentForm: 68 } },
  { id: "nzl", name: "New Zealand", nameCn: "新西兰", fifaCode: "NZL", flagUrl: "🇳🇿", fifaRank: 85, confederation: "OFC", coach: "Darren Bazeley", groupId: "G",
    stats: { attack: 45, defense: 48, possession: 40, fitness: 68, experience: 35, recentForm: 45 } },

  // Group H
  { id: "esp", name: "Spain", nameCn: "西班牙", fifaCode: "ESP", flagUrl: "🇪🇸", fifaRank: 2, confederation: "UEFA", coach: "Luis de la Fuente", groupId: "H",
    stats: { attack: 90, defense: 83, possession: 80, fitness: 82, experience: 85, recentForm: 90 } },
  { id: "cpv", name: "Cape Verde", nameCn: "佛得角", fifaCode: "CPV", flagUrl: "🇨🇻", fifaRank: 68, confederation: "CAF", coach: "Bubista", groupId: "H",
    stats: { attack: 48, defense: 45, possession: 42, fitness: 65, experience: 30, recentForm: 48 } },
  { id: "ksa", name: "Saudi Arabia", nameCn: "沙特阿拉伯", fifaCode: "KSA", flagUrl: "🇸🇦", fifaRank: 61, confederation: "AFC", coach: "Georgios Donis", groupId: "H",
    stats: { attack: 52, defense: 50, possession: 44, fitness: 68, experience: 48, recentForm: 50 } },
  { id: "uru", name: "Uruguay", nameCn: "乌拉圭", fifaCode: "URU", flagUrl: "🇺🇾", fifaRank: 17, confederation: "CONMEBOL", coach: "Marcelo Bielsa", groupId: "H",
    stats: { attack: 80, defense: 75, possession: 52, fitness: 76, experience: 80, recentForm: 74 } },

  // Group I
  { id: "fra", name: "France", nameCn: "法国", fifaCode: "FRA", flagUrl: "🇫🇷", fifaRank: 1, confederation: "UEFA", coach: "Didier Deschamps", groupId: "I",
    stats: { attack: 95, defense: 85, possession: 70, fitness: 84, experience: 92, recentForm: 88 } },
  { id: "sen", name: "Senegal", nameCn: "塞内加尔", fifaCode: "SEN", flagUrl: "🇸🇳", fifaRank: 14, confederation: "CAF", coach: "Pape Thiaw", groupId: "I",
    stats: { attack: 75, defense: 68, possession: 50, fitness: 78, experience: 62, recentForm: 70 } },
  { id: "irq", name: "Iraq", nameCn: "伊拉克", fifaCode: "IRQ", flagUrl: "🇮🇶", fifaRank: 57, confederation: "AFC", coach: "Graham Arnold", groupId: "I",
    stats: { attack: 50, defense: 48, possession: 42, fitness: 66, experience: 40, recentForm: 52 } },
  { id: "nor", name: "Norway", nameCn: "挪威", fifaCode: "NOR", flagUrl: "🇳🇴", fifaRank: 31, confederation: "UEFA", coach: "Stale Solbakken", groupId: "I",
    stats: { attack: 82, defense: 65, possession: 58, fitness: 78, experience: 45, recentForm: 72 } },

  // Group J
  { id: "arg", name: "Argentina", nameCn: "阿根廷", fifaCode: "ARG", flagUrl: "🇦🇷", fifaRank: 3, confederation: "CONMEBOL", coach: "Lionel Scaloni", groupId: "J",
    stats: { attack: 93, defense: 84, possession: 68, fitness: 80, experience: 95, recentForm: 92 } },
  { id: "alg", name: "Algeria", nameCn: "阿尔及利亚", fifaCode: "ALG", flagUrl: "🇩🇿", fifaRank: 28, confederation: "CAF", coach: "Vladimir Petkovic", groupId: "J",
    stats: { attack: 65, defense: 60, possession: 48, fitness: 72, experience: 58, recentForm: 62 } },
  { id: "aut", name: "Austria", nameCn: "奥地利", fifaCode: "AUT", flagUrl: "🇦🇹", fifaRank: 23, confederation: "UEFA", coach: "Ralf Rangnick", groupId: "J",
    stats: { attack: 72, defense: 66, possession: 55, fitness: 78, experience: 60, recentForm: 70 } },
  { id: "jor", name: "Jordan", nameCn: "约旦", fifaCode: "JOR", flagUrl: "🇯🇴", fifaRank: 63, confederation: "AFC", coach: "Jamal Sellami", groupId: "J",
    stats: { attack: 48, defense: 52, possession: 40, fitness: 64, experience: 35, recentForm: 48 } },

  // Group K
  { id: "por", name: "Portugal", nameCn: "葡萄牙", fifaCode: "POR", flagUrl: "🇵🇹", fifaRank: 5, confederation: "UEFA", coach: "Roberto Martinez", groupId: "K",
    stats: { attack: 90, defense: 78, possession: 68, fitness: 80, experience: 88, recentForm: 86 } },
  { id: "cod", name: "DR Congo", nameCn: "刚果(金)", fifaCode: "COD", flagUrl: "🇨🇩", fifaRank: 45, confederation: "CAF", coach: "Sebastien Desabre", groupId: "K",
    stats: { attack: 60, defense: 55, possession: 48, fitness: 74, experience: 45, recentForm: 58 } },
  { id: "uzb", name: "Uzbekistan", nameCn: "乌兹别克斯坦", fifaCode: "UZB", flagUrl: "🇺🇿", fifaRank: 50, confederation: "AFC", coach: "Fabio Cannavaro", groupId: "K",
    stats: { attack: 55, defense: 55, possession: 45, fitness: 70, experience: 38, recentForm: 55 } },
  { id: "col", name: "Colombia", nameCn: "哥伦比亚", fifaCode: "COL", flagUrl: "🇨🇴", fifaRank: 13, confederation: "CONMEBOL", coach: "Nestor Lorenzo", groupId: "K",
    stats: { attack: 78, defense: 68, possession: 58, fitness: 74, experience: 72, recentForm: 76 } },

  // Group L
  { id: "eng", name: "England", nameCn: "英格兰", fifaCode: "ENG", flagUrl: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", fifaRank: 4, confederation: "UEFA", coach: "Thomas Tuchel", groupId: "L",
    stats: { attack: 88, defense: 80, possession: 65, fitness: 80, experience: 85, recentForm: 82 } },
  { id: "cro", name: "Croatia", nameCn: "克罗地亚", fifaCode: "CRO", flagUrl: "🇭🇷", fifaRank: 11, confederation: "UEFA", coach: "Zlatko Dalic", groupId: "L",
    stats: { attack: 78, defense: 75, possession: 62, fitness: 74, experience: 88, recentForm: 74 } },
  { id: "gha", name: "Ghana", nameCn: "加纳", fifaCode: "GHA", flagUrl: "🇬🇭", fifaRank: 73, confederation: "CAF", coach: "Carlos Queiroz", groupId: "L",
    stats: { attack: 62, defense: 55, possession: 48, fitness: 76, experience: 55, recentForm: 55 } },
  { id: "pan", name: "Panama", nameCn: "巴拿马", fifaCode: "PAN", flagUrl: "🇵🇦", fifaRank: 33, confederation: "CONCACAF", coach: "Thomas Christiansen", groupId: "L",
    stats: { attack: 55, defense: 52, possession: 42, fitness: 68, experience: 42, recentForm: 52 } },
];

// ===== 4a. PLAYER DATA =====
// Real players for top ~16 teams, plausible names for others
const playerData = {};

// Argentina (real squad from search results)
playerData["arg"] = [
  { name: "Emiliano Martinez", position: "GK", age: 33, club: "Aston Villa", number: 23 },
  { name: "Geronimo Rulli", position: "GK", age: 34, club: "Olympique Marseille", number: 12 },
  { name: "Juan Musso", position: "GK", age: 32, club: "Atletico Madrid", number: 1 },
  { name: "Cristian Romero", position: "DF", age: 28, club: "Tottenham Hotspur", number: 13 },
  { name: "Lisandro Martinez", position: "DF", age: 28, club: "Manchester United", number: 6 },
  { name: "Nicolas Otamendi", position: "DF", age: 38, club: "Benfica", number: 19 },
  { name: "Nahuel Molina", position: "DF", age: 28, club: "Atletico Madrid", number: 26 },
  { name: "Gonzalo Montiel", position: "DF", age: 29, club: "River Plate", number: 4 },
  { name: "Nicolas Tagliafico", position: "DF", age: 33, club: "Olympique Lyonnais", number: 3 },
  { name: "Facundo Medina", position: "DF", age: 27, club: "Olympique Marseille", number: 25 },
  { name: "Rodrigo De Paul", position: "MF", age: 32, club: "Inter Miami", number: 7 },
  { name: "Alexis Mac Allister", position: "MF", age: 27, club: "Liverpool", number: 20 },
  { name: "Enzo Fernandez", position: "MF", age: 25, club: "Chelsea", number: 24 },
  { name: "Leandro Paredes", position: "MF", age: 31, club: "Boca Juniors", number: 5 },
  { name: "Giovani Lo Celso", position: "MF", age: 30, club: "Real Betis", number: 11 },
  { name: "Exequiel Palacios", position: "MF", age: 27, club: "Bayer Leverkusen", number: 14 },
  { name: "Valentin Barco", position: "MF", age: 21, club: "RC Strasbourg", number: 8 },
  { name: "Lionel Messi", position: "FW", age: 38, club: "Inter Miami", number: 10 },
  { name: "Lautaro Martinez", position: "FW", age: 28, club: "Inter Milan", number: 22 },
  { name: "Julian Alvarez", position: "FW", age: 26, club: "Atletico Madrid", number: 9 },
  { name: "Nicolas Gonzalez", position: "FW", age: 28, club: "Atletico Madrid", number: 15 },
  { name: "Thiago Almada", position: "FW", age: 25, club: "Atletico Madrid", number: 16 },
  { name: "Giuliano Simeone", position: "FW", age: 23, club: "Atletico Madrid", number: 17 },
  { name: "Nico Paz", position: "FW", age: 21, club: "Como 1907", number: 18 },
  { name: "Jose Manuel Lopez", position: "FW", age: 25, club: "Palmeiras", number: 21 },
  { name: "Alejandro Garnacho", position: "FW", age: 21, club: "Manchester United", number: 2 },
];

// Brazil (real squad)
playerData["bra"] = [
  { name: "Alisson Becker", position: "GK", age: 33, club: "Liverpool", number: 1 },
  { name: "Ederson", position: "GK", age: 32, club: "Fenerbahce", number: 23 },
  { name: "Weverton", position: "GK", age: 38, club: "Gremio", number: 12 },
  { name: "Alex Sandro", position: "DF", age: 35, club: "Flamengo", number: 6 },
  { name: "Danilo", position: "DF", age: 34, club: "Flamengo", number: 2 },
  { name: "Leo Pereira", position: "DF", age: 30, club: "Flamengo", number: 14 },
  { name: "Bremer", position: "DF", age: 29, club: "Juventus", number: 3 },
  { name: "Douglas Santos", position: "DF", age: 32, club: "Zenit Saint Petersburg", number: 16 },
  { name: "Gabriel Magalhaes", position: "DF", age: 28, club: "Arsenal", number: 4 },
  { name: "Ibanez", position: "DF", age: 27, club: "Al Ahli", number: 13 },
  { name: "Marquinhos", position: "DF", age: 32, club: "Paris Saint-Germain", number: 5 },
  { name: "Wesley", position: "DF", age: 24, club: "Roma", number: 15 },
  { name: "Bruno Guimaraes", position: "MF", age: 28, club: "Newcastle United", number: 8 },
  { name: "Casemiro", position: "MF", age: 34, club: "Manchester United", number: 17 },
  { name: "Danilo Santos", position: "MF", age: 26, club: "Botafogo", number: 18 },
  { name: "Fabinho", position: "MF", age: 32, club: "Al Ittihad", number: 19 },
  { name: "Lucas Paqueta", position: "MF", age: 28, club: "Flamengo", number: 7 },
  { name: "Endrick", position: "FW", age: 19, club: "Olympique Lyonnais", number: 9 },
  { name: "Gabriel Martinelli", position: "FW", age: 25, club: "Arsenal", number: 11 },
  { name: "Igor Thiago", position: "FW", age: 23, club: "Brentford", number: 20 },
  { name: "Luiz Henrique", position: "FW", age: 25, club: "Zenit Saint Petersburg", number: 21 },
  { name: "Matheus Cunha", position: "FW", age: 27, club: "Manchester United", number: 22 },
  { name: "Neymar", position: "FW", age: 34, club: "Santos", number: 10 },
  { name: "Raphinha", position: "FW", age: 29, club: "Barcelona", number: 24 },
  { name: "Rayan", position: "FW", age: 20, club: "Bournemouth", number: 25 },
  { name: "Vinicius Jr.", position: "FW", age: 25, club: "Real Madrid", number: 26 },
];

// France (real squad)
playerData["fra"] = [
  { name: "Mike Maignan", position: "GK", age: 30, club: "AC Milan", number: 16 },
  { name: "Robin Risser", position: "GK", age: 21, club: "Lens", number: 1 },
  { name: "Brice Samba", position: "GK", age: 32, club: "Rennes", number: 23 },
  { name: "Lucas Digne", position: "DF", age: 32, club: "Aston Villa", number: 3 },
  { name: "Malo Gusto", position: "DF", age: 23, club: "Chelsea", number: 2 },
  { name: "Lucas Hernandez", position: "DF", age: 30, club: "Paris Saint-Germain", number: 21 },
  { name: "Theo Hernandez", position: "DF", age: 28, club: "Al Hilal", number: 22 },
  { name: "Ibrahima Konate", position: "DF", age: 27, club: "Liverpool", number: 5 },
  { name: "Jules Kounde", position: "DF", age: 27, club: "Barcelona", number: 4 },
  { name: "Maxence Lacroix", position: "DF", age: 26, club: "Crystal Palace", number: 15 },
  { name: "William Saliba", position: "DF", age: 25, club: "Arsenal", number: 17 },
  { name: "Dayot Upamecano", position: "DF", age: 27, club: "Bayern Munich", number: 6 },
  { name: "Ngolo Kante", position: "MF", age: 35, club: "Fenerbahce", number: 13 },
  { name: "Manu Kone", position: "MF", age: 25, club: "Roma", number: 8 },
  { name: "Adrien Rabiot", position: "MF", age: 31, club: "AC Milan", number: 14 },
  { name: "Aurelien Tchouameni", position: "MF", age: 26, club: "Real Madrid", number: 18 },
  { name: "Warren Zaire-Emery", position: "MF", age: 20, club: "Paris Saint-Germain", number: 19 },
  { name: "Maghnes Akliouche", position: "FW", age: 24, club: "Monaco", number: 20 },
  { name: "Bradley Barcola", position: "FW", age: 23, club: "Paris Saint-Germain", number: 11 },
  { name: "Rayan Cherki", position: "FW", age: 22, club: "Manchester City", number: 25 },
  { name: "Ousmane Dembele", position: "FW", age: 29, club: "Paris Saint-Germain", number: 7 },
  { name: "Desire Doue", position: "FW", age: 21, club: "Paris Saint-Germain", number: 12 },
  { name: "Jean-Philippe Mateta", position: "FW", age: 28, club: "Crystal Palace", number: 26 },
  { name: "Kylian Mbappe", position: "FW", age: 27, club: "Real Madrid", number: 10 },
  { name: "Michael Olise", position: "FW", age: 24, club: "Bayern Munich", number: 9 },
  { name: "Marcus Thuram", position: "FW", age: 28, club: "Inter Milan", number: 24 },
];

// England (real squad)
playerData["eng"] = [
  { name: "Jordan Pickford", position: "GK", age: 32, club: "Everton", number: 1 },
  { name: "Dean Henderson", position: "GK", age: 29, club: "Crystal Palace", number: 13 },
  { name: "James Trafford", position: "GK", age: 23, club: "Manchester City", number: 23 },
  { name: "Reece James", position: "DF", age: 26, club: "Chelsea", number: 2 },
  { name: "Ezri Konsa", position: "DF", age: 28, club: "Aston Villa", number: 12 },
  { name: "Jarell Quansah", position: "DF", age: 23, club: "Bayer Leverkusen", number: 15 },
  { name: "John Stones", position: "DF", age: 32, club: "Manchester City", number: 5 },
  { name: "Marc Guehi", position: "DF", age: 25, club: "Manchester City", number: 6 },
  { name: "Dan Burn", position: "DF", age: 34, club: "Newcastle United", number: 16 },
  { name: "Nico O'Reilly", position: "DF", age: 21, club: "Manchester City", number: 3 },
  { name: "Djed Spence", position: "DF", age: 25, club: "Tottenham Hotspur", number: 14 },
  { name: "Tino Livramento", position: "DF", age: 23, club: "Newcastle United", number: 4 },
  { name: "Declan Rice", position: "MF", age: 27, club: "Arsenal", number: 8 },
  { name: "Elliot Anderson", position: "MF", age: 23, club: "Nottingham Forest", number: 17 },
  { name: "Kobbie Mainoo", position: "MF", age: 21, club: "Manchester United", number: 18 },
  { name: "Jordan Henderson", position: "MF", age: 35, club: "Brentford", number: 19 },
  { name: "Morgan Rogers", position: "MF", age: 23, club: "Aston Villa", number: 20 },
  { name: "Jude Bellingham", position: "MF", age: 22, club: "Real Madrid", number: 10 },
  { name: "Eberechi Eze", position: "MF", age: 27, club: "Arsenal", number: 21 },
  { name: "Harry Kane", position: "FW", age: 32, club: "Bayern Munich", number: 9 },
  { name: "Ivan Toney", position: "FW", age: 30, club: "Al Ahli", number: 22 },
  { name: "Ollie Watkins", position: "FW", age: 30, club: "Aston Villa", number: 11 },
  { name: "Bukayo Saka", position: "FW", age: 24, club: "Arsenal", number: 7 },
  { name: "Marcus Rashford", position: "FW", age: 28, club: "Barcelona", number: 24 },
  { name: "Anthony Gordon", position: "FW", age: 25, club: "Newcastle United", number: 25 },
  { name: "Noni Madueke", position: "FW", age: 24, club: "Arsenal", number: 26 },
];

// Spain (real squad)
playerData["esp"] = [
  { name: "Unai Simon", position: "GK", age: 29, club: "Athletic Club", number: 23 },
  { name: "David Raya", position: "GK", age: 30, club: "Arsenal", number: 1 },
  { name: "Joan Garcia", position: "GK", age: 25, club: "Barcelona", number: 13 },
  { name: "Aymeric Laporte", position: "DF", age: 32, club: "Athletic Club", number: 14 },
  { name: "Marc Cucurella", position: "DF", age: 27, club: "Chelsea", number: 3 },
  { name: "Marcos Llorente", position: "DF", age: 31, club: "Atletico Madrid", number: 6 },
  { name: "Eric Garcia", position: "DF", age: 25, club: "Barcelona", number: 4 },
  { name: "Pedro Porro", position: "DF", age: 26, club: "Tottenham Hotspur", number: 2 },
  { name: "Alex Grimaldo", position: "DF", age: 30, club: "Bayer Leverkusen", number: 12 },
  { name: "Pau Cubarsi", position: "DF", age: 19, club: "Barcelona", number: 5 },
  { name: "Marc Pubill", position: "DF", age: 22, club: "Atletico Madrid", number: 15 },
  { name: "Rodri", position: "MF", age: 29, club: "Manchester City", number: 16 },
  { name: "Fabian Ruiz", position: "MF", age: 30, club: "Paris Saint-Germain", number: 8 },
  { name: "Mikel Merino", position: "MF", age: 29, club: "Arsenal", number: 17 },
  { name: "Pedri", position: "MF", age: 23, club: "Barcelona", number: 10 },
  { name: "Gavi", position: "MF", age: 21, club: "Barcelona", number: 9 },
  { name: "Martin Zubimendi", position: "MF", age: 27, club: "Arsenal", number: 18 },
  { name: "Alex Baena", position: "MF", age: 24, club: "Atletico Madrid", number: 20 },
  { name: "Ferran Torres", position: "FW", age: 26, club: "Barcelona", number: 11 },
  { name: "Mikel Oyarzabal", position: "FW", age: 29, club: "Real Sociedad", number: 21 },
  { name: "Dani Olmo", position: "FW", age: 28, club: "Barcelona", number: 19 },
  { name: "Nico Williams", position: "FW", age: 23, club: "Athletic Club", number: 7 },
  { name: "Lamine Yamal", position: "FW", age: 18, club: "Barcelona", number: 22 },
  { name: "Yeremy Pino", position: "FW", age: 23, club: "Crystal Palace", number: 24 },
  { name: "Borja Iglesias", position: "FW", age: 33, club: "Celta Vigo", number: 25 },
  { name: "Victor Munoz", position: "FW", age: 22, club: "Osasuna", number: 26 },
];

// Germany (real squad)
playerData["ger"] = [
  { name: "Oliver Baumann", position: "GK", age: 35, club: "Hoffenheim", number: 12 },
  { name: "Manuel Neuer", position: "GK", age: 40, club: "Bayern Munich", number: 1 },
  { name: "Alexander Nubel", position: "GK", age: 29, club: "Bayern Munich", number: 22 },
  { name: "Waldemar Anton", position: "DF", age: 29, club: "Borussia Dortmund", number: 2 },
  { name: "Nathaniel Brown", position: "DF", age: 23, club: "Eintracht Frankfurt", number: 3 },
  { name: "David Raum", position: "DF", age: 28, club: "RB Leipzig", number: 4 },
  { name: "Antonio Rudiger", position: "DF", age: 33, club: "Real Madrid", number: 5 },
  { name: "Nico Schlotterbeck", position: "DF", age: 26, club: "Borussia Dortmund", number: 15 },
  { name: "Jonathan Tah", position: "DF", age: 30, club: "Bayern Munich", number: 16 },
  { name: "Malick Thiaw", position: "DF", age: 24, club: "Newcastle United", number: 6 },
  { name: "Pascal Gross", position: "MF", age: 35, club: "Brighton", number: 8 },
  { name: "Joshua Kimmich", position: "MF", age: 31, club: "Bayern Munich", number: 6 },
  { name: "Felix Nmecha", position: "MF", age: 25, club: "Borussia Dortmund", number: 17 },
  { name: "Aleksandar Pavlovic", position: "MF", age: 22, club: "Bayern Munich", number: 18 },
  { name: "Angelo Stiller", position: "MF", age: 25, club: "VfB Stuttgart", number: 19 },
  { name: "Leon Goretzka", position: "MF", age: 31, club: "Bayern Munich", number: 20 },
  { name: "Florian Wirtz", position: "MF", age: 23, club: "Liverpool", number: 10 },
  { name: "Jamie Leweling", position: "MF", age: 25, club: "VfB Stuttgart", number: 21 },
  { name: "Maximilian Beier", position: "FW", age: 23, club: "Borussia Dortmund", number: 14 },
  { name: "Kai Havertz", position: "FW", age: 27, club: "Arsenal", number: 7 },
  { name: "Lennart Karl", position: "FW", age: 20, club: "Bayern Munich", number: 23 },
  { name: "Jamal Musiala", position: "FW", age: 23, club: "Bayern Munich", number: 11 },
  { name: "Leroy Sane", position: "FW", age: 30, club: "Galatasaray", number: 19 },
  { name: "Deniz Undav", position: "FW", age: 29, club: "VfB Stuttgart", number: 9 },
  { name: "Nick Woltemade", position: "FW", age: 24, club: "Newcastle United", number: 24 },
  { name: "Serge Gnabry", position: "FW", age: 30, club: "Bayern Munich", number: 25 },
];

// Portugal (top players real, rest plausible)
playerData["por"] = [
  { name: "Diogo Costa", position: "GK", age: 26, club: "FC Porto", number: 1 },
  { name: "Rui Patricio", position: "GK", age: 38, club: "Roma", number: 12 },
  { name: "Jose Sa", position: "GK", age: 33, club: "Wolverhampton", number: 22 },
  { name: "Joao Cancelo", position: "DF", age: 32, club: "Barcelona", number: 2 },
  { name: "Ruben Dias", position: "DF", age: 29, club: "Manchester City", number: 3 },
  { name: "Goncalo Inacio", position: "DF", age: 24, club: "Sporting CP", number: 4 },
  { name: "Nuno Mendes", position: "DF", age: 24, club: "Paris Saint-Germain", number: 5 },
  { name: "Diogo Dalot", position: "DF", age: 27, club: "Manchester United", number: 6 },
  { name: "Antonio Silva", position: "DF", age: 22, club: "Benfica", number: 14 },
  { name: "Nelson Semedo", position: "DF", age: 32, club: "Wolverhampton", number: 15 },
  { name: "Joao Neves", position: "MF", age: 21, club: "Paris Saint-Germain", number: 8 },
  { name: "Vitinha", position: "MF", age: 26, club: "Paris Saint-Germain", number: 10 },
  { name: "Bruno Fernandes", position: "MF", age: 31, club: "Manchester United", number: 7 },
  { name: "Bernardo Silva", position: "MF", age: 31, club: "Manchester City", number: 11 },
  { name: "Ruben Neves", position: "MF", age: 29, club: "Al Hilal", number: 16 },
  { name: "Otavio", position: "MF", age: 31, club: "Al Nassr", number: 17 },
  { name: "Matheus Nunes", position: "MF", age: 27, club: "Manchester City", number: 18 },
  { name: "Cristiano Ronaldo", position: "FW", age: 41, club: "Al Nassr", number: 9 },
  { name: "Joao Felix", position: "FW", age: 26, club: "Barcelona", number: 19 },
  { name: "Rafael Leao", position: "FW", age: 26, club: "AC Milan", number: 20 },
  { name: "Diogo Jota", position: "FW", age: 29, club: "Liverpool", number: 21 },
  { name: "Goncalo Ramos", position: "FW", age: 25, club: "Paris Saint-Germain", number: 23 },
  { name: "Pedro Neto", position: "FW", age: 26, club: "Chelsea", number: 24 },
  { name: "Francisco Conceicao", position: "FW", age: 23, club: "Juventus", number: 25 },
  { name: "Trincao", position: "FW", age: 26, club: "Sporting CP", number: 26 },
  { name: "Joao Palhinha", position: "MF", age: 30, club: "Bayern Munich", number: 13 },
];

// Netherlands (real squad from search)
playerData["ned"] = [
  { name: "Mark Flekken", position: "GK", age: 32, club: "Bayer Leverkusen", number: 1 },
  { name: "Robin Roefs", position: "GK", age: 23, club: "Sunderland", number: 13 },
  { name: "Bart Verbruggen", position: "GK", age: 23, club: "Brighton", number: 23 },
  { name: "Nathan Ake", position: "DF", age: 31, club: "Manchester City", number: 5 },
  { name: "Denzel Dumfries", position: "DF", age: 30, club: "Inter Milan", number: 2 },
  { name: "Jorrel Hato", position: "DF", age: 20, club: "Chelsea", number: 3 },
  { name: "Jurrien Timber", position: "DF", age: 25, club: "Arsenal", number: 4 },
  { name: "Jan Paul van Hecke", position: "DF", age: 26, club: "Brighton", number: 15 },
  { name: "Micky van de Ven", position: "DF", age: 25, club: "Tottenham Hotspur", number: 6 },
  { name: "Virgil van Dijk", position: "DF", age: 34, club: "Liverpool", number: 4 },
  { name: "Frenkie de Jong", position: "MF", age: 29, club: "Barcelona", number: 8 },
  { name: "Marten de Roon", position: "MF", age: 35, club: "Atalanta", number: 16 },
  { name: "Ryan Gravenberch", position: "MF", age: 24, club: "Liverpool", number: 17 },
  { name: "Teun Koopmeiners", position: "MF", age: 28, club: "Juventus", number: 18 },
  { name: "Tijjani Reijnders", position: "MF", age: 27, club: "Manchester City", number: 14 },
  { name: "Guus Til", position: "MF", age: 28, club: "PSV Eindhoven", number: 19 },
  { name: "Quinten Timber", position: "MF", age: 25, club: "Olympique Marseille", number: 20 },
  { name: "Mats Wieffer", position: "MF", age: 26, club: "Brighton", number: 21 },
  { name: "Brian Brobbey", position: "FW", age: 24, club: "Sunderland", number: 9 },
  { name: "Memphis Depay", position: "FW", age: 32, club: "Corinthians", number: 10 },
  { name: "Cody Gakpo", position: "FW", age: 27, club: "Liverpool", number: 11 },
  { name: "Justin Kluivert", position: "FW", age: 27, club: "Bournemouth", number: 22 },
  { name: "Noa Lang", position: "FW", age: 26, club: "Galatasaray", number: 24 },
  { name: "Donyell Malen", position: "FW", age: 27, club: "Roma", number: 25 },
  { name: "Crysencio Summerville", position: "FW", age: 23, club: "West Ham United", number: 26 },
  { name: "Wout Weghorst", position: "FW", age: 33, club: "Ajax", number: 7 },
];

// Uruguay (real squad)
playerData["uru"] = [
  { name: "Sergio Rochet", position: "GK", age: 33, club: "Internacional", number: 1 },
  { name: "Fernando Muslera", position: "GK", age: 39, club: "Galatasaray", number: 12 },
  { name: "Santiago Mele", position: "GK", age: 28, club: "Junior FC", number: 23 },
  { name: "Guillermo Varela", position: "DF", age: 33, club: "Flamengo", number: 2 },
  { name: "Ronald Araujo", position: "DF", age: 27, club: "Barcelona", number: 3 },
  { name: "Jose Maria Gimenez", position: "DF", age: 31, club: "Atletico Madrid", number: 4 },
  { name: "Santiago Bueno", position: "DF", age: 27, club: "Wolverhampton", number: 5 },
  { name: "Sebastian Caceres", position: "DF", age: 26, club: "Club America", number: 13 },
  { name: "Mathias Olivera", position: "DF", age: 28, club: "Napoli", number: 15 },
  { name: "Joaquin Piquerez", position: "DF", age: 27, club: "Palmeiras", number: 16 },
  { name: "Matias Vina", position: "DF", age: 28, club: "Flamengo", number: 17 },
  { name: "Manuel Ugarte", position: "MF", age: 25, club: "Manchester United", number: 6 },
  { name: "Emiliano Martinez", position: "MF", age: 26, club: "Palmeiras", number: 18 },
  { name: "Rodrigo Bentancur", position: "MF", age: 28, club: "Tottenham Hotspur", number: 8 },
  { name: "Federico Valverde", position: "MF", age: 27, club: "Real Madrid", number: 7 },
  { name: "Agustin Canobbio", position: "MF", age: 27, club: "Fluminense", number: 19 },
  { name: "Juan Manuel Sanabria", position: "MF", age: 26, club: "Atletico San Luis", number: 20 },
  { name: "Giorgian de Arrascaeta", position: "MF", age: 32, club: "Fluminense", number: 10 },
  { name: "Nicolas de la Cruz", position: "MF", age: 29, club: "Flamengo", number: 21 },
  { name: "Rodrigo Zalazar", position: "MF", age: 26, club: "Braga", number: 22 },
  { name: "Facundo Pellistri", position: "MF", age: 24, club: "Panathinaikos", number: 24 },
  { name: "Maximiliano Araujo", position: "MF", age: 26, club: "Sporting CP", number: 25 },
  { name: "Brian Rodriguez", position: "MF", age: 26, club: "Club America", number: 26 },
  { name: "Rodrigo Aguirre", position: "FW", age: 31, club: "Tigres UANL", number: 9 },
  { name: "Federico Vinas", position: "FW", age: 27, club: "Real Oviedo", number: 11 },
  { name: "Darwin Nunez", position: "FW", age: 26, club: "Al Hilal", number: 14 },
];

// Japan (real squad)
playerData["jpn"] = [
  { name: "Zion Suzuki", position: "GK", age: 23, club: "Parma", number: 1 },
  { name: "Keisuke Osako", position: "GK", age: 26, club: "Sanfrecce Hiroshima", number: 12 },
  { name: "Tomoki Hayakawa", position: "GK", age: 27, club: "Kashima Antlers", number: 23 },
  { name: "Yuto Nagatomo", position: "DF", age: 39, club: "FC Tokyo", number: 5 },
  { name: "Shogo Taniguchi", position: "DF", age: 34, club: "Sint-Truiden", number: 3 },
  { name: "Ko Itakura", position: "DF", age: 29, club: "Ajax", number: 4 },
  { name: "Tsuyoshi Watanabe", position: "DF", age: 29, club: "Feyenoord", number: 16 },
  { name: "Takehiro Tomiyasu", position: "DF", age: 27, club: "Ajax", number: 2 },
  { name: "Hiroki Ito", position: "DF", age: 27, club: "Bayern Munich", number: 19 },
  { name: "Ayumu Seko", position: "DF", age: 25, club: "Le Havre", number: 15 },
  { name: "Yukinari Sugawara", position: "DF", age: 25, club: "Werder Bremen", number: 22 },
  { name: "Junnosuke Suzuki", position: "DF", age: 22, club: "Copenhagen", number: 13 },
  { name: "Wataru Endo", position: "MF", age: 33, club: "Liverpool", number: 6 },
  { name: "Junya Ito", position: "MF", age: 33, club: "Genk", number: 14 },
  { name: "Daichi Kamada", position: "MF", age: 29, club: "Crystal Palace", number: 8 },
  { name: "Ritsu Doan", position: "MF", age: 28, club: "Eintracht Frankfurt", number: 10 },
  { name: "Ao Tanaka", position: "MF", age: 27, club: "Leeds United", number: 17 },
  { name: "Keito Nakamura", position: "MF", age: 25, club: "Reims", number: 11 },
  { name: "Kaishu Sano", position: "MF", age: 25, club: "Mainz", number: 18 },
  { name: "Takefusa Kubo", position: "MF", age: 25, club: "Real Sociedad", number: 7 },
  { name: "Yuito Suzuki", position: "MF", age: 24, club: "Freiburg", number: 20 },
  { name: "Koki Ogawa", position: "FW", age: 28, club: "NEC Nijmegen", number: 9 },
  { name: "Daizen Maeda", position: "FW", age: 28, club: "Celtic", number: 21 },
  { name: "Ayase Ueda", position: "FW", age: 27, club: "Feyenoord", number: 24 },
  { name: "Kento Shiogai", position: "FW", age: 21, club: "VfL Wolfsburg", number: 25 },
  { name: "Keisuke Goto", position: "FW", age: 22, club: "Sint-Truiden", number: 26 },
];

// South Korea (real squad)
playerData["kor"] = [
  { name: "Jo Hyun-woo", position: "GK", age: 34, club: "Ulsan HD", number: 1 },
  { name: "Kim Seung-gyu", position: "GK", age: 35, club: "FC Tokyo", number: 12 },
  { name: "Song Bum-keun", position: "GK", age: 28, club: "Jeonbuk Hyundai", number: 23 },
  { name: "Kim Min-jae", position: "DF", age: 29, club: "Bayern Munich", number: 4 },
  { name: "Cho Yu-min", position: "DF", age: 28, club: "Sharjah", number: 15 },
  { name: "Lee Han-beom", position: "DF", age: 23, club: "Midtjylland", number: 16 },
  { name: "Kim Tae-hyun", position: "DF", age: 26, club: "Kashima Antlers", number: 2 },
  { name: "Park Jin-seob", position: "DF", age: 30, club: "Zhejiang FC", number: 5 },
  { name: "Lee Ki-hyuk", position: "DF", age: 26, club: "Gangwon FC", number: 3 },
  { name: "Lee Tae-seok", position: "DF", age: 24, club: "Austria Vienna", number: 13 },
  { name: "Seol Young-woo", position: "DF", age: 27, club: "Red Star Belgrade", number: 14 },
  { name: "Jens Castrop", position: "DF", age: 23, club: "Borussia Monchengladbach", number: 17 },
  { name: "Kim Moon-hwan", position: "DF", age: 30, club: "Daejeon Hana", number: 18 },
  { name: "Hwang In-beom", position: "MF", age: 29, club: "Feyenoord", number: 6 },
  { name: "Paik Seung-ho", position: "MF", age: 29, club: "Birmingham City", number: 8 },
  { name: "Yang Hyun-jun", position: "MF", age: 24, club: "Celtic", number: 19 },
  { name: "Bae Jun-ho", position: "MF", age: 22, club: "Stoke City", number: 20 },
  { name: "Eom Ji-sung", position: "MF", age: 24, club: "Swansea City", number: 21 },
  { name: "Hwang Hee-chan", position: "MF", age: 30, club: "Wolverhampton", number: 11 },
  { name: "Lee Dong-gyeong", position: "MF", age: 28, club: "Ulsan HD", number: 22 },
  { name: "Lee Jae-sung", position: "MF", age: 33, club: "Mainz", number: 7 },
  { name: "Lee Kang-in", position: "MF", age: 25, club: "Paris Saint-Germain", number: 10 },
  { name: "Kim Jin-kyu", position: "MF", age: 28, club: "Jeonbuk Hyundai", number: 25 },
  { name: "Son Heung-min", position: "FW", age: 33, club: "LAFC", number: 9 },
  { name: "Oh Hyun-kyu", position: "FW", age: 25, club: "Besiktas", number: 24 },
  { name: "Cho Gue-sung", position: "FW", age: 28, club: "Midtjylland", number: 26 },
];

// USA (real squad from search)
playerData["usa"] = [
  { name: "Chris Brady", position: "GK", age: 22, club: "Chicago Fire", number: 12 },
  { name: "Matt Freese", position: "GK", age: 27, club: "New York City FC", number: 1 },
  { name: "Matt Turner", position: "GK", age: 31, club: "New England Revolution", number: 23 },
  { name: "Max Arfsten", position: "DF", age: 22, club: "Columbus Crew", number: 2 },
  { name: "Sergino Dest", position: "DF", age: 25, club: "PSV Eindhoven", number: 3 },
  { name: "Alex Freeman", position: "DF", age: 21, club: "Villarreal", number: 13 },
  { name: "Mark McKenzie", position: "DF", age: 27, club: "Toulouse", number: 4 },
  { name: "Tim Ream", position: "DF", age: 38, club: "Charlotte FC", number: 14 },
  { name: "Chris Richards", position: "DF", age: 26, club: "Crystal Palace", number: 5 },
  { name: "Antonee Robinson", position: "DF", age: 28, club: "Fulham", number: 6 },
  { name: "Miles Robinson", position: "DF", age: 29, club: "FC Cincinnati", number: 15 },
  { name: "Joe Scally", position: "DF", age: 23, club: "Borussia Monchengladbach", number: 16 },
  { name: "Auston Trusty", position: "DF", age: 27, club: "Celtic", number: 17 },
  { name: "Tyler Adams", position: "MF", age: 27, club: "Bournemouth", number: 8 },
  { name: "Sebastian Berhalter", position: "MF", age: 23, club: "Vancouver Whitecaps", number: 18 },
  { name: "Weston McKennie", position: "MF", age: 27, club: "Juventus", number: 7 },
  { name: "Gio Reyna", position: "MF", age: 23, club: "Borussia Monchengladbach", number: 10 },
  { name: "Cristian Roldan", position: "MF", age: 31, club: "Seattle Sounders", number: 19 },
  { name: "Malik Tillman", position: "MF", age: 24, club: "Bayer Leverkusen", number: 20 },
  { name: "Brenden Aaronson", position: "FW", age: 25, club: "Leeds United", number: 11 },
  { name: "Folarin Balogun", position: "FW", age: 24, club: "Monaco", number: 9 },
  { name: "Ricardo Pepi", position: "FW", age: 23, club: "PSV Eindhoven", number: 21 },
  { name: "Christian Pulisic", position: "FW", age: 27, club: "AC Milan", number: 7 },
  { name: "Tim Weah", position: "FW", age: 26, club: "Olympique Marseille", number: 22 },
  { name: "Haji Wright", position: "FW", age: 28, club: "Coventry City", number: 24 },
  { name: "Alejandro Zendejas", position: "FW", age: 28, club: "Club America", number: 25 },
];

// Mexico (real squad)
playerData["mex"] = [
  { name: "Carlos Acevedo", position: "GK", age: 30, club: "Santos Laguna", number: 12 },
  { name: "Guillermo Ochoa", position: "GK", age: 40, club: "AEL Limassol", number: 13 },
  { name: "Raul Rangel", position: "GK", age: 25, club: "Chivas", number: 1 },
  { name: "Jesus Gallardo", position: "DF", age: 31, club: "Toluca", number: 23 },
  { name: "Israel Reyes", position: "DF", age: 26, club: "Club America", number: 3 },
  { name: "Cesar Montes", position: "DF", age: 29, club: "Lokomotiv Moscow", number: 4 },
  { name: "Jorge Sanchez", position: "DF", age: 28, club: "PAOK", number: 2 },
  { name: "Johan Vasquez", position: "DF", age: 27, club: "Genoa", number: 5 },
  { name: "Mateo Chavez", position: "DF", age: 22, club: "AZ Alkmaar", number: 14 },
  { name: "Edson Alvarez", position: "MF", age: 28, club: "Fenerbahce", number: 6 },
  { name: "Luis Chavez", position: "MF", age: 30, club: "Dinamo Moscow", number: 8 },
  { name: "Alvaro Fidalgo", position: "MF", age: 29, club: "Real Betis", number: 15 },
  { name: "Brian Gutierrez", position: "MF", age: 23, club: "Chivas", number: 16 },
  { name: "Cesar Huerta", position: "MF", age: 25, club: "Anderlecht", number: 17 },
  { name: "Erik Lira", position: "MF", age: 26, club: "Cruz Azul", number: 18 },
  { name: "Gilberto Mora", position: "MF", age: 19, club: "Tijuana", number: 19 },
  { name: "Orbelin Pineda", position: "MF", age: 30, club: "AEK Athens", number: 7 },
  { name: "Luis Romo", position: "MF", age: 31, club: "Chivas", number: 20 },
  { name: "Obed Vargas", position: "MF", age: 21, club: "Atletico Madrid", number: 21 },
  { name: "Roberto Alvarado", position: "MF", age: 27, club: "Chivas", number: 22 },
  { name: "Santiago Gimenez", position: "FW", age: 25, club: "AC Milan", number: 9 },
  { name: "Armando Gonzalez", position: "FW", age: 24, club: "Chivas", number: 24 },
  { name: "Raul Jimenez", position: "FW", age: 35, club: "Fulham", number: 10 },
  { name: "Guillermo Martinez", position: "FW", age: 28, club: "Pumas", number: 25 },
  { name: "Julian Quinones", position: "FW", age: 29, club: "Al Qadsiah", number: 11 },
  { name: "Alexis Vega", position: "FW", age: 28, club: "Toluca", number: 26 },
];

// Morocco (real squad)
playerData["mar"] = [
  { name: "Yassine Bounou", position: "GK", age: 35, club: "Al Hilal", number: 1 },
  { name: "Munir El Kajoui", position: "GK", age: 37, club: "RS Berkane", number: 12 },
  { name: "Ahmed Reda Tagnaouti", position: "GK", age: 30, club: "Royal Armed Forces", number: 22 },
  { name: "Nayef Aguerd", position: "DF", age: 30, club: "Olympique Marseille", number: 5 },
  { name: "Youssef Belammari", position: "DF", age: 26, club: "Al Ahly", number: 15 },
  { name: "Issa Diop", position: "DF", age: 29, club: "Fulham", number: 16 },
  { name: "Zakaria El Ouahdi", position: "DF", age: 23, club: "Genk", number: 2 },
  { name: "Achraf Hakimi", position: "DF", age: 27, club: "Paris Saint-Germain", number: 3 },
  { name: "Redouane Halhal", position: "DF", age: 25, club: "KV Mechelen", number: 17 },
  { name: "Noussair Mazraoui", position: "DF", age: 28, club: "Manchester United", number: 4 },
  { name: "Chadi Riad", position: "DF", age: 22, club: "Crystal Palace", number: 13 },
  { name: "Anass Salah-Eddine", position: "DF", age: 24, club: "PSV Eindhoven", number: 18 },
  { name: "Sofyan Amrabat", position: "MF", age: 29, club: "Real Betis", number: 6 },
  { name: "Ayyoub Bouaddi", position: "MF", age: 18, club: "Lille", number: 20 },
  { name: "Neil El Aynaoui", position: "MF", age: 23, club: "Roma", number: 21 },
  { name: "Bilal El Khannouss", position: "MF", age: 22, club: "VfB Stuttgart", number: 8 },
  { name: "Samir El Mourabet", position: "MF", age: 23, club: "RC Strasbourg", number: 23 },
  { name: "Azzedine Ounahi", position: "MF", age: 26, club: "Girona", number: 7 },
  { name: "Ismael Saibari", position: "MF", age: 24, club: "PSV Eindhoven", number: 14 },
  { name: "Ayoube Amaimouni", position: "FW", age: 22, club: "Eintracht Frankfurt", number: 24 },
  { name: "Brahim Diaz", position: "FW", age: 26, club: "Real Madrid", number: 10 },
  { name: "Ayoub El Kaabi", position: "FW", age: 33, club: "Olympiacos", number: 9 },
  { name: "Abde Ezzalzouli", position: "FW", age: 24, club: "Real Betis", number: 11 },
  { name: "Yassine Gessime", position: "FW", age: 23, club: "RC Strasbourg", number: 25 },
  { name: "Soufiane Rahimi", position: "FW", age: 30, club: "Al Ain", number: 19 },
  { name: "Chemsdine Talbi", position: "FW", age: 21, club: "Sunderland", number: 26 },
];

// Croatia (top players real, rest plausible)
playerData["cro"] = [
  { name: "Dominik Livakovic", position: "GK", age: 31, club: "Fenerbahce", number: 1 },
  { name: "Ivica Ivusic", position: "GK", age: 31, club: "Pafos", number: 12 },
  { name: "Nediljko Labrovic", position: "GK", age: 26, club: "Augsburg", number: 23 },
  { name: "Josip Juranovic", position: "DF", age: 30, club: "Union Berlin", number: 2 },
  { name: "Josko Gvardiol", position: "DF", age: 24, club: "Manchester City", number: 4 },
  { name: "Martin Erlic", position: "DF", age: 28, club: "Bologna", number: 5 },
  { name: "Josip Sutalo", position: "DF", age: 26, club: "Ajax", number: 3 },
  { name: "Borna Sosa", position: "DF", age: 28, club: "Ajax", number: 19 },
  { name: "Josip Stanisic", position: "DF", age: 26, club: "Bayern Munich", number: 6 },
  { name: "Marin Pongracic", position: "DF", age: 28, club: "Fiorentina", number: 15 },
  { name: "Luka Modric", position: "MF", age: 40, club: "Real Madrid", number: 10 },
  { name: "Mateo Kovacic", position: "MF", age: 32, club: "Manchester City", number: 8 },
  { name: "Marcelo Brozovic", position: "MF", age: 33, club: "Al Nassr", number: 11 },
  { name: "Lovro Majer", position: "MF", age: 28, club: "Wolfsburg", number: 7 },
  { name: "Mario Pasalic", position: "MF", age: 31, club: "Atalanta", number: 13 },
  { name: "Luka Sucic", position: "MF", age: 23, club: "Real Sociedad", number: 14 },
  { name: "Martin Baturina", position: "MF", age: 23, club: "Dinamo Zagreb", number: 16 },
  { name: "Nikola Vlasic", position: "MF", age: 28, club: "Torino", number: 17 },
  { name: "Andrej Kramaric", position: "FW", age: 35, club: "Hoffenheim", number: 9 },
  { name: "Ivan Perisic", position: "FW", age: 37, club: "Hajduk Split", number: 18 },
  { name: "Bruno Petkovic", position: "FW", age: 31, club: "Dinamo Zagreb", number: 20 },
  { name: "Josip Brekalo", position: "FW", age: 28, club: "Fiorentina", number: 21 },
  { name: "Ante Budimir", position: "FW", age: 34, club: "Osasuna", number: 22 },
  { name: "Marco Pasalic", position: "FW", age: 24, club: "Rijeka", number: 24 },
  { name: "Igor Matanovic", position: "FW", age: 23, club: "Eintracht Frankfurt", number: 25 },
  { name: "Dion Drena Beljo", position: "FW", age: 24, club: "Augsburg", number: 26 },
];

// Function to generate plausible players for remaining teams
function generateFictionalSquad(teamId) {
  const team = teamDefs.find(t => t.id === teamId);
  const firstNames = ["Ahmed", "Mohamed", "Ali", "Lucas", "Marco", "Sergio", "Andre", "Diego", "Carlos", "Fernando", "Miguel", "Pedro", "Javier", "David", "Daniel", "Omar", "Karim", "Hassan", "Nicolas", "Victor", "Rafael", "Felipe", "Eduardo", "Gabriel", "Ricardo", "Juan", "Paolo", "Roberto", "Gustavo", "Bruno", "Tiago", "Marko", "Ivan", "Pavel", "Jan", "Lars", "Sven", "Kim", "Park", "Akira"];
  const lastNames = ["Silva", "Santos", "Ferreira", "Costa", "Lopez", "Garcia", "Martinez", "Rodriguez", "Gonzalez", "Hernandez", "Perez", "Torres", "Ramirez", "Flores", "Rivera", "Cruz", "Morales", "Ortiz", "Kim", "Lee", "Park", "Choi", "Tanaka", "Yamamoto", "Sato", "Nguyen", "Chen", "Kumar", "Singh", "Muller", "Schmidt", "Weber", "Novak", "Horvat", "Ibrahim", "Ali", "Diallo", "Traore", "Coulibaly", "Toure"];
  const GKclubs = ["Al Ahly", "Club Africain", "Esperance", "Wydad Casablanca", "Raja Casablanca", "Zamalek", "Pyramids FC", "Orlando Pirates", "Kaizer Chiefs", "Mamelodi Sundowns"];
  const DFclubs = ["Anderlecht", "Club Brugge", "Genk", "Basel", "Young Boys", "Dinamo Zagreb", "Shakhtar Donetsk", "Sparta Prague", "Slavia Prague", "Celtic", "Rangers", "Galatasaray", "Fenerbahce", "Besiktas", "Olympiacos", "Panathinaikos", "PAOK"];
  const MFclubs = ["Ajax", "PSV Eindhoven", "Benfica", "FC Porto", "Sporting Lisbon", "RB Salzburg", "RB Leipzig", "Bayer Leverkusen", "Lille", "Monaco", "Nice", "Marseille"];
  const FWclubs = ["AC Milan", "Napoli", "Roma", "Lazio", "Atalanta", "Fiorentina", "Valencia", "Sevilla", "Real Betis", "Real Sociedad", "Villarreal"];
  const mix = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const players = [];
  const usedNumbers = new Set();
  const usedNames = new Set();
  // 3 GKs
  for (let i = 0; i < 3; i++) {
    let num, name;
    do { num = Math.floor(Math.random() * 99) + 1; } while (usedNumbers.has(num));
    do { name = `${mix(firstNames)} ${mix(lastNames)}`; } while (usedNames.has(name));
    usedNumbers.add(num); usedNames.add(name);
    players.push({ name, position: "GK", age: 22 + Math.floor(Math.random() * 15), club: mix(GKclubs), number: num });
  }
  // 8 DFs
  for (let i = 0; i < 8; i++) {
    let num, name;
    do { num = Math.floor(Math.random() * 99) + 1; } while (usedNumbers.has(num));
    do { name = `${mix(firstNames)} ${mix(lastNames)}`; } while (usedNames.has(name));
    usedNumbers.add(num); usedNames.add(name);
    players.push({ name, position: "DF", age: 22 + Math.floor(Math.random() * 13), club: mix([...DFclubs, ...MFclubs]), number: num });
  }
  // 8 MFs
  for (let i = 0; i < 8; i++) {
    let num, name;
    do { num = Math.floor(Math.random() * 99) + 1; } while (usedNumbers.has(num));
    do { name = `${mix(firstNames)} ${mix(lastNames)}`; } while (usedNames.has(name));
    usedNumbers.add(num); usedNames.add(name);
    players.push({ name, position: "MF", age: 21 + Math.floor(Math.random() * 14), club: mix([...MFclubs, ...DFclubs]), number: num });
  }
  // 7 FWs
  for (let i = 0; i < 7; i++) {
    let num, name;
    do { num = Math.floor(Math.random() * 99) + 1; } while (usedNumbers.has(num));
    do { name = `${mix(firstNames)} ${mix(lastNames)}`; } while (usedNames.has(name));
    usedNumbers.add(num); usedNames.add(name);
    players.push({ name, position: "FW", age: 21 + Math.floor(Math.random() * 13), club: mix([...FWclubs, ...MFclubs]), number: num });
  }
  return players.sort((a, b) => a.number - b.number);
}

// Teams with real squads from search data
const realSquadTeams = new Set(["arg", "bra", "fra", "eng", "esp", "ger", "por", "ned", "uru", "jpn", "kor", "usa", "mex", "mar", "cro"]);

// ===== 4b. BUILD TEAMS AND PLAYERS =====
const allPlayers = [];
const teams = teamDefs.map(td => {
  const squad = playerData[td.id] || generateFictionalSquad(td.id);
  const playerIds = squad.map((p, idx) => {
    const pid = `${td.id}-${p.number}`;
    allPlayers.push({
      id: pid,
      name: p.name,
      position: p.position,
      age: p.age,
      club: p.club,
      number: p.number,
      teamId: td.id,
    });
    return pid;
  });
  return { ...td, playerIds };
});

write('teams.json', teams);
write('players.json', allPlayers);

// ===== 5. MATCHES =====
// Group stage schedule from search results; knockout placeholders
const groupStageMatches = [
  // Group A
  { date: "2026-06-11T20:00:00Z", home: "mex", away: "rsa", group: "A", venue: "estadio-azteca" },
  { date: "2026-06-12T17:00:00Z", home: "kor", away: "cze", group: "A", venue: "estadio-akron" },
  { date: "2026-06-18T19:00:00Z", home: "cze", away: "rsa", group: "A", venue: "mercedes-benz-stadium" },
  { date: "2026-06-18T22:00:00Z", home: "mex", away: "kor", group: "A", venue: "estadio-akron" },
  { date: "2026-06-24T20:00:00Z", home: "mex", away: "cze", group: "A", venue: "estadio-azteca" },
  { date: "2026-06-24T20:00:00Z", home: "rsa", away: "kor", group: "A", venue: "estadio-bbva" },
  // Group B
  { date: "2026-06-12T22:00:00Z", home: "can", away: "bih", group: "B", venue: "bmo-field" },
  { date: "2026-06-13T19:00:00Z", home: "qat", away: "sui", group: "B", venue: "levis-stadium" },
  { date: "2026-06-18T17:00:00Z", home: "sui", away: "bih", group: "B", venue: "sofi-stadium" },
  { date: "2026-06-18T22:00:00Z", home: "can", away: "qat", group: "B", venue: "bc-place" },
  { date: "2026-06-24T17:00:00Z", home: "sui", away: "can", group: "B", venue: "bc-place" },
  { date: "2026-06-24T17:00:00Z", home: "bih", away: "qat", group: "B", venue: "lumen-field" },
  // Group C
  { date: "2026-06-13T22:00:00Z", home: "bra", away: "mar", group: "C", venue: "metlife-stadium" },
  { date: "2026-06-13T17:00:00Z", home: "hai", away: "sco", group: "C", venue: "gillette-stadium" },
  { date: "2026-06-19T19:00:00Z", home: "sco", away: "mar", group: "C", venue: "gillette-stadium" },
  { date: "2026-06-19T22:00:00Z", home: "bra", away: "hai", group: "C", venue: "lincoln-financial-field" },
  { date: "2026-06-24T22:00:00Z", home: "sco", away: "bra", group: "C", venue: "hard-rock-stadium" },
  { date: "2026-06-24T22:00:00Z", home: "mar", away: "hai", group: "C", venue: "mercedes-benz-stadium" },
  // Group D
  { date: "2026-06-12T19:00:00Z", home: "usa", away: "par", group: "D", venue: "sofi-stadium" },
  { date: "2026-06-13T17:00:00Z", home: "aus", away: "tur", group: "D", venue: "bc-place" },
  { date: "2026-06-19T17:00:00Z", home: "usa", away: "aus", group: "D", venue: "lumen-field" },
  { date: "2026-06-19T19:00:00Z", home: "tur", away: "par", group: "D", venue: "levis-stadium" },
  { date: "2026-06-25T19:00:00Z", home: "usa", away: "tur", group: "D", venue: "sofi-stadium" },
  { date: "2026-06-25T19:00:00Z", home: "par", away: "aus", group: "D", venue: "levis-stadium" },
  // Group E
  { date: "2026-06-14T17:00:00Z", home: "ger", away: "cuw", group: "E", venue: "nrg-stadium" },
  { date: "2026-06-14T19:00:00Z", home: "civ", away: "ecu", group: "E", venue: "lincoln-financial-field" },
  { date: "2026-06-20T17:00:00Z", home: "ger", away: "civ", group: "E", venue: "bmo-field" },
  { date: "2026-06-20T19:00:00Z", home: "ecu", away: "cuw", group: "E", venue: "arrowhead-stadium" },
  { date: "2026-06-25T22:00:00Z", home: "ger", away: "ecu", group: "E", venue: "metlife-stadium" },
  { date: "2026-06-25T22:00:00Z", home: "cuw", away: "civ", group: "E", venue: "lincoln-financial-field" },
  // Group F
  { date: "2026-06-14T22:00:00Z", home: "ned", away: "jpn", group: "F", venue: "att-stadium" },
  { date: "2026-06-14T17:00:00Z", home: "swe", away: "tun", group: "F", venue: "estadio-bbva" },
  { date: "2026-06-20T22:00:00Z", home: "ned", away: "swe", group: "F", venue: "nrg-stadium" },
  { date: "2026-06-20T22:00:00Z", home: "tun", away: "jpn", group: "F", venue: "estadio-bbva" },
  { date: "2026-06-25T17:00:00Z", home: "ned", away: "tun", group: "F", venue: "arrowhead-stadium" },
  { date: "2026-06-25T17:00:00Z", home: "jpn", away: "swe", group: "F", venue: "att-stadium" },
  // Group G
  { date: "2026-06-15T19:00:00Z", home: "bel", away: "egy", group: "G", venue: "lumen-field" },
  { date: "2026-06-15T22:00:00Z", home: "irn", away: "nzl", group: "G", venue: "sofi-stadium" },
  { date: "2026-06-21T17:00:00Z", home: "bel", away: "irn", group: "G", venue: "sofi-stadium" },
  { date: "2026-06-21T22:00:00Z", home: "nzl", away: "egy", group: "G", venue: "bc-place" },
  { date: "2026-06-26T19:00:00Z", home: "bel", away: "nzl", group: "G", venue: "bc-place" },
  { date: "2026-06-26T19:00:00Z", home: "egy", away: "irn", group: "G", venue: "lumen-field" },
  // Group H
  { date: "2026-06-15T17:00:00Z", home: "esp", away: "cpv", group: "H", venue: "mercedes-benz-stadium" },
  { date: "2026-06-15T19:00:00Z", home: "ksa", away: "uru", group: "H", venue: "hard-rock-stadium" },
  { date: "2026-06-21T19:00:00Z", home: "esp", away: "ksa", group: "H", venue: "mercedes-benz-stadium" },
  { date: "2026-06-21T19:00:00Z", home: "uru", away: "cpv", group: "H", venue: "hard-rock-stadium" },
  { date: "2026-06-26T22:00:00Z", home: "esp", away: "uru", group: "H", venue: "estadio-bbva" },
  { date: "2026-06-26T22:00:00Z", home: "ksa", away: "cpv", group: "H", venue: "nrg-stadium" },
  // Group I
  { date: "2026-06-16T22:00:00Z", home: "fra", away: "sen", group: "I", venue: "metlife-stadium" },
  { date: "2026-06-16T19:00:00Z", home: "irq", away: "nor", group: "I", venue: "gillette-stadium" },
  { date: "2026-06-22T19:00:00Z", home: "fra", away: "irq", group: "I", venue: "lincoln-financial-field" },
  { date: "2026-06-22T22:00:00Z", home: "nor", away: "sen", group: "I", venue: "metlife-stadium" },
  { date: "2026-06-26T17:00:00Z", home: "fra", away: "nor", group: "I", venue: "gillette-stadium" },
  { date: "2026-06-26T17:00:00Z", home: "sen", away: "irq", group: "I", venue: "bmo-field" },
  // Group J
  { date: "2026-06-16T17:00:00Z", home: "arg", away: "alg", group: "J", venue: "arrowhead-stadium" },
  { date: "2026-06-16T17:00:00Z", home: "aut", away: "jor", group: "J", venue: "levis-stadium" },
  { date: "2026-06-22T17:00:00Z", home: "arg", away: "aut", group: "J", venue: "att-stadium" },
  { date: "2026-06-22T17:00:00Z", home: "jor", away: "alg", group: "J", venue: "levis-stadium" },
  { date: "2026-06-27T19:00:00Z", home: "arg", away: "jor", group: "J", venue: "att-stadium" },
  { date: "2026-06-27T19:00:00Z", home: "alg", away: "aut", group: "J", venue: "arrowhead-stadium" },
  // Group K
  { date: "2026-06-17T22:00:00Z", home: "por", away: "cod", group: "K", venue: "nrg-stadium" },
  { date: "2026-06-17T17:00:00Z", home: "uzb", away: "col", group: "K", venue: "estadio-azteca" },
  { date: "2026-06-23T19:00:00Z", home: "por", away: "uzb", group: "K", venue: "nrg-stadium" },
  { date: "2026-06-23T17:00:00Z", home: "col", away: "cod", group: "K", venue: "estadio-akron" },
  { date: "2026-06-27T22:00:00Z", home: "por", away: "col", group: "K", venue: "hard-rock-stadium" },
  { date: "2026-06-27T22:00:00Z", home: "cod", away: "uzb", group: "K", venue: "mercedes-benz-stadium" },
  // Group L
  { date: "2026-06-17T19:00:00Z", home: "eng", away: "cro", group: "L", venue: "att-stadium" },
  { date: "2026-06-17T17:00:00Z", home: "gha", away: "pan", group: "L", venue: "bmo-field" },
  { date: "2026-06-23T22:00:00Z", home: "eng", away: "gha", group: "L", venue: "gillette-stadium" },
  { date: "2026-06-23T22:00:00Z", home: "pan", away: "cro", group: "L", venue: "bmo-field" },
  { date: "2026-06-27T17:00:00Z", home: "eng", away: "pan", group: "L", venue: "metlife-stadium" },
  { date: "2026-06-27T17:00:00Z", home: "cro", away: "gha", group: "L", venue: "lincoln-financial-field" },
];

let matchId = 1;
const matches = [];

// Group stage
groupStageMatches.forEach(m => {
  matches.push({
    id: `match-${String(matchId++).padStart(3, '0')}`,
    homeTeamId: m.home,
    awayTeamId: m.away,
    date: m.date,
    stage: "group",
    groupId: m.group,
    venueId: m.venue,
    status: "scheduled",
  });
});

// Knockout rounds with placeholder pairings
const koVenues = ["metlife-stadium", "att-stadium", "sofi-stadium", "hard-rock-stadium", "estadio-azteca", "arrowhead-stadium", "nrg-stadium", "lincoln-financial-field", "gillette-stadium", "mercedes-benz-stadium", "lumen-field", "levis-stadium", "bmo-field", "bc-place", "estadio-bbva", "estadio-akron"];

// Round of 32: June 28 - July 3 (16 matches)
const r32Dates = ["2026-06-28T17:00:00Z","2026-06-28T20:00:00Z","2026-06-29T17:00:00Z","2026-06-29T20:00:00Z","2026-06-30T17:00:00Z","2026-06-30T20:00:00Z","2026-07-01T17:00:00Z","2026-07-01T20:00:00Z","2026-07-02T17:00:00Z","2026-07-02T20:00:00Z","2026-07-03T17:00:00Z","2026-07-03T20:00:00Z","2026-06-28T22:00:00Z","2026-06-29T22:00:00Z","2026-07-01T22:00:00Z","2026-07-02T22:00:00Z"];
// Use actual teams as placeholders so the app works
const r32Teams = ["arg","fra","bra","eng","ger","esp","por","ned","uru","jpn","kor","usa","mex","mar","cro","bel","sen","col","sui","aut","nor","tur","ecu","irn","egy","aus","swe","civ","alg","par","cze","sco"];
for (let i = 0; i < 16; i++) {
  matches.push({
    id: `match-${String(matchId++).padStart(3, '0')}`,
    homeTeamId: r32Teams[i * 2],
    awayTeamId: r32Teams[i * 2 + 1],
    date: r32Dates[i],
    stage: "round32",
    venueId: koVenues[i % 16],
    status: "scheduled",
  });
}

// Round of 16: July 4-7 (8 matches)
const r16Dates = ["2026-07-04T17:00:00Z","2026-07-04T20:00:00Z","2026-07-05T17:00:00Z","2026-07-05T20:00:00Z","2026-07-06T17:00:00Z","2026-07-06T20:00:00Z","2026-07-07T17:00:00Z","2026-07-07T20:00:00Z"];
const r16Teams = ["arg","bra","fra","eng","esp","ger","por","ned","uru","jpn","kor","usa","mex","mar","cro","bel"];
for (let i = 0; i < 8; i++) {
  matches.push({
    id: `match-${String(matchId++).padStart(3, '0')}`,
    homeTeamId: r16Teams[i * 2],
    awayTeamId: r16Teams[i * 2 + 1],
    date: r16Dates[i],
    stage: "round16",
    venueId: koVenues[i],
    status: "scheduled",
  });
}

// Quarter-finals: July 9-11 (4 matches)
const qfDates = ["2026-07-09T17:00:00Z","2026-07-09T20:00:00Z","2026-07-10T17:00:00Z","2026-07-10T20:00:00Z"];
const qfVenues = ["sofi-stadium","gillette-stadium","arrowhead-stadium","hard-rock-stadium"];
for (let i = 0; i < 4; i++) {
  matches.push({
    id: `match-${String(matchId++).padStart(3, '0')}`,
    homeTeamId: ["arg","fra","esp","eng"][i],
    awayTeamId: ["bra","ger","por","ned"][i],
    date: qfDates[i],
    stage: "quarter",
    venueId: qfVenues[i],
    status: "scheduled",
  });
}

// Semi-finals: July 14-15 (2 matches)
matches.push({
  id: `match-${String(matchId++).padStart(3, '0')}`,
  homeTeamId: "arg", awayTeamId: "fra",
  date: "2026-07-14T20:00:00Z", stage: "semi",
  venueId: "att-stadium", status: "scheduled"
});
matches.push({
  id: `match-${String(matchId++).padStart(3, '0')}`,
  homeTeamId: "eng", awayTeamId: "esp",
  date: "2026-07-15T20:00:00Z", stage: "semi",
  venueId: "mercedes-benz-stadium", status: "scheduled"
});

// Third place: July 18
matches.push({
  id: `match-${String(matchId++).padStart(3, '0')}`,
  homeTeamId: "bra", awayTeamId: "por",
  date: "2026-07-18T17:00:00Z", stage: "third",
  venueId: "hard-rock-stadium", status: "scheduled"
});

// Final: July 19
matches.push({
  id: `match-${String(matchId++).padStart(3, '0')}`,
  homeTeamId: "arg", awayTeamId: "eng",
  date: "2026-07-19T20:00:00Z", stage: "final",
  venueId: "metlife-stadium", status: "scheduled"
});

write('matches.json', matches);

// ===== 6. H2H RECORDS =====
const h2h = [
  {
    team1Id: "arg", team2Id: "bra",
    matches: [
      { date: "1974-06-30", tournament: "1974 World Cup", homeTeamId: "arg", awayTeamId: "bra", homeScore: 1, awayScore: 2 },
      { date: "1978-06-18", tournament: "1978 World Cup", homeTeamId: "arg", awayTeamId: "bra", homeScore: 0, awayScore: 0 },
      { date: "1982-07-02", tournament: "1982 World Cup", homeTeamId: "arg", awayTeamId: "bra", homeScore: 1, awayScore: 3 },
      { date: "1990-06-24", tournament: "1990 World Cup", homeTeamId: "arg", awayTeamId: "bra", homeScore: 1, awayScore: 0 },
      { date: "2021-07-10", tournament: "2021 Copa America Final", homeTeamId: "arg", awayTeamId: "bra", homeScore: 1, awayScore: 0 },
      { date: "2023-11-21", tournament: "2026 World Cup Qualifier", homeTeamId: "bra", awayTeamId: "arg", homeScore: 0, awayScore: 1 },
    ]
  },
  {
    team1Id: "arg", team2Id: "ger",
    matches: [
      { date: "1958-06-08", tournament: "1958 World Cup", homeTeamId: "arg", awayTeamId: "ger", homeScore: 1, awayScore: 3 },
      { date: "1966-07-16", tournament: "1966 World Cup", homeTeamId: "arg", awayTeamId: "ger", homeScore: 0, awayScore: 0 },
      { date: "1986-06-29", tournament: "1986 World Cup Final", homeTeamId: "arg", awayTeamId: "ger", homeScore: 3, awayScore: 2 },
      { date: "1990-07-08", tournament: "1990 World Cup Final", homeTeamId: "arg", awayTeamId: "ger", homeScore: 0, awayScore: 1 },
      { date: "2006-06-30", tournament: "2006 World Cup Quarter", homeTeamId: "arg", awayTeamId: "ger", homeScore: 1, awayScore: 1 },
      { date: "2010-07-03", tournament: "2010 World Cup Quarter", homeTeamId: "arg", awayTeamId: "ger", homeScore: 0, awayScore: 4 },
      { date: "2014-07-13", tournament: "2014 World Cup Final", homeTeamId: "arg", awayTeamId: "ger", homeScore: 0, awayScore: 1 },
    ]
  },
  {
    team1Id: "bra", team2Id: "fra",
    matches: [
      { date: "1958-06-24", tournament: "1958 World Cup Semi", homeTeamId: "bra", awayTeamId: "fra", homeScore: 5, awayScore: 2 },
      { date: "1986-06-21", tournament: "1986 World Cup Quarter", homeTeamId: "bra", awayTeamId: "fra", homeScore: 1, awayScore: 1 },
      { date: "1998-07-12", tournament: "1998 World Cup Final", homeTeamId: "bra", awayTeamId: "fra", homeScore: 0, awayScore: 3 },
      { date: "2006-07-01", tournament: "2006 World Cup Quarter", homeTeamId: "bra", awayTeamId: "fra", homeScore: 0, awayScore: 1 },
    ]
  },
  {
    team1Id: "eng", team2Id: "arg",
    matches: [
      { date: "1966-07-23", tournament: "1966 World Cup Quarter", homeTeamId: "eng", awayTeamId: "arg", homeScore: 1, awayScore: 0 },
      { date: "1986-06-22", tournament: "1986 World Cup Quarter", homeTeamId: "arg", awayTeamId: "eng", homeScore: 2, awayScore: 1 },
      { date: "1998-06-30", tournament: "1998 World Cup Round of 16", homeTeamId: "arg", awayTeamId: "eng", homeScore: 2, awayScore: 2 },
      { date: "2002-06-07", tournament: "2002 World Cup Group", homeTeamId: "arg", awayTeamId: "eng", homeScore: 0, awayScore: 1 },
    ]
  },
  {
    team1Id: "eng", team2Id: "ger",
    matches: [
      { date: "1966-07-30", tournament: "1966 World Cup Final", homeTeamId: "eng", awayTeamId: "ger", homeScore: 4, awayScore: 2 },
      { date: "1970-06-14", tournament: "1970 World Cup Quarter", homeTeamId: "eng", awayTeamId: "ger", homeScore: 2, awayScore: 3 },
      { date: "1990-07-04", tournament: "1990 World Cup Semi", homeTeamId: "eng", awayTeamId: "ger", homeScore: 1, awayScore: 1 },
      { date: "2010-06-27", tournament: "2010 World Cup Round of 16", homeTeamId: "eng", awayTeamId: "ger", homeScore: 1, awayScore: 4 },
      { date: "2021-06-29", tournament: "EURO 2020 Round of 16", homeTeamId: "eng", awayTeamId: "ger", homeScore: 2, awayScore: 0 },
    ]
  },
  {
    team1Id: "esp", team2Id: "ned",
    matches: [
      { date: "2010-07-11", tournament: "2010 World Cup Final", homeTeamId: "esp", awayTeamId: "ned", homeScore: 1, awayScore: 0 },
      { date: "2014-06-13", tournament: "2014 World Cup Group", homeTeamId: "esp", awayTeamId: "ned", homeScore: 1, awayScore: 5 },
    ]
  },
  {
    team1Id: "ger", team2Id: "ita",
    matches: [
      { date: "1970-06-17", tournament: "1970 World Cup Semi", homeTeamId: "ger", awayTeamId: "ita", homeScore: 3, awayScore: 4 },
      { date: "1982-07-11", tournament: "1982 World Cup Final", homeTeamId: "ger", awayTeamId: "ita", homeScore: 1, awayScore: 3 },
      { date: "2006-07-04", tournament: "2006 World Cup Semi", homeTeamId: "ger", awayTeamId: "ita", homeScore: 0, awayScore: 2 },
      { date: "2012-06-28", tournament: "EURO 2012 Semi", homeTeamId: "ger", awayTeamId: "ita", homeScore: 1, awayScore: 2 },
    ]
  },
  {
    team1Id: "usa", team2Id: "mex",
    matches: [
      { date: "2002-06-17", tournament: "2002 World Cup Round of 16", homeTeamId: "usa", awayTeamId: "mex", homeScore: 2, awayScore: 0 },
      { date: "2011-06-25", tournament: "2011 Gold Cup Final", homeTeamId: "usa", awayTeamId: "mex", homeScore: 2, awayScore: 4 },
      { date: "2019-07-07", tournament: "2019 Gold Cup Final", homeTeamId: "usa", awayTeamId: "mex", homeScore: 0, awayScore: 1 },
      { date: "2021-08-01", tournament: "2021 Gold Cup Final", homeTeamId: "usa", awayTeamId: "mex", homeScore: 1, awayScore: 0 },
      { date: "2024-03-24", tournament: "2024 CONCACAF Nations League", homeTeamId: "usa", awayTeamId: "mex", homeScore: 2, awayScore: 0 },
    ]
  },
  {
    team1Id: "por", team2Id: "esp",
    matches: [
      { date: "2010-06-29", tournament: "2010 World Cup Round of 16", homeTeamId: "por", awayTeamId: "esp", homeScore: 0, awayScore: 1 },
      { date: "2018-06-15", tournament: "2018 World Cup Group", homeTeamId: "por", awayTeamId: "esp", homeScore: 3, awayScore: 3 },
      { date: "2012-06-27", tournament: "EURO 2012 Semi", homeTeamId: "por", awayTeamId: "esp", homeScore: 0, awayScore: 0 },
    ]
  },
  {
    team1Id: "fra", team2Id: "por",
    matches: [
      { date: "2006-07-05", tournament: "2006 World Cup Semi", homeTeamId: "fra", awayTeamId: "por", homeScore: 1, awayScore: 0 },
      { date: "2016-07-10", tournament: "EURO 2016 Final", homeTeamId: "fra", awayTeamId: "por", homeScore: 0, awayScore: 1 },
      { date: "2021-06-23", tournament: "EURO 2020 Group", homeTeamId: "fra", awayTeamId: "por", homeScore: 2, awayScore: 2 },
    ]
  },
  {
    team1Id: "ned", team2Id: "arg",
    matches: [
      { date: "1978-06-25", tournament: "1978 World Cup Final", homeTeamId: "ned", awayTeamId: "arg", homeScore: 1, awayScore: 3 },
      { date: "1998-07-04", tournament: "1998 World Cup Quarter", homeTeamId: "ned", awayTeamId: "arg", homeScore: 2, awayScore: 1 },
      { date: "2006-06-21", tournament: "2006 World Cup Group", homeTeamId: "ned", awayTeamId: "arg", homeScore: 0, awayScore: 0 },
      { date: "2014-07-09", tournament: "2014 World Cup Semi", homeTeamId: "ned", awayTeamId: "arg", homeScore: 0, awayScore: 0 },
      { date: "2022-12-09", tournament: "2022 World Cup Quarter", homeTeamId: "ned", awayTeamId: "arg", homeScore: 2, awayScore: 2 },
    ]
  },
  {
    team1Id: "bra", team2Id: "ned",
    matches: [
      { date: "1974-07-03", tournament: "1974 World Cup", homeTeamId: "bra", awayTeamId: "ned", homeScore: 0, awayScore: 2 },
      { date: "1994-07-09", tournament: "1994 World Cup Quarter", homeTeamId: "bra", awayTeamId: "ned", homeScore: 3, awayScore: 2 },
      { date: "1998-07-07", tournament: "1998 World Cup Semi", homeTeamId: "bra", awayTeamId: "ned", homeScore: 1, awayScore: 1 },
      { date: "2010-07-02", tournament: "2010 World Cup Quarter", homeTeamId: "bra", awayTeamId: "ned", homeScore: 1, awayScore: 2 },
    ]
  },
  {
    team1Id: "eng", team2Id: "fra",
    matches: [
      { date: "1966-07-20", tournament: "1966 World Cup Group", homeTeamId: "eng", awayTeamId: "fra", homeScore: 2, awayScore: 0 },
      { date: "1982-06-16", tournament: "1982 World Cup Group", homeTeamId: "eng", awayTeamId: "fra", homeScore: 3, awayScore: 1 },
      { date: "2022-12-10", tournament: "2022 World Cup Quarter", homeTeamId: "eng", awayTeamId: "fra", homeScore: 1, awayScore: 2 },
    ]
  },
  {
    team1Id: "ger", team2Id: "ned",
    matches: [
      { date: "1974-07-07", tournament: "1974 World Cup Final", homeTeamId: "ger", awayTeamId: "ned", homeScore: 2, awayScore: 1 },
      { date: "1988-06-21", tournament: "EURO 1988 Semi", homeTeamId: "ger", awayTeamId: "ned", homeScore: 1, awayScore: 2 },
      { date: "1990-06-24", tournament: "1990 World Cup Round of 16", homeTeamId: "ger", awayTeamId: "ned", homeScore: 2, awayScore: 1 },
    ]
  },
  {
    team1Id: "jpn", team2Id: "kor",
    matches: [
      { date: "2011-01-25", tournament: "2011 Asian Cup Semi", homeTeamId: "jpn", awayTeamId: "kor", homeScore: 2, awayScore: 2 },
      { date: "2019-01-15", tournament: "2019 Asian Cup Group", homeTeamId: "jpn", awayTeamId: "kor", homeScore: 0, awayScore: 1 },
      { date: "2022-07-27", tournament: "2022 EAFF Championship", homeTeamId: "jpn", awayTeamId: "kor", homeScore: 3, awayScore: 0 },
    ]
  },
  {
    team1Id: "uru", team2Id: "arg",
    matches: [
      { date: "1930-07-30", tournament: "1930 World Cup Final", homeTeamId: "uru", awayTeamId: "arg", homeScore: 4, awayScore: 2 },
      { date: "1986-06-16", tournament: "1986 World Cup Round of 16", homeTeamId: "arg", awayTeamId: "uru", homeScore: 1, awayScore: 0 },
      { date: "2023-11-16", tournament: "2026 World Cup Qualifier", homeTeamId: "arg", awayTeamId: "uru", homeScore: 0, awayScore: 2 },
    ]
  },
  {
    team1Id: "esp", team2Id: "ita",
    matches: [
      { date: "2012-07-01", tournament: "EURO 2012 Final", homeTeamId: "esp", awayTeamId: "ita", homeScore: 4, awayScore: 0 },
      { date: "2021-07-06", tournament: "EURO 2020 Semi", homeTeamId: "esp", awayTeamId: "ita", homeScore: 1, awayScore: 1 },
      { date: "2024-06-20", tournament: "EURO 2024 Group", homeTeamId: "esp", awayTeamId: "ita", homeScore: 1, awayScore: 0 },
    ]
  },
  {
    team1Id: "bra", team2Id: "ger",
    matches: [
      { date: "2002-06-30", tournament: "2002 World Cup Final", homeTeamId: "bra", awayTeamId: "ger", homeScore: 2, awayScore: 0 },
      { date: "2014-07-08", tournament: "2014 World Cup Semi", homeTeamId: "bra", awayTeamId: "ger", homeScore: 1, awayScore: 7 },
    ]
  },
  {
    team1Id: "fra", team2Id: "esp",
    matches: [
      { date: "2006-06-27", tournament: "2006 World Cup Round of 16", homeTeamId: "fra", awayTeamId: "esp", homeScore: 3, awayScore: 1 },
      { date: "2021-10-10", tournament: "2021 UEFA Nations League Final", homeTeamId: "fra", awayTeamId: "esp", homeScore: 2, awayScore: 1 },
      { date: "2024-07-09", tournament: "EURO 2024 Semi", homeTeamId: "fra", awayTeamId: "esp", homeScore: 1, awayScore: 2 },
    ]
  },
  {
    team1Id: "por", team2Id: "ned",
    matches: [
      { date: "2006-06-25", tournament: "2006 World Cup Round of 16", homeTeamId: "por", awayTeamId: "ned", homeScore: 1, awayScore: 0 },
      { date: "2012-06-17", tournament: "EURO 2012 Group", homeTeamId: "por", awayTeamId: "ned", homeScore: 2, awayScore: 1 },
      { date: "2019-06-09", tournament: "2019 UEFA Nations League Final", homeTeamId: "por", awayTeamId: "ned", homeScore: 1, awayScore: 0 },
    ]
  },
];

write('h2h.json', h2h);

console.log("\nAll data files generated successfully!");
console.log(`  Teams: ${teams.length}`);
console.log(`  Players: ${allPlayers.length}`);
console.log(`  Matches: ${matches.length}`);
console.log(`  Venues: ${venues.length}`);
console.log(`  Groups: ${groups.length}`);
console.log(`  H2H pairs: ${h2h.length}`);
