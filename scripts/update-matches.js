const fs = require('fs');

const tzMap = {
  'estadio-azteca': -6, 'estadio-akron': -6, 'estadio-bbva': -6,
  'att-stadium': -6, 'arrowhead-stadium': -6, 'nrg-stadium': -6,
  'metlife-stadium': -5, 'gillette-stadium': -5, 'lincoln-financial-field': -5,
  'mercedes-benz-stadium': -5, 'hard-rock-stadium': -5, 'bmo-field': -5,
  'sofi-stadium': -8, 'levis-stadium': -8, 'lumen-field': -8, 'bc-place': -8,
};

function toUTC(dateStr, timeStr, venueId) {
  const tz = tzMap[venueId] || -5;
  const [month, day] = dateStr.split('/').map(Number);
  let [hour, period] = timeStr.split(' ');
  let [h, m] = hour.split(':').map(Number);
  if (!m) m = 0;
  const isPM = period === 'PM';
  const isAM = period === 'AM';
  if (isPM && h !== 12) h += 12;
  if (isAM && h === 12) h = 0;

  let utcHour = h - tz;
  let dayOffset = 0;
  if (utcHour >= 24) { utcHour -= 24; dayOffset = 1; }
  if (utcHour < 0) { utcHour += 24; dayOffset = -1; }

  let actualDay = day + dayOffset;
  let mo = month;
  // Handle month rollover (June=6, July=7)
  if (actualDay > 30 && mo === 6) { actualDay -= 30; mo = 7; }
  if (actualDay < 1 && mo === 7) { actualDay += 30; mo = 6; }

  const d = new Date(Date.UTC(2026, mo - 1, actualDay, utcHour, m));
  return d.toISOString();
}

