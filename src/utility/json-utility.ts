export const tryParse = (data: any): any => {
  try {
    return JSON.parse(data);
  } catch (err) {
    return data;
  }
};
