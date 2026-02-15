// api.js - Módulo para chamadas de API

const API_URL = "https://robertodias87.app.n8n.cloud/webhook/botflix";

/**
 * Busca uma recomendação de filme baseada no humor do usuário.
 * @param {string} mood - O texto descrevendo o humor do usuário.
 * @returns {Promise<object>} A resposta da API contendo os resultados do filme.
 * @throws {Error} Se a resposta da rede não for 'ok'.
 */
export async function fetchMovieRecommendation(mood) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userPrompt: mood }),
  });

  if (!response.ok) {
    throw new Error(`Erro na rede: ${response.statusText}`);
  }

  return response.json();
}