// Official 2026 FIFA World Cup schedule based on FIFA announcement
const groupMatches = [
  // June 11
  {id:'match-001',h:'mex',a:'rsa',g:'A',v:'estadio-azteca',d:'6/11',t:'3:00 PM'},
  {id:'match-002',h:'kor',a:'cze',g:'A',v:'estadio-akron',d:'6/11',t:'10:00 PM'},
  // June 12
  {id:'match-003',h:'can',a:'bih',g:'B',v:'bmo-field',d:'6/12',t:'3:00 PM'},
  {id:'match-004',h:'usa',a:'par',g:'D',v:'sofi-stadium',d:'6/12',t:'9:00 PM'},
  // June 13
  {id:'match-005',h:'qat',a:'sui',g:'B',v:'levis-stadium',d:'6/13',t:'3:00 PM'},
  {id:'match-006',h:'bra',a:'mar',g:'C',v:'metlife-stadium',d:'6/13',t:'6:00 PM'},
  {id:'match-007',h:'hai',a:'sco',g:'C',v:'gillette-stadium',d:'6/13',t:'9:00 PM'},
  // June 14
  {id:'match-008',h:'aus',a:'tur',g:'D',v:'bc-place',d:'6/14',t:'12:00 AM'},
  {id:'match-009',h:'ger',a:'cuw',g:'E',v:'nrg-stadium',d:'6/14',t:'1:00 PM'},
  {id:'match-010',h:'ned',a:'jpn',g:'F',v:'att-stadium',d:'6/14',t:'4:00 PM'},
  {id:'match-011',h:'civ',a:'ecu',g:'E',v:'lincoln-financial-field',d:'6/14',t:'7:00 PM'},
  {id:'match-012',h:'swe',a:'tun',g:'F',v:'estadio-bbva',d:'6/14',t:'10:00 PM'},
  // June 15
  {id:'match-013',h:'esp',a:'cpv',g:'H',v:'mercedes-benz-stadium',d:'6/15',t:'12:00 PM'},
  {id:'match-014',h:'bel',a:'egy',g:'G',v:'lumen-field',d:'6/15',t:'3:00 PM'},
  {id:'match-015',h:'ksa',a:'uru',g:'H',v:'hard-rock-stadium',d:'6/15',t:'6:00 PM'},
  {id:'match-016',h:'irn',a:'nzl',g:'G',v:'sofi-stadium',d:'6/15',t:'9:00 PM'},
  // June 16
  {id:'match-017',h:'fra',a:'sen',g:'I',v:'metlife-stadium',d:'6/16',t:'3:00 PM'},
  {id:'match-018',h:'irq',a:'nor',g:'I',v:'gillette-stadium',d:'6/16',t:'6:00 PM'},
  {id:'match-019',h:'arg',a:'alg',g:'J',v:'arrowhead-stadium',d:'6/16',t:'9:00 PM'},
  // June 17
  {id:'match-020',h:'aut',a:'jor',g:'J',v:'levis-stadium',d:'6/17',t:'12:00 AM'},
  {id:'match-021',h:'por',a:'cod',g:'K',v:'nrg-stadium',d:'6/17',t:'1:00 PM'},
  {id:'match-022',h:'eng',a:'cro',g:'L',v:'att-stadium',d:'6/17',t:'4:00 PM'},
  {id:'match-023',h:'gha',a:'pan',g:'L',v:'bmo-field',d:'6/17',t:'7:00 PM'},
  {id:'match-024',h:'uzb',a:'col',g:'K',v:'estadio-azteca',d:'6/17',t:'10:00 PM'},
  // June 18
  {id:'match-025',h:'cze',a:'rsa',g:'A',v:'mercedes-benz-stadium',d:'6/18',t:'12:00 PM'},
  {id:'match-026',h:'sui',a:'bih',g:'B',v:'sofi-stadium',d:'6/18',t:'3:00 PM'},
  {id:'match-027',h:'can',a:'qat',g:'B',v:'bc-place',d:'6/18',t:'6:00 PM'},
  {id:'match-028',h:'mex',a:'kor',g:'A',v:'estadio-akron',d:'6/18',t:'9:00 PM'},
  // June 19
  {id:'match-029',h:'usa',a:'aus',g:'D',v:'lumen-field',d:'6/19',t:'3:00 PM'},
  {id:'match-030',h:'sco',a:'mar',g:'C',v:'gillette-stadium',d:'6/19',t:'6:00 PM'},
  {id:'match-031',h:'bra',a:'hai',g:'C',v:'lincoln-financial-field',d:'6/19',t:'9:00 PM'},
  // June 20
  {id:'match-032',h:'tur',a:'par',g:'D',v:'levis-stadium',d:'6/20',t:'12:00 AM'},
  {id:'match-033',h:'ned',a:'swe',g:'F',v:'nrg-stadium',d:'6/20',t:'1:00 PM'},
  {id:'match-034',h:'ger',a:'civ',g:'E',v:'bmo-field',d:'6/20',t:'4:00 PM'},
  {id:'match-035',h:'ecu',a:'cuw',g:'E',v:'arrowhead-stadium',d:'6/20',t:'8:00 PM'},
  // June 21
  {id:'match-036',h:'tun',a:'jpn',g:'F',v:'estadio-bbva',d:'6/21',t:'12:00 AM'},
  {id:'match-037',h:'esp',a:'ksa',g:'H',v:'mercedes-benz-stadium',d:'6/21',t:'12:00 PM'},
  {id:'match-038',h:'bel',a:'irn',g:'G',v:'sofi-stadium',d:'6/21',t:'3:00 PM'},
  {id:'match-039',h:'uru',a:'cpv',g:'H',v:'hard-rock-stadium',d:'6/21',t:'6:00 PM'},
  {id:'match-040',h:'nzl',a:'egy',g:'G',v:'bc-place',d:'6/21',t:'9:00 PM'},
  // June 22
  {id:'match-041',h:'arg',a:'aut',g:'J',v:'att-stadium',d:'6/22',t:'1:00 PM'},
  {id:'match-042',h:'fra',a:'irq',g:'I',v:'lincoln-financial-field',d:'6/22',t:'5:00 PM'},
  {id:'match-043',h:'nor',a:'sen',g:'I',v:'metlife-stadium',d:'6/22',t:'8:00 PM'},
  {id:'match-044',h:'jor',a:'alg',g:'J',v:'levis-stadium',d:'6/22',t:'11:00 PM'},
  // June 23
  {id:'match-045',h:'por',a:'uzb',g:'K',v:'nrg-stadium',d:'6/23',t:'1:00 PM'},
  {id:'match-046',h:'eng',a:'gha',g:'L',v:'gillette-stadium',d:'6/23',t:'4:00 PM'},
  {id:'match-047',h:'pan',a:'cro',g:'L',v:'bmo-field',d:'6/23',t:'7:00 PM'},
  {id:'match-048',h:'col',a:'cod',g:'K',v:'estadio-akron',d:'6/23',t:'10:00 PM'},
  // June 24 (Matchday 3)
  {id:'match-049',h:'sui',a:'can',g:'B',v:'bc-place',d:'6/24',t:'3:00 PM'},
  {id:'match-050',h:'bih',a:'qat',g:'B',v:'lumen-field',d:'6/24',t:'3:00 PM'},
  {id:'match-051',h:'sco',a:'bra',g:'C',v:'hard-rock-stadium',d:'6/24',t:'6:00 PM'},
  {id:'match-052',h:'mar',a:'hai',g:'C',v:'mercedes-benz-stadium',d:'6/24',t:'6:00 PM'},
  {id:'match-053',h:'cze',a:'mex',g:'A',v:'estadio-azteca',d:'6/24',t:'9:00 PM'},
  {id:'match-054',h:'rsa',a:'kor',g:'A',v:'estadio-bbva',d:'6/24',t:'9:00 PM'},
  // June 25
  {id:'match-055',h:'cuw',a:'civ',g:'E',v:'lincoln-financial-field',d:'6/25',t:'4:00 PM'},
  {id:'match-056',h:'ecu',a:'ger',g:'E',v:'metlife-stadium',d:'6/25',t:'4:00 PM'},
  {id:'match-057',h:'jpn',a:'swe',g:'F',v:'att-stadium',d:'6/25',t:'7:00 PM'},
  {id:'match-058',h:'tun',a:'ned',g:'F',v:'arrowhead-stadium',d:'6/25',t:'7:00 PM'},
  {id:'match-059',h:'tur',a:'usa',g:'D',v:'sofi-stadium',d:'6/25',t:'10:00 PM'},
  {id:'match-060',h:'par',a:'aus',g:'D',v:'levis-stadium',d:'6/25',t:'10:00 PM'},
  // June 26
  {id:'match-061',h:'nor',a:'fra',g:'I',v:'gillette-stadium',d:'6/26',t:'3:00 PM'},
  {id:'match-062',h:'sen',a:'irq',g:'I',v:'bmo-field',d:'6/26',t:'3:00 PM'},
  {id:'match-063',h:'cpv',a:'ksa',g:'H',v:'nrg-stadium',d:'6/26',t:'8:00 PM'},
  {id:'match-064',h:'uru',a:'esp',g:'H',v:'estadio-akron',d:'6/26',t:'8:00 PM'},
  {id:'match-065',h:'egy',a:'irn',g:'G',v:'lumen-field',d:'6/26',t:'11:00 PM'},
  {id:'match-066',h:'nzl',a:'bel',g:'G',v:'bc-place',d:'6/26',t:'11:00 PM'},
  // June 27
  {id:'match-067',h:'pan',a:'eng',g:'L',v:'metlife-stadium',d:'6/27',t:'5:00 PM'},
  {id:'match-068',h:'cro',a:'gha',g:'L',v:'lincoln-financial-field',d:'6/27',t:'5:00 PM'},
  {id:'match-069',h:'col',a:'por',g:'K',v:'hard-rock-stadium',d:'6/27',t:'7:30 PM'},
  {id:'match-070',h:'cod',a:'uzb',g:'K',v:'mercedes-benz-stadium',d:'6/27',t:'7:30 PM'},
  {id:'match-071',h:'alg',a:'aut',g:'J',v:'arrowhead-stadium',d:'6/27',t:'10:00 PM'},
  {id:'match-072',h:'jor',a:'arg',g:'J',v:'att-stadium',d:'6/27',t:'10:00 PM'},
];

