import { SvgType, svgTypes } from './SvgTypes'

interface SvgIconProps {
  className: string
  iconType: string
  title: string
  desc?: string
}

const SvgIcon = ({ className, iconType, title, desc }: SvgIconProps) => {
  const svgType: SvgType | undefined = svgTypes.find(
    (element) => element.name === iconType
  )

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      aria-labelledby={`${iconType}Title ${iconType}Desc`}
      role="img"
    >
      <title id={`${iconType}Title`}>{title}</title>
      <desc id={`${iconType}Desc`}>{desc}</desc>
      <path strokeLinecap="round" strokeLinejoin="round" d={svgType?.d} />
    </svg>
  )
}
export default SvgIcon
