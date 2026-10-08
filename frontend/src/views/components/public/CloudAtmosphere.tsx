export function CloudAtmosphere() {
  return (
    <>
      {['background', 'midground', 'foreground'].map((depth) => (
        <div
          key={depth}
          className={`cloud-layer cloud-layer--${depth}`}
          aria-hidden="true"
          data-depth={depth}
        >
          <div className="cloud-drift">
            <picture>
              <source
                type="image/webp"
                srcSet="/atmosphere/cloud-bank-small.webp 768w, /atmosphere/cloud-bank.webp 1536w"
                sizes="(max-width: 600px) 120vw, 100vw"
              />
              <img
                src="/atmosphere/cloud-bank.png"
                alt=""
                width="1536"
                height="1024"
                fetchPriority={depth === 'midground' ? 'high' : 'auto'}
              />
            </picture>
          </div>
        </div>
      ))}
    </>
  )
}
