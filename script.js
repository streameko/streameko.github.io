let animeData = {};

fetch("animes_por_id.json")
  .then(res => res.json())
  .then(data => {
    animeData = data;
    renderAnimeList();
  });

const searchInput = document.getElementById("searchInput");
const dubToggle = document.getElementById("dubToggle");
const animeList = document.getElementById("animeList");

searchInput.addEventListener("input", renderAnimeList);
dubToggle.addEventListener("change", renderAnimeList);

function renderAnimeList() {
  const query = searchInput.value.toLowerCase();
  const dubbedOnly = dubToggle.checked;
  animeList.innerHTML = "";

  Object.entries(animeData).forEach(([id, anime]) => {
    const names = [anime.name, ...(anime.alternative_names || [])].map(n => n.toLowerCase());
    const matchesSearch = names.some(name => name.includes(query));
    if (!matchesSearch) return;

    const hasDub = (anime.episodes || []).some(ep => ep.language === 1);
    if (dubbedOnly && !hasDub) return;

    const poster = anime.poster || "poster_default.png";
    const div = document.createElement("div");
    div.className = "card p-4 flex flex-col items-center text-center";
    div.innerHTML = `
      <img src="${poster}" alt="Poster de ${anime.name}" class="rounded-xl object-cover mb-4 w-full max-w-[200px] h-[260px]" />
      <h2 class="font-semibold text-base mb-2">${anime.name}</h2>
      <button class="bg-indigo-400 hover:bg-indigo-500 text-white px-4 py-1 rounded-full text-sm transition" onclick="viewAnime('${id}')">Ver Episodios</button>
    `;
    animeList.appendChild(div);
  });
}

function viewAnime(id) {
  localStorage.setItem("selectedAnime", JSON.stringify(animeData[id]));
  window.location.href = `anime.html?id=${id}`;
}
