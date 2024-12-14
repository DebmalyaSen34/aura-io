"use cache";

export async function fetchUserData(request) {
  const userResponse = await fetch("/api/user/getDetails");
  const userData = await userResponse.json();

  const incidentsResponse = await fetch("/api/user/incidents/getIncidents");
  const incidentsData = await incidentsResponse.json();

  return {
    user: userData.user,
    incidents: incidentsData.incidents,
  };
}
