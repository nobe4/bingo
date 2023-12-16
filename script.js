let size = 5;

function resize(s) {
  size = s;
  generate();
}

function generate() {
  document.documentElement.style.setProperty("--size", size);
  main.innerHTML = "";
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let node = document.createElement("span");
      main.appendChild(node);
    }
  }
}

function edit(is_edit) {
  Array.from(main.children).forEach((n) => {
    n.contentEditable = is_edit;
    n.onclick = is_edit ? undefined : () => n.toggleAttribute("checked");
  });
}

function load() {
  try {
    let hash = location.hash.slice(1).split(",").map(Number);
    LZMA.decompress(hash, function (d, e) {
      if (e) {
        console.error(e);
      }

      let parts = d.split("|");

      size = Number(parts.splice(0, 1));
      generate();

      Array.from(main.children).forEach((n, i) => {
        n.innerText = parts[i * 2];
        n.toggleAttribute("checked", parts[i * 2 + 1] == "1");
      });
    });
  } catch (e) {
    console.warn(e);
  }
}

function save() {
  let data = `${size}|${Array.from(main.children)
    .map((n) => `${n.innerText}|${n.getAttribute("checked") === "" ? "1" : ""}`)
    .join("|")}`;

  LZMA.compress(data, 9, function (c, e) {
    if (e) {
      console.error(e);
    }
    location.hash = `#${c}`;
  });
}

generate();
edit(true);
