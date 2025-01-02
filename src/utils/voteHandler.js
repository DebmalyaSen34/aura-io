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
        console.warn(`Retrying in ${delays}ms (${i + 1}/${retries})...`);
        await new Promise((resolve) => setTimeout(resolve, delays));
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

    if (response.ok) {
      const { data } = await response.json();

      console.log("VoteHandler Data: ", data);

      return data;
    } else {
      throw new Error("Failed to update vote in database");
    }

    // const cachedVotes = getVotesfromCache();
    // delete cachedVotes[incidentId];
    // setVotesToCache(cachedVotes);
  } catch (error) {
    console.error("Error while updating vote in database: ", error);
    throw error;
  }
}, 1000);

export const handleVote = async (incidentId, voteType, currentVote) => {
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

  try {
    const { upvotes, downvotes, user_vote } = updateVoteInDatabase(
      incidentId,
      newVoteType
    );
    return { upvotes, downvotes, user_vote };
  } catch (error) {
    if (newVoteType === null) {
      cachedVotes[incidentId] = { type: currentVote };
    } else {
      delete cachedVotes[incidentId];
    }
    setVotesToCache(cachedVotes);
    throw error;
  }
};
