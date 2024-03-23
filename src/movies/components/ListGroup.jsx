export const ListGroup = ({ name, items, selectedItem, onItemSelect }) => {
  return (
    <div className="col-2">
      <select
        className="form-control mt-2"
        onChange={onItemSelect}
        value={selectedItem}
      >
        <option value="">{name}</option>
        {items.map(({ id, genre, sex_name }) => (
          <option key={id} value={id}>
            {genre} {sex_name}
          </option>
        ))}
      </select>
    </div>
  );
};
