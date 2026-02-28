import { fetchMovieRecommendation } from "./api.js";
import { renderMovieCard, showAlert, clearResults } from "./ui.js";

let moodTextArea;
let searchButton;
let newSearchButton;

document.addEventListener("DOMContentLoaded", () => {
  moodTextArea = document.getElementById("mood-textarea");
  searchButton = document.getElementById("search-button");
  newSearchButton = document.getElementById("new-search-button");

  setupEventListeners();
});

function setupEventListeners() {
  moodTextArea.addEventListener("keypress", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSearch();
    }
  });

  searchButton.addEventListener("click", handleSearch);

  if (newSearchButton) {
    newSearchButton.addEventListener("click", clearResults);
  }
}

async function handleSearch() {
  const mood = moodTextArea.value.trim();

  if (!mood) {
    showAlert("Preencha o campo de humor!");
    return;
  }

  const originalButtonContent = searchButton.innerHTML;
  searchButton.disabled = true;
  searchButton.textContent = "Buscando o filme";

  try {
    const data = await fetchMovieRecommendation(mood);

    if (data && data.results.length > 0) {
      const movie = data.results[0];
      renderMovieCard(movie);
    } else {
      showAlert(
        "Nenhum filme encontrado para esse humor. Tente ser mais descritivo!",
      );
    }
  } catch (error) {
    console.error("Falha ao buscar recomendação:", error);
    showAlert("Ocorreu um erro ao buscar o filme. Tente novamente mais tarde.");
  } finally {
    searchButton.disabled = false;
    searchButton.innerHTML = originalButtonContent;
  }
}

console.log("Botflix iniciado!");
