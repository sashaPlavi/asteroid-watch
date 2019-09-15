function init() {
  const form = document.getElementById("forma");
  form.onsubmit = clear;
  function clear(event) {
    event.preventDefault();
    let end = document.getElementById("end").value;
    let start = document.getElementById("start").value;
    fetchAsteriod(start, end);
    reset();
  }
  function fetchAsteriod(start, end) {
    let url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start}&end_date=${end}&api_key=kCcgen3YL2TUTjIZnLnrK4VDbLMEIMyYcXptqcFV `;
    fetch(url)
      .then(response => response.json())
      .then(response => {
        if (response.code == "400") {
          return msgEror(response);
        }
        return asteroids(response);
      });
  }

  function msgEror(msg) {
    let error = document.querySelector("#error");
    let error_msg = document.createTextNode(msg.error_message);
    error.appendChild(error_msg);
  }

  function asteroids(asteroids) {
    const nerthEarth = asteroids.near_earth_objects;
    const days = [];
    const hazardAsteroids = [];
    for (let key in nerthEarth) {
      days.push(nerthEarth[key]);
    }
    for (let i = 0; i < days.length; i++) {
      for (let j = 0; j < days[i].length; j++) {
        if (days[i][j].is_potentially_hazardous_asteroid) {
          hazardAsteroids.push(days[i][j]);
        }
      }
    }
    const anjasAsteroid = [];
    for (let i = 0; i < hazardAsteroids.length; i++) {
      anjasAsteroid.push(new MyAsteroids(hazardAsteroids[i]));
    }
    generateTableHead(anjasAsteroid);
    generateTable(anjasAsteroid);
  }

  function MyAsteroids(asteroids) {
    this.aprocheDate = asteroids.close_approach_data[0].close_approach_date;
    this.name = asteroids.name;
    this.links = asteroids.links;
    this.kilometers_per_hour =
      asteroids.close_approach_data[0].relative_velocity.kilometers_per_hour;
    this.estimated_diameter_min =
      asteroids.estimated_diameter.kilometers.estimated_diameter_min;
    this.estimated_diameter_max =
      asteroids.estimated_diameter.kilometers.estimated_diameter_max;
  }

  function generateTableHead(ast) {
    let table = document.querySelector("#aster");
    let data = Object.keys(ast[0]);

    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
      let th = document.createElement("th");
      let text = document.createTextNode(key);
      th.appendChild(text);
      row.appendChild(th);
      if (key === "links") {
        th.innerHTML = "";
      }
    }
    table.style.border = "2px solid black";
    generateTable(ast);
  }

  function generateTable(ast) {
    let table = document.querySelector("#aster");

    for (let element of ast) {
      let row = table.insertRow();
      row.setAttribute("id", `${element.name}`);
      for (let key in element) {
        let cell = row.insertCell();
        let text = document.createTextNode(element[key]);
        cell.appendChild(text);
        if (key === "links") {
          cell.innerHTML = "";
        }
      }
    }
    addHendlers(ast);
  }

  function addHendlers(ast) {
    let row = document.getElementsByTagName("tr");
    let rowWithID = [];
    for (let i = 0; i < row.length; i++) {
      if (row[i].id) {
        rowWithID.push(row[i]);
      }
    }
    for (let i = 0; i < rowWithID.length; i++) {
      rowWithID[i].onclick = function handleselected() {
        slected(ast, rowWithID[i].id);
      };
    }
  }

  function slected(data, id) {
    let table = document.querySelector("#selected");
    let row = table.insertRow();
    let cell = row.insertCell();
    let text = document.createTextNode(`${id}`);
    cell.appendChild(text);
    table.style.border = "1px solid black";

    addbutton(data);
  }

  function addbutton(ast) {
    let asteroids = ast;
    let button = document.querySelector("button");
    button.setAttribute("class", "seebutton");
    button.onclick = function nextpage() {
      let selected = [];
      var length = document.getElementById("selected").rows.length;
      for (let i = 0; i < length; i++) {
        selected.push(
          document.getElementById("selected").rows[i].cells[0].innerHTML
        );
      }
      getaddData(selected, asteroids);
    };
  }

  function getaddData(name, ast) {
    let selectedast = [];
    for (let i = 0; i < ast.length; i++) {
      for (let j = 0; j < name.length; j++) {
        if (ast[i].name === name[j]) {
          selectedast.push(ast[i]);
        }
      }
    }

    fetchCircle(selectedast);
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

  function closeAproch(data) {
    let name = data.name;
    let apr = data.close_approach_data.length;

    let table = document.querySelector("#chart");

    let row = table.insertRow();

    let cell = row.insertCell();
    let text = document.createTextNode(
      `${name}number of close approaches---->${apr}`
    );
    cell.appendChild(text);
    table.style.border = "2px solid black";
    let color = "";
    switch (apr) {
      case apr < 25:
        color = "green";
        break;
      case 25 < apr < 50:
        console.log(name + "yelow");
        color = "yelow";

        break;
      case 50 < apr < 75:
        console.log(name + "orange");
        color = "orange";

        break;
      case apr < 70:
        color = "red";

        break;
      default:
        color = "black";
    }

    console.log(data.close_approach_data.length);
    text.style.color = [color];
  }

  function reset() {
    document.querySelector("#error").innerHTML = "";
    document.querySelector("#selected").innerHTML = "";
    document.querySelector("#aster").innerHTML = "";
    document.querySelector("#chart").innerHTML = "";
    document.getElementById("end").value = "";
    document.getElementById("start").value = "";
  }
}

export { init };
