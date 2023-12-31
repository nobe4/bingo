let is_edit = false;
let separator = "";

function generate(s) {
  size.value = s;
  document.documentElement.style.setProperty("--size", size.value);
  main.innerHTML = "";
  for (let i = 0; i < size.value; i++) {
    for (let j = 0; j < size.value; j++) {
      let node = document.createElement("span");
      main.appendChild(node);
    }
  }
  edit(is_edit);
}

function edit(e) {
  is_edit = e;
  Array.from(main.children).forEach((n) => {
    n.contentEditable = is_edit;
    n.onclick = is_edit ? undefined : () => n.toggleAttribute("checked");
  });
}

function load() {
  if (location.hash == "") {
    return generate(size.value);
  }

  let hash = location.hash.slice(1).split(",").map(Number);
  LZMA.decompress(hash, function (d, e) {
    if (e) {
      console.error(e);
    }

    let parts = d.split(separator);

    generate(Number(parts.splice(0, 1)));
    Array.from(main.children).forEach((n, i) => {
      n.innerText = parts[i];
    });
  });
}

function save() {
  let data = [size.value]
    .concat(Array.from(main.children).map((n) => n.innerText))
    .join(separator);

  LZMA.compress(data, 9, function (c, e) {
    if (e) {
      console.error(e);
    }
    location.hash = `#${c}`;
  });
}

load();
