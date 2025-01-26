// 提供一个网页链接，去除 http:// 或 https:// 和 www. 前缀，去除后置参数

function GetPureURI(uri: string): string {
  return uri.replace(/^(https?:\/\/)?(www\.)?/, '').split('?')[0];
}

export default GetPureURI;