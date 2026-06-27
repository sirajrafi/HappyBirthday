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
    const handleError = () => setAudioError(true)
    const handlePlay = () => setAudioStarted(true)
    const handlePause = () => setAudioStarted(false)

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
        setAudioStarted(true)
      } catch (error) {
        window.setTimeout(() => {
          if (!audioStarted && !audioError) {
            void tryPlay()
          }
        }, 400)
      }
    }

    const startPlayback = () => {
      window.setTimeout(() => {
        void tryPlay()
      }, 300)
    }

    startPlayback()
    window.addEventListener('load', startPlayback)
    window.addEventListener('click', startPlayback, { once: true })
    window.addEventListener('keydown', startPlayback, { once: true })
    window.addEventListener('touchstart', startPlayback, { once: true })
    window.addEventListener('pointerdown', startPlayback, { once: true })

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay)
      audio.removeEventListener('loadedmetadata', handleCanPlay)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('error', handleError)
      window.removeEventListener('load', startPlayback)
      window.removeEventListener('click', startPlayback)
      window.removeEventListener('keydown', startPlayback)
      window.removeEventListener('touchstart', startPlayback)
      window.removeEventListener('pointerdown', startPlayback)
    }
  }, [audioStarted, audioError])

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
        setAudioStarted(true)
      }
    } catch (error) {
      setAudioError(true)
    }
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