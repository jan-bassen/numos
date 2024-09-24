import React, { type FC, useEffect } from 'react'

function isGoogleMapScriptLoaded(id: string): boolean {
  const scripts: HTMLCollectionOf<HTMLScriptElement> =
    document.head.getElementsByTagName('script')
  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i]?.getAttribute('id') === id) {
      return true
    }
  }

  return false
}

function loadScript(src: string, id: string) {
  if (isGoogleMapScriptLoaded(id)) {
    // Make sure the script is loaded
    return new Promise((resolve) => setTimeout(resolve, 500))
  }

  const script = document.createElement('script')
  script.setAttribute('async', '')
  script.setAttribute('id', id)
  script.src = src
  ;(document.querySelector('head') as any).appendChild(script)

  return new Promise<void>((resolve) => {
    script.onload = () => {
      resolve()
    }
  })
}

type Location = {
  lat: number
  lng: number
}

type MapTypeId = 'roadmap' | 'satellite' | 'hybrid' | 'terrain'

type Props = {
  apiKey: string
  defaultLocation: Location
  zoom?: number
  onChangeLocation?(lat: number, lng: number): void
  onChangeZoom?(zoom: number): void
  style?: any
  className?: string
  mapTypeId?: MapTypeId
  icon?: any // https://developers.google.com/maps/documentation/javascript/markers#icons
}

function isValidLocation(location: Location) {
  return (
    location && Math.abs(location.lat) <= 90 && Math.abs(location.lng) <= 180
  )
}

const GOOGLE_SCRIPT_URL =
  'https://maps.googleapis.com/maps/api/js?libraries=places&key='

const MapPicker: FC<Props> = ({
  apiKey,
  defaultLocation,
  zoom = 7,
  onChangeLocation,
  onChangeZoom,
  style,
  className,
  mapTypeId,
  icon,
}) => {
  const MAP_VIEW_ID = `google-map-view-${Math.random().toString(36).slice(2, 11)}`
  const map = React.useRef<any>(null)
  const marker = React.useRef<any>(null)

  function handleChangeLocation() {
    if (onChangeLocation) {
      const currentLocation = marker.current.getPosition()
      onChangeLocation(currentLocation.lat(), currentLocation.lng())
    }
  }

  function handleChangeZoom() {
    onChangeZoom?.(map.current.getZoom())
  }

  function loadMap() {
    const Google = (window as any).google
    const validLocation = isValidLocation(defaultLocation)
      ? defaultLocation
      : { lat: 0, lng: 0 }

    map.current = new Google.maps.Map(document.getElementById(MAP_VIEW_ID), {
      center: validLocation,
      zoom: zoom,
      mapTypeControl: false,
      streetViewControl: false,
      ...(mapTypeId && { mapTypeId }),
    })

    const svgMarker = {
      path: 'M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z',
      fillColor: 'blue',
      fillOpacity: 0.6,
      strokeWeight: 0,
      rotation: 0,
      scale: 2,
      anchor: new Google.maps.Point(0, 20),
    }

    if (!marker.current) {
      marker.current = new Google.maps.Marker({
        position: validLocation,
        map: map.current,
        draggable: true,
        icon: icon || svgMarker,
      })
      Google.maps.event.addListener(
        marker.current,
        'dragend',
        handleChangeLocation,
      )
    } else {
      marker.current.setPosition(validLocation)
    }

    map.current.addListener('click', (event: any) => {
      const clickedLocation = event.latLng
      marker.current.setPosition(clickedLocation)
      handleChangeLocation()
    })

    map.current.addListener('zoom_changed', handleChangeZoom)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    loadScript(GOOGLE_SCRIPT_URL + apiKey, `google-maps-${apiKey}`).then(
      loadMap,
    )
  }, [apiKey])

  useEffect(() => {
    if (marker.current) {
      map.current.setCenter(defaultLocation)
      marker.current.setPosition(defaultLocation)
    }
  }, [defaultLocation])

  useEffect(() => {
    if (map.current) {
      map.current.setZoom(zoom)
    }
  }, [zoom])

  const componentStyle = Object.assign(
    { width: '100%', height: '600px' },
    style || {},
  )

  return <div id={MAP_VIEW_ID} style={componentStyle} className={className} />
}
export default MapPicker
