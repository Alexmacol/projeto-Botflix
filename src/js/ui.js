// ui.js - Módulo para manipulação da interface do usuário

/**
 * Exibe um alerta personalizado centralizado na tela.
 * @param {string} message - A mensagem a ser exibida.
 */
export function showAlert(message) {
  const modal = document.getElementById("custom-alert");
  const messageElement = document.getElementById("alert-message");
  const closeButton = document.getElementById("close-alert");

  messageElement.textContent = message;

  // Garante estado limpo antes de abrir
  modal.classList.remove("closing");
  modal.classList.add("show");

  const close = () => {
    // Inicia animação de saída
    modal.classList.add("closing");

    // Espera a animação terminar antes de esconder
    setTimeout(() => {
      modal.classList.remove("show");
      modal.classList.remove("closing");
    }, 250);

    closeButton.removeEventListener("click", close);
    modal.removeEventListener("click", outsideClick);
  };

  const outsideClick = (event) => {
    if (event.target === modal) {
      close();
    }
  };

  closeButton.addEventListener("click", close);
  modal.addEventListener("click", outsideClick);
}

/**
 * Renderiza o card de um filme na tela de forma segura.
 * @param {object} movie - O objeto do filme vindo da API.
 */
export function renderMovieCard(movie) {
  const resultsDiv = document.getElementById("results");
  const moviesGrid = document.getElementById("movies-grid");

  moviesGrid.innerHTML = "";

  const movieCard = document.createElement("div");
  movieCard.className = "movie-card";

  const posterContainer = document.createElement("div");
  posterContainer.className = "movie-poster";

  if (movie.poster_path) {
    const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    const posterImg = document.createElement("img");
    posterImg.src = posterUrl;
    posterImg.alt = movie.title;
    posterContainer.appendChild(posterImg);
  } else {
    const noPosterDiv = document.createElement("div");
    noPosterDiv.className = "no-poster";
    noPosterDiv.textContent = "Pôster não disponível";
    posterContainer.appendChild(noPosterDiv);
  }

  const movieInfo = document.createElement("div");
  movieInfo.className = "movie-info";

  const movieTitle = document.createElement("div");
  movieTitle.className = "movie-title";
  movieTitle.textContent = movie.title;

  const movieOverview = document.createElement("div");
  movieOverview.className = "movie-overview";
  movieOverview.textContent = movie.overview || "Sem descrição.";

  const movieRating = document.createElement("div");
  movieRating.className = "movie-rating";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  movieRating.textContent = `⭐ ${rating} / 10`;

  movieInfo.append(movieTitle, movieOverview, movieRating);
  movieCard.append(posterContainer, movieInfo);
  moviesGrid.appendChild(movieCard);

  resultsDiv.classList.add("show");
}
