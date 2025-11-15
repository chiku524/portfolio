function LoadingSkeleton({ type = 'card', count = 1 }) {
  const SkeletonCard = () => (
    <div className="skeleton skeleton--card">
      <div className="skeleton__image" />
      <div className="skeleton__content">
        <div className="skeleton__line skeleton__line--title" />
        <div className="skeleton__line skeleton__line--text" />
        <div className="skeleton__line skeleton__line--text skeleton__line--short" />
      </div>
    </div>
  )

  const SkeletonText = () => (
    <div className="skeleton skeleton--text">
      <div className="skeleton__line" />
      <div className="skeleton__line skeleton__line--short" />
      <div className="skeleton__line" />
    </div>
  )

  if (type === 'card') {
    return (
      <>
        {Array.from({ length: count }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </>
    )
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonText key={index} />
      ))}
    </>
  )
}

export default LoadingSkeleton
