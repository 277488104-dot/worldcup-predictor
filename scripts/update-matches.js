const fs = require('fs');

// ==============================================
// Data from the user's provided Chinese schedule site
// Already in BEIJING TIME (UTC+8) - use directly
// Format: [matchId, date(MM/DD Beijing), time(HH:MM Beijing), homeId, awayId, group, stage, venueId]

const schedule = [
//====GROUP STAGE====
// June 12 Beijing (June 11 local) - Day 1
['match-001','6/12','03:00','mex','rsa','A','group','estadio-azteca'], // Mexico vs South Africa
['match-002','6/12','10:00','kor','cze','A','group','estadio-akron'], // Korea vs Czechia

// June 13 Beijing (June 12 local) - Day 2
['match-003','6/13','03:00','can','bih','B','group','bmo-field'], // Canada vs Bosnia
['match-004','6/13','09:00','usa','par','D','group','sofi-stadium'], // USA vs Paraguay

// June 14 Beijing (June 13 local) - Day 3
['match-005','6/14','03:00','qat','sui','B','group','levis-stadium'], // Qatar vs Switzerland
['match-006','6/14','06:00','bra','mar','C','group','metlife-stadium'], // Brazil vs Morocco
['match-007','6/14','09:00','hai','sco','C','group','gillette-stadium'], // Haiti vs Scotland

// June 14 additional
['match-008','6/14','14:00','aus','tur','D','group','bc-place'], // Australia vs Turkiye

// June 15 Beijing (June 14 local) - Day 4
['match-009','6/15','01:00','ger','cuw','E','group','nrg-stadium'], // Germany vs Curacao
['match-010','6/15','07:00','ned','jpn','F','group','att-stadium'], // Netherlands vs Japan
['match-011','6/15','04:00','civ','ecu','E','group','lincoln-financial-field'], // Cote d'Ivoire vs Ecuador
['match-012','6/15','10:00','swe','tun','F','group','estadio-bbva'], // Sweden vs Tunisia

// June 16 Beijing (June 15 local)
['match-013','6/16','00:00','esp','cpv','H','group','mercedes-benz-stadium'], // Spain vs Cape Verde
['match-014','6/16','03:00','bel','egy','G','group','lumen-field'], // Belgium vs Egypt
['match-015','6/16','06:00','ksa','uru','H','group','hard-rock-stadium'], // Saudi Arabia vs Uruguay
['match-016','6/16','06:00','irn','nzl','G','group','sofi-stadium'], // Iran vs New Zealand

// June 17 Beijing (June 16 local)
['match-017','6/17','03:00','fra','sen','I','group','metlife-stadium'], // France vs Senegal
['match-018','6/17','06:00','irq','nor','I','group','gillette-stadium'], // Iraq vs Norway
['match-019','6/17','09:00','arg','alg','J','group','arrowhead-stadium'], // Argentina vs Algeria

// June 17 additional
['match-020','6/17','14:00','aut','jor','J','group','levis-stadium'], // Austria vs Jordan

// June 18 Beijing (June 17 local)
['match-021','6/18','01:00','por','cod','K','group','nrg-stadium'], // Portugal vs DR Congo
['match-022','6/18','06:00','eng','cro','L','group','att-stadium'], // England vs Croatia
['match-023','6/18','03:00','gha','pan','L','group','bmo-field'], // Ghana vs Panama
['match-024','6/18','09:00','uzb','col','K','group','estadio-azteca'], // Uzbekistan vs Colombia

// June 18 additional (Matchday 2 starts)
['match-025','6/18','20:00','cze','rsa','A','group','mercedes-benz-stadium'], // Czechia vs South Africa

// June 19 Beijing (June 18 local)
['match-026','6/19','06:00','sui','bih','B','group','sofi-stadium'], // Switzerland vs Bosnia
['match-027','6/19','06:00','can','qat','B','group','bc-place'], // Canada vs Qatar
['match-028','6/19','06:00','mex','kor','A','group','estadio-akron'], // Mexico vs Korea

// June 20 Beijing (June 19 local)
['match-029','6/20','03:00','sco','mar','C','group','gillette-stadium'], // Scotland vs Morocco
['match-030','6/20','06:00','bra','hai','C','group','lincoln-financial-field'], // Brazil vs Haiti
['match-031','6/20','09:00','usa','aus','D','group','lumen-field'], // USA vs Australia

['match-032','6/20','06:00','tur','par','D','group','levis-stadium'], // Turkiye vs Paraguay

// June 21 Beijing (June 20 local)
['match-033','6/21','01:00','ned','swe','F','group','nrg-stadium'], // Netherlands vs Sweden
['match-034','6/21','03:00','ger','civ','E','group','bmo-field'], // Germany vs Cote d'Ivoire
['match-035','6/21','06:00','ecu','cuw','E','group','arrowhead-stadium'], // Ecuador vs Curacao

['match-036','6/21','06:00','tun','jpn','F','group','estadio-bbva'], // Tunisia vs Japan

// June 22 Beijing (June 21 local)
['match-037','6/22','00:00','esp','ksa','H','group','mercedes-benz-stadium'], // Spain vs Saudi Arabia
['match-038','6/22','03:00','bel','irn','G','group','sofi-stadium'], // Belgium vs Iran
['match-039','6/22','06:00','uru','cpv','H','group','hard-rock-stadium'], // Uruguay vs Cape Verde
['match-040','6/22','06:00','nzl','egy','G','group','bc-place'], // New Zealand vs Egypt

// June 23 Beijing (June 22 local)
['match-041','6/23','06:00','arg','aut','J','group','att-stadium'], // Argentina vs Austria
['match-042','6/23','03:00','nor','sen','I','group','metlife-stadium'], // Norway vs Senegal
['match-043','6/23','06:00','fra','irq','I','group','lincoln-financial-field'], // France vs Iraq
['match-044','6/23','06:00','jor','alg','J','group','levis-stadium'], // Jordan vs Algeria

// June 24 Beijing (June 23 local)
['match-045','6/24','01:00','por','uzb','K','group','nrg-stadium'], // Portugal vs Uzbekistan
['match-046','6/24','03:00','eng','gha','L','group','gillette-stadium'], // England vs Ghana
['match-047','6/24','06:00','pan','cro','L','group','bmo-field'], // Panama vs Croatia
['match-048','6/24','07:00','col','cod','K','group','estadio-akron'], // Colombia vs DR Congo

// June 25 Beijing (June 24 local) - Matchday 3
['match-049','6/25','03:00','sui','can','B','group','bc-place'], // Switzerland vs Canada
['match-050','6/25','06:00','bih','qat','B','group','lumen-field'], // Bosnia vs Qatar
['match-051','6/25','03:00','sco','bra','C','group','hard-rock-stadium'], // Scotland vs Brazil
['match-052','6/25','06:00','mar','hai','C','group','mercedes-benz-stadium'], // Morocco vs Haiti
['match-053','6/25','06:00','cze','mex','A','group','estadio-azteca'], // Czechia vs Mexico
['match-054','6/25','06:00','rsa','kor','A','group','estadio-bbva'], // South Africa vs Korea

// June 26 Beijing (June 25 local)
['match-055','6/26','06:00','cuw','civ','E','group','lincoln-financial-field'], // Curacao vs Cote d'Ivoire
['match-056','6/26','03:00','ecu','ger','E','group','metlife-stadium'], // Ecuador vs Germany
['match-057','6/26','05:00','jpn','swe','F','group','att-stadium'], // Japan vs Sweden
['match-058','6/26','05:00','tun','ned','F','group','arrowhead-stadium'], // Tunisia vs Netherlands
['match-059','6/26','06:00','tur','usa','D','group','sofi-stadium'], // Turkiye vs USA
['match-060','6/26','03:00','par','aus','D','group','levis-stadium'], // Paraguay vs Australia

// June 27 Beijing (June 26 local)
['match-061','6/27','06:00','nor','fra','I','group','gillette-stadium'], // Norway vs France
['match-062','6/27','06:00','sen','irq','I','group','bmo-field'], // Senegal vs Iraq
['match-063','6/27','03:00','cpv','ksa','H','group','nrg-stadium'], // Cape Verde vs Saudi Arabia
['match-064','6/27','03:00','uru','esp','H','group','estadio-akron'], // Uruguay vs Spain
['match-065','6/27','06:00','egy','irn','G','group','lumen-field'], // Egypt vs Iran
['match-066','6/27','09:00','nzl','bel','G','group','bc-place'], // New Zealand vs Belgium

// June 28 Beijing (June 27 local)
['match-067','6/28','06:00','pan','eng','L','group','metlife-stadium'], // Panama vs England
['match-068','6/28','06:00','cro','gha','L','group','lincoln-financial-field'], // Croatia vs Ghana
['match-069','6/28','06:00','col','por','K','group','hard-rock-stadium'], // Colombia vs Portugal
['match-070','6/28','07:30','cod','uzb','K','group','mercedes-benz-stadium'], // DR Congo vs Uzbekistan
['match-071','6/28','03:00','alg','aut','J','group','arrowhead-stadium'], // Algeria vs Austria
['match-072','6/28','03:00','jor','arg','J','group','att-stadium'], // Jordan vs Argentina
];

