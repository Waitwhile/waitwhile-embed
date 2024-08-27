export const MODAL_MARKUP = `
  <div class="waitwhile-modal-content"></div>
`;

export const MODAL_OPEN_CLASS = 'waitwhile-modal-open';

export const MODAL_STYLES = `
@keyframes ww-modal-in {
  from {
    transform: translateY(1vh) scale(0.98);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes ww-modal-o-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

body.${MODAL_OPEN_CLASS} {
  overflow: hidden;
  overscroll-behavior: contain;
  pointer-events: none;
}

.waitwhile-modal {
  pointer-events: all;
  position: fixed;
  width: 100%;
  min-width: 100%;
  height: 100%;
  min-height: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border: none;
  margin: 0;
  padding: 0 16px;
  transform: translateY(1vh) scale(0.98);
  opacity: 0;
  background: transparent;
}
.waitwhile-modal::backdrop {
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(0.35rem);
  overflow: scroll;
}
.waitwhile-modal[open] {
  animation: ww-modal-in 350ms ease-out forwards;
  animation-delay: 150ms;
}
.waitwhile-modal[open]::backdrop {
  animation: ww-modal-o-in 250ms ease-out;
}

.waitwhile-modal-content {
  margin: 5% auto;
  margin: 5vh auto;
  padding: 16px 16px 48px 16px;
  width: 100%;
  max-width: 771px;
  min-height: 400px;
  border-radius: 4px;
  box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background: #fff;
}
`;

export const HOSTS: Record<string, string> = {
  production: 'https://waitwhile.com',
  development: 'https://ww-static-public-dev.web.app',
};
