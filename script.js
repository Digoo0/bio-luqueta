let toastTimer;

const portfolio = document.querySelector('.portfolio');
const artworkGroup = document.querySelector('.portfolio-grid');
const artworks = [...artworkGroup.querySelectorAll('img')];
artworkGroup.querySelectorAll('.artwork').forEach((button, index) => {
  button.dataset.index = index;
  button.setAttribute('aria-haspopup', 'dialog');
  button.setAttribute('aria-label', 'Ampliar: ' + artworks[index].alt);
});
const artworkCopy = artworkGroup.cloneNode(true);
artworkCopy.setAttribute('aria-hidden', 'true');
artworkCopy.querySelectorAll('button').forEach(link => link.tabIndex = -1);
document.querySelector('.portfolio-track').append(artworkCopy);
document.querySelector('.portfolio-pause').addEventListener('click', event => {
  const paused = portfolio.classList.toggle('is-paused');
  event.currentTarget.innerHTML = paused
    ? '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m8 5 11 7-11 7z"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h4v14H7zm6 0h4v14h-4z"/></svg>';
  event.currentTarget.setAttribute('aria-label', paused ? 'Continuar artes' : 'Pausar artes');
  event.currentTarget.setAttribute('aria-pressed', String(paused));
});

function notify(message) {
  const toast = document.querySelector('.toast');
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3000);
}
document.querySelectorAll('[data-placeholder]').forEach(button => {
  button.addEventListener('click', () => notify(`Link de ${button.dataset.placeholder} em breve.`));
});
document.querySelector('.share').addEventListener('click', async () => {
  try {
    if (navigator.share) await navigator.share({ title: document.title, url: location.href });
    else if (navigator.clipboard && location.protocol !== 'file:') {
      await navigator.clipboard.writeText(location.href);
      notify('Link copiado.');
    } else notify('O compartilhamento estará disponível quando o site for publicado.');
  } catch (error) {
    if (error.name !== 'AbortError') notify('Não foi possível compartilhar agora.');
  }
});

const modal = document.querySelector('.art-modal');
let activeArtwork = 0;
let lastArtworkButton;
function showArtwork(index) {
  activeArtwork = (index + artworks.length) % artworks.length;
  const image = artworks[activeArtwork];
  const fullImage = modal.querySelector('.modal-image');
  fullImage.src = image.getAttribute('src');
  fullImage.alt = image.alt;
}
document.querySelector('.portfolio-track').addEventListener('click', event => {
  const button = event.target.closest('.artwork');
  if (!button) return;
  lastArtworkButton = button;
  showArtwork(Number(button.dataset.index));
  portfolio.classList.add('is-modal-open');
  modal.showModal();
});
modal.querySelector('.modal-close').addEventListener('click', () => modal.close());
modal.querySelector('.modal-prev').addEventListener('click', () => showArtwork(activeArtwork - 1));
modal.querySelector('.modal-next').addEventListener('click', () => showArtwork(activeArtwork + 1));
modal.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showArtwork(activeArtwork + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
modal.addEventListener('click', event => {
  if (event.target === modal) modal.close();
});
modal.addEventListener('close', () => {
  portfolio.classList.remove('is-modal-open');
  lastArtworkButton?.focus({ preventScroll: true });
});
