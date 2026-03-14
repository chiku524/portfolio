import { useMemo, useEffect, useState } from 'react'

const GITHUB_GRAPHQL = 'https://api.github.com/graphql'
const WEEKS = 53
const DAYS = 7

function useContributions(username, token) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(!!token)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    const query = `
      query($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                  weekday
                }
              }
            }
          }
        }
      }
    `

    const controller = new AbortController()
    fetch(GITHUB_GRAPHQL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query, variables: { login: username } }),
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error('GitHub API error')
        return res.json()
      })
      .then((json) => {
        if (json.errors) throw new Error(json.errors[0]?.message || 'GraphQL error')
        const weeks = json?.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? []
        const total =
          json?.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions ?? 0
        setData({ weeks, total })
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message)
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [username, token])

  return { data, loading, error }
}

/** Deterministic placeholder grid so the chart always looks good without a token */
function getPlaceholderGrid() {
  const grid = []
  for (let w = 0; w < WEEKS; w++) {
    const week = []
    for (let d = 0; d < DAYS; d++) {
      const seed = (w * 7 + d) * 11 + 13
      const level = (seed % 5) === 0 ? 0 : 1 + (seed % 4)
      week.push(level)
    }
    grid.push(week)
  }
  return grid
}

function GitHubActivityChart({ username = 'chiku524', className = '' }) {
  const token = typeof import.meta !== 'undefined' && import.meta.env?.VITE_GITHUB_TOKEN
  const { data, loading, error } = useContributions(username, token || null)

  const { grid, total } = useMemo(() => {
    if (data?.weeks?.length) {
      const totalContributions = data.total
      const grid = []
      const weeks = data.weeks.slice(-WEEKS)
      for (let i = 0; i < weeks.length; i++) {
        const week = weeks[i]
        const row = [0, 0, 0, 0, 0, 0, 0]
        const days = week?.contributionDays ?? []
        days.forEach((day) => {
          const wd = day.weekday
          if (wd >= 0 && wd < 7) row[wd] = day.contributionCount
        })
        grid.push(row)
      }
      while (grid.length < WEEKS) {
        grid.unshift([0, 0, 0, 0, 0, 0, 0])
      }
      return { grid, total: totalContributions }
    }
    return { grid: getPlaceholderGrid(), total: null }
  }, [data])

  /** Map contribution count to severity level (0–4) for clear visual distinction. Uses fixed buckets like GitHub. */
  const getLevel = (count) => {
    if (count <= 0) return 0
    if (count === 1) return 1
    if (count <= 4) return 2
    if (count <= 9) return 3
    return 4
  }

  const isLoading = loading && !data

  return (
    <div className={`github-activity ${className}`} aria-label="GitHub contribution activity">
      <div className="github-activity__header">
        <h4 className="github-activity__title">Code rhythm</h4>
        {total !== null && (
          <span className="github-activity__total">
            {total.toLocaleString()} contributions in the last year
          </span>
        )}
        {!token && total === null && !loading && (
          <span className="github-activity__hint">View full activity on GitHub</span>
        )}
      </div>
      <div className="github-activity__chart-wrap">
        {isLoading && (
          <div className="github-activity__loading" aria-hidden="true">
            <span className="github-activity__loading-dot" />
            <span className="github-activity__loading-dot" />
            <span className="github-activity__loading-dot" />
          </div>
        )}
        <div
          className="github-activity__grid"
          style={{ opacity: isLoading ? 0.4 : 1 }}
          role="img"
          aria-label={
            total !== null
              ? `GitHub contribution grid: ${total} contributions in the last year`
              : 'Decorative contribution-style grid. View GitHub profile for full activity.'
          }
        >
          {grid.map((week, wi) => (
            <div key={wi} className="github-activity__week">
              {week.map((count, di) => {
                const level = getLevel(count)
                return (
                  <span
                    key={`${wi}-${di}`}
                    className={`github-activity__cell github-activity__cell--${level}`}
                    title={count > 0 ? `${count} contribution${count !== 1 ? 's' : ''}` : 'No contributions'}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="github-activity__legend" aria-hidden="true">
        <span>Less</span>
        <span className="github-activity__legend-cell github-activity__legend-cell--0" />
        <span className="github-activity__legend-cell github-activity__legend-cell--1" />
        <span className="github-activity__legend-cell github-activity__legend-cell--2" />
        <span className="github-activity__legend-cell github-activity__legend-cell--3" />
        <span className="github-activity__legend-cell github-activity__legend-cell--4" />
        <span>More</span>
      </div>
      <a
        className="github-activity__link"
        href={`https://github.com/${username}`}
        target="_blank"
        rel="noreferrer"
      >
        View GitHub profile
        <span className="button__icon" aria-hidden="true">↗</span>
      </a>
      {error && (
        <p className="github-activity__error" role="alert">
          Could not load activity. <a href={`https://github.com/${username}`}>Open GitHub</a>.
        </p>
      )}
    </div>
  )
}

export default GitHubActivityChart
