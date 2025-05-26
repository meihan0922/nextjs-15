import qs from "query-string";

interface UrlQuery {
  params: string;
  key: string;
  value: string;
}

/** 將舊的 url 合併，與新的 params 合併 */
export const formUrlQuery = ({ params, key, value }: UrlQuery) => {
  const currentUrl = qs.parse(params);
  currentUrl[key] = value;

  return qs.stringifyUrl({ url: window.location.pathname, query: currentUrl });
};

interface RemoveUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

/** url 移除 params key */
export const removeKeysFromUrlQuery = ({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) => {
  const querystring = qs.parse(params);
  keysToRemove.forEach((k) => {
    delete querystring[k];
  });
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: querystring,
    },
    {
      skipNull: true,
    },
  );
};
