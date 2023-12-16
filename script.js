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

function test(v) {
  LZMA.compress(v, 9, function (compressed, error) {
    result.innerText = compressed;
  });
}

generate();
edit(true);
