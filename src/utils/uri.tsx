// 提供一个网页链接，去除 http:// 或 https:// 和 www. 前缀，去除后置参数, 并取出 url 末尾的 / 符号

function GetPureURI(uri: string): string {
  uri = uri.replace(/^(https?:\/\/)?(www\.)?/, '').split('?')[0];
  return uri.replace(/\/$/, '');
}

export default GetPureURI;