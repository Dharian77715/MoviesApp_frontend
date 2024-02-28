export const SearchBox = ({ value, onChange, ...rest }) => {
  return (
    <input
      type="text"
      name="query"
      className="form-control m-2"
      placeholder="Buscar..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    ></input>
  );
};
