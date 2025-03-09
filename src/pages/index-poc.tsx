// pages/index.tsx
import { useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

type CoinData = {
  id: string
  name: string
  symbol: string
  image: string
  currentPrice: number
  priceChange24h: number
  lastUpdated: string
}

export default function Home() {
  const [coin, setCoin] = useState<CoinData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [coinId, setCoinId] = useState('bitcoin')

  const fetchCoinData = async (id: string) => {
    try {
      setLoading(true)
      setError('')
      const res = await fetch(`/api/coins?id=${id}`)
      if (!res.ok) throw new Error('Failed to fetch data')
      const data = await res.json()
      setCoin(data)
    } catch (err) {
      setError('Error fetching data. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchCoinData(coinId)

    // Set up auto-refresh every 20 seconds
    const interval = setInterval(() => {
      fetchCoinData(coinId)
    }, 20000)

    return () => clearInterval(interval)
  }, [coinId])

  // Handle coin change
  const handleCoinChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCoinId(e.target.value)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Crypto Dashboard</title>
        <meta name="description" content="Crypto price dashboard with Redis caching" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Crypto Dashboard
        </h1>

        <p className={styles.description}>
          Simple proof of concept with Redis caching
        </p>

        <div className={styles.controls}>
          <select
            value={coinId}
            onChange={handleCoinChange}
            className={styles.select}
          >
            <option value="bitcoin">Bitcoin</option>
            <option value="ethereum">Ethereum</option>
            <option value="ripple">XRP</option>
            <option value="cardano">Cardano</option>
            <option value="solana">Solana</option>
          </select>

          <button
            onClick={() => fetchCoinData(coinId)}
            className={styles.button}
            disabled={loading}
          >
            Refresh Data
          </button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {coin && !loading && (
          <div className={styles.card}>
            <div className={styles.coinHeader}>
              <img src={coin.image} alt={coin.name} className={styles.coinImage} />
              <h2>{coin.name} ({coin.symbol.toUpperCase()})</h2>
            </div>

            <div className={styles.priceContainer}>
              <p className={styles.price}>${coin.currentPrice.toLocaleString()}</p>
              <p className={coin.priceChange24h >= 0 ? styles.positive : styles.negative}>
                {coin.priceChange24h >= 0 ? '↑' : '↓'} {Math.abs(coin.priceChange24h).toFixed(2)}%
              </p>
            </div>

            <p className={styles.updated}>
              Last updated: {new Date(coin.lastUpdated).toLocaleString()}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
