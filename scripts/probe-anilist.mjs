const query = `query ($search: String) {
  Page(page: 1, perPage: 3) {
    media(search: $search, type: ANIME) {
      id
      title { romaji english }
      description
      coverImage { large }
      format
      startDate { year month day }
      averageScore
    }
  }
}`;

try {
  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ query, variables: { search: 'bebop' } }),
  });
  console.log('status', response.status);
  console.log((await response.text()).slice(0, 800));
} catch (error) {
  console.error('ERR', error.cause || error);
}
