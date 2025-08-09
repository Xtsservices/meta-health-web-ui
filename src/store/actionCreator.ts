export const createAction = <T>(type: string, payload: T) => ({
  type,
  payload
});
