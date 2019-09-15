import { start } from "./ui.js";
import { fetchAsteriod } from "./data.js";
function init() {
  start();
}
function gimiasteroid(start, end, eror, asteroid) {
  fetchAsteriod(start, end, eror, asteroid);
}

export { init, gimiasteroid };
