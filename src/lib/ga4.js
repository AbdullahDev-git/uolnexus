import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ReactGA from 'react-ga4'

export function usePageTracking() {
  const location = useLocation()

  useEffect(() => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID
    if (!measurementId) return

    ReactGA.initialize(measurementId)
  }, [])

  useEffect(() => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID
    if (!measurementId) return

    ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search })
  }, [location.pathname, location.search])
}
