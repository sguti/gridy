import { GridyConfig, gridy } from "./lib/index";

const config: GridyConfig = {
  blockSize: 50,
  container: document.querySelector(".container"),
  tiles: Array.prototype.slice.call(
    document.querySelectorAll(".container .tile")
  ),
  containerHeight: 600,
  containerWidth: 1000,
  autoAlign: true
};

gridy(config);
