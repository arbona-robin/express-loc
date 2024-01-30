document.getElementById('follow').addEventListener('click', () => {
  // Change URL to include session ID
  const sessionId = document.getElementById('session-id').value
  window.location.href = `?session=${sessionId}`
})

const getSessionId = () => {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  return urlParams.get('session')
}

const sessionId = getSessionId()

var map = L.map('map')

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 18,
}).addTo(map)

var circle = L.circleMarker([0, 0]).addTo(map)

if (sessionId) {
  document.getElementById('no-session').style.display = 'none'

  const updateMap = () => {
    fetch(`api/session/${sessionId}`)
      .then(response => response.json())
      .then(data => {
        map.setView([data.latitude, data.longitude], 18)
        circle.setLatLng([data.latitude, data.longitude])
        circle.setRadius(data.accuracy)
      })
  }

  // Initialize map
  updateMap()

  // Refresh map every X ms
  setInterval(updateMap, 5000)
} else {
  // No session ID, show form
  document.getElementById('no-session').style.display = 'block'
  // hide map
  document.getElementById('map').style.display = 'none'
}
