const API_ROUTE = 'api/session'
const OPEN_STREE_MAP = {
  titleLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution:
    'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
}
const SESSION_NOT_FOUND_TEXT =
  'It is likely that the session has expired. All sessions are removed after 24 hours.'

// Session ID form initialization
document.getElementById('follow').addEventListener('click', async () => {
  // Change URL to include session ID
  const sessionId = document.getElementById('session-id').value || ''
  if (sessionId.length === 0) {
    return
  }
  // Check if session ID Exists
  const response = await fetch(`${API_ROUTE}/${sessionId}`)
  if (response.status !== 200) {
    alert(SESSION_NOT_FOUND_TEXT)
    return
  }
  window.location.href = `?session=${sessionId}`
})

// Session ID from URL
const getSessionId = () => {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  return urlParams.get('session')
}

const sessionId = getSessionId()

// Leaflet map initialization
var map = L.map('map')

var coordinates = []

const didCoordinateChange = newCoordinate => {
  const lastCoordinate = coordinates[coordinates.length - 1]
  if (!lastCoordinate) {
    return true
  }
  return (
    newCoordinate.latitude !== lastCoordinate[0] || newCoordinate.longitude !== lastCoordinate[1]
  )
}

var polyline = L.polyline(coordinates, {color: 'red'})

L.tileLayer(OPEN_STREE_MAP.titleLayer, {
  attribution: OPEN_STREE_MAP.attribution,
  maxZoom: 18,
}).addTo(map)

var circle = L.circleMarker([0, 0]).addTo(map)

if (sessionId) {
  document.getElementById('no-session').style.display = 'none'

  // Update map location
  const updateMap = () => {
    let displayedAlerts = []
    fetch(`${API_ROUTE}/${sessionId}`)
      .then(response => response.json())
      .catch(error => {
        window.location.href = '/'

        if (!displayedAlerts.includes(sessionId)) {
          alert(SESSION_NOT_FOUND_TEXT)
          displayedAlerts.push(sessionId)
        }
        console.error('Error:', error)
      })
      .then(data => {
        map.setView([data.latitude, data.longitude], 18)
        circle.setLatLng([data.latitude, data.longitude])
        circle.setRadius(data.accuracy)

        if (didCoordinateChange(data)) {
          coordinates.push([data.latitude, data.longitude])
          polyline.setLatLngs(coordinates).addTo(map)
        }
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
