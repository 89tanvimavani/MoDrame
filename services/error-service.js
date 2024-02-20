export const _throw = (data) => {
  return {
    error: true,
    data: data.response ? data.response.data : {},
    status: data.response?.status,
  };
};
