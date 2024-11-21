export function toCommas(value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export const formatLineBreaks = (text) => {
  if (!text) return '';
  return text.split('\\n').map((line, i) => (
    <p key={i}>
      {line}
      {i !== text.split('\\n').length - 1 && <br />}
    </p>
  ));
};
