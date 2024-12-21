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
        const errorData = await response.json();
        throw new Error(errorData.message || "Request failed");
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

    const data = await response.json();

    if (data.success) {
      const cachedVotes = getVotesfromCache();
      delete cachedVotes[incidentId];
      setVotesToCache(cachedVotes);
    } else {
      throw new Error(data.message || "Error while updating vote in database");
    }
  } catch (error) {
    console.error("Error while updating vote in database: ", error);
  }
}, 1000);

export const handleVote = (incidentId, voteType, currentVote) => {
  const cachedVotes = getVotesfromCache();
  let newVoteType;

  if (currentVote === voteType) {
    delete cachedVotes[incidentId];
    newVoteType = null;
  } else {
    cachedVotes[incidentId] = { type: voteType };
    newVoteType = voteType;
  }

  setVotesToCache(cachedVotes);

  updateVoteInDatabase(incidentId, voteType);

  return newVoteType;
};
