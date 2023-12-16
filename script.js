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
  let u = new URL(location.toString());
  try {
    data = u.searchParams.get("d").split(",").map(Number);
    LZMA.decompress(data, function (d, e) {
      if (e) {
        console.error(e);
      }

      d = JSON.parse(d);

      size = d.size;

      generate();

      console.log(d);
      Array.from(main.children).forEach((n, i) => {
        n.innerText = d.nodes[i].text;
        n.toggleAttribute("checked", d.nodes[i].checked);
      });
    });
  } catch (e) {
    console.warn(e);
  }
}

function save() {
  let data = JSON.stringify({
    size: size,
    nodes: Array.from(main.children).map((n) => {
      return {
        text: n.innerText,
        checked: n.getAttribute("checked") === "",
      };
    }),
  });

  LZMA.compress(data, 9, function (compressed, e) {
    if (e) {
      console.error(e);
    }
    let u = new URL(location.toString());
    u.searchParams.set("d", compressed);
    history.pushState(null, "", u.toString());
  });
}

generate();
edit(true);
