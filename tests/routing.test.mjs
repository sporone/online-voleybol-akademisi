import test from "node:test";
import assert from "node:assert/strict";
import { resolveRoute, routeFor, slugifyTr } from "../src/seo.js";

const course = ["course-1", "Parmak Pas", "Parmak pas açıklaması"];

test("Türkçe ders başlıkları SEO dostu bağlantıya dönüşür", () => {
  assert.equal(slugifyTr("Sıçrama Geliştirme"), "sicrama-gelistirme");
  assert.equal(routeFor("lesson", course), "/voleybol-dersleri/parmak-pas/egitim/");
});

test("Ders ve eğitim rotaları doğru sayfaya çözülür", () => {
  assert.deepEqual(resolveRoute("/voleybol-dersleri/parmak-pas/", [course]), { page:"course", course });
  assert.deepEqual(resolveRoute("/voleybol-dersleri/parmak-pas/egitim/", [course]), { page:"lesson", course });
});

test("Bilinmeyen rota güvenli biçimde ana sayfaya düşer", () => {
  assert.equal(resolveRoute("/bulunmayan-sayfa/", [course]).page, "home");
});
