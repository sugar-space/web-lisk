export function getSocialMetas({
  path = "https://sugarhub.space",
  title = "Sugar",
  description = "Spread sweetness in web3",
  keywords = "",
  image = "https://sugarhub.space/sugar.png",
  rect = true,
}: {
  image?: string;
  path?: string;
  title?: string;
  description?: string;
  keywords?: string;
  rect?: boolean;
}) {
  // const compiledImage = rect ? image + "?tr=ar-16-9,w-1200" : image;
  const compiledImage = image;

  return [
    { title },
    { name: "description", content: removeTags(description) },
    { name: "keywords", content: keywords },
    { name: "image", content: compiledImage },
    { name: "og:url", content: "https://sugarhub.space/" + compilePath(path) },
    { name: "og:title", content: title },
    { name: "og:description", content: removeTags(description) },
    { name: "og:image", content: compiledImage },
    {
      name: "twitter:card",
      content: image ? "summary_large_image" : "summary",
    },
    // { name: "twitter:creator", content: "@happycuans" },
    // { name: "twitter:site", content: "@happycuans" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: removeTags(description) },
    { name: "twitter:image", content: compiledImage },
    { name: "twitter:image:alt", content: title },
  ];
}

function compilePath(path: string) {
  if (path.charAt(0) === "/") {
    return path.substring(1);
  } else {
    return path;
  }
}

function removeTags(str: string) {
  if (str === null || str === "") return false;
  else str = str.toString();

  return str.replace(/(<([^>]+)>)/gi, "").slice(0, 150);
}
