fetch(
  "https://trailapi-trailapi.p.rapidapi.com/trails/explore/?lat=-37.0201&lon=144.9646",
  {
    method: "GET",
    headers: {
      "x-rapidapi-host": "trailapi-trailapi.p.rapidapi.com",
      "x-rapidapi-key": "18b41c1c7bmsheb630e6f2195bcfp1e66f6jsn0071376690aa",
    },
  }
)
  .then((response) => {
    console.log(response);
  })
  .catch((err) => {
    console.error(err);
  });