// Knockout rounds - dates from official schedule (Beijing times)
const koDates = {
  // R32: June 29 - July 4 Beijing
  'match-073': {d:'6/29',t:'06:00',v:'sofi-stadium',s:'round32'},
  'match-074': {d:'6/30',t:'03:00',v:'nrg-stadium',s:'round32'},
  'match-075': {d:'6/30',t:'06:30',v:'gillette-stadium',s:'round32'},
  'match-076': {d:'6/30',t:'11:00',v:'estadio-bbva',s:'round32'},
  'match-077': {d:'7/1',t:'00:00',v:'att-stadium',s:'round32'},
  'match-078': {d:'7/1',t:'05:00',v:'metlife-stadium',s:'round32'},
  'match-079': {d:'7/1',t:'08:00',v:'estadio-azteca',s:'round32'},
  'match-080': {d:'7/2',t:'00:00',v:'mercedes-benz-stadium',s:'round32'},
  'match-081': {d:'7/2',t:'04:00',v:'lumen-field',s:'round32'},
  'match-082': {d:'7/2',t:'08:00',v:'levis-stadium',s:'round32'},
  'match-083': {d:'7/3',t:'03:00',v:'sofi-stadium',s:'round32'},
  'match-084': {d:'7/3',t:'07:00',v:'bmo-field',s:'round32'},
  'match-085': {d:'7/3',t:'11:00',v:'bc-place',s:'round32'},
  'match-086': {d:'7/4',t:'02:00',v:'att-stadium',s:'round32'},
  'match-087': {d:'7/4',t:'06:00',v:'hard-rock-stadium',s:'round32'},
  'match-088': {d:'7/4',t:'09:30',v:'arrowhead-stadium',s:'round32'},
  // R16: July 5-8
  'match-089': {d:'7/5',t:'01:00',v:'nrg-stadium',s:'round16'},
  'match-090': {d:'7/5',t:'05:00',v:'lincoln-financial-field',s:'round16'},
  'match-091': {d:'7/6',t:'04:00',v:'metlife-stadium',s:'round16'},
  'match-092': {d:'7/6',t:'08:00',v:'estadio-azteca',s:'round16'},
  'match-093': {d:'7/7',t:'03:00',v:'att-stadium',s:'round16'},
  'match-094': {d:'7/7',t:'08:00',v:'lumen-field',s:'round16'},
  'match-095': {d:'7/8',t:'00:00',v:'mercedes-benz-stadium',s:'round16'},
  'match-096': {d:'7/8',t:'04:00',v:'bc-place',s:'round16'},
  // QF: July 10-12
  'match-097': {d:'7/10',t:'04:00',v:'gillette-stadium',s:'quarter'},
  'match-098': {d:'7/11',t:'03:00',v:'sofi-stadium',s:'quarter'},
  'match-099': {d:'7/12',t:'05:00',v:'hard-rock-stadium',s:'quarter'},
  'match-100':{d:'7/12',t:'09:00',v:'arrowhead-stadium',s:'quarter'},
  // SF: July 15-16
  'match-101':{d:'7/15',t:'03:00',v:'att-stadium',s:'semi'},
  'match-102':{d:'7/16',t:'03:00',v:'mercedes-benz-stadium',s:'semi'},
  // 3rd: July 19 05:00
  'match-103':{d:'7/19',t:'05:00',v:'hard-rock-stadium',s:'third'},
  // Final: July 20 03:00
  'match-104':{d:'7/20',t:'03:00',v:'metlife-stadium',s:'final'},
};

