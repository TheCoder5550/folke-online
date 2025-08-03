type ContainerProps = React.PropsWithChildren;

export default function Container(props: ContainerProps) {
  return (
    <div style={{
      position: "relative",
      paddingLeft: "1.5rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.25rem",
    }}>
      {props.children}
    </div>
  )
}