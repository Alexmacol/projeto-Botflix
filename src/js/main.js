import { renderMovieCard, showAlert } from "./ui.js";
import { fetchMovieRecommendation } from "./api.js";

let moodTextArea;
let searchButton;

document.addEventListener("DOMContentLoaded", () => {
  moodTextArea = document.getElementById("mood-textarea");
  searchButton = document.getElementById("search-button");

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
}

async function handleSearch() {
  const mood = moodTextArea.value.trim();

  if (!mood) {
    showAlert("Preencha o campo de humor!");
    return;
  }

  try {
    const data = await fetchMovieRecommendation(mood);

    if (data && data.results.length > 0) {
      const movie = data.results[0];
      renderMovieCard(movie);
    } else {
      showAlert(
        "Nenhum filme encontrado para esse humor. Tente ser mais descritivo!"
      );
    }
  } catch (error) {
    console.error("Falha ao buscar recomendação:", error);
    showAlert("Ocorreu um erro ao buscar o filme. Tente novamente mais tarde.");
  }
}

console.log("Botflix iniciado!");
