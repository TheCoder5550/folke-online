import { memo, useEffect, useRef } from "react";
import { makeSpecialCharacters } from "../helpers/special-characters";

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  // ref?: RefObject<HTMLInputElement | null>;
  focusOnAdd?: boolean;
}

const TextField: React.FC<TextFieldProps> = (props) => {
  const {
    focusOnAdd,
    onChange,
    ...rest
  } = props;

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!focusOnAdd) {
      return;
    }

    if (ref.current) {
      ref.current.focus()
    }
  }, [ ref.current ])

  const change = (e: React.ChangeEvent<HTMLInputElement>) => {
    correctCursor(e);
    return onChange?.(e);
  }

  return (
    <input
      ref={ref}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      type="text"
      onChange={change}
      {...rest}
    />
  );
};

export const TextFieldMemo = memo(TextField);

export default TextField;

function correctCursor(e: React.ChangeEvent<HTMLInputElement>) {
  if (makeSpecialCharacters(e.target.value) === e.target.value) {
    return;
  }

  const input = e.target;
  const oldPosition = input.value.length - (input.selectionStart ?? 0);

  requestAnimationFrame(() => {
    const newPosition = input.value.length - oldPosition;
    input.setSelectionRange(newPosition, newPosition);
  })
}