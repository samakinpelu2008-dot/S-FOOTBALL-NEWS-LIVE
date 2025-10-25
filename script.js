const apiKey = "8331c48c636d457c8ab2c16957b5b1c2";

// === FOOTBALL NEWS ===
async function getNews() {
  try {
    const res = await fetch(`https://newsapi.org/v2/everything?q=football&apiKey=${apiKey}`);
    const data = await res.json();
    const container = document.getElementById("news");
    container.innerHTML = data.articles.slice(0, 8).map(a => `
      <div>
        <h3>${a.title}</h3>
        <img src="${a.urlToImage || ''}" style="width:100%;max-height:200px;object-fit:cover;border-radius:10px;margin:5px 0;">
        <p>${a.description || ''}</p>
        <a href="${a.url}" target="_blank">Read more</a>
      </div>
    `).join("");
  } catch (err) {
    console.error(err);
  }
}

// === LIVE SCORES ===
async function getScores() {
  const res = await fetch("https://api.football-data.org/v4/matches?status=LIVE", {
    headers: { "X-Auth-Token": apiKey }
  });
  const data = await res.json();
  const container = document.getElementById("scores");
  if (!data.matches.length) {
    container.innerHTML = "<p>No live matches currently.</p>";
    return;
  }
  container.innerHTML = data.matches.map(m => `
    <div>
      <img src="${m.homeTeam.crest}" width="25"> <strong>${m.homeTeam.name}</strong> 
      ${m.score.fullTime.home ?? 0} - ${m.score.fullTime.away ?? 0} 
      <strong>${m.awayTeam.name}</strong> <img src="${m.awayTeam.crest}" width="25">
    </div>
  `).join("");
}

// === LEAGUE TABLE ===
async function getLeagueTable(leagueCode = "PL") {
  const res = await fetch(`https://api.football-data.org/v4/competitions/${leagueCode}/standings`, {
    headers: { "X-Auth-Token": apiKey }
  });
  const data = await res.json();
  const tbody = document.querySelector("#league-table tbody");
  tbody.innerHTML = data.standings[0].table.map(t => `
    <tr>
      <td>${t.position}</td>
      <td><img src="${t.team.crest}" width="20"> ${t.team.name}</td>
      <td>${t.points}</td>
      <td>${t.won}</td>
      <td>${t.draw}</td>
      <td>${t.lost}</td>
    </tr>
  `).join("");
}

// === Auto Refresh Scores Every 30 Seconds ===
setInterval(getScores, 30000);

// === Load Everything ===
getNews();
getScores();
getLeagueTable();

// === Change League Table ===
document.getElementById("league-select").addEventListener("change", (e) => {
  getLeagueTable(e.target.value);
});
