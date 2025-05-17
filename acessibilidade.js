
const btnAumentar = document.getElementById('aumentar-fonte');
const btnDiminuir = document.getElementById('diminuir-fonte');
const btnContraste = document.getElementById('alto-contraste');

let tamanhoFonteAtual = 16;
const passo = 2; 

btnAumentar.addEventListener('click', () => {
  tamanhoFonteAtual += passo;
  document.body.style.fontSize = tamanhoFonteAtual + 'px';
});

btnDiminuir.addEventListener('click', () => {
  if (tamanhoFonteAtual > 8) { 
    tamanhoFonteAtual -= passo;
    document.body.style.fontSize = tamanhoFonteAtual + 'px';
  }
});

btnContraste.addEventListener('click', () => {
  document.body.classList.toggle('alto-contraste');
});
