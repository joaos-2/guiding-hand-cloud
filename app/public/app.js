const $ = (s) => document.querySelector(s);

async function carregarBarreiras() {
  const alvo = $('#barreiras');
  try {
    const r = await fetch('/api/barriers?status=confirmed');
    const data = await r.json();
    if (!data.barriers.length) { alvo.textContent = 'Nenhuma barreira confirmada ainda.'; return; }
    const ul = document.createElement('ul');
    for (const b of data.barriers) {
      const li = document.createElement('li');
      li.textContent = `${b.obstacle} (aprox. ${b.lat}, ${b.lng}) - ${b.confirmations} confirmacoes`;
      ul.appendChild(li);
    }
    alvo.replaceChildren(ul);
  } catch {
    alvo.textContent = 'Nao foi possivel carregar as barreiras agora.';
  }
}

$('#form-rota').addEventListener('submit', async (e) => {
  e.preventDefault();
  const from = $('#from').value.trim();
  const to = $('#to').value.trim();
  const r = await fetch(`/api/route?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
  const data = await r.json();
  const ol = $('#passos');
  ol.replaceChildren(...(data.steps || []).map((s) => {
    const li = document.createElement('li'); li.textContent = s; return li;
  }));
  $('#resultado').hidden = false;
  $('#resultado').focus?.();
});

carregarBarreiras();
