const Notification = ({ message }) => {
  if (!message) return null;

  const isError = message.type === 'error';

  const notificationStyle = {
    color: isError ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    border: `3px solid ${isError ? 'red' : 'green'}`,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  };

  return (
    <div style={notificationStyle}>
      {message.text}
    </div>
  );
};
export default Notification