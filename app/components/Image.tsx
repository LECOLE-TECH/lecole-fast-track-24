interface props {
  width: number
  height: number
  url: string
  alt: string
  srcSet?: string
  className?: string
}
const Image = ({ width, height, url, alt, srcSet = "", className }: props) => {
  return (
    <>
      <img
        className={className}
        loading="lazy"
        height={height}
        srcSet={srcSet}
        width={width}
        src={url}
        alt={alt}
      />
    </>
  )
}

export default Image