// Build the match data array
const result = [];

// Group stage
for (const m of schedule) {
  const [id, dateStr, timeStr, homeId, awayId, group, stage, venueId] = m;
  const [month, day] = dateStr.split('/').map(Number);
  const [hour, min] = timeStr.split(':').map(Number);

  // Beijing time to UTC: subtract 8 hours
  let utcH = hour - 8;
  let utcDay = day;
  let utcMonth = month;
  if (utcH < 0) { utcH += 24; utcDay = day - 1; }
  if (utcDay < 1) { utcDay += 30; utcMonth = 5; } // roll back to May (won't happen for June matches)

  const d = new Date(Date.UTC(2026, utcMonth - 1, utcDay, utcH, min));
  result.push({id,homeTeamId:homeId,awayTeamId:awayId,date:d.toISOString(),stage,groupId:group,venueId,status:'scheduled'});
}

// Knockout stage
for (const [id, info] of Object.entries(koDates)) {
  const [month, day] = info.d.split('/').map(Number);
  const [hour, min] = (info.t || '00:00').split(':').map(Number);
  let utcH = hour - 8;
  let utcDay = day;
  let utcMonth = month;
  if (utcH < 0) { utcH += 24; utcDay = day - 1; }
  if (utcDay < 1) { utcDay += 30; utcMonth--; }

  const d = new Date(Date.UTC(2026, utcMonth - 1, utcDay, utcH, min));
  result.push({id,homeTeamId:'tbd',awayTeamId:'tbd',date:d.toISOString(),stage:info.s,venueId:info.v,status:'scheduled'});
}

result.sort((a,b) => parseInt(a.id.split('-')[1]) - parseInt(b.id.split('-')[1]));

fs.writeFileSync('/Users/daijin/web/worldcup-predictor/public/data/matches.json', JSON.stringify(result, null, 2));

// Verify Beijing times
console.log('Verifying Beijing times (UTC+8):');
[0,1,2,5,9,16,21].forEach(i => {
  const m = result[i];
  const d = new Date(m.date);
  const bj = new Date(d.getTime() + 8*3600000);
  console.log(m.id, m.homeTeamId+' vs '+m.awayTeamId, '→ BJ: '+bj.getUTCMonth()+'/'+bj.getUTCDate()+' '+String(bj.getUTCHours()).padStart(2,'0')+':'+String(bj.getUTCMinutes()).padStart(2,'0'));
});
console.log('Total:', result.length, 'matches');
