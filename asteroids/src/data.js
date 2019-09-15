function fetchAsteriod(start, end, eror, asteroid) {
  console.log(start);

  let url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start}&end_date=${end}&api_key=kCcgen3YL2TUTjIZnLnrK4VDbLMEIMyYcXptqcFV `;
  fetch(url)
    .then(response => response.json())
    .then(response => {
      if (response.code == "400") {
        return eror(response);
      }
      return asteroid(response);
    });
}

function fetchCircle(sel) {
  for (let i = 0; i < sel.length; i++) {
    let url = sel[i].links.self;

    fetch(url)
      .then(response => response.json())
      .then(response => {
        closeAproch(response);
      });
  }
}
export { fetchAsteriod, fetchCircle };
