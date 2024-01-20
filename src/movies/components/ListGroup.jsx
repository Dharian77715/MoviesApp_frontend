export const ListGroup = ({ name, items, selectedItem, onItemSelect }) => {
  return (
    <div className="col-2">
      <select
        className="form-control mt-2"
        onChange={onItemSelect}
        value={selectedItem}
      >
        <option value="">All genres</option>
        {items.map(({ id, genre }) => (
          <option key={id} value={id}>
            {genre}
          </option>
        ))}
      </select>
    </div>
  );
};
