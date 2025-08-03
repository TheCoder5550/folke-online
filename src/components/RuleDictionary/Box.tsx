type BoxProps = React.PropsWithChildren;

export default function Box(props: BoxProps) {
  return (
    <div style={{
      border: "1px solid black",
      padding: "0.5rem"
    }}>
      {props.children}
    </div>
  )
}