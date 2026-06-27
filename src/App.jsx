import React, { useEffect, useRef, useState } from 'react'
import './App.css'
import './LoveLetter.css'
import './BookCanvas.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './layout/Layout'
import Home from './pages/Home'
import LoveLetter from './pages/LoveLetter'
import Test from './pages/Test'
import OpeningAnimation from './components/OpeningAnimation'

const App = () => {
  const audioRef = useRef(null)
  const [audioStarted, setAudioStarted] = useState(false)
  const [audioReady, setAudioReady] = useState(false)
  const [audioError, setAudioError] = useState(false)
  const [showStartOverlay, setShowStartOverlay] = useState(true)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.loop = true
    audio.volume = 0.35
    audio.preload = 'auto'

    const handleCanPlay = () => {
      setAudioReady(true)
      if (!audioStarted && !audioError) {
        void tryPlay()
      }
    }
    const handleError = () => {
      setAudioError(true)
      setAudioStarted(false)
    }
    const handlePlay = () => {
      setAudioError(false)
      setAudioStarted(true)
    }
    const handlePause = () => {
      setAudioStarted(false)
    }

    audio.addEventListener('canplaythrough', handleCanPlay)
    audio.addEventListener('loadedmetadata', handleCanPlay)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('error', handleError)

    const tryPlay = async () => {
      if (audioStarted || audioError) return
      try {
        audio.currentTime = 0
        await audio.play()
        setAudioError(false)
        setAudioStarted(true)
      } catch (error) {
        setAudioError(true)
      }
    }

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay)
      audio.removeEventListener('loadedmetadata', handleCanPlay)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('error', handleError)
    }
  }, [audioStarted, audioError])

  useEffect(() => {
    if (audioStarted) {
      setShowStartOverlay(false)
    }
  }, [audioStarted])

  const toggleAudio = async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      if (audioStarted) {
        audio.pause()
        setAudioStarted(false)
      } else {
        audio.currentTime = 0
        await audio.play()
        setAudioError(false)
        setAudioStarted(true)
      }
    } catch (error) {
      setAudioError(true)
    }
  }

  const handleStartExperience = async () => {
    setShowStartOverlay(false)
    await toggleAudio()
  }

  const MyRoute = createBrowserRouter(createRoutesFromElements(
    <Route>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />}></Route>
        <Route path='love-Letter' element={<LoveLetter />}></Route>
        <Route path='test' element={<Test />}></Route>
      </Route>
    </Route>
  ))


  // ------------------Cake loader 
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [animateOut, setAnimateOut] = useState(false); // New state for animation

  useEffect(() => {
    const handlePageLoad = () => {
      setTimeout(() => setAnimateOut(true), 8400);
      setTimeout(() => setLoading(false), 9000);
      setTimeout(() => setShowContent(true), 8600);
    };

    if (document.readyState === "complete") {
      handlePageLoad();
    } else {
      window.addEventListener("load", handlePageLoad);
    }

    return () => window.removeEventListener("load", handlePageLoad);
  }, []);

  return (
    <>
      {showStartOverlay && (
        <div
          onClick={handleStartExperience}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at top, rgba(255,221,240,0.95), rgba(255,184,214,0.82) 35%, rgba(132,90,160,0.86))',
            backdropFilter: 'blur(8px)',
            padding: '1.5rem',
            overflow: 'hidden',
          }}
        >
          {['♥', '✦', '✧', '❀'].map((icon, index) => (
            <span
              key={icon + index}
              style={{
                position: 'absolute',
                left: `${10 + index * 20}%`,
                top: `${12 + (index % 3) * 18}%`,
                fontSize: `${1.1 + (index % 3) * 0.4}rem`,
                color: index % 2 === 0 ? '#fff8fd' : '#ffd6e8',
                opacity: 0.8,
                animation: `floatSparkle ${3.5 + index * 0.4}s ease-in-out infinite`,
                pointerEvents: 'none',
              }}
            >
              {icon}
            </span>
          ))}
          <div
            style={{
              maxWidth: '34rem',
              width: '100%',
              textAlign: 'center',
              padding: '2rem 1.5rem',
              borderRadius: '2rem',
              background: 'rgba(255,255,255,0.28)',
              border: '1px solid rgba(255,255,255,0.45)',
              boxShadow: '0 25px 60px rgba(88, 35, 92, 0.28)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✨</div>
            <h2 style={{ margin: '0 0 0.6rem', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#fff8fd', textShadow: '0 2px 10px rgba(0,0,0,0.18)' }}>
              Happy Birthday, My Love
            </h2>
            <p style={{ margin: '0 0 1.2rem', fontSize: '1rem', lineHeight: 1.6, color: '#fff8fd', opacity: 0.95 }}>
              Tap below to begin this little magical moment with music, soft lights, and your sweetest memories.
            </p>
            <button
              type="button"
              onClick={handleStartExperience}
              style={{
                padding: '0.95rem 1.6rem',
                borderRadius: '999px',
                border: 'none',
                background: 'linear-gradient(135deg, #ffffff 0%, #ffd7eb 55%, #ffc4de 100%)',
                color: '#8a2f62',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 10px 24px rgba(255, 120, 180, 0.3)',
                fontSize: '1rem',
              }}
            >
              Open the surprise ✨
            </button>
          </div>
        </div>
      )}
      <audio
        ref={audioRef}
        src="/assets/A_Thousand_Years_-_Christina_Perri.mp3"
        preload="auto"
        autoPlay
        playsInline
      />
      <button
        className="audio-toggle"
        onClick={toggleAudio}
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 9999,
          background: 'rgba(255,255,255,0.95)',
          border: '1px solid rgba(0,0,0,0.12)',
          borderRadius: '999px',
          padding: '0.75rem 1rem',
          cursor: 'pointer',
          fontWeight: '700',
        }}
      >
        {audioError ? 'Audio Error' : audioStarted ? 'Pause Music' : 'Play Music'}
      </button>
      {
        loading && <OpeningAnimation animateOut={animateOut}/>
      }
      {
        showContent && <RouterProvider router={MyRoute} />
      }
    </>
  )
}

export default App