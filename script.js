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
    div.className = "bg-gray-800 p-4 rounded shadow hover:bg-gray-700 transition flex flex-col items-center";
    div.innerHTML = `
      <img src="${poster}" alt="Poster" class="mb-2 w-full h-48 object-cover rounded">
      <h2 class="text-lg font-semibold mb-2 text-center">${anime.name}</h2>
      <button class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm" onclick="viewAnime('${id}')">Ver Episodios</button>`;
    animeList.appendChild(div);
  });
}

function viewAnime(id) {
  const overlay = document.getElementById("fadeOverlay");
  overlay.classList.add("active");

  setTimeout(() => {
    localStorage.setItem("selectedAnime", JSON.stringify(animeData[id]));
    window.location.href = `anime.html?id=${id}`;
  }, 500);
}

