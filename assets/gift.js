(() => {
  const openButton = document.getElementById('gift-open');
  const closeButton = document.getElementById('gift-close');
  const modal = document.getElementById('gift-modal');
  const dialog = modal?.querySelector('.gift-dialog');
  const form = document.getElementById('wishes-form');
  const status = document.getElementById('wish-status');
  if (!openButton || !closeButton || !modal || !dialog || !form || !status) return;

  let previousFocus = null;
  function openGift() {
    previousFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('gift-opened');
    closeButton.focus();
  }
  function closeGift() {
    modal.hidden = true;
    document.body.classList.remove('gift-opened');
    previousFocus?.focus();
  }
  openButton.addEventListener('click', openGift);
  closeButton.addEventListener('click', closeGift);
  modal.addEventListener('click', event => {
    if (event.target === modal) closeGift();
  });
  document.addEventListener('keydown', event => {
    if (modal.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeGift();
    }
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button:not([disabled]),input:not([disabled]),textarea:not([disabled])')]
      .filter(element => element.tabIndex >= 0);
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const name = form.elements.namedItem('name').value.trim();
    const message = form.elements.namedItem('message').value.trim();
    const honey = form.elements.namedItem('_honey').value;
    if (honey) return;
    if (name.length < 2 || message.length < 5) {
      status.textContent = 'Vui lòng nhập tên và lời chúc đầy đủ trước khi gửi.';
      status.dataset.state = 'error';
      return;
    }
    const button = form.querySelector('[type="submit"]');
    button.disabled = true;
    status.textContent = 'Đang gửi lời chúc…';
    delete status.dataset.state;
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: name.slice(0, 80),
          message: message.slice(0, 500),
          _subject: 'Lời chúc mừng đám cưới Bảo Ngọc & Đăng Hoàng',
          _captcha: 'false',
          _honey: ''
        })
      });
      const result = await response.json();
      if (!response.ok || (result.success !== true && result.success !== 'true')) {
        throw new Error('FormSubmit did not accept the message');
      }
      form.reset();
      status.textContent = 'Lời chúc đã được tiếp nhận. Nếu đây là lần gửi đầu tiên, chú rể cần xác nhận email FormSubmit để nhận thư.';
      status.dataset.state = 'success';
    } catch (_) {
      status.textContent = 'Chưa gửi được lời chúc. Vui lòng kiểm tra kết nối và thử lại sau.';
      status.dataset.state = 'error';
    } finally {
      button.disabled = false;
    }
  });
})();