const knockout = [
  // R32 (all TBD)
  {id:'match-073',d:'6/28',t:'3:00 PM',v:'sofi-stadium',s:'round32'},
  {id:'match-074',d:'6/29',t:'1:00 PM',v:'nrg-stadium',s:'round32'},
  {id:'match-075',d:'6/29',t:'4:30 PM',v:'gillette-stadium',s:'round32'},
  {id:'match-076',d:'6/29',t:'9:00 PM',v:'estadio-bbva',s:'round32'},
  {id:'match-077',d:'6/30',t:'1:00 PM',v:'att-stadium',s:'round32'},
  {id:'match-078',d:'6/30',t:'5:00 PM',v:'metlife-stadium',s:'round32'},
  {id:'match-079',d:'6/30',t:'9:00 PM',v:'estadio-azteca',s:'round32'},
  {id:'match-080',d:'7/1',t:'12:00 PM',v:'mercedes-benz-stadium',s:'round32'},
  {id:'match-081',d:'7/1',t:'4:00 PM',v:'lumen-field',s:'round32'},
  {id:'match-082',d:'7/1',t:'8:00 PM',v:'levis-stadium',s:'round32'},
  {id:'match-083',d:'7/2',t:'3:00 PM',v:'sofi-stadium',s:'round32'},
  {id:'match-084',d:'7/2',t:'7:00 PM',v:'bmo-field',s:'round32'},
  {id:'match-085',d:'7/2',t:'11:00 PM',v:'bc-place',s:'round32'},
  {id:'match-086',d:'7/3',t:'2:00 PM',v:'att-stadium',s:'round32'},
  {id:'match-087',d:'7/3',t:'6:00 PM',v:'hard-rock-stadium',s:'round32'},
  {id:'match-088',d:'7/3',t:'9:30 PM',v:'arrowhead-stadium',s:'round32'},
  // R16
  {id:'match-089',d:'7/4',t:'1:00 PM',v:'nrg-stadium',s:'round16'},
  {id:'match-090',d:'7/4',t:'5:00 PM',v:'lincoln-financial-field',s:'round16'},
  {id:'match-091',d:'7/5',t:'4:00 PM',v:'metlife-stadium',s:'round16'},
  {id:'match-092',d:'7/5',t:'8:00 PM',v:'estadio-azteca',s:'round16'},
  {id:'match-093',d:'7/6',t:'3:00 PM',v:'att-stadium',s:'round16'},
  {id:'match-094',d:'7/6',t:'8:00 PM',v:'lumen-field',s:'round16'},
  {id:'match-095',d:'7/7',t:'12:00 PM',v:'mercedes-benz-stadium',s:'round16'},
  {id:'match-096',d:'7/7',t:'4:00 PM',v:'bc-place',s:'round16'},
  // QF
  {id:'match-097',d:'7/9',t:'4:00 PM',v:'gillette-stadium',s:'quarter'},
  {id:'match-098',d:'7/10',t:'3:00 PM',v:'sofi-stadium',s:'quarter'},
  {id:'match-099',d:'7/11',t:'5:00 PM',v:'hard-rock-stadium',s:'quarter'},
  {id:'match-100',d:'7/11',t:'9:00 PM',v:'arrowhead-stadium',s:'quarter'},
  // SF
  {id:'match-101',d:'7/14',t:'3:00 PM',v:'att-stadium',s:'semi'},
  {id:'match-102',d:'7/15',t:'3:00 PM',v:'mercedes-benz-stadium',s:'semi'},
  // 3rd
  {id:'match-103',d:'7/18',t:'5:00 PM',v:'hard-rock-stadium',s:'third'},
  // Final
  {id:'match-104',d:'7/19',t:'3:00 PM',v:'metlife-stadium',s:'final'},
];

const result = [];
for (const m of groupMatches) {
  result.push({id:m.id,homeTeamId:m.h,awayTeamId:m.a,date:toUTC(m.d,m.t,m.v),stage:'group',groupId:m.g,venueId:m.v,status:'scheduled'});
}
for (const k of knockout) {
  result.push({id:k.id,homeTeamId:'tbd',awayTeamId:'tbd',date:toUTC(k.d,k.t,k.v),stage:k.s,venueId:k.v,status:'scheduled'});
}
result.sort((a,b) => parseInt(a.id.split('-')[1]) - parseInt(b.id.split('-')[1]));

fs.writeFileSync('/Users/daijin/web/worldcup-predictor/public/data/matches.json', JSON.stringify(result, null, 2));
console.log('Done. ' + result.length + ' matches written.');
// Show first match as Beijing time
const d = new Date(result[0].date);
const bj = new Date(d.getTime() + 8*3600000);
console.log('Match 1 UTC:', d.toISOString());
console.log('Match 1 Beijing:', bj.toISOString());
