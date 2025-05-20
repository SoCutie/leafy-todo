const { ipcRenderer } = require('electron')

// Window controls
document.addEventListener('DOMContentLoaded', () => {
  const minimizeBtn = document.getElementById('minimize-btn')
  const closeBtn = document.getElementById('close-btn')

  minimizeBtn?.addEventListener('click', () => {
    ipcRenderer.send('minimize-window')
  })

  closeBtn?.addEventListener('click', () => {
    ipcRenderer.send('close-window')
  })

  // Reset zoom handler
  ipcRenderer.on('reset-zoom', () => {
    document.body.style.zoom = "1"
    if (window.devicePixelRatio !== 1) {
      document.body.style.transform = `scale(${1/window.devicePixelRatio})`
      document.body.style.transformOrigin = '0 0'
    }
  })
})

// Prevent accidental zooming
window.addEventListener('wheel', (e) => {
  if (e.ctrlKey) e.preventDefault()
}, { passive: false })