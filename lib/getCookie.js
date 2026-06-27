//   export const getCookie = (name) => {
//     const value = `; ${document.cookie}`;
//     console.log(value)
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop().split(";").shift();
//   };

export const getCookie = (name) => {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const [key, ...value] = cookie.trim().split("=");

    if (key === name) {
      return value.join("=");
    }
  }

  return null;
};