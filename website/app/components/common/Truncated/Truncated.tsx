export default function Truncated(props: {children: string, length: number}) {

  if (props.children.length <= props.length) {
    return <>{props.children}</>;
  }

  return <>{props.children.slice(0, props.length-1)}…</>;
}
