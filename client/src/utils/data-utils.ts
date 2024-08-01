import {LoginRequest} from "../apis/base/base";

export const getData = async <T>(
    url: string,
    loginReq: LoginRequest
  )
  : Promise<T> => {
    const res = await fetch(url, {
      method: 'Post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(loginReq)
    });

    return await res.json();
  }
