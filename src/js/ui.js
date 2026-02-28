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
 * Resolve os provedores de acordo com a prioridade.
 * @param {object} watch - O objeto do provedor do filme vindo da API.
 * @returns {object} Um objeto com os provedores organizados por categoria e sem duplicatas.
 */
function resolveProvidersByPriority(watch) {
  const priorityOrder = ["flatrate", "free", "rent", "buy"];
  const resolved = {};
  const seenProviders = new Set();

  priorityOrder.forEach((category) => {
    if (!Array.isArray(watch[category])) return;

    watch[category].forEach((provider) => {
      if (seenProviders.has(provider.provider_id)) return;

      if (!resolved[category]) {
        resolved[category] = [];
      }

      resolved[category].push(provider);
      seenProviders.add(provider.provider_id);
    });
  });

  return resolved;
}

/**
 * Renderiza os Provedores onde assistir na tela de forma segura.
 * @param {object} watch - O objeto watch vindo da API.
 */
function renderProviders(watch) {
  if (!watch) return null;

  // Badges por categoria
  const PROVIDER_BADGES = {
    flatrate: { label: "Assinatura", class: "badge-flatrate" },
    rent: { label: "Aluguel", class: "badge-rent" },
    buy: { label: "Compra", class: "badge-buy" },
    free: { label: "Grátis", class: "badge-free" },
  };

  //  Versão deduplicada e priorizada
  const resolvedWatch = resolveProvidersByPriority(watch);

  const providersContainer = document.createElement("div");
  providersContainer.className = "movie-providers";

  const categories = [
    { key: "flatrate" },
    { key: "rent" },
    { key: "buy" },
    { key: "free" },
  ];

  categories.forEach(({ key }) => {
    if (!Array.isArray(resolvedWatch[key]) || resolvedWatch[key].length === 0) {
      return;
    }

    const categoryDiv = document.createElement("div");
    categoryDiv.className = "provider-category";

    // Badge da categoria (uma vez por grupo)
    const badgeInfo = PROVIDER_BADGES[key];
    if (badgeInfo) {
      const badge = document.createElement("div");
      badge.className = `provider-badge ${badgeInfo.class}`;
      badge.textContent = badgeInfo.label;
      categoryDiv.appendChild(badge);
    }

    const logosDiv = document.createElement("div");
    logosDiv.className = "provider-logos";

    // Logos dos providers
    resolvedWatch[key].forEach((provider) => {
      const link = document.createElement("a");
      link.href = watch.link || "#";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className = "provider-link";
      link.title = `Ver onde assistir no JustWatch`;

      const img = document.createElement("img");
      img.src = `https://image.tmdb.org/t/p/w45${provider.logo_path}`;
      img.alt = provider.provider_name;
      img.className = "provider-logo";

      link.appendChild(img);
      logosDiv.appendChild(link);
    });

    categoryDiv.appendChild(logosDiv);
    providersContainer.appendChild(categoryDiv);
  });

  if (watch.link) {
    const note = document.createElement("div");
    note.className = "providers-note";
    note.textContent = "Os links abrem no JustWatch.";
    providersContainer.appendChild(note);
  }

  return providersContainer;
}

/**
 * Renderiza o card de um filme na tela de forma segura.
 * @param {object} movie - O objeto do filme vindo da API.
 */
export function renderMovieCard(movie) {
  const resultsDiv = document.getElementById("results-container");
  const moviesGrid = document.getElementById("movies-grid");
  const mainContent = document.querySelector(".main-content");

  // Inicia a animação de saída da busca
  mainContent.classList.add("hiding");

  // Espera a animação de saída terminar para mostrar os resultados
  mainContent.addEventListener(
    "animationend",
    () => {
      mainContent.classList.remove("hiding");
      mainContent.classList.add("hidden");

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

      const providersSection = renderProviders(movie.watch);
      if (providersSection) {
        movieInfo.appendChild(providersSection);
      }

      resultsDiv.classList.add("show");
    },
    { once: true },
  );
}

/**
 * Limpa os resultados da tela e oculta o container de resultados com animação
 * e reexibe a tela inicial.
 */
export function clearResults() {
  const resultsDiv = document.getElementById("results-container");
  const moviesGrid = document.getElementById("movies-grid");
  const moodTextArea = document.getElementById("mood-textarea");
  const mainContent = document.querySelector(".main-content");

  if (resultsDiv && resultsDiv.classList.contains("show")) {
    resultsDiv.classList.add("hiding");

    resultsDiv.addEventListener(
      "animationend",
      () => {
        resultsDiv.classList.remove("show");
        resultsDiv.classList.remove("hiding");
        if (moviesGrid) {
          moviesGrid.innerHTML = "";
        }

        // Mostra a busca de volta com animação
        mainContent.classList.remove("hidden");
        mainContent.classList.add("showing");
        mainContent.addEventListener(
          "animationend",
          () => {
            mainContent.classList.remove("showing");
            if (moodTextArea) {
              moodTextArea.value = "";
              moodTextArea.focus();
            }
          },
          { once: true },
        );
      },
      { once: true },
    );
  } else {
    if (resultsDiv) {
      resultsDiv.classList.remove("show");
    }

    if (moviesGrid) {
      moviesGrid.innerHTML = "";
    }

    mainContent.classList.remove("hidden");
    if (moodTextArea) {
      moodTextArea.value = "";
      moodTextArea.focus();
    }
  }
}
