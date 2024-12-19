import { debounce } from "lodash";

const CACHE_KEY = "batman@2003";

export const getVotesfromCache = () => {
  const cachedVotes = localStorage.getItem(CACHE_KEY);
  return cachedVotes ? JSON.parse(cachedVotes) : {};
};

export const setVotesToCache = (votes) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify(votes));
};

async function fetchWithRetry(url, options, retries = 3, delays = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        return response;
      } else {
        throw new Error("Request failed");
      }
    } catch (error) {
      if (i < retries - 1) {
        console.warn(`Retrying in (${i + 1}/${retries})...`);
        await new Promise((resolve) => setTimeout(resolve, delays));
        throw new Error("Max retries reached");
      } else {
        throw error;
      }
    }
  }
}

const updateVoteInDatabase = debounce(async (incidentId, voteType) => {
  try {
    const response = await fetchWithRetry("/api/user/vote", {
      method: "POST",
      body: JSON.stringify({ incidentId, voteType }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const cachedVotes = getVotesfromCache();
    delete cachedVotes[incidentId];
    setVotesToCache(cachedVotes);
  } catch (error) {
    console.error("Error while updating vote in database: ", error);
  }
}, 5000);

export const handleVote = (incidentId, voteType) => {
  const cachedVotes = getVotesfromCache();
  cachedVotes[incidentId] = { type: voteType };
  setVotesToCache(cachedVotes);

  updateVoteInDatabase(incidentId, voteType);
};
