import contentstack, { Region, QueryOperation } from "@contentstack/delivery-sdk"
import ContentstackLivePreview, { IStackSdk } from "@contentstack/live-preview-utils";
import { Page } from "./types";

export const stack = contentstack.stack({
  apiKey: import.meta.env.VITE_CONTENTSTACK_API_KEY as string,
  deliveryToken: import.meta.env.VITE_CONTENTSTACK_DELIVERY_TOKEN as string,
  environment: import.meta.env.VITE_CONTENTSTACK_ENVIRONMENT as string,
  region: import.meta.env.VITE_CONTENTSTACK_REGION === 'EU' ? Region.EU : Region.US,
  live_preview: {
    enable: import.meta.env.VITE_CONTENTSTACK_PREVIEW === 'true',
    preview_token: import.meta.env.VITE_CONTENTSTACK_PREVIEW_TOKEN,
    host: import.meta.env.VITE_CONTENTSTACK_REGION === 'EU' ? "eu-rest-preview.contentstack.com" : "rest-preview.contentstack.com",
  }
});

export function initLivePreview() {
  ContentstackLivePreview.init({
    ssr: false,
    enable: import.meta.env.VITE_CONTENTSTACK_PREVIEW === 'true',
    mode: "builder",
    stackSdk: stack.config as IStackSdk,
    stackDetails: {
      apiKey: import.meta.env.VITE_CONTENTSTACK_API_KEY as string,
      environment: import.meta.env.VITE_CONTENTSTACK_ENVIRONMENT as string,
    },
    clientUrlParams: {
      host:
        import.meta.env.VITE_CONTENTSTACK_REGION === "EU"
          ? "eu-app.contentstack.com"
          : "app.contentstack.com",
    },
    editButton: {
      enable: true,
    },
  });
}

export async function getPage(url: string) {
  const result = await stack
    .contentType("page")
    .entry()
    .query()
    .where("url", QueryOperation.EQUALS, url)
    .find<Page>();

  if (result.entries) {
    const entry = result.entries[0]

    if (import.meta.env.VITE_CONTENTSTACK_PREVIEW === 'true') {
      contentstack.Utils.addEditableTags(entry, 'page', true);
    }

    return entry;
  }
}