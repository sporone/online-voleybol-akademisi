import test from "node:test";
import assert from "node:assert/strict";
import { trainingVideos, videoTopics } from "../src/video-library.js";
import { individualTrainingVideos, individualVideoTopics } from "../src/individual-video-library.js";
import { technicalCards } from "../src/technical-cards.js";

const unique = (values) => new Set(values).size === values.length;

test("eğitim videoları eksiksiz ve benzersizdir", () => {
  assert.equal(trainingVideos.length, 88);
  assert.equal(unique(trainingVideos.map((video) => video.id)), true);
  assert.equal(videoTopics.reduce((sum, topic) => sum + topic.count, 0), 88);
  assert.equal(trainingVideos.every((video) => video.topic && video.title && video.preview), true);
});

test("bireysel antrenman kütüphanesi kategorilerle tutarlıdır", () => {
  assert.equal(individualTrainingVideos.length, 80);
  assert.equal(unique(individualTrainingVideos.map((video) => video.id)), true);
  assert.equal(individualVideoTopics.reduce((sum, topic) => sum + topic.count, 0), 80);
});

test("teknik kart verisi eksiksizdir", () => {
  assert.equal(technicalCards.length, 20);
  assert.equal(unique(technicalCards.map((card) => card.id)), true);
  assert.equal(technicalCards.every((card) => card.title && card.category && card.image), true);
});
