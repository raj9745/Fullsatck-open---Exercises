const Notification = ({ message }) => {
  if (!message) return null;

  const notificationStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    border: '3px solid green',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  };

  return <div style={notificationStyle}>{message}</div>;
};

export default Notification;
