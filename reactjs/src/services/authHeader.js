const authHeader = () => {
  const account = JSON.parse(localStorage.getItem("account"));

  if (account && account.token) {
    return { Authorization: `${account.token}` };
  } else {
    return {};
  }
};

export default authHeader;
