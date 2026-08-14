// NotebookLM Viewer / Chat View paylaşım bağlantısını yalnızca burada yönetin.
// İsterseniz aynı değerleri .env dosyasından da verebilirsiniz.
export const NOTEBOOKLM_URL = "https://notebook.google.com/notebook/17fd666c-5352-43eb-873c-20b62e774737/preview";

export const notebookLmConfig = Object.freeze({
  url: (import.meta.env.VITE_NOTEBOOKLM_URL || NOTEBOOKLM_URL).trim(),
  iframeEnabled: import.meta.env.VITE_NOTEBOOKLM_IFRAME_ENABLED === "true",
  iframeLoadTimeoutMs: 10000,
});
