const websiteUrl = process.env.NEXT_PUBLIC_RUNNING_LOCALLY
  ? "http://localhost:3000"
  : "https://openui.quix.gg";

export default function openUiLink() {
  return websiteUrl;
}
