export const ListGroup = ({ name, items, selectedItem, onItemSelect }) => {
  return (
    <div className="col-2">
      <select
        className="form-control m-2"
        onChange={onItemSelect}
        value={selectedItem && selectedItem.genre}
      >
        <option value="">Select genre</option>
        {items.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};
