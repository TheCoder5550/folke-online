type BoxProps = React.PropsWithChildren;

export default function Box(props: BoxProps) {
  return (
    <div style={{
      border: "1px solid rgb(var(--text-rgb), 0.75)",
      padding: "0.5rem"
    }}>
      {props.children}
    </div>
  )
}