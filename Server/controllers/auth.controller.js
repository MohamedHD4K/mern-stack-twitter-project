const singin = async (req, res) => {
  res.json({
    data:"You hit the singin endpoint",
  });
};

const login = async (req, res) => {
  res.json({
    data:"You hit the login endpoint",
  });
};

const logout = async (req, res) => {
  res.json({
    data:"You hit the logout endpoint",
  });
};

export { login, singin, logout };
