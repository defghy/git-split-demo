export const getCookie = (name) => {
  const reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  let arr = document.cookie.match(reg);

  if (!arr || !unescape(arr[2])) {
    return 0;
  }
  return unescape(arr[2]);
}
